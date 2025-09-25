import React, { useState, useEffect } from 'react';
import { Trash2, PlusCircle, DollarSign, ShoppingCart, TrendingDown, TrendingUp } from 'lucide-react';

interface ShoppingItem {
  id: string;
  name: string;
  price: number;
}

interface AppData {
  budget: number;
  items: ShoppingItem[];
}

function App() {
  const [budget, setBudget] = useState<number>(0);
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [itemName, setItemName] = useState<string>('');
  const [itemPrice, setItemPrice] = useState<string>('');

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('financeTracker');
    if (savedData) {
      try {
        const parsedData: AppData = JSON.parse(savedData);
        setBudget(parsedData.budget || 0);
        setItems(parsedData.items || []);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever budget or items change
  useEffect(() => {
    const dataToSave: AppData = {
      budget,
      items
    };
    localStorage.setItem('financeTracker', JSON.stringify(dataToSave));
  }, [budget, items]);

  // Calculate totals
  const totalSpent = items.reduce((sum, item) => sum + item.price, 0);
  const remainingBudget = budget - totalSpent;
  const isOverBudget = remainingBudget < 0;

  // Handle adding new item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemName.trim() && itemPrice.trim()) {
      const price = parseFloat(itemPrice);
      if (!isNaN(price) && price >= 0) {
        const newItem: ShoppingItem = {
          id: Date.now().toString(),
          name: itemName.trim(),
          price: price
        };
        setItems(prev => [...prev, newItem]);
        setItemName('');
        setItemPrice('');
      }
    }
  };

  // Handle deleting item
  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-3">
            <DollarSign className="w-8 h-8" />
            <h1 className="text-3xl font-bold tracking-tight">Finance Tracker</h1>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-center text-blue-100 mt-2 font-medium">
            Track your budget and shopping expenses
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Budget Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Set Your Budget</h2>
              <span className="text-xl">🎯</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                  Total Budget
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    id="budget"
                    value={budget || ''}
                    onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg font-medium"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Current Budget</p>
                  <p className="text-2xl font-bold text-gray-800">
                    ${budget.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shopping List Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Shopping List</h2>
              <span className="text-xl">🛍️</span>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4 mb-6">
              <div>
                <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  id="itemName"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Enter item name"
                />
              </div>

              <div>
                <label htmlFor="itemPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    id="itemPrice"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Add Item</span>
              </button>
            </form>

            {/* Items List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No items added yet</p>
                  <p className="text-sm">Add your first item above</p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-green-600 font-semibold">${item.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Totals Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Spent */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-700">Total Spent</h3>
              <span className="text-lg">💸</span>
            </div>
            <p className="text-3xl font-bold text-orange-600">${totalSpent.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">
              {items.length} item{items.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Remaining Budget */}
          <div className={`rounded-2xl shadow-lg p-6 border ${
            isOverBudget 
              ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200' 
              : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
          }`}>
            <div className="flex items-center space-x-3 mb-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isOverBudget ? 'bg-red-100' : 'bg-green-100'
              }`}>
                <TrendingUp className={`w-5 h-5 ${
                  isOverBudget ? 'text-red-600' : 'text-green-600'
                }`} />
              </div>
              <h3 className="font-semibold text-gray-700">
                {isOverBudget ? 'Over Budget' : 'Remaining'}
              </h3>
              <span className="text-lg">{isOverBudget ? '⚠️' : '✅'}</span>
            </div>
            <p className={`text-3xl font-bold ${
              isOverBudget ? 'text-red-600' : 'text-green-600'
            }`}>
              ${Math.abs(remainingBudget).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {isOverBudget ? 'Exceeds budget' : 'Left to spend'}
            </p>
          </div>

          {/* Budget Progress */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-700">Budget Usage</h3>
              <span className="text-lg">📊</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">
                  {budget > 0 ? Math.min(Math.round((totalSpent / budget) * 100), 999) : 0}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    isOverBudget 
                      ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  }`}
                  style={{ 
                    width: budget > 0 ? `${Math.min((totalSpent / budget) * 100, 100)}%` : '0%' 
                  }}
                />
              </div>
              
              {isOverBudget && (
                <div className="text-xs text-red-600 bg-red-50 px-3 py-1 rounded-full text-center font-medium">
                  You've exceeded your budget by ${Math.abs(remainingBudget).toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;