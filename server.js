require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth');
const recordRoutes = require('./routes/records');
const exerciseRoutes = require('./routes/exercise');
const app = express();
const PORT = 3000;

app.use(express.json()); //jsonを受け取れるように
app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/exercise', exerciseRoutes);

//動作確認のルート

app.get('/', (req, res) => {
    res.send('GymCore API is running!');
})

app.listen(PORT, () => {
    console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});
