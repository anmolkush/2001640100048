const express = require('express');
const axios = require('axios');
const app = express();
const port = 8008;


app.use(express.json());

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;

  if (!urls) {
    return res.status(400).json({ error: 'url is not given in parameter' });
  }

  const urlList = Array.isArray(urls) ? urls : [urls];

  const fetchNumbers = async (url) => {
    try {
      const response = await axios.get(url, { timeout: 500 });
      if (response.data && Array.isArray(response.data.numbers)) {
        return response.data.numbers;
      }
    } catch (error) {
      console.error(`Error while  fetching numbers from ${url}: ${error.message}`);
    }
    return [];
  };

  const promises = urlList.map((url) => fetchNumbers(url));
  const result = await Promise.all(promises);

  const mergedNumbers = Array.from(new Set([].concat(...result))).sort((a, b) => a - b);

  res.json({ numbers: mergedNumbers });
});

app.listen(port, () => {
  console.log(`App is running on ${port} Port`);
});
