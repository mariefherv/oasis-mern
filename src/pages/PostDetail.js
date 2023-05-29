import '../index.css';
import AppNavbar from "../components/AppNavbar";
import RightSidebar from "../components/RightSidebar";
import {Col, Container, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import { useParams } from 'react-router-dom'
import {useEffect, useState} from "react";
import PostCards from "../components/PostCards";
import CommentItem from "../components/CommentItem";

export default function PostDetail() {
    const { post_id } = useParams()

    const [post, setPost] = useState([])
    const [comments, setComments] = useState([])

    useEffect(() => {

        fetch(`http://localhost:4000/post/view/${post_id}`,
        {method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
        })
        .then(res => res.json())
        .then(data => {
        // get all data of the product
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
                        {post}
                    {/*Comment section*/}
                    <ListGroup className={'rounded-4 mt-2 '}>
                        {comments}
                    </ListGroup>
                </Col>
                <Col lg={3} className='p-0 m-0'>
                    <RightSidebar />
                </Col>
            </Row>
        </Container>
    );
}