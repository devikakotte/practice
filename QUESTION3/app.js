const express = require('express');
const app = express();
const PORT = 9000;

app.use(express.json());

// --- ENDPOINT A: GET ALL PRODUCTS WITH GENERATED DETERMINISTIC IDS ---
app.get('/categories/:categoryName/products', async (req, res) => {
    try {
        // Mock dataset representing incoming raw company records
        let rawProducts = [
            { productName: "Premium Mechanical Keyboard", price: 6500 },
            { productName: "Ergonomic Wireless Mouse", price: 4200 }
        ];

        // Map through products and inject a standardized ID attribute
        let productsWithIds = rawProducts.map(product => {
            // Algorithmic transformation: lowercase the text and replace spaces with hyphens
            const cleanId = product.productName.toLowerCase().replace(/ /g, "-");
            
            return {
                ...product,
                id: cleanId // e.g., "premium-mechanical-keyboard"
            };
        });

        res.status(200).json(productsWithIds);
    } catch (error) {
        res.status(500).json({ error: "Failed to compile collection IDs" });
    }
});


// --- ENDPOINT B: NEW SPECIFIC SINGLE PRODUCT LOOKUP BY ID ---
// Example Path: /categories/Accessories/products/premium-mechanical-keyboard
app.get('/categories/:categoryName/products/:productId', async (req, res) => {
    try {
        // 1. EXTRACT BOTH WILDCARD VARIABLES FROM THE PATH LINK
        const { categoryName, productId } = req.params;

        // Mock database collection (pre-populated with our deterministic string IDs)
        let productDatabase = [
            { productName: "Premium Mechanical Keyboard", price: 6500, id: "premium-mechanical-keyboard", rating: 4.8 },
            { productName: "Ergonomic Wireless Mouse", price: 4200, id: "ergonomic-wireless-mouse", rating: 4.5 }
        ];

        // 2. THE SEARCH MATCH ENGINE (.find)
        // Scans the array item-by-item and extracts the exact match instantly
        const matchedProduct = productDatabase.find(p => p.id === productId);

        // 3. THE 404 ERROR BOUNDARY GUARD
        // If matchedProduct is empty (undefined), break immediately and return a 404
        if (!matchedProduct) {
            return res.status(404).json({
                error: "Product Not Found",
                message: `No product item found within category '${categoryName}' matching ID code: '${productId}'`
            });
        }

        // 4. FLUSH SUCCESS PAYLOAD
        res.status(200).json(matchedProduct);

    } catch (error) {
        console.error("❌ Individual Lookup Engine Broken:", error.message);
        res.status(500).json({ error: "Internal details matching pipeline failure" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Details Lookup Server running on port ${PORT}`);
});