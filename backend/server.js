require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/userRoutes');
const deepworkRoutes =  require('./routes/deepworkRoutes')
const alarmTimerRoutes = require('./routes/alarmTimerRoutes');

// CREATES VARIABLE FOR EXPRESS
const app = express();

// PARSES INCOMING PAYLOADS INTO JSON
app.use(express.json());

// MAIN ROUTES
app.use('/api/users', userRoutes);
app.use('/api/deepwork', deepworkRoutes);
app.use('/api/alarmTimer', alarmTimerRoutes);


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
