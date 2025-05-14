import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import inventoryReducer from './inventorysSlice';
import orderReducer from './orderSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    inventory: inventoryReducer,
    order: orderReducer
  },
});

export default store;