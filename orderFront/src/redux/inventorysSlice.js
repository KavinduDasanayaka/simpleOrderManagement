import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    inventory: {
        dough: 50,
        sauce: 30,
        cheese: 40,
        pepperoni: 20,
        onion: 25
    }
};

const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {
        deductIngredients: (state, action) => {
            const { ingredients } = action.payload;
            for (const [ingredient, amount] of Object.entries(ingredients)) {
                if (state.inventory[ingredient] >= amount) {
                    state.inventory[ingredient] -= amount;
                }
            }
        },
        restockIngredient: (state, action) => {
            const { ingredient, amount } = action.payload;
            state.inventory[ingredient] = (state.inventory[ingredient] || 0) + amount;
        },
        addInventoryItem: (state, action) => {
            const { ingredient, quantity } = action.payload;
            if (!state.inventory[ingredient]) {
                state.inventory[ingredient] = quantity;
            }
        },
        removeInventoryItem: (state, action) => {
            delete state.inventory[action.payload];
        }
    }
});

export const { deductIngredients, restockIngredient, addInventoryItem, removeInventoryItem } = inventorySlice.actions;
export default inventorySlice.reducer;