import React, { useState } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBModalFooter } from 'mdbreact';
import axios from 'axios';

function SignUp(props) {

    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        country: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        errors: [],
        loading: false
    });

    const handleChange = (e) => {
        setValues({...values, [e.target.name]:e.target.value})
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setValues({...values, loading:true});
        const newUserData = {
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: values.phoneNumber,
            country: values.country,
            username: values.username,
            email: values.email,
            password: values.password,
            confirmPassword: values.confirmPassword
        };
        axios.post('/signup', newUserData)
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
        <MDBContainer className='vh-100'>
            <MDBRow className='h-100 align-items-center'>
            <MDBCol md="6 mx-auto">
                <MDBCard> 
                    <MDBCardBody className="mx-4">
                    <div className="text-center">
                        <h3 className="dark-grey-text mb-5 font-weight-bold">
                        <strong>Sign up</strong>
                        </h3>
                    </div>
                        
                        <form onSubmit={handleSubmit}>
                        
                            <div className='grey-text'>
                                <div className="row">
                                    <div className="col">
                                        <MDBInput
                                            className="input"
                                            label="First Name*"
                                            icon='id-card'
                                            group
                                            type="text"
                                            name="firstName"
                                            value={values.firstName}
                                            onChange={handleChange} 
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div className="col">
                                        <MDBInput
                                            className="input"
                                            label="Last Name*"
                                            icon='id-card'
                                            group
                                            type="text"
                                            name="lastName"
                                            autocomplete='off'
                                            value={values.lastName}
                                            onChange={handleChange} 
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col">
                                        <MDBInput
                                            className="input"
                                            label="Country*"
                                            icon='globe-asia'
                                            group
                                            type="text"
                                            name="country"
                                            autocomplete='off'
                                            value={values.country}
                                            onChange={handleChange} 
                                        />
                                    </div>
                                    <div className="col">
                                        <MDBInput
                                            className="input"
                                            label="Phone Number*"
                                            icon='mobile'
                                            group
                                            type="text"
                                            name="phoneNumber"
                                            autocomplete='off'
                                            value={values.phoneNumber}
                                            onChange={handleChange} 
                                        />
                                    </div>
                                </div>
                                
                                <MDBInput
                                    className="input"
                                    label="Email Address*"
                                    icon='envelope'
                                    group
                                    type="email"
                                    name="email"
                                    autocomplete='off'
                                    value={values.email}
                                    onChange={handleChange} 
                                />

                                <MDBInput
                                    className="input"
                                    label="User Name*"
                                    icon='user'
                                    group
                                    type="text"
                                    name="username"
                                    autocomplete='off'
                                    value={values.username}
                                    onChange={handleChange} 
                                />
                                
                                <MDBInput
                                    className="input"
                                    label="Password*"
                                    icon='lock'
                                    group
                                    type="password"
                                    name="password"
                                    value={values.password}
                                    onChange={handleChange} 
                                />
                                <MDBInput
                                    className="input"
                                    label="Confirm Password*"
                                    icon='lock'
                                    group
                                    type="password"
                                    name="confirmPassword"
                                    value={values.confirmPassword}
                                    onChange={handleChange} 
                                    containerClass="mb-0"
                                />
                            </div>

                            <div className="text-center mb-3 mt-lg-5">
                                <MDBBtn
                                    type="submit"
                                    outline
                                    className="btn-block z-depth-1a"
                                    disabled={values.loading || !values.email || !values.password || !values.firstName || !values.lastName || !values.country || !values.username || !values.phoneNumber}
                                    style={{
                                        borderRadius:'2rem'
                                    }}
                                >
                                {values.loading && <span><span className="spinner-border spinner-border-sm mr-3" role="status" aria-hidden="true"></span><span>signing up...</span></span>}
                                {!values.loading && `Sign Up`}
                                </MDBBtn>
                            </div>
                        
                        </form>
                    </MDBCardBody>
                    <MDBModalFooter className="mx-5 pt-3 mb-1">
                        <p className="font-small grey-text d-flex justify-content-end">
                        Already have an account?
                        {values.errors.general}
                        <a href="login" className="cyan-text ml-1">
        
                            Sign in
                        </a>
                        </p>
                    </MDBModalFooter>
                </MDBCard>
            </MDBCol>
            </MDBRow>
      </MDBContainer>
    )
}

export default SignUp
