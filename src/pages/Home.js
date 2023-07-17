
import { useContext, useEffect, useState } from 'react';
import { Col, Container, FormSelect, Offcanvas, Row, Spinner } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { useLocation, useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';
import AppNavbar from '../components/AppNavbar';
import CreatePost from '../components/CreatePost';
import PostCards from '../components/PostCards';
import RightSidebar from '../components/RightSidebar';
import { unblockContact } from '../functions/contactFunctions';
import '../index.css';
import toggle from '../static/images/hamburger-menu.svg';

export default function Home() {
    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-width: 1224px)'
    })

    const { user } = useContext(UserContext)

    const location = useLocation()
    const history = useNavigate()

    const getUrl = new URLSearchParams(location.search).get('sort');

    const [show, setShow] = useState(false);
    const [view, setView] = useState(getUrl ? getUrl : 'Likes')
    const [isLoading, setIsLoading] = useState(true)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [posts, setPosts] = useState([])

    function sortBy(val){
        setView(val)        
        history(`${location.pathname}?sort=${val}`);
    }

    useEffect(() => {
        fetch(`http://127.0.0.1:4000/post/viewAllBy${view}`,
        {method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
        }
        )
        .then(res => res.json())
        .then(data => {
            setIsLoading(false)
            setPosts(data.map(post => (
                post.status !== 'BLOCKED' ? <PostCards key={post.p_id} postProp={post} minimize={true} />
                : post.blocked_by === user.id ?
                <Container className=' d-flex flex-row  my-1 p-3 rounded-5 bg-secondary'>
                    <p className='p-0 m-0'>You have blocked this user. Do you wish to <span className='text-funct' onClick={e => unblockContact(post.user_id)}> unblock @{post.username}</span> to see their posts?</p>
                </Container>
                : null
                )))
        })
    }, [setView, view, posts, user.id])

    return (
        isDesktopOrLaptop ?
            <Container fluid>
                <Row className='d-flex flex-row '>
                    <Col lg={2} className={"me-4"}>
                        <AppNavbar/>
                    </Col>
                    <Col className='d-flex flex-column  '>
                        <CreatePost />
                        <Row className='d-flex flex-row align-items-center px-4'>
                            <Col xs={2} className=''>
                                <label htmlFor='sort-type'>Sort by:</label>
                            </Col>
                            <Col xs={10} className='d-flex flex-row'>
                                <FormSelect
                                 id='sort-type' className="border rounded-3"
                                    as="select"
                                    value={view}
                                    onChange={e => {
                                    sortBy(e.target.value)
                                    }
                                }
                                >
                                    <option value="Recent">Recent</option>
                                    <option value="Likes">Top</option>
                                </FormSelect>
                            </Col>
                        </Row>
                        {isLoading ?
                        <div className={"flex-grow-1 w-100 text-center mt-3 mb-0"}>
                            <Spinner/>
                        </div>
                        :
                        posts}
                    </Col>

                    <Col lg={3} className='p-0 m-0 z-index-0 ms-4 '>
                        <RightSidebar/>
                    </Col>
                </Row>

            </Container>
            :
            <Container fluid>
                <Col className={"d-flex flex-column"}>
                {/* Navbar toggler for mobile */}
                <img
                    src={toggle}
                    alt="menu"
                    className='nav-toggle mt-4 ms-2'
                    onClick={handleShow}
                />

                <Container fluid>
                    {/* Navbar */}
                    <Offcanvas show={show} onHide={handleClose}>
                        <Offcanvas.Header closeButton className='justify-content-end' />
                        <AppNavbar />
                    </Offcanvas>
                </Container>
                {posts}
                </Col>

            </Container>
    )
}