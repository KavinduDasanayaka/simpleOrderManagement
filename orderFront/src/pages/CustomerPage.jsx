import React from "react";
import Header from "../components/Header";
import { useState, useMemo } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { deductIngredients } from '../redux/inventorysSlice';

function CustomerPage() {
    const [order, setOrder] = useState("pepperoni");
    const [quantity, setQuantity] = useState(1);
    const [orderId, setOrderId] = useState(null);
    const dispatch = useDispatch();
    const inventory = useSelector((state) => state.inventory.inventory);

    // Define pizza recipes and costs
    const pizzaCosts = {
        pepperoni: {
            base: 8,
            ingredients: { dough: 1, sauce: 1, cheese: 2, pepperoni: 3 },
            ingredientCosts: { dough: 2, sauce: 1, cheese: 2, pepperoni: 3 }
        },
        cheesy: {
            base: 7,
            ingredients: { dough: 1, sauce: 1, cheese: 4 },
            ingredientCosts: { dough: 2, sauce: 1, cheese: 4 }
        },
        onion: {
            base: 6,
            ingredients: { dough: 1, sauce: 1, cheese: 2, onion: 2 },
            ingredientCosts: { dough: 2, sauce: 1, cheese: 2, onion: 1 }
        }
    };

    // Calculate total cost and check inventory availability
    const { totalCost, isOrderPossible, requiredIngredients } = useMemo(() => {
        const pizza = pizzaCosts[order];
        const ingredientCost = Object.values(pizza.ingredientCosts).reduce((sum, cost) => sum + cost, 0);
        const total = (pizza.base + ingredientCost) * quantity;

        // Check if enough ingredients are available
        const required = {};
        let canOrder = true;
        for (const [ingredient, amount] of Object.entries(pizza.ingredients)) {
            const needed = amount * quantity;
            required[ingredient] = needed;
            if (inventory[ingredient] < needed) {
                canOrder = false;
            }
        }

        return { totalCost: total, isOrderPossible: canOrder, requiredIngredients: required };
    }, [order, quantity, inventory]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isOrderPossible) return;

        const newOrderId = "ORD-" + Date.now() + "-" + Math.floor(Math.random() * 10000);
        setOrderId(newOrderId);

        // Dispatch action to deduct ingredients
        const ingredientsToDeduct = {};
        for (const [ingredient, amount] of Object.entries(pizzaCosts[order].ingredients)) {
            ingredientsToDeduct[ingredient] = amount * quantity;
        }
        dispatch(deductIngredients({ ingredients: ingredientsToDeduct }));

        // Log order details for backend API
        console.log({ order, quantity, totalCost, orderId: newOrderId });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-600 to-blue-400">
            <Header />

            <div className="flex flex-col items-center mt-10">
                <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-2">
                    Welcome to the Customer Page
                </h1>
                <p className="text-lg text-white mt-2 max-w-xl text-center">
                    Manage your orders easily. Choose from Pepperoni Pizza, Cheesy Pizza, or Onion Pizza below.
                </p>
            </div>
            <div className="flex justify-center mt-12">
                <form
                    className="bg-white bg-opacity-90 rounded-2xl shadow-2xl px-10 py-8 w-full max-w-md"
                    onSubmit={handleSubmit}
                >
                    <h2 className="text-3xl font-bold text-cyan-700 mb-6 text-center">Order Form</h2>
 Achieving Greatness
                    <label className="block text-lg font-medium text-cyan-800 mb-2" htmlFor="order">
                        Select your order:
                    </label>
                    <select
                        id="order"
                        className="w-full border-2 border-cyan-200 rounded-xl p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                    >
                        <option value="pepperoni">Pepperoni Pizza</option>
                        <option value="cheesy">Cheesy Pizza</option>
                        <option value="onion">Onion Pizza</option>
                    </select>
                    <label className="block text-lg font-medium text-cyan-800 mb-2" htmlFor="quantity">
                        Quantity:
                    </label>
                    <input
                        type="number"
                        id="quantity"
                        min="1"
                        className="w-full border-2 border-cyan-200 rounded-xl p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                        placeholder="Enter quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-cyan-800">Cost Breakdown:</h3>
                        <ul className="text-sm text-cyan-700">
                            {Object.entries(pizzaCosts[order].ingredientCosts).map(([ingredient, cost]) => (
                                <li key={ingredient}>
                                    {ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}: ${cost} x {quantity} = ${(cost * quantity).toFixed(2)}
                                </li>
                            ))}
                            <li className="font-semibold mt-2">
                                Total Cost: ${totalCost.toFixed(2)}
                            </li>
                        </ul>
                    </div>
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-cyan-800">Inventory Status:</h3>
                        <ul className="text-sm text-cyan-700">
                            {Object.entries(requiredIngredients).map(([ingredient, needed]) => (
                                <li key={ingredient} className={inventory[ingredient] < needed ? "text-red-600" : ""}>
                                    {ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}: {inventory[ingredient]} available, {needed} needed
                                </li>
                            ))}
                        </ul>
                        {!isOrderPossible && (
                            <p className="text-red-600 text-sm mt-2">
                                Insufficient ingredients to fulfill this order. Please reduce quantity or choose another pizza.
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className={`w-full py-3 rounded-xl font-semibold transition shadow-md ${
                            isOrderPossible
                                ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                                : "bg-gray-400 text-gray-200 cursor-not-allowed"
                        }`}
                        disabled={!isOrderPossible}
                    >
                        Submit Order
                    </button>
                    {orderId && (
                        <div className="mt-6 text-center text-green-700 font-semibold">
                            Order submitted! Your order ID is: <span className="font-mono">{orderId}</span>
                            <br />
                            Total Cost: ${totalCost.toFixed(2)} for {quantity} {order} pizza(s)
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default CustomerPage;