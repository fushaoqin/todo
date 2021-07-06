import React, { useState } from 'react';
//import { Form, Button, Container } from 'react-bootstrap';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBIcon, MDBModalFooter } from 'mdbreact';
import axios from 'axios';
import './Login.css';

function Login(props) {

    const [values, setValues] = useState({
        email: '',
        password: '',
        errors: [],
        loading: false
    });

    const handleChange = (e) => {
        setValues({...values, [e.target.name]:e.target.value})
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setValues({...values, loading:true});
        const userData = {
            email: values.email,
            password: values.password
        };
        axios.post('/login', userData)
            .then((res) => {
                localStorage.setItem('AuthToken', `Bearer ${res.data.token}`);
                setValues({...values, loading:false});
                props.history.push('/');
            })
            .catch((e) => {
                setValues({...values, errors: e.response.data, loading: false});
            });
    };

    return (
        // <Container fluid={true} className='d-flex justify-content-center align-items-center' style={{minHeight:'700px', height:'100vh',backgroundImage:'linear-gradient(#8ccce6,#8ccccc,#d9ffb3)'}}>
             
        //     <Form onSubmit={handleSubmit} style={{position:'relative', minHeight:'700px', maxWidth:'450px', width:'50%', padding:'50px', boxShadow:'10px 10px 10px #85857a', borderRadius:'1rem', backgroundColor:'white'}}>
        //         <div style={{ top:'-15%', textAlign:'center'}}>
        //             <i className="far fa-user fa-7x" style={{borderRadius:'50%',padding:'2rem',backgroundColor:'#8ccccc', color:'white'}}></i>
        //             <h1 style={{textAlign:'center',paddingBottom:'3rem'}}>Login</h1>
        //         </div>
        //         <Form.Group size='lg' controlId='formBasicEmail'>
        //             <Form.Label>Email address</Form.Label>
        //             <Form.Control 
        //                 autoFocus
        //                 type='email' 
        //                 name='email' 
        //                 placeholder='Enter email' 
        //                 value={values.email}
        //                 onChange={handleChange} 
        //                 autocomplete='off'
        //             />
        //             <Form.Control.Feedback type={values.errors.email ? "invalid" : "valid"}>
        //                 {values.errors.email}
        //             </Form.Control.Feedback>
        //         </Form.Group>

        //         <Form.Group size='lg' controlId='formBasicPassword'>
        //             <Form.Label>Password</Form.Label>
        //             <Form.Control 
        //                 type='password' 
        //                 name='password' 
        //                 placeholder='Password' 
        //                 value={values.password}
        //                 onChange={handleChange} 
        //             />
        //             <Form.Control.Feedback type={values.errors.password ? "invalid" : "valid"}>
        //                 {values.errors.password}
        //             </Form.Control.Feedback>
        //         </Form.Group>

        //         <Button block size='lg' className='mb-3 mt-4' variant='primary' type='submit' disabled={values.loading || !values.email || !values.password} style={{backgroundColor:'#8ccccc', borderColor:'#8ccccc'}}>
        //             Sign In
        //         </Button>
        //         <a href='signup' style={{color:'#8ccccc'}}>Don't have an account? Sign Up<br/></a>
        //         {values.errors.general}
        //     </Form>
        // </Container>
        <MDBContainer className='vh-100'>
            <MDBRow className='h-100 align-items-center'>
            <MDBCol md="6 mx-auto">
                <MDBCard> 
                    <MDBCardBody className="mx-4">
                        <div className="text-center">
                            <h2 className="dark-grey-text font-weight-bolder m-lg-5">
                            <strong>Log in</strong>
                            </h2>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                        
                        <div className='grey-text'>
                        <MDBInput
                            className="input"
                            label="Your email"
                            icon='envelope'
                            group
                            type="email"
                            name="email"
                            validate
                            value={values.email}
                            onChange={handleChange} 
                            autoComplete='off'
                        />
                        <MDBInput
                            className="input"
                            label="Your password"
                            icon='lock'
                            group
                            type="password"
                            name="password"
                            value={values.password}
                            onChange={handleChange} 
                            validate
                            containerClass="mb-0"
                        />
                        </div>
                        <p className="font-small cyan-text d-flex justify-content-end pb-3">
                        Forgot
                        <a href="#!" className="cyan-text ml-1">
        
                            Password?
                        </a>
                        </p>
                        <div className="text-center mb-3">
                            <MDBBtn
                                type="submit"
                                outline
                                className="btn-block z-depth-1a"
                                disabled={values.loading || !values.email || !values.password}
                                style={{
                                    borderRadius:'2rem'
                                }}
                            >
                                {values.loading && <span><span className="spinner-border spinner-border-sm mr-3" role="status" aria-hidden="true"></span><span>signing in...</span></span>}
                                {!values.loading && `Sign In`}
                            </MDBBtn>
                        </div>
                        <p className="font-small dark-grey-text text-center d-flex justify-content-center mb-3 pt-2">
                            {values.errors.general}
                            or Sign in with:
                        </p>
                        <div className="row my-3 d-flex justify-content-center">
                            <MDBBtn
                                type="button"
                                color="white"
                                className="mr-md-3 z-depth-1a"
                                style={{
                                    borderRadius:'2rem'
                                }}
                            >
                            <MDBIcon fab icon="facebook-f" className="cyan-text text-center" />
                            </MDBBtn>
                            <MDBBtn
                                type="button"
                                color="white"
                                style={{
                                    borderRadius:'2rem'
                                }}
                                className="mr-md-3 z-depth-1a"
                            >
                            <MDBIcon fab icon="twitter" className="cyan-text" />
                            </MDBBtn>
                            <MDBBtn
                                type="button"
                                color="white"
                                style={{
                                    borderRadius:'2rem'
                                }}
                                className="z-depth-1a"
                            >
                            <MDBIcon fab icon="google-plus-g" className="cyan-text" />
                            </MDBBtn>
                        </div>
                        </form>
                    </MDBCardBody>
                    <MDBModalFooter className="mx-5 pt-3 mb-1">
                        <p className="font-small grey-text d-flex justify-content-end">
                        Not a member?
                        <a href="signup" className="cyan-text ml-1">
        
                            Sign Up
                        </a>
                        </p>
                    </MDBModalFooter>
                </MDBCard>
            </MDBCol>
            </MDBRow>
      </MDBContainer>
                
    )
}

export default Login;