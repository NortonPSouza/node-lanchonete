require("dotenv").config();
const express = require('express');
const app = express();
const { API_PORT } = process.env;
const morgan = require("morgan");
const router = require('./routes');

const port = process.env.PORT || API_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

morgan.format("logger-dev"," :remote-addr [:date[web]] :method :url :status :response-time ms - :user-agent")
app.use(morgan("logger-dev"));

app.use('/api/v1', router);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});