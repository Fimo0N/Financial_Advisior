import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, X, RefreshCw } from 'lucide-react';
import { fetchStockPrice } from '../utils/stockService';

const PortfolioScreen = ({ holdings, addHolding, removeHolding }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newHolding, setNewHolding] = useState({ symbol: '', shares: '' });
    const [fetchedPrice, setFetchedPrice] = useState(null);
    const [isLoadingPrice, setIsLoadingPrice] = useState(false);

    // Debounce price fetching
    useEffect(() => {
        const getPrice = async () => {
            if (newHolding.symbol.length >= 2) {
                setIsLoadingPrice(true);
                try {
                    const price = await fetchStockPrice(newHolding.symbol.toUpperCase());
                    setFetchedPrice(price);
                } catch (error) {
                    console.error("Failed to fetch price", error);
                    setFetchedPrice(null);
                } finally {
                    setIsLoadingPrice(false);
                }
            } else {
                setFetchedPrice(null);
            }
        };

        const timeoutId = setTimeout(getPrice, 800);
        return () => clearTimeout(timeoutId);
    }, [newHolding.symbol]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewHolding({ ...newHolding, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const shares = parseFloat(newHolding.shares);

        if (newHolding.symbol && shares > 0 && fetchedPrice) {
            addHolding({ ...newHolding, shares, purchasePrice: fetchedPrice });
            setNewHolding({ symbol: '', shares: '' });
            setFetchedPrice(null);
            setIsModalOpen(false);
        } else {
            alert("Please enter a valid symbol and shares, and wait for the price to load.");
        }
    };

    const calculateTotalValue = () => {
        // This calculates value based on CURRENT loaded prices in holdings
        // Assuming holdings have a currentPrice updated by parent, or we fall back to purchasePrice
        return holdings.reduce((total, holding) => {
            const price = holding.currentPrice || holding.purchasePrice;
            return total + (holding.shares * price);
        }, 0).toFixed(2);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Your Portfolio</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2"
                >
                    <PlusCircle size={20} />
                    Add Transaction
                </button>
            </div>

            {/* Portfolio Summary */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Total Portfolio Value</h3>
                <p className="text-4xl font-bold text-green-500 mt-2">${calculateTotalValue()}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <RefreshCw size={14} className="animate-spin-slow" />
                    <span>Live Market Updates</span>
                </div>
            </div>

            {/* Holdings Table */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Holdings</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-gray-200 dark:border-gray-600">
                            <tr>
                                <th className="p-3">Symbol</th>
                                <th className="p-3">Shares</th>
                                <th className="p-3">Avg. Buy Price</th>
                                <th className="p-3">Current Price</th>
                                <th className="p-3">Total Value</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {holdings.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-6 text-center text-gray-500">No holdings. Add a transaction to get started.</td>
                                </tr>
                            ) : holdings.map((holding) => (
                                <tr key={holding.symbol} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <td className="p-3 font-bold">{holding.symbol}</td>
                                    <td className="p-3">{holding.shares}</td>
                                    <td className="p-3 text-gray-500">${holding.purchasePrice.toFixed(2)}</td>
                                    <td className="p-3 font-semibold text-blue-600">
                                        ${(holding.currentPrice || holding.purchasePrice).toFixed(2)}
                                    </td>
                                    <td className="p-3 font-bold text-green-600">
                                        ${(holding.shares * (holding.currentPrice || holding.purchasePrice)).toFixed(2)}
                                    </td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => removeHolding(holding.symbol)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Transaction Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md relative animate-fade-in-up">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
                            <X size={24} />
                        </button>
                        <h3 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Add Transaction</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Stock Symbol</label>
                                <input
                                    type="text"
                                    name="symbol"
                                    value={newHolding.symbol}
                                    onChange={handleInputChange}
                                    placeholder="e.g., AAPL"
                                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    autoComplete="off"
                                />
                            </div>

                            {/* Price Preview */}
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg flex justify-between items-center h-16">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Current Market Price:</span>
                                {isLoadingPrice ? (
                                    <RefreshCw className="animate-spin text-blue-500" size={20} />
                                ) : fetchedPrice ? (
                                    <span className="text-xl font-bold text-green-600">${fetchedPrice}</span>
                                ) : (
                                    <span className="text-gray-400 italic">Enter symbol...</span>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Number of Shares</label>
                                <input
                                    type="number"
                                    name="shares"
                                    value={newHolding.shares}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 10"
                                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!fetchedPrice || !newHolding.symbol || !newHolding.shares}
                                className={`w-full font-bold py-3 rounded-lg shadow-md transition-colors ${!fetchedPrice || !newHolding.symbol || !newHolding.shares
                                        ? 'bg-gray-300 cursor-not-allowed text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                            >
                                Add to Portfolio
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PortfolioScreen;
