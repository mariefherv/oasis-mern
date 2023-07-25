import { useEffect, useState } from "react";
import { Col, Container, ListGroup, Row, Spinner } from "react-bootstrap";
import { Navigate, useParams } from 'react-router-dom';
import AppNavbar from "../components/AppNavbar";
import CommentItem from "../components/CommentItem";
import PostCards from "../components/PostCards";
import RightSidebar from "../components/RightSidebar";
import '../index.css';
import { useContext } from "react";
import UserContext from "../UserContext";

export default function PostDetail() {
    const { post_id } = useParams()

    const { user } = useContext(UserContext)

    const [post, setPost] = useState([])
    const [comments, setComments] = useState([])

    const [isLoading, setIsLoading] = useState(true)
    const [commentsLoading, setCommentsLoading] = useState(true)

    useEffect(() => {

        fetch(`https://oasis-api-nocv.onrender.com/post/view/${post_id}`,
        {method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
        }
        })
        .then(res => res.json())
        .then(data => {
        // get all data of the posts
        setIsLoading(false)
        if(data.length !== 0) setPost(<PostCards postProp={data[0]} minimize={false}/>)
        })})
        
        fetch(`https://oasis-api-nocv.onrender.com/post/comment/${post_id}`,
        {method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
        }
        })
        .then(res => res.json())
        .then(data => {
            setCommentsLoading(false)
            setComments(data.map(comment => {
                return(
                <CommentItem key={comment.comment_id} commentProp= {comment}/>            
            )
        }))
    }, [post, comments]
    )
    
    return (
        user.id === null ?
            <Navigate to='/error' />
        :
        <Container fluid>
            <Row className='d-flex flex-row'>
                <Col lg={2} className=''>
                    <AppNavbar />
                </Col>
                <Col>
                    {/* TODO: Replace expand with minimize*/}
                        {isLoading ?
                            <div className={"flex-grow-1 w-100 text-center mt-3 mb-0"}>
                                <Spinner/>
                            </div>
                            :
                            post}
                    {/*Comment section*/}
                    <ListGroup className={'rounded-4 mt-2 '}>
                        {commentsLoading ?
                            <div className={"flex-grow-1 w-100 text-center mt-3 mb-0"}>
                                <Spinner/>
                            </div>
                            :
                            comments}
                    </ListGroup>
                </Col>
                <Col lg={3} className='p-0 m-0'>
                    <RightSidebar />
                </Col>
            </Row>
        </Container>
    );
}