import express from 'express';
import cors from 'cors';
import utils from 'utils';

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: utils.isEmpty('abc') });
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
