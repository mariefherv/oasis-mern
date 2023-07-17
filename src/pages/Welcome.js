
import { Container, Row } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import Typewriter from 'typewriter-effect';
import '../index.css';

export default function Welcome() {
    // Media Queries for responsive UI
    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-width: 1224px)'
    })
    const isLandscape = useMediaQuery({ query: '(orientation: landscape)' })
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

    const location = useNavigate()

    function signUp() {
        location("/register");
    }


    return (
        <div className='welcome' >
            <Container fluid className="h-100">
                <div className='h-100 d-flex flex-column justify-content-center align-items-center'>
                    <Row className='justify-content-center'>
                        <h1 className='text-white fw-bold text-center'>
                            <Typewriter
                                options={{
                                    strings: [
                                        'share stories.',
                                        'seek refuge.',
                                        'find solace.',
                                        'you are safe here.'
                                    ],
                                    autoStart: true,
                                    loop: true,
                                    delay: 100
                                }}
                            />
                        </h1>
                    </Row>
                    <Row>
                        {(isDesktopOrLaptop || (isLandscape && isTabletOrMobile)) && <p className='text-center '>
                            A safe space for women to come together—an oasis for their thoughts, experiences, <br /> and sufferings to be validated and given support.
                        </p>}
                        {(isTabletOrMobile && !isLandscape) && <p className='text-center'>
                            A safe space for women to come together—an oasis for their thoughts, experiences, and sufferings to be validated and given support.
                        </p>}
                    </Row>
                    <Row>
                        <Container>
                            <button type="button" className="button" onClick={signUp} >get started</button>
                        </Container>
                    </Row>
                </div>
            </Container>
        </div>
    )
}