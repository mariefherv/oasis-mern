
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import { Button, Container, Dropdown, Form, FormControl, Image, Modal, Spinner } from 'react-bootstrap';
import DropdownItem from "react-bootstrap/DropdownItem";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownToggle from "react-bootstrap/DropdownToggle";
// import { useMediaQuery } from 'react-responsive';
import { Link, useNavigate } from "react-router-dom";
import TextareaAutosize from 'react-textarea-autosize';
import Swal from 'sweetalert2';
import { PostContext } from '../PostContext';
import UserContext from '../UserContext';
import { addContact, blockContact, cancelContact, removeContact } from '../functions/contactFunctions';
import '../index.css';
import Admin_f from "../static/images/admin_placeholder_f.svg";
import Admin_m from "../static/images/admin_placeholder_m.svg";
import Therapist_f from "../static/images/dr_placeholder_f.svg";
import Therapist_m from "../static/images/dr_placeholder_m.svg";
import User_f from "../static/images/nonuser_f.svg";
import User_m from "../static/images/nonuser_m.svg";
import Others from "../static/images/other_placeholder.svg";
import person_add from "../static/images/person/person-add.svg";
import placeholder_f from "../static/images/user_placeholder_f.svg";
import placeholder_m from "../static/images/user_placeholder_m.svg";
import Typewriter from 'typewriter-effect';


