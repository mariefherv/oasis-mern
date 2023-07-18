import React, { useEffect, useState } from "react";
import { Button, Container, ListGroup, Spinner } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import UserCommentItem from "./UserCommentItem";
import UserPostItem from "./UserPostItem";



export default function UserOverview() {

    const { user_id } = useParams();

    const [postComments, setPostComments] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const location = useLocation()
    const history = useNavigate()

    const getUrl = new URLSearchParams(location.search).get('sort');
    const [view, setView] = useState(getUrl ? getUrl : 'Recent')

    useEffect(() => {
        fetch(`https://oasis-api-nocv.onrender.com/post/viewAllCommentsPostsBy${view}/${user_id}`,
        {method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
        }
        )
        .then(res => res.json())
        .then(data => {
            setIsLoading(false)
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
                <Button className={view === 'Recent' ? 'me-3' : 'me-3 bg-secondary'} onClick={() => {sortBy('Recent')}}>New</Button>
                <Button  className={view === 'Likes' ? 'me-3' : 'me-3 bg-secondary'} onClick={() => {sortBy('Likes')}}>Top</Button>
            </Container>

            {isLoading ?
            <div className={"flex-grow-1 w-100 text-center mt-3 mb-0"}>
                <Spinner/>
            </div>
            :
            <ListGroup>
                {postComments}
            </ListGroup>}
        </Container>
    );
}