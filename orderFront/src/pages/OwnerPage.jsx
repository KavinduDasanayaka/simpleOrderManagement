import React, { useState } from "react";
import Header from '../components/Header';
import { useSelector, useDispatch } from 'react-redux';
import { restockIngredient } from '../redux/inventorysSlice';

function OwnerPage() {
    const inventory = useSelector((state) => state.inventory.inventory);
    const dispatch = useDispatch();
    const [restock, setRestock] = useState({ ingredient: 'dough', amount: 0 });

    const handleRestock = (e) => {
        e.preventDefault();
        if (restock.amount > 0) {
            dispatch(restockIngredient({ ingredient: restock.ingredient, amount: Number(restock.amount) }));
            setRestock({ ...restock, amount: 0 });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-600 to-blue-400">
            <Header />
            <div className="flex flex-col items-center mt-10">
                <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-2">
                    Inventory Dashboard
                </h1>
                <p className="text-lg text-white mt-2 max-w-xl text-center">
                    View and manage inventory levels for pizza ingredients.
                </p>
            </div>
            <div className="flex justify-center mt-12">
                <div className="bg-white bg-opacity-90 rounded-2xl shadow-2xl px-10 py-8 w-full max-w-md">
                    <h2 className="text-3xl font-bold text-cyan-700 mb-6 text-center">Current Inventory</h2>
                    <ul className="text-sm text-cyan-700 mb-6">
                        {Object.entries(inventory).map(([ingredient, quantity]) => (
                            <li key={ingredient} className="mb-2">
                                {ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}: {quantity}
                            </li>
                        ))}
                    </ul>
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
                            <option value="dough">Dough</option>
                            <option value="sauce">Sauce</option>
                            <option value="cheese">Cheese</option>
                            <option value="pepperoni">Pepperoni</option>
                            <option value="onion">Onion</option>
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
            </div>
        </div>
    );
}

export default OwnerPage;