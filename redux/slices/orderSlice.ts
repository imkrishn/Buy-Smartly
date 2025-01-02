import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {},
  reducers: {
    setOrder(state, action) {
      return action.payload;
    },
    clearOrder() {
      return {}; // Reset the state to an empty object
    }
  }
});

export const { setOrder, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
