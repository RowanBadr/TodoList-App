const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let tasks = [];

// Create task
app.post('/tasks', (req, res) => {
    const { title, userId } = req.body;
    if (!title || !userId) {
        return res.status(400).json({ error: 'title and userId required' });
    }

    const newTask = {
        id: uuidv4(),
        title,
        userId
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Get tasks
app.get('/tasks', (req, res) => {
    const { userId } = req.query;
    const userTasks = tasks.filter(t => t.userId === userId);
    res.json(userTasks);
});

// Update task
app.put('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.title = req.body.title || task.title;
    res.json(task);
});

// Delete task
app.delete('/tasks/:id', (req, res) => {
    tasks = tasks.filter(t => t.id !== req.params.id);
    res.json({ message: 'Task deleted' });
});

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
