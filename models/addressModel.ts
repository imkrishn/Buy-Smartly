import mongoose, { Document, Schema, Types } from 'mongoose';

// Interface for the Address model
interface IAddress extends Document {
  userId: Types.ObjectId;
  name: string;
  newAddress: string;
  pinCode: string;
  mobileNumber: string;
}

const addressSchema = new Schema<IAddress>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  newAddress: {
    type: String,
    required: true,
  },
  pinCode: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (v: string) {
        return /^\d{10}$/.test(v); // Ensures the mobile number is exactly 10 digits
      },
      message: "Please provide a valid Mobile Number",
    },
  },
});

// Model definition
const Address = mongoose.models.Address || mongoose.model<IAddress>('Address', addressSchema);

export default Address;
