
import '../index.css';
import { Container, Form, Row, Button } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive'
import Typed from 'react-typed'

export default function Login() {
    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-width: 1224px)'
    })
    const isLandscape = useMediaQuery({ query: '(orientation: landscape)' })
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })


    return (
        <div className='pages'>
        <Container fluid className='container'>
            <Form className='form-container'>
                <Form.Text>
                    <h1 className='sign-in-heading'>Sign in</h1>
                </Form.Text>
                <Form.Control type="text" placeholder="Username" />
                <Form.Control type="password" placeholder="Password" />
                <Form.Text className='sign-in-text'> <a href='/register'> Don't have an account yet? </a></Form.Text>
                <button className='sign-up-button' type="submit">
                    Sign In
                </button>
            </Form>
        </Container>
        </div>   
        )
}