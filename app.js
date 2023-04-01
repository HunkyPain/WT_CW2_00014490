const express = require('express');
const fs = require('fs');
const app = express();

// Set the view engine to Pug
app.set('view engine', 'pug');

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Define the filename for the file that will store the to-do list
const todoListFilename = 'todoList.txt';

// Load the to-do list from the file (if it exists)
let todoList = [];
if (fs.existsSync(todoListFilename)) {
  const fileContent = fs.readFileSync(todoListFilename, 'utf8');
  todoList = fileContent.split('\n').filter(todo => todo !== '');
}

// Define a function to save the to-do list to the file
function saveTodoList() {
  const fileContent = todoList.join('\n');
  fs.writeFileSync(todoListFilename, fileContent);
}

// Define a route to render the to-do list page
app.get('/', (req, res) => {
  res.render('index', { todoList });
});

// Define a route to handle form submissions
app.post('/add', (req, res) => {
  const newTodo = req.body.todo.trim();
  if (newTodo.length > 0) {
    todoList.push(newTodo);
    saveTodoList();
  } else {
    console.log('Empty to-do item submitted');
    // you can also send an error response to the client here
  }
  res.redirect('/');
});

// Define a route to handle form submissions for deleting a post
app.post('/delete', (req, res) => {
  const todoToDelete = req.body.todo;
  todoList = todoList.filter((todo) => todo !== todoToDelete);
  saveTodoList();
  res.redirect('/');
});

app.get('/export', (req, res) => {
    const filename = 'todos.json';
    const data = JSON.stringify(todoList, null, 2);
    res.setHeader('Content-disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-type', 'application/json');
    res.write(data, () => {
      res.end();
    });
  });


//   app.post('/done', (req, res) => {
//     const todoToMarkAsDone = req.body.todo;
//     todoList = todoList.map((todo) => {
//       if (todo === todoToMarkAsDone) {
//         return {
//           text: todo,
//           isDone: true
//         };
//       } else {
//         return todo;
//       }
//     });
//     saveTodoList();
//     res.redirect('/');
//   });

// Start the server
app.listen(8000, () => {
  console.log('Server listening on port 8000');
});
