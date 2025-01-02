import { createSlice } from "@reduxjs/toolkit"

const User = {
  name: "",
  email: ""
}

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState: User,
  reducers: {
    setCurrentUser(state, action) {
      state.name = action.payload.name
      state.email = action.payload.email
    }
  }

})

export const { setCurrentUser } = currentUserSlice.actions;
export default currentUserSlice.reducer