import {Card, CardGroup, Container, ButtonGroup, Button, Row, ListGroup} from "react-bootstrap";
import React, {useState, useEffect} from "react";
import PostCards from "../PostCards";
import { useContext } from "react";
import UserContext from "../../UserContext";
import UserCommentItem from "./UserCommentItem";
import UserPostItem from "./UserPostItem";
import { useLocation, useNavigate, useParams } from "react-router-dom";



export default function UserOverview() {

    const { user_id } = useParams();

    const [postComments, setPostComments] = useState([])

    const location = useLocation()
    const history = useNavigate()

    const getUrl = new URLSearchParams(location.search).get('sort');
    const [view, setView] = useState(getUrl ? getUrl : 'Recent')

    useEffect(() => {
        fetch(`http://localhost:4000/post/viewAllCommentsPostsBy${view}/${user_id}`,
        {method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
        }
        )
        .then(res => res.json())
        .then(data => {
            data.length !== 0 ?
            setPostComments(data.map(item => (
                item.type === 'comment' ?
                <UserCommentItem key={item.c_id} commentProp={item}/>
                :
                <UserPostItem key={item.p_id} postProp={item}/>
                ))) 
                : setPostComments(null)
        })
    })

    function sortBy(val){
        setView(val)        
        history(`${location.pathname}?sort=${val}`);
    }


    return(
        <Container >
            <Container className={"p-3 bg-body"}>
                <Button className={view === 'Recent' ? 'me-3 bg-primary' : 'me-3'} onClick={() => {sortBy('Recent')}}>New</Button>
                <Button  className={view === 'Likes' ? 'me-3 bg-primary' : 'me-3'} onClick={() => {sortBy('Likes')}}>Top</Button>
            </Container>

            <ListGroup>
                {postComments}
            </ListGroup>
        </Container>
    );
}