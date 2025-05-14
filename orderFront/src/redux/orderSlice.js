    import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    orders: []
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addOrder: (state, action) => {
            state.orders.push(action.payload);
        },
        removeOrder: (state, action) => {
            state.orders = state.orders.filter(order => order.orderId !== action.payload);
        },
        updateOrderStatus: (state, action) => {
            const { orderId, status } = action.payload;
            const order = state.orders.find(order => order.orderId === orderId);
            if (order) {
                order.status = status;
            }
        }
    }
});

export const { addOrder, removeOrder, updateOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;