const { user } = require('firebase-functions/lib/providers/auth');
const { db } = require('../util/admin');

exports.getAllTodos = (req, res) => {
    db.collection('todos').where('username', '==', req.user.username).orderBy('createdAt', 'desc').get()
        .then((data) => {
            let todos = [];
            data.forEach((doc) => {
                todos.push({
                    todoId:doc.id,
                    title: doc.data().title,
                    username: doc.data().username,
                    body: doc.data().body,
                    createdAt: doc.data().createdAt
                });
            });
            return res.json(todos);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

exports.addTodo = (req, res) => {
    if (req.body.body.trim() === '') {
        return res.status(400).json({ body: 'Must not be empty' });
    }

    if(req.body.title.trim() === '') {
        return res.status(400).json({ title: 'Must not be emtpy' });
    }

    const newTodo = {
        title: req.body.title,
        body: req.body.body,
        createdAt: new Date().toISOString(),
        username: req.user.username
    }

    db.collection('todos').add(newTodo)
        .then((doc) => {
            const responseTodo = newTodo
            responseTodo.id = doc.id;
            return res.json(responseTodo);
        })
        .catch((err) => {
            res.status(500).json({ error: 'Something went wrong' });
            console.error(err);
        });
};

exports.deleteTodo = (req,res) => {
    //const document = db.doc(`/todos/${req.params.todoId}`);
    let document = db.collection('todos').doc(`${req.params.todoId}`);
    document.get()
        .then((doc) => {
            if(!doc.exists) {
                return res.status(404).json({ error: 'Todo not found' });
            }
            if(doc.data().username !== req.user.username) {
                return res.status(403).json({ error: "Unauthorized" });
            }
            return document.delete();
        })
        .then(() => {
            res.json({ message: 'Delete successful' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

exports.editTodo = (req, res) => {
    if(req.body.todoId || req.body.createdAt) {
        res.sttatus(403).json({ message: 'Not allowed to edit' });
    }
    let document = db.collection('todos').doc(`${req.params.todoId}`);
    document.update(req.body)
        .then(() => {
            res.json({ message: 'Updated successfully' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({
                error: err.code
            });
        });
};