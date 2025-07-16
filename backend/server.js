require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const deepworkRoutes =  require('./routes/deepworkRoutes')
const alarmTimerRoutes = require('./routes/alarmTimerRoutes');
const downloadDataRoute = require('./routes/downloadDataRoute');

// CREATES VARIABLE FOR EXPRESS
const app = express();

// ENABLE CORS FOR FRONTEND ORIGIN
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
}));

// PARSES INCOMING PAYLOADS INTO JSON
app.use(express.json());

// MAIN ROUTES
app.use('/api/users', userRoutes);
app.use('/api/deepwork', deepworkRoutes);
app.use('/api/alarmTimer', alarmTimerRoutes);
app.use('/api/downloadData', downloadDataRoute);


// DATABASE AND PORT CONNECTION
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Successfully connected to DB from port ${process.env.PORT}`);
        })
    })
    .catch((error) => {
        console.log('Database and Port connection FAILED!');
        console.log(error);
    })
