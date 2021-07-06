import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBModal, MDBModalBody, MDBTooltip, MDBInput, MDBModalHeader, MDBModalFooter, MDBTypography, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn, MDBIcon } from 'mdbreact';
import { authMiddleWare } from '../util/auth';

function Account(props) {

    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        username: '',
        country: '',
        profilePicture: '',
        uiLoading: true,
        buttonLoading: false,
        imageError: ''
    });

    const [modals, setModals] = useState({
        modal1: false,
        modal2: false
    });

    const [info, setInfo] = useState({
        firstName: '',
        lastName: '',
        country: ''
    })

    const [preview, setPreview] = useState(null);

    useEffect(() => {
        authMiddleWare(props.history);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        axios
            .get('/user')
            .then((res) => {
                console.log(res.data);
                setValues(v => ({
                    ...v,
                    firstName: res.data.userCredentials.firstName,
                    lastName: res.data.userCredentials.lastName,
                    email: res.data.userCredentials.email,
                    phoneNumber: res.data.userCredentials.phoneNumber,
                    country: res.data.userCredentials.country,
                    username: res.data.userCredentials.username,
                    profilePicture: res.data.userCredentials.imageUrl,
                    uiLoading: false
                }));
            })
            .catch((err) => {
                if (err.response.status === 403) {
                    props.history.push('/login');
                }
                console.log(err);
                setValues(v => ({ ...v, errorMsg: 'Error in retrieving the data' }));
            })
    }, [props.history]);

    const toggle = nr => () => {
        let modalNumber = 'modal' + nr;
        setModals({
            ...modals,
            [modalNumber] : !modals[modalNumber]
        });
    };

    const handleChange = (e) => {
        setInfo({
            ...info,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        setValues({
            ...values,
            image: e.target.files[0]
        });

        setPreview(URL.createObjectURL(e.target.files[0]));
    };

    const handleProfilePic = (e) => {
        e.preventDefault();
        setValues({
            ...values,
            buttonLoading: true
        });
        authMiddleWare(props.history);
        const authToken = localStorage.getItem('AuthToken');
        let form_data = new FormData();
        form_data.append('image', values.image);
        form_data.append('content', values.content);
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        axios
            .post('/user/image', form_data, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })
            .then(() => {
                setValues({ ...values, buttonLoading: false });
                localStorage.setItem('Page', 'Account');
                toggle(1);
                window.location.reload();
            })
            .catch((err) => {
                if (err.response.status === 403) {
                    props.history.push('/login');
                }
                console.log(err);
                setValues({
                    ...values,
                    uiLoading: false,
                    imageError: 'Error in posting the data'
                });
            });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        setValues({
            ...values,
            buttonLoading: true
        });
        authMiddleWare(props.history);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        const formData = {
            firstName: info.firstName,
            lastName: info.lastName,
            country: info.country
        };
        axios
            .post('/user', formData)
            .then(() => {
                setValues({ ...values, buttonLoading: false });
                localStorage.setItem('Page', 'Account');
            })
            .then(() => {
                window.location.reload();
                toggle(2);
            })
            .catch((e) => {
                if(e.response.status === 403) {
                    props.history.push('/login');
                }
                console.log(e);
                setValues({ buttonLoading: false });
            });
    };

    return (
        <>
        {values.uiLoading === false ? (
            <MDBContainer fluid className="vh-100 flex-fill p-5">
                <MDBRow className="justify-content-md-center">   
                    <MDBCol style={{maxWidth:"1184px"}}>   
                        <MDBTypography variant="h2" className="mb-4">Your info</MDBTypography>
                        <MDBCard className="my-3">
                            <MDBCardBody className="py-4">
                                <MDBRow>
                                    <MDBCol className="col-auto">
                                        <div style={{display:"flex", width:"190px", height:"190px", backgroundColor:"#036e64", borderRadius:"50%", justifyContent:"center", alignItems:"center", overflow:"hidden"}}>
                                        {values.profilePicture == null ? <MDBIcon far icon="user" className="white-text" size="5x"/> : <img src={values.profilePicture} style={{ minWidth:"190px", minHeight:"190px"}} alt="" />}
                                        </div>
                                    </MDBCol>
                                    <MDBCol>
                                        <div>
                                            <MDBCardTitle>{values.firstName} {values.lastName}</MDBCardTitle>
                                            <MDBCardText className="text-monospace py-3" style={{maxWidth:"350px"}}>
                                            Personalize your account with a photo. You photo will only be used within the site.
                                            </MDBCardText>
                                            <MDBBtn onClick={toggle(1)}>Upload photo</MDBBtn>
                                        </div>
                                        <MDBModal isOpen={modals.modal1} toggle={toggle(1)} centered>
                                            <MDBModalHeader toggle={toggle(1)} style={{border:"none"}}>{values.firstName} {values.lastName}</MDBModalHeader>
                                            <MDBModalBody>
                                                <div className="d-flex justify-content-center">
                                                    <div style={{display:"flex", width:"200px", height:"200px", minWidth:"160px", minHeight:"160px", backgroundColor:"#036e64", borderRadius:"50%", justifyContent:"center", alignItems:"center", overflow:"hidden"}}>
                                                        {preview == null ? (<MDBIcon far icon="user" className="white-text" size="5x"/>) :
                                                        <img src={preview} className="rounded-cricle" style={{minWidth:"200px",minHeight:"200px"}}/>}
                                                    </div>
                                                </div>
                                                <div className="text-center" style={{paddingTop:"40px"}}>
                                                    <label style={{cursor:"pointer", color:"#19b1a2"}}>
                                                        <MDBIcon icon="cloud-upload-alt" /> Add a photo
                                                        <input type="file" onChange={handleImageChange} style={{display:"none"}}/>
                                                    </label>
                                                </div>
                                            </MDBModalBody>
                                            <MDBModalFooter style={{border:"none"}}>
                                                <MDBBtn onClick={handleProfilePic}>
                                                    {values.buttonLoading && <span><span className="spinner-border spinner-border-sm mr-3" role="status" aria-hidden="true"></span><span>saving...</span></span>}
                                                    {!values.buttonLoading && `Save`}
                                                </MDBBtn>
                                                <MDBBtn onClick={toggle(1)}>
                                                    Cancel
                                                </MDBBtn>
                                            </MDBModalFooter>
                                        </MDBModal>
                                    </MDBCol>
                                </MDBRow>
                            </MDBCardBody>
                        </MDBCard>

                        <MDBCard className="my-3">
                            <MDBCardBody>
                                <MDBRow>
                                    <MDBCol>
                                        <MDBCardTitle>Personal info</MDBCardTitle>
                                    </MDBCol>
                                    <MDBCol className="text-right">
                                        <a style={{color:"#00bfa5"}} onClick={toggle(2)}>
                                            Edit personal info    
                                        </a>
                                        <MDBModal isOpen={modals.modal2} toggle={toggle(2)} centered>
                                            <MDBModalHeader toggle={toggle(2)}><MDBIcon far icon="edit" /></MDBModalHeader>
                                            <MDBModalBody>
                                                <MDBRow className="d-flex justify-content-center">
                                                    <MDBInput
                                                        className="input"
                                                        label="First Name*"
                                                        type="text"
                                                        name="firstName"
                                                        value={info.firstName}
                                                        onChange={handleChange} 
                                                        autoComplete='off'
                                                    />
                                                </MDBRow>

                                                <MDBRow className="d-flex justify-content-center">
                                                    <MDBInput
                                                        className="input"
                                                        label="Last Name*"
                                                        type="text"
                                                        name="lastName"
                                                        autoComplete='off'
                                                        value={info.lastName}
                                                        onChange={handleChange} 
                                                    />
                                                </MDBRow>
                                                <MDBRow className="d-flex justify-content-center">
                                                    <MDBInput
                                                        className="input"
                                                        label="Country*"
                                                        type="text"
                                                        name="country"
                                                        autoComplete='off'
                                                        value={info.country}
                                                        onChange={handleChange} 
                                                    />
                                                </MDBRow>
                                                <MDBRow className="d-flex justify-content-center">
                                                    <MDBTooltip
                                                    domElement
                                                    placement="right"
                                                    >
                                                        <span className="blue-text">
                                                            <MDBInput
                                                                className="input"
                                                                label="Email*"
                                                                type="email"
                                                                background
                                                                value={values.email}
                                                                disabled
                                                            />
                                                        </span>
                                                        <span>Unable to edit due to security reasons</span>
                                                    </MDBTooltip>
                                                </MDBRow>
                                                <MDBRow className="d-flex justify-content-center">
                                                    <MDBTooltip
                                                    domElement
                                                    placement="right"
                                                    >
                                                        <span className="blue-text">
                                                            <MDBInput
                                                                className="input"
                                                                label="Username*"
                                                                type="text"
                                                                background
                                                                value={values.username}
                                                                disabled
                                                            />
                                                        </span>
                                                        <span>Unable to edit due to security reasons</span>
                                                    </MDBTooltip>
                                                </MDBRow>
                                            </MDBModalBody>
                                            <MDBModalFooter>
                                                <MDBBtn onClick={handleUpdate}>
                                                    {values.buttonLoading && <span><span className="spinner-border spinner-border-sm mr-3" role="status" aria-hidden="true"></span><span>saving...</span></span>}
                                                    {!values.buttonLoading && `Save`}
                                                </MDBBtn>
                                                <MDBBtn onClick={toggle(2)}>
                                                    Cancel
                                                </MDBBtn>
                                            </MDBModalFooter>
                                        </MDBModal>
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol className="pt-4">
                                        First Name 
                                    </MDBCol>
                                    <MDBCol className="pt-4 font-weight-bolder">
                                        {values.firstName}
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol className="pt-4">
                                        Last Name
                                    </MDBCol>
                                    <MDBCol className="pt-4 font-weight-bolder">
                                        {values.lastName}
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol className="pt-4">
                                        Email 
                                    </MDBCol>
                                    <MDBCol className="pt-4 font-weight-bolder">
                                        {values.email}
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol className="pt-4">
                                        User Name
                                    </MDBCol>
                                    <MDBCol className="pt-4 font-weight-bolder">
                                        {values.username}
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol className="pt-4">
                                        Country 
                                    </MDBCol>
                                    <MDBCol className="pt-4 font-weight-bolder">
                                        {values.country}
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol className="pt-4">
                                        Phone
                                    </MDBCol>
                                    <MDBCol className="pt-4 font-weight-bolder">
                                        {values.phoneNumber}
                                    </MDBCol>
                                </MDBRow>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    
                </MDBRow>
                
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

export default Account;
