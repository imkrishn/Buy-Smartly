'use client';

import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface Address {
  name: string;
  newAddress: string;
  pinCode: string;
  mobileNumber: string;
}

function Address({ handleAddress }: { handleAddress: (address: string) => void }) {
  const [newAddress, setNewAddress] = useState<boolean>(false);
  const [address, setAddress] = useState<Address>({
    name: "",
    newAddress: "",
    pinCode: "",
    mobileNumber: ""
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Address>();

  const handleFormSubmit = async (data: Address) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/addAddress`, data, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setAddress(data);
        setNewAddress(false);
        const fetchedAddress = data
        handleAddress(
          `${fetchedAddress?.name}, (${fetchedAddress?.newAddress}, ${fetchedAddress?.pinCode}), Phone - ${fetchedAddress?.mobileNumber}`
        );
        reset();
      }
    } catch (err) {
      console.error("Error updating Address:", err);
    }
  };

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/getAddress`, {
          withCredentials: true
        });

        const fetchedAddress = res.data.address;
        setAddress(fetchedAddress); // Update local address state
        handleAddress(
          `${fetchedAddress?.name}, (${fetchedAddress?.newAddress}, ${fetchedAddress?.pinCode}), Phone - ${fetchedAddress?.mobileNumber}`
        );
      } catch (err) {
        console.error("Error fetching address:", err);
      }
    };

    fetchAddress();
  }, []); // Run only once on component mount

  return (
    <div className="address w-full shadow-lg flex p-3 flex-col lg:flex-row">
      <div className="flex flex-col gap-2">
        <h1 className="underline text-3xl">Address</h1>
        <div className="address-current-name text-2xl rounded-lg my-2">
          <strong>Name: </strong>
          {address?.name || "No name available"}
        </div>
        <div className="address-current-add my-2 rounded-lg">
          <strong>Address: </strong>
          {address?.newAddress || "No address available"}, {address?.pinCode || ""}
        </div>
        <div className="address-current-number font-extralight my-2">
          <strong>Mobile: </strong>
          {address?.mobileNumber || "No mobile number available"}
        </div>
        <button
          onClick={() => setNewAddress((prev) => !prev)}
          className="address-change my-2 bg-green-500 px-3 py-2 rounded-lg text-white active:scale-95"
        >
          {newAddress ? "Cancel" : "Add Address"}
        </button>
      </div>

      {newAddress && (
        <form
          className="address-new flex flex-col gap-4 rounded-lg p-4"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <input
            type="text"
            placeholder="Full Name"
            className="px-4 py-2 outline-none border rounded-lg"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          <input
            type="text"
            placeholder="New Address"
            className="px-4 py-2 outline-none border rounded-lg"
            {...register("newAddress", { required: "Address is required" })}
          />
          {errors.newAddress && <p className="text-red-500">{errors.newAddress.message}</p>}

          <input
            type="text"
            placeholder="Pin Code"
            className="px-4 py-2 outline-none border rounded-lg"
            {...register("pinCode", {
              required: "Pin Code is required",
              pattern: { value: /^\d{6}$/, message: "Enter a valid 6-digit pin code" },
            })}
          />
          {errors.pinCode && <p className="text-red-500">{errors.pinCode.message}</p>}

          <input
            type="text"
            placeholder="Mobile Number"
            className="px-4 py-2 outline-none border rounded-lg"
            {...register("mobileNumber", {
              required: "Mobile Number is required",
              pattern: { value: /^\d{10}$/, message: "Enter a valid 10-digit mobile number" },
            })}
          />
          {errors.mobileNumber && <p className="text-red-500">{errors.mobileNumber.message}</p>}

          <button
            disabled={isSubmitting}
            type="submit"
            className="px-4 py-2 bg-blue-400 text-white active:scale-95 rounded-lg"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </form>
      )}
    </div>
  );
}

export default Address;
