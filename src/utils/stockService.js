export const fetchStockPrice = async (symbol) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock data generation
    // deterministic based on symbol char codes so it doesn't jump wildly on every keystroke
    // but random enough to look real
    const hash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const basePrice = (hash % 500) + 50; // Price between $50 and $550

    // Add some random noise for "real-time" feel
    const noise = (Math.random() - 0.5) * 2;
    return parseFloat((basePrice + noise).toFixed(2));
};

export const fetchHistoricalData = async (symbol) => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const history = [];
    const today = new Date();

    // Deterministic start price based on symbol
    const hash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    let price = (hash % 400) + 50;

    // Generate 180 days of history
    for (let i = 180; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // Random walk
        const change = (Math.random() - 0.5) * 5;
        price += change;
        if (price < 10) price = 10;

        history.push({
            date: date.toISOString().split('T')[0],
            close: parseFloat(price.toFixed(2))
        });
    }
    return history;
};