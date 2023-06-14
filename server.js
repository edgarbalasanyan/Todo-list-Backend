const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Todo List data
let tasks = [];

// Get all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});
// GET a task by ID
app.get("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(task => task.id === taskId);

  if (task) {
    res.status(200).json(task);
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

// Add a new task
app.post("/tasks", (req, res) => {
  const { name, deadline} = req.body;
  if (deadline && name) {
    const task = {
      id: tasks.length + 1,
      name: name,
      deadline: deadline,
      completed: false
    };
    tasks.push(task);
    res.status(201).json(task);
  } else {
    res.status(400).json({ error: "Task name and deadline are required." });
  }
});

// Add the deadline for a task
app.put('/tasks/:id/deadline', (req, res) => {
  const { id } = req.params;
  const { deadline } = req.body;

  const task = tasks.find((task) => task.id === parseInt(id));

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  task.deadline = deadline;

  res.status(200).json(task);
});



// Update a task
app.put("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const { name, completed } = req.body;
  const task = tasks.find(task => task.id === taskId);
  if (task) {
    task.name = name || task.name;
    task.completed = completed || task.completed;
    res.json(task);
  } else {
    res.status(404).json({ error: "Task not found." });
  }
});

// check deadline 
function checkDeadline(task) {
  const currentDate = new Date();
  const deadline = new Date(task.deadline);

  const timeRemaining = deadline - currentDate;
  const oneHourInMillis = 60 * 60 * 1000; 
  const oneDayInMillis = 24 * 60 * 60 * 1000;

  if (timeRemaining <= oneHourInMillis && timeRemaining > 0) {
    console.log("Alert: Less than one hour left until deadline");
  }
  if (timeRemaining <= oneDayInMillis && timeRemaining > oneHourInMillis){
    console.log("Alert: Less than one day left until deadline")
  }
}


// Delete a task
app.delete("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const index = tasks.findIndex(task => task.id === taskId);
  if (index !== -1) {
    tasks.splice(index, 1);
    res.sendStatus(204);
  } else {
    res.status(404).json({ error: "Task not found." });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
