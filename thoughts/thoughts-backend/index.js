const express = require("express");
const app = express();
require("dotenv").config();

const Thought = require("./models/thoughts");

app.use(express.static("dist"));

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const cors = require("cors");

app.use(cors());

app.use(express.json());
app.use(requestLogger);

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/thoughts", (request, response) => {
  Thought.find({}).then((thoughts) => {
    response.json(thoughts);
  });
});

app.get("/api/thoughts/:id", (request, response) => {
  Thought.findById(request.params.id).then((thought) => {
    response.json(thought);
  });
});

app.post("/api/thoughts", (request, response) => {
  const body = request.body;

  if (body.title.trim().length === 0 || body.body.trim().length === 0) {
    return response
      .status(400)
      .json({ error: "Title and body are need to post." });
  }

  const thought = new Thought({
    title: body.title,
    body: body.body,
    timestamp: new Date(),
    origin: {
      city: body.origin.city,
      country: body.origin.country,
      countryCode: body.origin.countryCode,
    },
    likes: 0,
  });

  thought
    .save()
    .then((savedThought) => {
      response.json(savedThought);
    })
    .catch((error) => {
      response.status(500).json({ error: "There was an error saving post." });
    });
});

app.patch("/api/thoughts/:id", (request, response) => {
  const body = request.body;

  const thought = {
    likes: body.likes,
  };

  Thought.findByIdAndUpdate(request.params.id, thought, { new: true }).then(
    (updatedThought) => {
      response.json(updatedThought);
    }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
