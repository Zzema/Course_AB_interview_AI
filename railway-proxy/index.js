const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Gemini API Proxy',
    timestamp: new Date().toISOString()
  });
});

// Proxy endpoint для Gemini API
app.post('/api/generate', async (req, res) => {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'API key not configured. Set GEMINI_API_KEY environment variable.' 
      });
    }

    // Получаем тело запроса от клиента
    const body = req.body;

    console.log('🔵 Proxying request to Gemini API...');

    // Запрос к Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    const data = await geminiResponse.json();

    console.log('✅ Response from Gemini:', geminiResponse.status);

    // Возвращаем ответ клиенту
    res.status(geminiResponse.status).json(data);

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Gemini Proxy Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🔑 API Key configured: ${process.env.GEMINI_API_KEY ? 'Yes ✅' : 'No ❌'}`);
});

