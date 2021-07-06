import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBModal, MDBInput, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText } from 'mdbreact';
import axios from 'axios';
import { authMiddleWare } from '../util/auth';
import './Todo.css';

function Todo(props) {

    const [values, setValues] = useState({
        todos: '',
        title: '',
        body: '',
        todoId: '',
        errors: [],
        open: false,
        uiLoading: true,
        buttonType: '',
        viewOpen: false,
        buttonLoading: false,
        adding: false
    });

    const [modal1, setModal1] = useState(false);

    const [modal2,setModal2] = useState(false);

    const [modal3,setModal3] = useState(false);

    const [deleteId,setDeleteId] = useState('');

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        });
    };

    useEffect(() => {
        authMiddleWare(props.history);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        axios
            .get('/todos')
            .then((res) => {
                setValues(v => ({
                    ...v,
                    todos: res.data,
                    uiLoading: false
                }));
            })
            .catch((e) => {
                console.log(e);
            });
    }, [props.history]);

    const handleDelete = () => {
        setValues({
            ...values,
            buttonLoading: true
        });
        authMiddleWare(props.history);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        let todoId = deleteId;
        axios
            .delete(`todo/${todoId}`)
            .then(() => {
                localStorage.setItem('Page', 'Todo');
                window.location.reload();
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const handleEdit = (data) => {
        setModal1(true);
        setValues({
            ...values,
            title: data.title,
            body: data.body,
            todoId: data.todoId,
            buttonType: 'Edit',
            open: true
        });
    };

    const handleViewOpen = (data) => {
        setModal2(true);
        setValues({
            ...values,
            title: data.title,
            body: data.body,
            viewOpen: true
        });
    };

    const handleClickOpen = () => {
        setModal1(true);
        setValues({
            ...values,
            todoId: '',
            title: '',
            body: '',
            buttonType: '',
            open: true
        });
    };

    const handleSubmit = (e) => {
        authMiddleWare(props.history);
        e.preventDefault();
        setValues({
            ...values,
            buttonLoading: true
        });
        const userTodo = {
            title: values.title,
            body: values.body
        };
        let options = {};
        if (values.buttonType === 'Edit') {
            options = {
                url: `/todo/${values.todoId}`,
                method: 'put',
                data: userTodo
            };
        } else {
            options = {
                url: '/todo',
                method: 'post',
                data: userTodo
            };
        }
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        axios(options)
            .then(() => {
                localStorage.setItem('Page', 'Todo');
                setValues({ ...values, open: false, buttonLoading: false });
                window.location.reload();
            })
            .catch((e) => {
                setValues({ ...values, errors: e.response.data });
                console.log(e);
            });
    };

    const toggleModal2 = () => {
        setModal2(!modal2);
    }

    const toggleModal1 = () => {
        setModal1(!modal1);
    }

    const toggleModal3 = (todo) => {
        setModal3(!modal3);
        setDeleteId(todo.todoId);
    }

    return (
        <>
        {values.uiLoading === false ? (
            <MDBContainer fluid className="vh-100 flex-fill" style={{padding:"7rem"}}>
                <a className="add-transform" onClick={()=>{handleClickOpen()}} style={{position:"fixed",width:"65px",height:"65px",bottom:"40px",right:"40px",backgroundColor:"#FFF",color:"#0C9",borderRadius:"50%",textAlign:"center",boxShadow:"5px 5px 10px #999"}}>
                    <i className="fas fa-plus fa-4x fa-spin-hover"></i>
                </a>
                
                <MDBModal isOpen={modal1} toggle={toggleModal1} centered size="lg">
                    <MDBModalHeader toggle={toggleModal1} style={{border:"none"}}>{values.buttonType === 'Edit' ? <p>Edit Task</p> : <p>Add a Task</p>}</MDBModalHeader>
                    <MDBModalBody>
                        <form>
                            <MDBInput className="input" label="Title" name="title" icon="tag" group type="text" value={values.title} onChange={handleChange} />
                            <MDBInput className="input" type="textarea" name="body" rows="5" label="Details" icon="pencil-alt" value={values.body} onChange={handleChange} />
                        </form>
                    </MDBModalBody>
                    <MDBModalFooter style={{border:"none"}}>
                        <MDBBtn outline onClick={handleSubmit} style={{borderRadius:"15px"}}>
                            {values.buttonLoading && <span><span className="spinner-border spinner-border-sm mr-3" role="status" aria-hidden="true"></span><span>saving...</span></span>}
                            {!values.buttonLoading && `Save`}
                        </MDBBtn>
                        <MDBBtn outline onClick={toggleModal1} style={{borderRadius:"15px"}}>
                            Cancel
                        </MDBBtn>
                    </MDBModalFooter>
                </MDBModal>

                <MDBModal isOpen={modal2} toggle={toggleModal2} centered size="lg">
                    <MDBModalHeader toggle={toggleModal2}>{values.title}</MDBModalHeader>
                    <MDBModalBody style={{minHeight:"500px",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:"3rem",fontSize:"1.5rem"}}>
                    {values.body}
                    </MDBModalBody>
                </MDBModal>

                <MDBModal isOpen={modal3}  frame position="top">
                    <MDBModalBody className="text-center">
                        Are you sure you want to delete this task?
                        <MDBBtn outline onClick={handleDelete} style={{borderRadius:"15px",margin:"1rem",marginLeft:"4rem"}}>
                            {values.buttonLoading && <span className="spinner-border spinner-border-sm mr-3" role="status" aria-hidden="true"></span>}
                            {!values.buttonLoading && `Yes`}
                        </MDBBtn>
                        <MDBBtn outline onClick={toggleModal3} style={{borderRadius:"15px"}} color="danger">
                            No
                        </MDBBtn>
                    </MDBModalBody>
                </MDBModal>

                <div style={{display:"flex", height:"100%", flexWrap:"wrap"}}>
                {values.todos.map((todo) => (

                        <MDBCard className="card-transform" style={{width: "22rem",height:"11rem",minWidth:"22rem", margin:"5rem"}}>
                            <MDBCardBody style={{textAlign:"center"}}>
                                <MDBCardTitle>{todo.title}</MDBCardTitle>
                                <MDBCardText>
                                    <p style={{height:"42px"}}>{`${todo.body.substring(0, 81)}`}</p>
                                </MDBCardText>
                                <MDBBtn className="btn-transform" outline style={{opacity:"0",borderRadius:"2rem"}} size="sm" id="view" onClick={()=>{handleViewOpen(todo)}}>View</MDBBtn>
                                <MDBBtn className="btn-transform" outline style={{opacity:"0",borderRadius:"2rem"}} size="sm"id="edit" onClick={()=>{handleEdit(todo)}}>Edit</MDBBtn>
                                <MDBBtn className="btn-transform" outline style={{opacity:"0",borderRadius:"2rem"}} size="sm"id="delete" onClick={()=>{toggleModal3(todo)}}>Delete</MDBBtn>
                            </MDBCardBody>
                        </MDBCard>
                        
                ))}
                </div>
            </MDBContainer>
        ) : (
            <div className="flex-fill p-0 overflow-hidden vh-100" style={{display:"flex",justifyContent:"center", alignItems:"center"}}>
                <div className="spinner-border text-success" role="status" style={{width:"10rem", height:"10rem"}}>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )}
        </>
    );
}

export default Todo;
