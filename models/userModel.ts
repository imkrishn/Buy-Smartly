import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please provide Full Name"],
    trim: true,
  },
  mobileNumber: {
    type: String,
    unique: true,
    validate: {
      validator: function (v: any) {
        return /^\d{10,10}$/.test(v);
      },
      message: "Please provide a valid Mobile Number",
    },
  },
  email: {
    type: String,
    required: [true, "Please provide Email"],
    unique: true,
    lowercase: true, // Converts email to lowercase
    trim: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Email validation regex
      },
      message: "Please provide a valid Email",
    },
  },
  dateOfBirth: {
    type: Date, // Use `Date` for date fields
    required: [true, "Please provide date of birth"],
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: [8, "Password must be at least 8 characters"], // Enforces minimum password length

  },
  salt: {
    type: String,
    select: false,
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  creationTime: {
    type: Date,
    default: Date.now,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date
});



const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
