require("dotenv").config();
const express = require('express');
const app = express();
const { API_PORT } = process.env;
const morgan = require("morgan");
const router = require('./routes');

const port = process.env.PORT || API_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use('/api/v1', router)

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});