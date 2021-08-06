const mongoose = require('mongoose');
const {MONGO_URI} = process.env;

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    })
    .then(() => console.log("Successfully connected to database"))
    .catch((error) => {
        console.log("database connection failed. exiting now...");
        console.error(error);
        process.exit(1);
    }
)

module.exports = mongoose;
