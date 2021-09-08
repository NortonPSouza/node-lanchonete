require("dotenv").config();
const express = require('express');
const app = express();
const { API_PORT } = process.env;
const router = require('./routes');

const port = process.env.PORT || API_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require('./controller/user');

app.use('/api/v1', router)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});