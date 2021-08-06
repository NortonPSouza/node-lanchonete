require("dotenv").config();
const express = require('express');
const app = express();
const { API_PORT } = process.env;

const port = process.env.PORT || API_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require('./controller/auth')(app);
require('./controller/user')(app);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});