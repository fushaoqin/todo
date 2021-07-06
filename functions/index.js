const functions = require("firebase-functions");
const app = require('express')();
const auth = require('./util/auth');

const cors = require('cors')({origin:true});
app.use(cors);

const { getAllTodos, addTodo, deleteTodo, editTodo } = require('./APIs/todos');
const { loginUser, signUpUser, uploadProfilePhoto, getUserDetail, updateUserDetails } = require('./APIs/users');

app.get('/todos', auth, getAllTodos);
app.post('/todo', auth, addTodo);
app.delete('/todo/:todoId', auth, deleteTodo);
app.put('/todo/:todoId', auth, editTodo);

app.post('/login', loginUser);
app.post('/signup', signUpUser);
app.post('/user/image', auth, uploadProfilePhoto);

app.get('/user', auth, getUserDetail);
app.post('/user', auth, updateUserDetails);

exports.api = functions.https.onRequest(app);
