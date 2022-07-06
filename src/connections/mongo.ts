const mongoose = require('mongoose');
const {MONGO_URI} = process.env;

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    })
    .then(() =>  console.log({ success: "MongoDB Connected" }))
    .catch((error: Error) => {
        console.log("database Mongo connection failed. exiting now...");
        console.error(error);
        process.exit(1);
    }
)

export default mongoose;
