import { combineReducers } from '@reduxjs/toolkit';
import currentUserSlice from './slices/currentUser'
import orderSlice from './slices/orderSlice'
import cartCountSlice from '@/redux/slices/cartCountSlice'

const rootReducer = combineReducers({
  currentUser: currentUserSlice,
  order: orderSlice,
  cartCount: cartCountSlice,
});

export default rootReducer;