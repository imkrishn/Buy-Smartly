"use client";

import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/convertToSubCurrency";



const Payment = ({ amount, orderDetail }: { amount: number, orderDetail: any }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);


  // Fetching the clientSecret for the PaymentIntent
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((err) => console.error("Error creating payment intent:", err));
  }, [amount]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!orderDetail.address) {
      return alert("Minimum a address is required")
    }

    if (!orderDetail.totalAmount) {
      return alert("Amount is none")
    }

    if (orderDetail.orderItems.length === 0) {
      return alert("Select minimum 1 product to buy")
    }
    setLoading(true);
    if (!stripe || !elements) {
      setErrorMessage("Stripe or Elements is not loaded.");
      setLoading(false);
      return;
    }

    try {
      const { error: submitError } = await elements.submit();

      if (submitError) {
        setErrorMessage(submitError.message);
        setLoading(false);
        return;
      }


      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_API_URL}/payment-success?amount=${amount}`,
        },

      });

      if (error) {
        setErrorMessage(error.message);
      }
    } catch (err) {
      console.error("Payment processing error:", err);
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md">
      {clientSecret && <PaymentElement />}
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}

      <button
        disabled={!stripe || loading}
        className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
      >
        {!loading ? `Pay $${amount}` : "Processing..."}
      </button>
    </form>
  );
};



export default Payment;
