require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
  { id: 3, task: 'Do Assignment', completed: true },
];

// GET All
app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});

// GET Active (BONUS) - MUST be before /todos/:id
app.get('/todos/active', (req, res) => {
  const activeTodos = todos.filter(t => !t.completed);
  res.status(200).json(activeTodos);
});

// GET Completed - MUST be before /todos/:id
app.get('/todos/completed', (req, res) => {
  const completed = todos.filter(t => t.completed);
  res.json(completed);
});

// GET Single - MUST be LAST
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  res.status(200).json(todo);
});

// POST with validation
app.post('/todos', (req, res) => {
  const { task, completed } = req.body;
  if (!task) {
    return res.status(400).json({ error: 'Task field is required' });
  }
  const newTodo = {
    id: Date.now(),
    task,
    completed: completed || false
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PATCH Update
app.patch('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  Object.assign(todo, req.body);
  res.status(200).json(todo);
});

// DELETE
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter(t => t.id !== id);
  if (todos.length === initialLength)
    return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

// Error handling
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error!' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));