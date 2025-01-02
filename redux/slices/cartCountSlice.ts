import { createSlice } from "@reduxjs/toolkit";

const cartCountSlice = createSlice({
  name: "cartCount",
  initialState: 0,
  reducers: {
    setCartCount(state, action) {
      return action.payload;
    },
    incrementCartCount(state) {
      return state + 1;
    },

  },
});

export const { setCartCount, incrementCartCount } = cartCountSlice.actions;

export default cartCountSlice.reducer;
