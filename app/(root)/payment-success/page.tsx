"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount");
  const payment_intent = searchParams.get("payment_intent");
  const payment_intent_client_secret = searchParams.get("payment_intent_client_secret");
  const redirect_status = searchParams.get("redirect_status");

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Redux state
  const orderDetails = useSelector((state: RootState) => state.order);

  // Memoize orderDetails to prevent unnecessary re-renders
  const memoizedOrderDetails = useMemo(() => orderDetails, [orderDetails]);

  // Prevent multiple Axios calls using a ref
  const hasAlreadyProcessed = useRef(false);

  useEffect(() => {
    // Ensure this effect runs only when necessary
    if (!payment_intent || !payment_intent_client_secret || !redirect_status) {
      setErrorMessage("Invalid payment details");
      setLoading(false);
      return;
    }

    // Avoid multiple Axios calls if already processed
    if (hasAlreadyProcessed.current) {
      setLoading(false);
      return;
    }

    const fetchPaymentDetails = async () => {
      try {
        const stripe = await stripePromise;

        if (!stripe) {
          setErrorMessage("Stripe initialization failed.");
          setLoading(false);
          return;
        }

        const { error: paymentError, paymentIntent } = await stripe.retrievePaymentIntent(payment_intent_client_secret);

        if (paymentError) {
          setErrorMessage(paymentError.message || "Payment error");
          setLoading(false);
          return;
        }

        if (paymentIntent?.status === "succeeded") {
          setPaymentSuccess(true);

          // Perform the API call once after success
          if (!hasAlreadyProcessed.current) {
            try {
              await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/order`,
                { ...memoizedOrderDetails, payment_intent },
                { withCredentials: true }
              );
              hasAlreadyProcessed.current = true;
            } catch (axiosError) {
              setErrorMessage("Failed to create order.");
              console.error("Axios error:", axiosError);
            }
          }
        } else {
          setErrorMessage("Payment failed or is still processing.");
        }
      } catch (err) {
        setErrorMessage("An unexpected error occurred.");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };


    fetchPaymentDetails();
  }, [payment_intent, payment_intent_client_secret, redirect_status, memoizedOrderDetails]);

  return (
    <div className="payment-success-container">
      {loading ? (
        <div className="spinner m-auto"></div>
      ) : (
        <>
          {paymentSuccess ? (
            <div className="w-full h-screen bg-green-400 text-white text-4xl gap-3 flex-col flex justify-center items-center">
              <h1>Payment Successful!</h1>
              <p>Your payment of ${amount} was successful.</p>
            </div>
          ) : (
            <div className="w-full h-screen bg-blue-600 text-red-600 gap-3 flex-col flex justify-center items-center">
              <h1>Payment Failed</h1>
              <p>{errorMessage}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentSuccess;
