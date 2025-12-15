import React, { useState, useEffect } from 'react';
import { Home, BarChart2, BrainCircuit, Newspaper, Target, TrendingUp, Shield } from 'lucide-react';

import Navigation from './components/Navigation.jsx';
import DashboardScreen from './screens/DashboardScreen.jsx';
import PortfolioScreen from './screens/PortfolioScreen.jsx';
import AiInsightsScreen from './screens/AiInsightsScreen.jsx';
import FinancialNewsScreen from './screens/FinancialNewsScreen.jsx';
import GoalsScreen from './screens/GoalsScreen.jsx';
import PredictionScreen from './screens/PredictionScreen.jsx';
import RiskAssessment from './components/RiskAssessment.jsx';

import axios from 'axios';
import { fetchStockPrice } from './utils/stockService';

function App() {
  const [activeScreen, setActiveScreen] = useState('Dashboard');

  // --- Centralized State for Portfolio ---
  const [holdings, setHoldings] = useState([]);

  // Fetch initial holdings from backend
  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/transactions');
        const transactions = response.data.data;
        processTransactions(transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchHoldings();
  }, []);

  // Helper to aggregate transactions into holdings
  const processTransactions = (transactions) => {
    const aggregated = {};

    transactions.forEach(tx => {
      const sym = tx.symbol.toUpperCase();
      if (!aggregated[sym]) {
        aggregated[sym] = {
          symbol: sym,
          shares: 0,
          purchasePrice: 0,
          totalCost: 0
        };
      }
      aggregated[sym].shares += tx.shares;
      aggregated[sym].totalCost += (tx.shares * tx.price_at_purchase);
    });

    const holdingsArray = Object.values(aggregated).map(h => ({
      symbol: h.symbol,
      shares: h.shares,
      purchasePrice: h.shares > 0 ? h.totalCost / h.shares : 0,
      currentPrice: h.purchasePrice // Init with purchase price
    }));

    setHoldings(holdingsArray);
  };

  // Real-time price polling
  useEffect(() => {
    const updatePrices = async () => {
      if (holdings.length === 0) return;

      const updatedHoldings = await Promise.all(holdings.map(async (holding) => {
        try {
          const price = await fetchStockPrice(holding.symbol);
          return { ...holding, currentPrice: price };
        } catch (e) {
          return holding;
        }
      }));

      setHoldings(updatedHoldings);
    };

    const interval = setInterval(updatePrices, 5000);
    return () => clearInterval(interval);
  }, [holdings.length]);

  // --- Centralized State for Goals ---
  const [goals, setGoals] = useState([
    { id: 1, name: 'Vacation Fund', target: 5000, current: 1200 },
    { id: 2, name: 'New Car', target: 25000, current: 8500 },
  ]);

  // Function to add a new holding to the portfolio (and save to backend)
  const addHolding = async (newHolding) => {
    try {
      await axios.post('http://localhost:3000/api/transactions', {
        symbol: newHolding.symbol.toUpperCase(),
        shares: newHolding.shares,
        price_at_purchase: newHolding.purchasePrice
      });

      const response = await axios.get('http://localhost:3000/api/transactions');
      processTransactions(response.data.data);

    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("Failed to save transaction to backend.");
    }
  };

  // Function to remove a holding (Client side only for now)
  const removeHolding = (symbol) => {
    setHoldings(holdings.filter(h => h.symbol !== symbol));
  };


  // Function to add a new goal
  const addGoal = (newGoal) => {
    setGoals([...goals, { ...newGoal, id: Date.now(), current: 0 }]);
  };

  // Function to add a contribution to a goal
  const addContribution = (goalId, amount) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        return { ...goal, current: goal.current + amount };
      }
      return goal;
    });
    setGoals(updatedGoals);
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'Dashboard':
        return <DashboardScreen holdings={holdings} setActiveScreen={setActiveScreen} />;
      case 'Portfolio':
        return <PortfolioScreen holdings={holdings} addHolding={addHolding} removeHolding={removeHolding} />;
      case 'Prediction':
        return <PredictionScreen />;
      case 'AI Insights':
        return <AiInsightsScreen />;
      case 'Financial News':
        return <FinancialNewsScreen />;
      case 'Goals':
        return <GoalsScreen goals={goals} addGoal={addGoal} addContribution={addContribution} />;
      case 'Risk Assessment':
        return <RiskAssessment />;
      default:
        return <DashboardScreen holdings={holdings} />;
    }
  };

  // Navigation items configuration
  const navItems = [
    { name: 'Dashboard', icon: Home },
    { name: 'Portfolio', icon: BarChart2 },
    { name: 'Prediction', icon: TrendingUp },
    { name: 'AI Insights', icon: BrainCircuit },
    { name: 'Financial News', icon: Newspaper },
    { name: 'Goals', icon: Target },
    { name: 'Risk Assessment', icon: Shield },
  ];

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen flex flex-col md:flex-row">
      {/* Main Navigation Component */}
      <Navigation
        navItems={navItems}
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {renderScreen()}
      </main>
    </div>

  );
}

export default App;