const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 9000;

app.use(express.json());

app.get('/categories/:categoryName/products', async (req, res) => {
    // 1. Define the 5 company server codes we must aggregate data from
    const companies = ["AMZ", "WAL", "BJZ", "FLP", "HYN"];
    let masterCombinedList = [];

    // 2. RUN RESILIENT FAULT-TOLERANT ITERATOR LOOP
    for (const company of companies) {
        try {
            console.log(`📡 Attempting network connection to Company: ${company}...`);

            // --- AXIOS TIMEOUT PROTECTION CONTROL ---
            // If the server doesn't respond within 1500ms, abort the request and throw an error
            const response = await axios.get(`http://20.244.56.144/test/companies/${company}/templates`, {
                timeout: 1500 
            });

            // If the fetch succeeds, safely merge the products into our master list
            if (response.data && Array.isArray(response.data)) {
                masterCombinedList.push(...response.data);
            }

        } catch (error) {
            // --- CIRCUIT BREAKER TRIPPED LAYER ---
            // If a company fails, logs out, or hits the 1500ms limit, handle it safely here!
            console.warn(`⚠️ Warning: Company ${company} is slow or offline. Skipping safely!`);
            
            // The continue keyword instantly breaks the current iteration and jumps to the next company
            continue; 
        }
    }

    // 3. RESPOND GRACEFULLY WITH WHATEVER DATA WAS SUCCESSFULLY COLLECTED
    res.status(200).json({
        success: true,
        totalCollected: masterCombinedList.length,
        data: masterCombinedList
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Resilient Circuit-Breaker Engine running on port ${PORT}`);
});