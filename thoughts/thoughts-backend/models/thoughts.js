const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then((result) => {
    console.log("Connected do MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB", error.message);
  });

const thoughtSchema = new mongoose.Schema({
  title: String,
  body: String,
  timestamp: Date,
  origin: {
    city: String,
    country: String,
    countryCode: String,
  },
  likes: Number,
});

thoughtSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Thought", thoughtSchema);
