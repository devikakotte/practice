const express = require('express');
const app = express();
const PORT = 9000;

app.use(express.json());

app.get('/categories/:categoryName/products', async (req, res) => {
    try {
        const { categoryName } = req.params;

        // 1. EXTRACT PAGINATION PARAMETERS WITH SAFE DEFAULTS
        const n = parseInt(req.query.n) || 5;       // Number of products per page
        const page = parseInt(req.query.page) || 1; // Requested page index

        // 2. MOCK LARGE DATASET (Simulating an array of 12 distinct products)
        let largeDataset = [
            { id: 1, productName: "Pro Laptop A", price: 50000 },
            { id: 2, productName: "Pro Laptop B", price: 55000 },
            { id: 3, productName: "Pro Laptop C", price: 60000 },
            { id: 4, productName: "Budget Laptop D", price: 25000 },
            { id: 5, productName: "Budget Laptop E", price: 28000 },
            { id: 6, productName: "Gaming Laptop F", price: 85000 },
            { id: 7, productName: "Gaming Laptop G", price: 92000 },
            { id: 8, productName: "UltraBook H", price: 68000 },
            { id: 9, productName: "UltraBook I", price: 72000 },
            { id: 10, productName: "Workstation J", price: 120000 },
            { id: 11, productName: "Workstation K", price: 135000 },
            { id: 12, productName: "Slim Laptop L", price: 41000 }
        ];

        // 3. THE PAGINATION OFFSETS ALGORITHM
        // Calculate the exact starting array position (Skips complete full boxes)
        const startIndex = (page - 1) * n;
        
        // Calculate where the cutting scissors stop
        const endIndex = page * n;

        // Extract the clean subset window from our complete collection
        const paginatedDataWindow = largeDataset.slice(startIndex, endIndex);

        // 4. STRUCTURED RESTRUCTURING RESPONSE
        res.status(200).json({
            currentPage: page,
            itemsPerPage: n,
            totalItemsFound: largeDataset.length,
            totalPagesCalculated: Math.ceil(largeDataset.length / n),
            data: paginatedDataWindow
        });

    } catch (error) {
        console.error("❌ Pagination Engine Broken:", error.message);
        res.status(500).json({ error: "Internal pagination execution error" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Pagination Server running smoothly on port ${PORT}`);
});