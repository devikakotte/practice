const express = require('express');
const app = express();
const PORT = 9000;

app.use(express.json());

app.get('/categories/:categoryName/products', async (req, res) => {
    const { categoryName } = req.params;
    const n = parseInt(req.query.n) || 10;
    const minPrice = parseInt(req.query.minPrice) || 0;
    const maxPrice = parseInt(req.query.maxPrice) || 1000000;
    
    // Read the sorting parameters
    const sort = req.query.sort;            // e.g., 'price' or 'rating'
    const order = req.query.order || 'asc';  // 'asc' or 'desc'

    let rawCombinedProducts = [
        { productName: "Wireless Earbuds X", price: 3000, rating: 4.5 },
        { productName: "Noise Cancelling Buds", price: 7500, rating: 4.8 },
        { productName: "Basic Earphones", price: 800, rating: 3.5 }
    ];

    // (Milestone 2 logic applied)
    const uniqueTrackingMap = new Map();
    rawCombinedProducts.forEach(product => uniqueTrackingMap.set(product.productName, product));
    let uniqueProducts = Array.from(uniqueTrackingMap.values());
    let filteredProducts = uniqueProducts.filter(p => p.price >= minPrice && p.price <= maxPrice);

    // --- NEW MATERIAL FOR MILESTONE 3 ---

    // 1. DYNAMIC SORTING ENGINES
    if (sort) {
        filteredProducts.sort((a, b) => {
            // Read properties dynamically via bracket notation
            const valueA = a[sort]; 
            const valueB = b[sort];

            // Use a ternary operator to handle order math
            return order === 'desc' ? valueB - valueA : valueA - valueB;
        });
    }

    // 2. TOP-N WINDOW SLICING
    const responsePayload = filteredProducts.slice(0, n);

    // 3. SUCCESS RESPONSES
    res.json(responsePayload);
});

app.listen(PORT, () => {
    console.log(`🚀 Aggregator server spinning on port ${PORT}`);
});