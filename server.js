// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); // Import path module

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serve static files from the root directory

// MongoDB Connection
mongoose.connect('mongodb://localhost/todo-list', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Task Schema
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
});

const Task = mongoose.model('Task', taskSchema);

// Routes
app.get('/api/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json(newTask);
});

app.put('/api/tasks/:id', async (req, res) => {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
});

app.delete('/api/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
});

// Add a route for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Serve index.html when accessing the root URL
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
