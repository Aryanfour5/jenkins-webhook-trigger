const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
//hello
// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route: Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes
app.get('/api/weather/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const apiKey = process.env.WEATHER_API_KEY || 'demo_key';
        
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );
        
        res.json(response.data);
    } catch (error) {
        res.status(404).json({ error: 'City not found' });
    }
});

app.get('/api/forecast/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const apiKey = process.env.WEATHER_API_KEY || 'demo_key';
        
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
        );
        
        res.json(response.data);
    } catch (error) {
        res.status(404).json({ error: 'Forecast not available' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
    console.log(`Weather Monitor running on http://localhost:${PORT}`);
});

