const express = require('express');
const axios = require('axios');
const morgan = require('morgan');
const cors = require('cors'); // Import cors middleware
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup - Morgan for HTTP request logging
app.use(morgan('combined'));
app.use(cors()); // Enable CORS for all routes

// Route to fetch data from an external API
app.get('/api/fetch', async (req, res) => {
    const apiUrl = req.query.url; // Fetch URL from query parameter
  try {
    
    
    if (!apiUrl) {
      throw new Error('URL parameter is required');
    }


    const startTime = new Date();

    
    const response = await axios.get(apiUrl, { maxRedirects: 5 });


    const responseSize = JSON.stringify(response.data).length;

    // Calculate connection time in milliseconds
    const endTime = new Date();
    const connectionTime = endTime - startTime;

    
    const responseData = {
      url: apiUrl,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      requestHeaders: req.headers, 
      responseHeaders: response.headers, 
      dataSize: responseSize, 
      requestTime: startTime.toISOString(),
      responseTime: endTime.toISOString(), 
      connectionTime: connectionTime, 
      data: response.data, 
    };

 
    console.log('Received data:', responseData);

 
    res.json(responseData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ url:apiUrl,error: 'Internal Server Error' });
  }
});

// Default route for testing server availability
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
