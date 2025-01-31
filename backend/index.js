import express from 'express';
import  axios from 'axios';
import cors from 'cors';
const app = express();
app.use(cors());
app.get('/api/quiz', async (req, res) => {
  try {
    const response = await axios('https://api.jsonserve.com/Uw5CrX');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from API:', error);
    res.status(500).send('Error fetching quiz data');
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
