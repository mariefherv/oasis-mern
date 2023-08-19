import { TextareaAutosize } from "@mui/material";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { Button, Container, FormControl, Image, ListGroup, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import UserContext from "../../UserContext";
import Admin_f from "../../static/images/admin_placeholder_f.svg";
import Admin_m from "../../static/images/admin_placeholder_m.svg";
import Therapist_f from "../../static/images/dr_placeholder_f.svg";
import Therapist_m from "../../static/images/dr_placeholder_m.svg";
import User_f from "../../static/images/nonuser_f.svg";
import User_m from "../../static/images/nonuser_m.svg";
import Others from "../../static/images/other_placeholder.svg";

export default function UserPostItem({postProp}){

    const { user } = useContext(UserContext)

    const { p_id, subject, content, date_time, user_id, username, role, gender, prefix, last_name, suffix } = postProp

    const [love, setLove] = useState(false)
    const [count, setCount] = useState("")

    const [new_subject, setNewSubject] = useState(subject)
    const [new_content, setNewContent] = useState(content);

    const [open, setOpen] = useState(false);
    const openModal = (e) => {
        setOpen(true);
    }
    const closeModal = e => {
        setOpen(false);
    }
    const [editActive, setEditActive] = useState(false)

    const relativeTime = require('dayjs/plugin/relativeTime')
    dayjs.extend(relativeTime)

    const time = dayjs(date_time).fromNow()

    useEffect(() => {
        fetch(`https://oasis-api-nocv.onrender.com/post/checkLike/${p_id}`,
        {method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin": "https://localhost:3000" || "https://oasis-black.vercel.app/" ,
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
        }
        }
        )
        .then(res => res.json())
        .then(data => {
            data.length !== 0 ? setLove(true) : setLove(false)
        })

        fetch(`https://oasis-api-nocv.onrender.com/post/countLikes/${p_id}`, {
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin": "https://localhost:3000" || "https://oasis-black.vercel.app/" ,
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
            },
            }).then(res => res.json())
            .then(data => {
                data[0].count !== 0 ? setCount(data[0].count) : setCount("")
        })

        fetch(`https://oasis-api-nocv.onrender.com/post/checkLike/${p_id}`,
        {method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin": "https://localhost:3000" || "https://oasis-black.vercel.app/" ,
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
        }
        }
        )
        .then(res => res.json())
        .then(data => {
            data.length !== 0 ? setLove(true) : setLove(false)
        })

        fetch(`https://oasis-api-nocv.onrender.com/post/countLikes/${p_id}`, {
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin": "https://localhost:3000" || "https://oasis-black.vercel.app/" ,
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
            },
            }).then(res => res.json())
            .then(data => {
                data[0].count !== 0 ? setCount(data[0].count) : setCount("")
        })

        new_content !== '' && new_content !== '' && (new_subject !== subject || new_content !== content) ? setEditActive(true) : setEditActive(false)

    }, [p_id, count, love, user_id, user.id, subject, content, new_content, new_subject])

    function likePost(e) {
        e.preventDefault()

        fetch(`https://oasis-api-nocv.onrender.com/post/like/${p_id}`, {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin": "https://localhost:3000" || "https://oasis-black.vercel.app/" ,
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
        },
        }).then(res => res.json())
        .then(data => {
            data ? setLove(true) : setLove(false)
        })
    }

    function unlikePost(e) {
        e.preventDefault()

        fetch(`https://oasis-api-nocv.onrender.com/post/unlike/${p_id}`, {
        method : 'DELETE',
        headers : {
            'Content-Type' : 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin": "https://localhost:3000" || "https://oasis-black.vercel.app/" ,
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
        },
        }).then(res => res.json())
        .then(data => {
            data ? setLove(false) : setLove(true)
        })
    }

    function editPost(e) {
        e.preventDefault()

        Swal.fire({
            text: "Are you sure you want to save your changes?",
            iconColor: '#3A3530',
            color: '#3A3530',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            customClass: {
            actions: 'my-actions',
            cancelButton: 'order-1 right-gap',
            confirmButton: 'order-2',
            denyButton: 'order-3',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://oasis-api-nocv.onrender.com/post/edit/${p_id}`, {
                    method : 'PUT',
                    headers : {
                        'Content-Type' : 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin": "https://localhost:3000" || "https://oasis-black.vercel.app/" ,
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
                    },
                    body: JSON.stringify({
                        subject: new_subject,
                        content: new_content,
                        edited: true
                    })
                    }).then(res => res.json())
                    .then(data => {
                        data ?
                        Swal.fire({
                            title: "Post Edited Successfully!",
                            icon: "success",
                            iconColor: '#3A3530',
                            color: '#3A3530',
                            confirmButtonText: "OK",
                            buttonsStyling: false,
                            customClass: {
                                confirmButton: 'button2'
                            }
                        })
                        :
                        Swal.fire({
                            title: "Oh No!",
                            icon: "error",
                            text: "Something went wrong :( Please try again!",
                            iconColor: '#3A3530',
                            color: '#3A3530',
                            confirmButtonText: "OK",
                            buttonsStyling: false,
                            customClass: {
                                confirmButton: 'button2'
                            }
                        })
                })
                setNewSubject(new_subject);
                setNewContent(new_content);
                closeModal()
            }
        })

    }

    function deletePost(e) {
        e.preventDefault()

        Swal.fire({
            text: "Are you sure you want to delete this post?",
            iconColor: '#3A3530',
            color: '#3A3530',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            customClass: {
            actions: 'my-actions',
            cancelButton: 'order-1 right-gap',
            confirmButton: 'order-2',
            denyButton: 'order-3',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://oasis-api-nocv.onrender.com/post/delete/${p_id}`, {
                method : 'DELETE',
                headers : {
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                }).then(res => res.json())
                .then(data => {
                data ? Swal.fire('Post Deleted!', '', 'success')
                : Swal.fire('Oh no! Something went wrong :(', '', 'error')
            })
            }
        })
    }

    const navigate = useNavigate()

    function nav(link) {
        navigate(link)
    }

    const imageMap = {
        "User_male": User_m,
        "User_female": User_f,
        "Therapist_male": Therapist_m,
        "Therapist_female": Therapist_f,
        "Admin_male": Admin_m,
        "Admin_female": Admin_f,
        "User_non-binary": Others,
        "Therapist_non-binary": Others,
        "Admin_non-binary": Others,
        "User_others": Others,
        "Admin_others": Others,
        "Therapist_others": Others
    };
    
    // Assuming `role` and `gender` are defined variables
    const imageName = `${role}_${gender}`;

    return(
        <>
        <ListGroup.Item className={"p-3 pb-0"}>
            <div className={"d-flex align-items-center"}>
                {love ?
                <div className={"pe-3 ps-2 text-center"} onClick={unlikePost}>
                    <Button className={"bg-light border-0 text-danger"}><i className={"bi bi-heart-fill"}></i></Button>
                    <span>{count}</span>
                </div>
                :
                <div className={"pe-3 ps-2 text-center"} onClick={likePost}>
                    <Button className={"bg-light border-0 text-secondary"}><i className={"bi bi-heart"}></i></Button>
                    <span>{count}</span>
                </div>
                }
                <div >
                    <Image className='profile-avatar' src={imageMap[imageName]} />
                </div>
                <Container className={"d-flex flex-column"}>
                    <h6>{subject}</h6>
                    <p className={"text-muted"}><small>Posted by {role !== 'Therapist' ? `@${username}` : `${prefix ? prefix : ''} ${last_name} ${suffix ? suffix : ''}`} <i className={"bi bi-dot"}></i>{time}</small></p>
                    <Container fluid >
                        <div className={"d-flex flex-grow-1 py-2 align-items-baseline"}>
                            <Button className={"me-2 bg-light"} onClick={e => {nav(`/post/${p_id}`)}}><i className={"bi bi-arrows-angle-expand "}></i></Button>
                            {user.id === user_id && <Button className={"me-2 bg-light"} onClick={openModal}><i className={"bi bi-pencil "}></i> Edit</Button>}
                            {user.id === user_id && <Button className={"me-2 bg-light"} onClick={deletePost}><i className={"bi bi-trash "}></i> Delete</Button>}

                            <div className={"flex-grow-1"}></div>
                        </div>
                    </Container>
                </Container>
            </div>
        </ListGroup.Item>
        <Modal show={open} size="lg" className="mt-auto" centered onHide={closeModal}>
                <Container fluid className="d-flex flex-column px-4 my-4 justify-content-between align-items-center">
                    <h3 className='py-3'>Edit Post</h3>
                    <div className='rounded-4 d-flex flex-row p-2 shadow-focus w-100' >
                        <FormControl 
                            placeholder="Title"
                            className='border-0 w-100 shadow-none'
                            onChange = {e => setNewSubject(e.target.value)}
                            value={new_subject}
                        />
                    </div>
                    <div className='w-100'>
                        <TextareaAutosize
                            className='content-box'
                            placeholder='What are your thoughts?'
                            minRows={10}
                            maxRows={15}
                            onChange = {e => setNewContent(e.target.value)}
                            value={new_content}
                        />
                    </div>
                    <div className='mt-3'>
                        <Button 
                        className="rounded px-5 bg-primary border-0"
                        onClick={editPost}
                        disabled={!editActive}
                        >
                            Save
                        </Button>
                    </div>
                    </Container>
                </Modal>
        </>
    );
}