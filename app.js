const express = require('express');
const fs = require('fs');
const app = express();

// setting the view engine to pug
app.set('view engine', 'pug');

// pug will read public folder and we can get style.css and other things
app.use(express.static('public'));

// parse url bodies
app.use(express.urlencoded({ extended: true }));

// variable for filename to keep todo posts
const todoListFilename = 'todoList.txt';

// load todolist from file if it exists
let todoList = [];
if (fs.existsSync(todoListFilename)) {
  const fileContent = fs.readFileSync(todoListFilename, 'utf8');
  todoList = fileContent.split('\n').filter(todo => todo !== '');
}

// save todolist to file
function saveTodoList() {
  const fileContent = todoList.join('\n');
  fs.writeFileSync(todoListFilename, fileContent);
}

// render route
app.get('/', (req, res) => {
  res.render('index', { todoList });
});

// post submission route
app.post('/add', (req, res) => {
  const newTodo = req.body.todo.trim();
  if (newTodo.length > 0) {
    todoList.push(newTodo);
    saveTodoList();
  } else {
    console.log('Empty to-do item submitted');
  }
  res.redirect('/');
});

// delete post
app.post('/delete', (req, res) => {
  const todoToDelete = req.body.todo;
  todoList = todoList.filter((todo) => todo !== todoToDelete);
  saveTodoList();
  res.redirect('/');
});
//export post to json
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

// START SERVER ON PORT 8000
app.listen(8000, () => {
  console.log('Server listening on port 8000');
});
