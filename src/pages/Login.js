
import { useContext, useEffect, useState } from 'react';
import { Button, Container, Form, Modal, Spinner } from 'react-bootstrap';
// import { useMediaQuery } from 'react-responsive';
import { Link, NavLink, Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';
import '../index.css';
import Typewriter from 'typewriter-effect';

export default function Login() {
    const {user, setUser} = useContext(UserContext)
    // const isDesktopOrLaptop = useMediaQuery({
    //     query: '(min-width: 1224px)'
    // })
    // const isLandscape = useMediaQuery({ query: '(orientation: landscape)' })
    // const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("")

    const [isActive, setIsActive] = useState(false)

    const [loading, setLoading] = useState(false)

    const location = useNavigate()

    function loginUser(e) {
        e.preventDefault()
        setLoading(true)
        
        fetch('http://localhost:4000/user/login', {

        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            username : username,
            password : password
        })

        }).then(res => res.json())
        .then(data => {
            if(typeof data.accessToken !== "undefined"){
                localStorage.setItem('token',data.accessToken)
                retrieveUserDetails(data.accessToken)

                Swal.fire({
                    title: "Welcome.",
                    text: "this is a safe space.",
                    color: '#3A3530',
                    confirmButtonText: "Let me in",
                    buttonsStyling: false,
                    customClass: {
                        confirmButton: 'button2'
                    }
                })

                location("/home");

            } else {
                data.error !== 'banned' ?
                Swal.fire({
                    title: "We couldn't log you in :(",
                    icon: "error",
                    text: "Please check your username or password.",
                    color: '#3A3530',
                    confirmButtonText: "Try again",
                    buttonsStyling: false,
                    customClass: {
                        confirmButton: 'button2'
                    }
                })
                :
                Swal.fire({
                    title: "You've been banned.",
                    icon: "error",
                    text: "If you believe this is a mistake, please contact the administrator.",
                    color: '#3A3530',
                    confirmButtonText: "Okay",
                    buttonsStyling: false,
                    customClass: {
                        confirmButton: 'button2'
                    }
                })  
            }
        
        })
        setUsername(username);
        setPassword(password);
    }

    const retrieveUserDetails = (token) =>{
        fetch('http://localhost:4000/user/getUserDetails',{
        headers : {
            Authorization: `Bearer ${token}`
        }
        }).then(res => res.json())
        .then(data => {
			if(typeof data[0].user_id !== "undefined"){
				setUser({
					id: data[0].user_id,
					username: data[0].username,
					email: data[0].email,
					role: data[0].role,
                    gender: data[0].gender
				});
			} else {
				setUser({
                    id: null,
					username: null,
                    email: null,
					role: null,
                    gender: null,
				})
			}
        }).then(setLoading(false))
        
    }

    useEffect(()=> {
            if(username !== '' && password !== ''){
                setIsActive(true)
            } else {
                setIsActive(false)
            }
        }, [password, username, isActive])

    return (
        user.id !== null ?
        <Navigate to='/home' />
        :
        <div className='pages'>
        <Button as={Link} to='/about' className="about-btn">About Us</Button>
        <Container fluid className='auth-container'>
            <Form className='form-container entry-form'>
                <Form.Text>
                    <h1 className='sign-in-heading'>Sign in</h1>
                </Form.Text>
                <Form.Control type="text" placeholder="Username"
                className='form-text'
                onChange = {e => setUsername(e.target.value)}
                />
                <Form.Control type="password" placeholder="Password"
                className='form-text'
                onChange = {e => setPassword(e.target.value)}
                />
                <Form.Text className='sign-in-text'> <NavLink to={'/register'}> Don't have an account yet? </NavLink></Form.Text>
                <button className='sign-up-button' type="submit" onClick={loginUser} disabled={!isActive}>
                    Sign In
                </button>
            </Form>

        <Modal show={loading} size="md" className='d-flex mt-auto loading' centered>
            <Spinner className="align-self-center"/>
            <div className="mt-2">
                <Typewriter 
                    options={{
                        strings: ['please wait a moment...'],
                        autoStart: true,
                        loop: true,
                        delay: 100,
                        deleteSpeed: .10,
                    }}
                />
            </div>
        </Modal>
        </Container>
        </div>   
        )
}