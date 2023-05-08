import {Col, Container, ListGroupItem, Row, Image} from "react-bootstrap";
import placeholder from '../static/images/profile1.svg';
import heart from '../static/images/love.svg'
import activeHeart from '../static/images/love-active.svg'
import { useState, useEffect } from "react";

export default function CommentItem({commentProp}){

    const hdate = require('human-date')
    const {comment_id, username, content, date_commented } = commentProp

    const time = hdate.relativeTime(date_commented)

    const [love, setLove] = useState(false)
    const [count, setCount] = useState("")
    
    useEffect(() => {
        fetch(`http://localhost:4000/post/comment/checkLike/${comment_id}`,
        {method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
        }
        )
        .then(res => res.json())
        .then(data => {
            data.length !== 0 ? setLove(true) : setLove(false)
        })

        fetch(`http://localhost:4000/post/comment/countLikes/${comment_id}`, {
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            }).then(res => res.json())
            .then(data => {
                data[0].count !== 0 ? setCount(data[0].count) : setCount("")
        })

    }, [comment_id, love, count])

    function likeComment(e) {
        e.preventDefault()

        fetch(`http://localhost:4000/post/comment/like/${comment_id}`, {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        }).then(res => res.json())
        .then(data => {
            data ? setLove(true) : setLove(false)
        })
    }

    function unlikeComment(e) {
        e.preventDefault()

        fetch(`http://localhost:4000/post/comment/unlike/${comment_id}`, {
        method : 'DELETE',
        headers : {
            'Content-Type' : 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        }).then(res => res.json())
        .then(data => {
            data ? setLove(false) : setLove(true)
        })
    }

    return(
        <ListGroupItem className={'bg-secondary border-0 border-bottom'}>
            <Row className={'d-flex flex-row align-items-center'}>
                <Col className={'col-2 d-flex flex-column align-items-center '}>
                    <Image src={placeholder}></Image>
                    <div className={'fw-bold'}>@{username}</div>
                    <p><small className={'text-muted '}>{time}</small></p>
                </Col>
                <Col >
                    {content}
                </Col>
                <Col className={'col-2 text-center'}>
                    {!love ? 
                    <img src={heart} 
                    className='post-heart'
                    alt='Like comment'
                    onClick={likeComment}
                    />
                    :
                    <img src={activeHeart} 
                    className='post-heart'
                    alt='Unlike comment'
                    onClick={unlikeComment}
                    />}
                    {count}
                </Col>

            </Row>
        </ListGroupItem>
    );
}