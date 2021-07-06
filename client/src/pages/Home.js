import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { authMiddleWare } from '../util/auth';
import Account from '../components/Account';
import Todo from '../components/Todo';
import { MDBTypography, MDBBox , MDBContainer, MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavbarToggler, MDBCollapse, MDBDropdown,
    MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon } from "mdbreact";

function Home(props) {

    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        profilePicture: '',
        imageLoading: false,
        render: false
    });

    const [loading, setLoading] = useState(true);

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        authMiddleWare(props.history);
        const authToken = localStorage.getItem('AuthToken');
        const page = localStorage.getItem('Page') === 'Account' ? true : false;
        axios.defaults.headers.common = { Authorization: `${authToken}`};
        axios.get('/user')
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
                    render: page
                }));
                setTimeout(() => setLoading(false),2000);
            })
            .catch((err) => {
                console.log(err);
                if(err.response.status === 403) {
                    props.history.push('/login')
                }
                console.log(err);
                setValues(v => ({ ...v, errorMsg: 'Error in retrieving the data' }));
            });
    }, [props.history]);  

    const loadAccountPage = (e) => {
        setValues({...values, render: true});
    }

    const loadTodoPage = (e) => {
        setValues({...values, render: false});
    }

    const handleLogout = (e) => {
        localStorage.removeItem('AuthToken');
        localStorage.removeItem('Page');
        props.history.push('/login');
    }

    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    }

    return(
        <>
        {loading === false ? (
            <MDBContainer fluid className="vh-100 flex-fill p-0 overflow-hidden">
                <MDBNavbar color="default-color" dark expand="md">
                    <MDBNavbarBrand>
                    <strong className="white-text">To Do</strong>
                    </MDBNavbarBrand>
                    <MDBNavbarToggler onClick={toggleCollapse} />
                    <MDBCollapse id="navbarCollapse3" isOpen={isOpen} navbar>
                    <MDBNavbarNav right>
                        <MDBNavItem className="pr-3">
                        <MDBDropdown>
                            <MDBDropdownToggle nav className="dopdown-toggle" color="primary">
                                <div className="z-depth-2" style={{display:"flex",height:"35px", width:"35px", backgroundColor:"black", borderRadius:"50%",justifyContent:"center", alignItems:"center", overflow:"hidden"}}>{values.profilePicture == null ? <div>{values.firstName.charAt(0)} {values.lastName.charAt(0)}</div> : <img src={values.profilePicture} className="z-depth-0" style={{  minHeight: "40px", minWidth:"40px"}} alt="drop down logo" />}</div>
                            </MDBDropdownToggle>
                            <MDBDropdownMenu className="dropdown-default">
                                {values.render === true ? <MDBDropdownItem onClick={loadTodoPage}><MDBIcon far icon="calendar-check" className="mr-2"/>Tasks</MDBDropdownItem> : <MDBDropdownItem onClick={loadAccountPage}><MDBIcon far icon="user-circle" className="mr-2"/>Profile</MDBDropdownItem>}
                                <MDBDropdownItem divider />
                                <MDBDropdownItem onClick={handleLogout}><MDBIcon icon="sign-out-alt" className="mr-2"/>Logout</MDBDropdownItem>
                            </MDBDropdownMenu>
                        </MDBDropdown>
                        </MDBNavItem>
                    </MDBNavbarNav>
                    </MDBCollapse>
                </MDBNavbar>
                
                <div className="row">
                    <div className="col">
                        <div>{values.render ? <Account {...props}/> : <Todo {...props}/>}</div>
                    </div>
                    
                </div>
                
            </MDBContainer>
        ) : (
            <div className="flex-fill p-0 overflow-hidden vh-100" style={{display:"flex",justifyContent:"center", alignItems:"center"}}>
                <MDBTypography className="text-center" variant="display-1">
                    <MDBBox tag="p" mb={0} className="animated fadeIn">Welcome</MDBBox>
                    <MDBBox tag="h1" mb={3} className="animated fadeIn delay-1s">{values.firstName} {values.lastName}</MDBBox>
                    <div className="spinner-grow text-success" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </MDBTypography>
            </div>
        )}
        </>
    );
}
    

export default Home;