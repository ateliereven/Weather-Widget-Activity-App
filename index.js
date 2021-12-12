const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit')
require('dotenv').config();

// port is stored in environment variables, else use 5000:
const PORT = process.env.PORT || 5000;

const app = express();

//limit calls to api per user:
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //10 minutes
    max: 15
})
app.use(limiter);
app.set('trust proxy', 1)

//set static folder:
app.use(express.static('public'))

//routes:
app.use('/api', require('./routes'))

//enable cors:
app.use(cors());
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

