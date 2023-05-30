import '../index.css';
import AppNavbar from "../components/AppNavbar";
import RightSidebar from "../components/RightSidebar";
import {Col, Container, ListGroup, ListGroupItem, Row, Spinner} from "react-bootstrap";
import { useParams } from 'react-router-dom'
import {useEffect, useState} from "react";
import PostCards from "../components/PostCards";
import CommentItem from "../components/CommentItem";

export default function PostDetail() {
    const { post_id } = useParams()

    const [post, setPost] = useState([])
    const [comments, setComments] = useState([])

    const [isLoading, setIsLoading] = useState(true)
    const [commentsLoading, setCommentsLoading] = useState(true)

    useEffect(() => {

        fetch(`http://localhost:4000/post/view/${post_id}`,
        {method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
        })
        .then(res => res.json())
        .then(data => {
        // get all data of the posts
        setIsLoading(false)
        if(data.length !== 0) setPost(<PostCards postProp={data[0]} minimize={false}/>)
        })})
        
        fetch(`http://localhost:4000/post/comment/${post_id}`,
        {method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
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