export default function PostCards({postProp, minimize}) {

    const { updatePost } = useContext(PostContext);

    // const isDesktopOrLaptop = useMediaQuery({
    //     query: '(min-width: 1224px)'
    // })

    // const isLandscape = useMediaQuery({ query: '(orientation: landscape)' })

    const [love, setLove] = useState(false)
    const [comment, setComment] = useState("")
    const [active, setActive] = useState(false)
    const [count, setCount] = useState("")
    const [status, setStatus] = useState("INACTIVE")
    const [blocked_by, setBlockedBy] = useState(null)

    const [showReport, setShowReport] = useState(false)
    const [activeReport, setActiveReport] = useState(false)
    const [loading, setLoading] = useState(false)

    const [open, setOpen] = useState(false);
    const openModal = (e) => {
        setOpen(true);
    }
    const closeModal = e => {
        setOpen(false);
    }
    const [editActive, setEditActive] = useState(false)

    const { p_id, subject, content, username, date_posted, user_id, edited, role, gender, prefix, last_name, suffix } = postProp
    const { user } = useContext(UserContext)

    const [new_subject, setNewSubject] = useState(subject)
    const [new_content, setNewContent] = useState(content)

    const [report, setReport] = useState('')
    const [reportDetail, setReportDetail] = useState('')
    
    const relativeTime = require('dayjs/plugin/relativeTime')
    dayjs.extend(relativeTime)

    const time = dayjs(date_posted).fromNow()

    useEffect(() => {
        if(user_id !== user.id) {
            fetch(`https://oasis-api-nocv.onrender.com/contact/view/${user_id}`, {
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
            },
            }).then(res => res.json())
            .then(data => {
                if(data.length !== 0) {
                    setStatus(data[0].status)
                    data[0].blocked_by !== null ? setBlockedBy(data[0].blocked_by) : setBlockedBy(null)
                }
        })
        }

        fetch(`https://oasis-api-nocv.onrender.com/post/checkLike/${p_id}`,
        {method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin" : "*",
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
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
            },
            }).then(res => res.json())
            .then(data => {
                data[0].count !== 0 ? setCount(data[0].count) : setCount("")
        })

        comment !== '' ? setActive(true) : setActive(false)
        new_content !== '' && new_content !== '' && (new_subject !== subject || new_content !== content) ? setEditActive(true) : setEditActive(false)
        updatePost(p_id, { love, comment, count, user_id, blocked_by });

        report !== '' ? setActiveReport(true) : setActiveReport(false)

    }, [p_id, comment, count, love, user_id, user.id, blocked_by, status, updatePost, subject, content, new_content, new_subject, report])

    function likePost(e) {
        e.preventDefault()

        fetch(`https://oasis-api-nocv.onrender.com/post/like/${p_id}`, {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
        },
        body: JSON.stringify({
            post_user_id: user_id
        })
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
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
        },
        }).then(res => res.json())
        .then(data => {
            data ? setLove(false) : setLove(true)
        })
    }

    function reply(e) {
        e.preventDefault()
        setLoading(true)

        fetch(`https://oasis-api-nocv.onrender.com/post/comment/${p_id}`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
            },
            body: JSON.stringify({
                content: comment,
                post_user_id: user_id
            })
            }).then(res => res.json())
            .then(data => {
                data ?
                Swal.fire({
                    title: "Reply Sent!",
                    icon: "success",
                    text: "Thanks for sharing your thoughts!",
                    iconColor: '#3A3530',
                    color: '#3A3530',
                    confirmButtonText: "OK",
                    buttonsStyling: false,
                    customClass: {
                        confirmButton: 'button2'
                    }
                }).then(setLoading(false))
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
                }).then(setLoading(false))
        })
        setComment("");
    }

    function reportPost(e){
        e.preventDefault()
        setLoading(true)

        fetch(`https://oasis-api-nocv.onrender.com/post/report/${p_id}`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
            },
            body: JSON.stringify({
                type: report,
                details: reportDetail
            })
            }).then(res => res.json())
            .then(data => {
                data ?
                Swal.fire({
                    title: "Post reported!",
                    icon: "success",
                    text: "Thank you for helping us making this space safer for everyone.",
                    iconColor: '#3A3530',
                    color: '#3A3530',
                    confirmButtonText: "OK",
                    buttonsStyling: false,
                    customClass: {
                        confirmButton: 'button2'
                    }
                }).then(setLoading(false))
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
                }).then(setLoading(false))
        })
    }

    // contact functions
    function add(e){
        e.preventDefault()
        setStatus(addContact(user_id))
    }

    function remove(e){
        e.preventDefault()
        setStatus(removeContact(user_id))
    }
    
    function block(e){
        setStatus(blockContact(user_id))
    }

    function cancel(e){
        setStatus(cancelContact(user_id))
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
                setLoading(true)
                fetch(`https://oasis-api-nocv.onrender.com/post/edit/${p_id}`, {
                    method : 'PUT',
                    headers : {
                        'Content-Type' : 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin" : "*",
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
                }).then(setLoading(false))
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
                setLoading(true)
                fetch(`https://oasis-api-nocv.onrender.com/post/delete/${p_id}`, {
                method : 'DELETE',
                headers : {
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
                },
                }).then(res => res.json())
                .then(data => {
                    data ? Swal.fire('Post Deleted!', '', 'success')
                    : Swal.fire('Oh no! Something went wrong :(', '', 'error')
                }).then(setLoading(false))
            }
        })
    }

    // Create a mapping object for role and gender combinations
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

    const navigate = useNavigate()
    const goBack = () => {  
        navigate(-1);
    };
    const [hover, setHover] = useState(false)

    return (
            <Container className={"mt-3"}>
                <div
                    onMouseOver={()=>{setHover(true)}}
                    onMouseOut={()=>{setHover(false)}}
                    className={" rounded-4 border border-1 " + (hover ? "bg-white" : "bg-light")}>
                    <Container className={"d-flex py-4 px-3"}>
                        <div className={"d-flex flex-column align-items-center justify-content-between col-2  pe-0"}>
                            <Image 
                            src={user.id === user_id ? 
                            user.role === 'User' ? user.gender === 'male' ? placeholder_m : user.gender === 'female' ? placeholder_f : Others :
                            imageMap[imageName]
                            : imageMap[imageName]}
                            className={"img-fluid profile-avatar"}
                            />
                            <Dropdown>
                                <DropdownToggle className={"username mt-1"}>
                                    {role !== 'Therapist' ? `@${username}` : `${prefix ? prefix : ''} ${last_name} ${suffix ? suffix : ''}`}
                                </DropdownToggle>

                                {user.id !== user_id ?
                                    <DropdownMenu>
                                        {/*TODO: get user_id from prop*/}
                                        <DropdownItem as={Link} to={`/user/${user_id}`} className={"ps-4"}><i
                                            className="bi bi-person-fill pe-3"></i>View Profile</DropdownItem>
                                        <Dropdown.Header>contact</Dropdown.Header>
                                        {(status === "INACTIVE") &&
                                            <DropdownItem className={"ps-4"} onClick={add}><i className={"bi bi-person-add pe-3"}></i>Add</DropdownItem>}

                                        {(status === "PENDING") &&
                                            <DropdownItem className={"ps-4"} onClick={cancel}><i className={"bi bi-x-lg pe-3"}></i>Cancel Request</DropdownItem>}

                                        {status === "ACTIVE" && <DropdownItem onClick={remove} className={"ps-4"}><i
                                            className={"bi bi-person-dash pe-3"}></i>Remove</DropdownItem>}

                                        {status !== "BLOCKED" &&
                                            <DropdownItem onClick={block} className={"ps-4"}><i className="bi bi-x-circle pe-3"></i>Block</DropdownItem>}

                                    </DropdownMenu>
                                    :
                                    <DropdownMenu>
                                        {/*TODO: get user_id from prop*/}
                                        <DropdownItem as={Link} to={`/user/${user_id}`} className={"ps-4"}><Image src={person_add}                                                                         className={"pe-3"}></Image>View
                                            Profile</DropdownItem>
                                    </DropdownMenu>
                                }
                            </Dropdown>
                            <p className={"text-muted"}><small>{time} </small></p>
                            <p className={"text-muted"}><small>{edited ? <i>(edited)</i> : null }</small></p>
                            {love ?
                                <div
                                    className='d-flex flex-row justify-content-center mt-auto pb-1 align-items-center post-likes'
                                    onClick={unlikePost}>
                                    <Button className={"border-0 text-danger"}><i
                                        className={"bi bi-heart-fill"}></i> {count}</Button>
                                </div> :
                                <div
                                    className='d-flex justify-content-center mt-auto pb-1 align-items-center post-likes'
                                    onClick={likePost}>
                                    <Button className={"border-0 text-secondary"}><i
                                        className={"bi bi-heart"}></i> {count}</Button>
                                </div>
                            }
                        </div>
                        <div className={"d-flex flex-column align-items-start justify-content-between p-2 pe-0 flex-grow-1"}>
                            <h5 className={"fw-bold"}>{subject}</h5>
                            <p className={minimize ? 'post-content-preview' : 'post-content-text'}>
                                {content}

                            </p>
                            <TextareaAutosize
                                className='comment-box '
                                placeholder='What are your thoughts?'
                                onChange={e => setComment(e.target.value)}
                                value={comment}
                            />
                        </div>
                        <div className={"d-flex flex-column align-items-end justify-content-between p-2 pe-0 "}>
                            <div className={"d-flex flex-row flex-nowrap align-items-center"}>
                            {minimize ?
                                <Link to={`/post/${p_id}`} >
                                    <i className="bi bi-arrows-expand"></i>
                                </Link>
                                :
                                <Link onClick={goBack}>
                                    <i className="bi bi-arrow-return-left"></i>
                                </Link>
                            }

                            <Dropdown className={"dropstart"}>
                                <Button type="button" className=" post-options border-0 " data-bs-toggle="dropdown"
                                        aria-expanded="false">
                                    <i className="bi bi-three-dots-vertical"></i>
                                </Button>
                                {user.id === user_id ?
                                    <ul className="dropdown-menu">
                                        <DropdownItem onClick={openModal} className={"ps-4"}>
                                            <i className="bi bi-pencil-square pe-3"></i>Edit
                                        </DropdownItem>
                                        <DropdownItem onClick={deletePost} className={"ps-4"}>
                                            <i className="bi bi-trash-fill pe-3"></i>Delete
                                        </DropdownItem>
                                    </ul>
                                    :
                                    <ul className="dropdown-menu">
                                        <DropdownItem onClick={e => setShowReport(true)} className={"ps-4"}>
                                            <i className="bi bi-exclamation-lg pe-3"></i>Report
                                        </DropdownItem>
                                    </ul>
                                }
                            </Dropdown>
                            </div>
                            <div className={"flex-grow-1"}></div>

                            <Button className=' d-flex flex-row flex-nowrap p-2 rounded-5 comment-button'
                                    onClick={reply} disabled={!active}>
                                <i className={"bi bi-reply me-2"}></i>
                                Reply
                            </Button>
                        </div>
                    </Container>
                </div>
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
                    <Modal show={showReport} onHide={()=>{setShowReport(false)}} centered size={'md'}>
                    <Modal.Header>Report Post</Modal.Header>
                    <Modal.Body className="">
                        <Form.Label htmlFor='report'>Report Type</Form.Label>
                        <Form.Control id='report' as="select" className={"mb-2"} 
                        onChange={e => setReport(e.target.value)}
                        value={report}>
                            <option value=''>-- Select Report Type --</option>
                            <option value='Inappropriate'>Inappropriate Content</option>
                            <option value='Abusive'>Abusive or Hateful Content</option>
                            <option value='Spam'>Spam or Unrelated Content</option>
                            <option value='Others'>Others</option>
                        </Form.Control>

                        <Form.Label htmlFor='li-link'>Additional Details (Optional)</Form.Label>
                            <Form.Control
                                id='description'
                                as='textarea'
                                placeholder='Additional details of the report...'
                                onChange = {e => setReportDetail(e.target.value)}
                                value={reportDetail}
                                rows={6}
                                className='mb-2'
                            />
                        
                    <div className="text-center mt-3">
                        <Button className={"me-2 bg-primary"} onClick={reportPost} disabled={!activeReport}>Submit Report</Button>
                        <Button className={"bg-secondary"} onClick={()=>{setShowReport(false)}}>Cancel</Button>
                    </div> 
                    </Modal.Body>
                </Modal>

                <Modal show={loading} size="md" className='d-flex mt-auto loading' centered>
                <Spinner className="align-self-center"/>
                <div className="mt-2">
                    <Typewriter 
                        options={{
                            strings: ['please wait a moment...'],
                            autoStart: true,
                            loop: true,
                            delay: 100,
                            deleteSpeed: .10,
                        }}
                    />
                </div>
            </Modal>
            </Container>
    )
}