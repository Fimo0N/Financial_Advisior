import axios from 'axios';
import { twelveDataApiKey } from '../config/apiKeys';


// ──────────────────────────────────────────
// SIMPLE PARSED QUOTE (task requirement)
// Parses price, change, percent_change
// ──────────────────────────────────────────
export const fetchParsedQuote = async (symbol) => {
    try {
        const url = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${twelveDataApiKey}`;

        const response = await axios.get(url);
        const data = response.data;

        return {
            price: parseFloat(data.price),
            change: parseFloat(data.change),
            percent_change: parseFloat(data.percent_change)
        };

    } catch (error) {
        console.error("Error parsing quote data:", error);
        return null;
    }
};


// ──────────────────────────────────────────
// FULL QUOTE ENDPOINT FUNCTION
// (returns all key metrics from Twelve Data)
// ──────────────────────────────────────────
export const fetchQuote = async (symbol) => {
    try {
        let querySymbol = symbol;

        // Crypto translation table
        const cryptoMap = {
            'BTC': 'BTC/USD',
            'ETH': 'ETH/USD',
            'SOL': 'SOL/USD',
            'DOGE': 'DOGE/USD',
            'XRP': 'XRP/USD',
            'ADA': 'ADA/USD',
            'BNB': 'BNB/USD'
        };

        if (cryptoMap[symbol]) {
            querySymbol = cryptoMap[symbol];
        }

        const url = `https://api.twelvedata.com/quote?symbol=${querySymbol}&apikey=${twelveDataApiKey}`;

        const response = await axios.get(url);
        const data = response.data;

        if (data.status === "error") {
            console.error("Quote API Error:", data.message);
            return null;
        }

        return {
            symbol: data.symbol,
            name: data.name,
            price: parseFloat(data.price),
            change: parseFloat(data.change),
            percent_change: parseFloat(data.percent_change),
            open: parseFloat(data.open),
            high: parseFloat(data.high),
            low: parseFloat(data.low),
            previous_close: parseFloat(data.previous_close),
            volume: data.volume ? parseFloat(data.volume) : null,
            timestamp: data.datetime
        };

    } catch (error) {
        console.error("Network or Server Error (quote):", error);
        return null;
    }
};


// ──────────────────────────────────────────
// HISTORICAL DATA (your original function)
// ──────────────────────────────────────────
export const fetchHistoricalData = async (symbol) => {
    try {
        let querySymbol = symbol;

        // Crypto translation table
        const cryptoMap = {
            'BTC': 'BTC/USD',
            'ETH': 'ETH/USD',
            'SOL': 'SOL/USD',
            'DOGE': 'DOGE/USD',
            'XRP': 'XRP/USD',
            'ADA': 'ADA/USD',
            'BNB': 'BNB/USD'
        };
        if (cryptoMap[symbol]) {
            querySymbol = cryptoMap[symbol];
        }

        const url = `https://api.twelvedata.com/time_series?symbol=${querySymbol}&interval=1day&outputsize=5000&apikey=${twelveDataApiKey}`;

        console.log(`Fetching history for ${querySymbol}...`);

        const response = await axios.get(url);
        const data = response.data;

        if (data.code && data.code !== 200) {
            console.error("API Error:", data.message);
            return null;
        }

        if (!data.values || data.values.length === 0) {
            console.warn(`No data values returned for ${querySymbol}`);
            return null;
        }

        const cleanData = data.values.map(day => ({
            date: day.datetime,
            close: parseFloat(day.close)
        })).reverse();

        return cleanData;

    } catch (error) {
        console.error("Network or Server Error:", error);
        return null;
    }
};
