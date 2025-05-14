import React, { useState } from "react";
import Header from '../components/Header';
import { useSelector, useDispatch } from 'react-redux';
import { restockIngredient, addInventoryItem, removeInventoryItem } from '../redux/inventorysSlice';
import { addOrder, removeOrder, updateOrderStatus } from '../redux/orderSlice';

function OwnerPage() {
    const inventory = useSelector((state) => state.inventory.inventory);
    const orders = useSelector((state) => state.order.orders);
    const dispatch = useDispatch();

    // State for restock form
    const [restock, setRestock] = useState({ ingredient: 'dough', amount: 0 });

    // State for new inventory item form
    const [newItem, setNewItem] = useState({ ingredient: '', quantity: 0 });

    // State for new order form
    const [newOrder, setNewOrder] = useState({ pizzaType: 'pepperoni', quantity: 1 });

    // Pizza costs for calculating total cost in new order
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

    // Handle restock form submission
    const handleRestock = (e) => {
        e.preventDefault();
        if (restock.amount > 0) {
            dispatch(restockIngredient({ ingredient: restock.ingredient, amount: Number(restock.amount) }));
            setRestock({ ...restock, amount: 0 });
        }
    };

    // Handle new inventory item form submission
    const handleAddItem = (e) => {
        e.preventDefault();
        if (newItem.ingredient && newItem.quantity > 0) {
            dispatch(addInventoryItem({ ingredient: newItem.ingredient.toLowerCase(), quantity: Number(newItem.quantity) }));
            setNewItem({ ingredient: '', quantity: 0 });
        }
    };

    // Handle remove inventory item
    const handleRemoveItem = (ingredient) => {
        dispatch(removeInventoryItem(ingredient));
    };

    // Handle new order form submission
    const handleAddOrder = (e) => {
        e.preventDefault();
        const pizza = pizzaCosts[newOrder.pizzaType];
        const ingredientCost = Object.values(pizza.ingredientCosts).reduce((sum, cost) => sum + cost, 0);
        const totalCost = (pizza.base + ingredientCost) * newOrder.quantity;

        // Check inventory availability
        let canOrder = true;
        const ingredientsToDeduct = {};
        for (const [ingredient, amount] of Object.entries(pizza.ingredients)) {
            const needed = amount * newOrder.quantity;
            ingredientsToDeduct[ingredient] = needed;
            if (inventory[ingredient] < needed) {
                canOrder = false;
            }
        }

        if (canOrder) {
            const newOrderId = "ORD-" + Date.now() + "-" + Math.floor(Math.random() * 10000);
            dispatch(addOrder({
                orderId: newOrderId,
                pizzaType: newOrder.pizzaType,
                quantity: newOrder.quantity,
                totalCost,
                status: 'Placed'
            }));
            dispatch(deductIngredients({ ingredients: ingredientsToDeduct }));
            setNewOrder({ pizzaType: 'pepperoni', quantity: 1 });
        } else {
            alert('Insufficient ingredients to fulfill this order.');
        }
    };

    // Handle remove order
    const handleRemoveOrder = (orderId) => {
        dispatch(removeOrder(orderId));
    };

    // Handle update order status
    const handleUpdateStatus = (orderId, status) => {
        dispatch(updateOrderStatus({ orderId, status }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-600 to-blue-400">
            <Header />
            <div className="flex flex-col items-center mt-10">
                <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-2">
                    Owner Dashboard
                </h1>
                <p className="text-lg text-white mt-2 max-w-xl text-center">
                    Manage inventory and orders for the pizza shop.
                </p>
            </div>
            <div className="flex flex-col items-center mt-12 space-y-12">
                {/* Current Inventory */}
                <div className="bg-white bg-opacity-90 rounded-2xl shadow-2xl px-10 py-8 w-full max-w-md">
                    <h2 className="text-3xl font-bold text-cyan-700 mb-6 text-center">Current Inventory</h2>
                    <ul className="text-sm text-cyan-700 mb-6">
                        {Object.entries(inventory).map(([ingredient, quantity]) => (
                            <li key={ingredient} className="mb-2 flex justify-between">
                                <span>{ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}: {quantity}</span>
                                <button
                                    onClick={() => handleRemoveItem(ingredient)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Restock Inventory */}
                <div className="bg-white bg-opacity-90 rounded-2xl shadow-2xl px-10 py-8 w-full max-w-md">
                    <h2 className="text-3xl font-bold text-cyan-700 mb-6 text-center">Restock Inventory</h2>
                    <form onSubmit={handleRestock}>
                        <label className="block text-lg font-medium text-cyan-800 mb-2" htmlFor="ingredient">
                            Select Ingredient:
                        </label>
                        <select
                            id="ingredient"
                            className="w-full border-2 border-cyan-200 rounded-xl p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                            value={restock.ingredient}
                            onChange={(e) => setRestock({ ...restock, ingredient: e.target.value })}
                        >
                            {Object.keys(inventory).map(ingredient => (
                                <option key={ingredient} value={ingredient}>{ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}</option>
                            ))}
                        </select>
                        <label className="block text-lg font-medium text-cyan-800 mb-2" htmlFor="amount">
                            Restock Amount:
                        </label>
                        <input
                            type="number"
                            id="amount"
                            min="0"
                            className="w-full border-2 border-cyan-200 rounded-xl p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                            placeholder="Enter amount"
                            value={restock.amount}
                            onChange={(e) => setRestock({ ...restock, amount: e.target.value })}
                        />
                        <button
                            type="submit"
                            className={`w-full py-3 rounded-xl font-semibold transition shadow-md ${
                                restock.amount > 0
                                    ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                            }`}
                            disabled={restock.amount <= 0}
                        >
                            Restock
                        </button>
                    </form>
                </div>

                {/* Add New Inventory Item */}
                <div className="bg-white bg-opacity-90 rounded-2xl shadow-2xl px-10 py-8 w-full max-w-md">
                    <h2 className="text-3xl font-bold text-cyan-700 mb-6 text-center">Add New Inventory Item</h2>
                    <form onSubmit={handleAddItem}>
                        <label className="block text-lg font-medium text-cyan-800 mb-2" htmlFor="newIngredient">
                            Ingredient Name:
                        </label>
                        <input
                            type="text"
                            id="newIngredient"
                            className="w-full border-2 border-cyan-200 rounded-xl p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                            placeholder="Enter ingredient name"
                            value={newItem.ingredient}
                            onChange={(e) => setNewItem({ ...newItem, ingredient: e.target.value })}
                        />
                        <label className="block text-lg font-medium text-cyan-800 mb-2" htmlFor="newQuantity">
                            Initial Quantity:
                        </label>
                        <input
                            type="number"
                            id="newQuantity"
                            min="0"
                            className="w-full border-2 border-cyan-200 rounded-xl p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                            placeholder="Enter quantity"
                            value={newItem.quantity}
                            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                        />
                        <button
                            type="submit"
                            className={`w-full py-3 rounded-xl font-semibold transition shadow-md ${
                                newItem.ingredient && newItem.quantity > 0
                                    ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                            }`}
                            disabled={!newItem.ingredient || newItem.quantity <= 0}
                        >
                            Add Item
                        </button>
                    </form>
                </div>

                {/* Manage Orders */}
                <div className="bg-white bg-opacity-90 rounded-2xl shadow-2xl px-10 py-8 w-full max-w-2xl">
                    <h2 className="text-3xl font-bold text-cyan-700 mb-6 text-center">Manage Orders</h2>
                    <h3 className="text-lg font-medium text-cyan-800 mb-4">Current Orders</h3>
                    {orders.length === 0 ? (
                        <p className="text-sm text-cyan-700 text-center">No orders available.</p>
                    ) : (
                        <table className="w-full text-sm text-cyan-700">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-2">Order ID</th>
                                    <th>Pizza</th>
                                    <th>Qty</th>
                                    <th>Cost</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.orderId} className="border-b">
                                        <td className="py-2">{order.orderId}</td>
                                        <td>{order.pizzaType.charAt(0).toUpperCase() + order.pizzaType.slice(1)}</td>
                                        <td>{order.quantity}</td>
                                        <td>${order.totalCost.toFixed(2)}</td>
                                        <td>
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleUpdateStatus(order.orderId, e.target.value)}
                                                className="border-2 border-cyan-200 rounded p-1"
                                            >
                                                <option value="Placed">Placed</option>
                                                <option value="Preparing">Preparing</option>
                                                <option value="Dispatched">Dispatched</option>
                                                <option value="Delivered">Delivered</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleRemoveOrder(order.orderId)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <h3 className="text-lg font-medium text-cyan-800 mt-6 mb-4">Add New Order</h3>
                    <form onSubmit={handleAddOrder}>
                        <label className="block text-lg font-medium text-cyan-800 mb-2" htmlFor="pizzaType">
                            Pizza Type:
                        </label>
                        <select
                            id="pizzaType"
                            className="w-full border-2 border-cyan-200 rounded-xl p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                            value={newOrder.pizzaType}
                            onChange={(e) => setNewOrder({ ...newOrder, pizzaType: e.target.value })}
                        >
                            <option value="pepperoni">Pepperoni Pizza</option>
                            <option value="cheesy">Cheesy Pizza</option>
                            <option value="onion">Onion Pizza</option>
                        </select>
                        <label className="block text-lg font-medium text-cyan-800 mb-2" htmlFor="orderQuantity">
                            Quantity:
                        </label>
                        <input
                            type="number"
                            id="orderQuantity"
                            min="1"
                            className="w-full border-2 border-cyan-200 rounded-xl p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                            placeholder="Enter quantity"
                            value={newOrder.quantity}
                            onChange={(e) => setNewOrder({ ...newOrder, quantity: Number(e.target.value) })}
                        />
                        <button
                            type="submit"
                            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-xl transition shadow-md"
                        >
                            Add Order
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default OwnerPage;