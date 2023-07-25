import {
    Col,
    Container,
    Row,
    Image,
    Tabs,
    Tab, Button, ListGroup, Modal, FormControl, Form, Spinner
} from 'react-bootstrap';
import { Navigate, useLocation, useNavigate, useParams} from "react-router-dom";
import AppNavbar from '../components/AppNavbar';
import User_f from "../static/images/nonuser_f.svg";
import User_m from "../static/images/nonuser_m.svg";
import placeholder_f from "../static/images/user_placeholder_f.svg";
import placeholder_m from "../static/images/user_placeholder_m.svg";
import Therapist_f from "../static/images/dr_placeholder_f.svg";
import Therapist_m from "../static/images/dr_placeholder_m.svg";
import Admin_f from "../static/images/admin_placeholder_f.svg";
import Admin_m from "../static/images/admin_placeholder_m.svg";
import Others from "../static/images/other_placeholder.svg";
import UserOverview from "../components/user/UserOverview";
import profile_banner from "../static/images/bg.png"
import fb from '../static/images/facebook.svg';
import twt from '../static/images/twitter.svg';
import lnk from '../static/images/linkedin.svg';
import UserPostItem from "../components/user/UserPostItem";
import UserCommentItem from '../components/user/UserCommentItem';
import React, { useEffect, useState } from 'react';
import ContactItem from '../components/ContactItem';
import { useContext } from 'react';
import UserContext from '../UserContext';
import dayjs from 'dayjs'
import { TextareaAutosize } from '@mui/material';
import Swal from 'sweetalert2';
import { addContact, blockContact, cancelContact, confirmContact, declineContact, removeContact } from '../functions/contactFunctions';
import TherapistCard from '../components/TherapistCard';


export default function User() {

    const { user } = useContext(UserContext)

    const { user_id } = useParams();

    const [userLoading, setUserLoading] = useState(true)
    const [postLoading, setPostLoading] = useState(true)
    const [commentLoading, setCommentLoading] = useState(true)
    const [contactLoading, setContactLoading] = useState(true)
    const [likedLoading, setLikedLoading] = useState(true)

    const [status, setStatus] = useState(null)
    const [requested_by, setRequestedBy] = useState(null)

    const [posts, setPosts] = useState([])
    const [comments, setComments] = useState([])
    const [contacts, setContacts] = useState([])
    const [blocked, setBlocked] = useState([])
    const [liked, setLiked] = useState([])
    const [count, setCount] = useState(0)

    const [user_username, setUsername] = useState('')
    const [user_role, setRole] = useState('')
    const [user_registration_date, setRegistrationDate] = useState('')
    const [user_fb_link, setFBLink] = useState('')
    const [user_twt_link, setTwtLink] = useState('')
    const [user_li_link, setLiLink] = useState('')
    const [user_bio, setBio] = useState('')
    const [user_prefix, setPrefix] = useState('')
    const [user_first_name, setFirstName] = useState('')
    const [user_last_name, setLastName] = useState('')
    const [user_suffix, setSuffix] = useState('')
    const [gender, setGender] = useState('')

    const [therapist_id, setTherapistId] = useState('')
    const [field, setField] = useState('')
    const [description, setDescription] = useState('')
    const [online, setOnline] = useState(false)
    const [in_person, setInPerson] = useState(false)


    const [new_username, setNewUsername] = useState(user.username)
    const [new_fb_link, setNewFBLink] = useState(user.fb_link)
    const [new_twt_link, setNewTwtLink] = useState(user.twt_link)
    const [new_li_link, setNewLiLink] = useState(user.li_link)
    const [newBio, setNewBio] = useState(user.bio)

    const [usernameExists, setUsernameExists] = useState(false)
    const [isValidUsername, setValidUsername] = useState(false)
    const [isValidFB, setValidFB] = useState(false)
    const [isValidTwt, setValidTwt] = useState(false)
    const [isValidLi, setValidLi] = useState(false)

    const [editActive, setEditActive] = useState(false)
    const [socialActive, setSocialActive] = useState(false)

    useEffect(() => {
        if(user_id !== user.id) {
            fetch(`https://oasis-api-nocv.onrender.com/contact/view/${user_id}`,
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
                if(data.length !== 0) {
                    setStatus(data[0].status)
                    setRequestedBy(data[0].requested_by)
                }
            })
        }

        fetch(`https://oasis-api-nocv.onrender.com/post/viewByUser/${user_id}`,
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
            setPostLoading(false)
            setPosts(data.map(post => (
                <UserPostItem key={post.p_id} postProp={post}/>
                )))
        })

        fetch(`https://oasis-api-nocv.onrender.com/post/viewCommentsByUser/${user_id}`,
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
            setCommentLoading(false)
            data.length !== 0 ?
            setComments(data.map(comment => (
                <UserCommentItem key={comment.c_id} commentProp={comment}/>
                ))) 
                : setComments(null)
        })

        fetch(`https://oasis-api-nocv.onrender.com/contact/viewAll`,
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
            setContactLoading(false)
            setContacts(data.map(contact => {
                return(
                ((contact.status !== 'INACTIVE' && contact.status !== 'BLOCKED') && contact.requested_by !== user.id) ? 
                    <ContactItem key={contact.contact_id} contactProp= {contact} highlight={false} pageView={true} options={true}/>
                :
                null       
            )
        }))
        })

        fetch(`https://oasis-api-nocv.onrender.com/contact/viewAll`,
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
            setContactLoading(false)
            setBlocked(data.map(contact => {
                return(
                (contact.status === 'BLOCKED' && contact.blocked_by === user.id) ? 
                    <ContactItem key={contact.contact_id} contactProp= {contact} highlight={false} pageView={true} options={true}/>
                :
                null       
            )
        }))
        })

        fetch(`https://oasis-api-nocv.onrender.com/post/viewAllLikedCommentsPosts/${user_id}`,
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
            setLikedLoading(false)
            data.length !== 0 ?
            setLiked(data.map(item => (
                item.type === 'comment' ?
                <UserCommentItem key={item.c_id} commentProp={item} likePage={true}/>
                :
                <UserPostItem key={item.p_id} postProp={item}/>
                ))) 
                : setLiked(null)
        })

        fetch(`https://oasis-api-nocv.onrender.com/post/countUserLikes/${user_id}`,
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
            data ? setCount(data[0].count) : setCount(0)
        })

    }, [new_username, user.id, user.username, user_id, usernameExists, status, contacts])

    useEffect(() => {
        fetch('https://oasis-api-nocv.onrender.com/user/checkUsername', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                username: new_username
            })
        }).then(res => res.json())
        .then(data => {
            data ? setUsernameExists(true) : setUsernameExists(false)
        })

        const valid_username= /^[a-z0-9_.-]{3,15}$/
        if(new_username){new_username.match(valid_username) ? setValidUsername(true) : setValidUsername(false)}
        // check if username already exists
        new_username !== '' && (new_username !== user.username || !usernameExists) && isValidUsername ? setEditActive(true) : setEditActive(false)
    }, [isValidUsername, new_username, user.username, usernameExists])

    useEffect(() => {
        const fb_valid = /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9(.?)?]/
        const twt_valid = /^(https?:\/\/)?(www\.)?twitter\.com\/[a-zA-Z0-9_]{1,15}$/
        const li_valid = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9_-]+\/?$/

        if(new_fb_link){new_fb_link.match(fb_valid) ? setValidFB(true) : setValidFB(false)}
        if(new_twt_link){new_twt_link.match(twt_valid) ? setValidTwt(true) : setValidTwt(false)}
        if(new_li_link){new_li_link.match(li_valid) ? setValidLi(true) : setValidLi(false)}

        (!new_fb_link || isValidFB) && (!new_twt_link || isValidTwt) && (!new_li_link || isValidLi) ? setSocialActive(true) : setSocialActive(false)
    }, [isValidFB, isValidLi, isValidTwt, new_fb_link, new_li_link, new_twt_link])

    useEffect(() => {
            fetch(`https://oasis-api-nocv.onrender.com/user/getUser/${user_id}`,
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
                setUserLoading(false)

                setUsername(data[0].username)
                setRole(data[0].role)
                setRegistrationDate(dayjs(data[0].registration_date).format('MMMM DD, YYYY'))
                setFBLink(data[0].fb_link)
                setTwtLink(data[0].twt_link)
                setLiLink(data[0].li_link)
                setBio(data[0].bio)
                setPrefix(data[0].prefix)
                setLastName(data[0].last_name)
                setFirstName(data[0].first_name)
                setSuffix(data[0].suffix)
                setTherapistId(data[0].therapist_id)
                setGender(data[0].gender)
                setField(data[0].field)
                setDescription(data[0].description)
                setOnline(data[0].online)
                setInPerson(data[0].in_person)

                setNewUsername(data[0].username)
                setNewFBLink(data[0].fb_link)
                setNewTwtLink(data[0].twt_link)
                setNewLiLink(data[0].li_link)
                setNewBio(data[0].bio)
            })
    }, [user.id, user_id])

    const location = useLocation()
    const history = useNavigate()

    const getUrl = new URLSearchParams(location.search).get('tab');
    const [tab, setTab] = useState(getUrl ? getUrl : 'overview')

    function viewTab(val){
        setTab(val)        
        history(`${location.pathname}?tab=${val}`);
    }

    const [openEdit, setOpenEdit] = useState(false);
    const [openSocial, setOpenSocial] = useState(false);
    const [openBio, setOpenBio] = useState(false);

    const [subject, setSubject] = useState("")
    const [content, setContent] = useState("");

    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(false)


    const openModal = (e) => {
        setOpen(true);
    }
    const closeModal = e => {
        setOpen(false);
    }

    useEffect(() => {
        subject !== '' && content !== '' ? setActive(true) : setActive(false)
    }, [subject, content])

    function createPost(e) {
        e.preventDefault()

        fetch(`https://oasis-api-nocv.onrender.com/post/create`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
            },
            body: JSON.stringify({
                subject: subject,
                content: content
            })
            }).then(res => res.json())
            .then(data => {
                data ? 
                Swal.fire({
                    title: "Post created!",
                    icon: "success",
                    text: "Thank you for sharing.",
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
        closeModal()
        setSubject("");
        setContent("");
    }

    function editUser(e) {
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
                fetch(`https://oasis-api-nocv.onrender.com/user/editDetails`, {
                    method : 'PATCH',
                    headers : {
                        'Content-Type' : 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
                    },
                    body: JSON.stringify({
                        username: new_username,
                        bio: newBio,
                        fb_link: new_fb_link,
                        twt_link: new_twt_link,
                        li_link: new_li_link
                    })
                    }).then(res => res.json())
                    .then(data => {
                        data ?
                        Swal.fire({
                            title: "Your details have been updated successfully!",
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
                setUsername(new_username);
                setBio(newBio);
                setFBLink(new_fb_link);
                setTwtLink(new_twt_link);
                setLiLink(new_li_link);
                setOpenEdit(false)
                setOpenSocial(false)
                setOpenBio(false)
            }
        })
    }

    // contact functions
    function add(e){
        e.preventDefault()
        setStatus(addContact(user_id))
        setRequestedBy(user.id)
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

    function confirm(e){
        e.preventDefault()
        
        setStatus(confirmContact(user_id))
    }

    function decline(e){
        e.preventDefault()
        
        setStatus(declineContact(user_id))
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
            const imageName = `${user_role}_${gender}`;

    return(
        user.id === null ?
            <Navigate to='/error' />
        :
        <Container fluid>
            <Row className='d-flex flex-row'>
                <Col lg={2} className=''>
                    <AppNavbar/>
                </Col>
                <Col className={'my-4 '}>
                    {user_role === 'Therapist' && <TherapistCard therapistProp={
                        {'therapist_id': therapist_id,
                        'prefix': user_prefix,
                        'first_name': user_first_name,
                        'last_name': user_last_name,
                        'suffix': user_suffix,
                        'field': field,
                        'description': description,
                        'online': online,
                        'in_person': in_person,
                        'fb_link': user_fb_link,
                        'twt_link': user_twt_link,
                        'li_link': user_li_link,
                        'user_therapist_id': user_id,
                        'gender': gender}
                        
                    }
                    />}
                    <Row className={'w-100 my-4 rounded-4 bg-light'}>
                        <Tabs onSelect={e => viewTab(e)}
                        activeKey={tab}
                        defaultActiveKey={'overview'}
                        >
                            <Tab title={"Overview"} eventKey={'overview'} value='overview' tabClassName='tab-title'>
                                <UserOverview/>
                            </Tab>
                            <Tab title={"Posts"} eventKey={'posts'} value='posts' tabClassName='tab-title'>
                                {postLoading ?
                                <div className={"flex-grow-1 w-100 text-center mt-3 mb-0"}>
                                    <Spinner />
                                </div>
                                :
                                <ListGroup className={"mb-3"}>
                                    {posts}
                                </ListGroup>}
                            </Tab>
                            <Tab title={"Comments"} eventKey={'comments'} value='comments' tabClassName='tab-title'>
                                {commentLoading ?
                                <div className={"flex-grow-1 w-100 text-center mt-3 mb-0"}>
                                    <Spinner />
                                </div>
                                :
                                <ListGroup className={"mb-3"}>
                                    {comments}
                                </ListGroup>}
                            </Tab>
                            {user_id === user.id && 
                            <Tab title={<span>Contacts <i className='bi bi-lock-fill'/></span>} eventKey={"contacts"} tabClassName='tab-title'>
                                <Form className={"d-flex flex-row flex-nowrap p-2 mb-2"} >
                                    <Form.Control placeholder={"search by username"}/>
                                    <Button className={"mx-1"}>Search</Button>
                                </Form>
                                {contactLoading ?
                                <div className={"flex-grow-1 w-100 text-center mt-3 mb-0"}>
                                    <Spinner />
                                </div>
                                :
                                <ListGroup className={"mb-3"}>
                                    {contacts}
                                </ListGroup>}
                            </Tab>}
                            {user_id === user.id && 
                            <Tab title={<span>Blocked <i className='bi bi-lock-fill'/></span>} eventKey={"blocked"} tabClassName='tab-title'>
                                <Form className={"d-flex flex-row flex-nowrap p-2 mb-2"} >
                                    <Form.Control placeholder={"search by username"}/>
                                    <Button className={"mx-1"}>Search</Button>
                                </Form>
                                {contactLoading ?
                                <div className={"flex-grow-1 w-100 text-center mt-3 mb-0"}>
                                    <Spinner />
                                </div>
                                :
                                <ListGroup className={"mb-3"}>
                                    {blocked}
                                </ListGroup>}
                            </Tab>}
                            <Tab title={"Likes"} eventKey={"likes"} tabClassName='tab-title'>
                                {likedLoading ?
                                <div className={"flex-grow-1 w-100 text-center mt-3 mb-0"}>
                                    <Spinner />
                                </div>
                                :
                                <ListGroup className={"mb-3"}>
                                    {liked}
                                </ListGroup>}
                            </Tab>
                        </Tabs>
                    </Row>
                </Col>
                {<Col lg={3} className='d-flex align-items-center justify-content-center'>
                    {userLoading ?
                    <div className={"flex-grow-1 w-100 text-center mt-3 mb-0"}>
                        <Spinner />
                    </div>
                    :
                    <div className='mt-4 align-self-start'>
                    {/*profile options*/}
                    <Container fluid className={"d-flex flex-column my-4 "}>
                        <div className={"bg-white border border-1 rounded-4 px-2 py-3 position-relative"}>
                            <Container>
                                <div className={"profile-banner overflow-hidden "}>
                                    <label>
                                    <Image src={profile_banner} className={"w-100 h-auto"}/>
                                    </label>
                                </div>
                                <Container fluid className={"position-relative text-center"}>
                                    <Image src={user.id === user_id ? 
                        user.role === 'User' ? user.gender === 'male' ? placeholder_m : user.gender === 'female' ? placeholder_f : Others :
                        imageMap[imageName]
                        : imageMap[imageName]} className={"profile-pic"}/>
                                </Container>
                                {user_role === 'Therapist' ?
                                <h5 className={"text-center py-1"}>{user_prefix} {user_last_name} {user_suffix}</h5>
                                :
                                <h5 className={"text-center py-1"}>@{user_username}</h5>}
                                <p className={"text-center "}><small >{user_role}</small></p>
                                {user_id === user.id && 
                                <Button className={"d-flex align-items-center justify-content-between w-100 border-0"}
                                onClick={e => setOpenEdit(true)}
                                >
                                    <i className={"bi bi-pen"}></i>
                                    Edit Profile
                                    <div></div>
                                </Button>}
                                <Container fluid className={"my-1"}></Container>
                                <Container fluid className={"d-flex flex-row flex-wrap p-1"}>
                                    <div className={"d-flex flex-column mb-2 flex-grow-1 align-items-center"}>
                                        <Row><h6>Likes</h6></Row>
                                        <Row><div className={"d-flex aligns-items-center mt-1"}>
                                            <i className={"bi bi-hearts me-1"}></i>
                                            <span><small>{count}</small></span>
                                        </div>
                                        </Row>
                                        
                                    </div>
                                    <div className={"d-flex flex-column mb-2 flex-grow-1 align-items-center"}>
                                        <Row><h6>User Day</h6></Row>
                                        <Row><div className={"d-flex aligns-items-center mt-1"}>
                                            <i className={"bi bi-calendar-event me-1"}></i>
                                            <span><small>{user_registration_date}</small></span>
                                        </div>
                                        </Row>
                                        
                                    </div>
                                    <div className={"d-flex flex-column my-2 flex-grow-1 align-items-center w-100 "}>
                                        <Row>
                                            {user_fb_link && <Col><a href={user_fb_link.substring(0,5) === "https" ? user_fb_link : "https://"+user_fb_link} target="_blank" rel="noopener noreferrer"><Image src={fb}/></a></Col>}
                                            {user_twt_link && <Col><a href={user_twt_link.substring(0,5) === "https" ? user_twt_link : "https://"+user_twt_link} target="_blank" rel="noopener noreferrer"><Image src={twt}/></a></Col>}
                                            {user_li_link && <Col><a href={user_li_link.substring(0,5) === "https" ? user_li_link : "https://"+user_li_link} target="_blank" rel="noopener noreferrer"><Image src={lnk}/></a></Col>}
                                        </Row>
                                        {user_id === user.id ?
                                        <Row>
                                            <Button as={"li"} className={" d-flex align-items-center mt-3 px-2 py-1 me-2"} onClick={e => setOpenSocial(true)}>
                                                <i className={"bi bi-plus"}></i>
                                                Edit socials
                                            </Button>
                                        </Row>
                                        :
                                        <div>
                                        <Row className='d-flex flex-row pt-3 align-items-center justify-content-center'>
                                            {((status === "INACTIVE" || !status) && user_role !== 'Therapist') && 
                                                <Button as={"li"} className={"align-items-center mt-3 px-2 py-1 me-2 bg-primary text-center"} onClick={add}>
                                                    <i className={"bi bi-person-plus me-2"}></i>
                                                    Add contact
                                                </Button>}

                                            {(status === "PENDING" && requested_by === user.id) &&
                                            <div className='d-flex flex-column pt-3 text-center align-items-center'>
                                                <small><em> You've already sent a contact request to this user.</em></small>
                                                <Button as={"li"} className={"align-items-center mt-3 px-2 py-1 me-2 bg-secondary"} onClick={cancel}>
                                                        <i className={"bi bi-x-lg me-2"}></i>
                                                        Cancel Request
                                                    </Button>
                                            </div>}

                                            {(status === "PENDING" && requested_by !== user.id) &&
                                            <div className='d-flex flex-column pt-3 text-center align-items-center'>
                                                <small><em>I've sent you a contact request.</em></small>
                                                <Button as={"li"} className={"align-items-center mt-3 px-2 py-1 me-2 bg-primary"} onClick={confirm}>
                                                    <i className={"bi bi-person-add me-2"}></i>
                                                    Confirm Request
                                                </Button>
                                                <Button as={"li"} className={"align-items-center mt-3 px-2 py-1 me-2 bg-secondary"} onClick={decline}>
                                                    <i className={"bi bi-x-lg me-2"}></i>
                                                    Decline
                                                </Button>
                                            </div>}
                                            {status === "ACTIVE" &&
                                                <Button as={"li"} className={"align-items-center mt-3 px-2 py-1 me-2 bg-primary text-center"} onClick={remove}>
                                                    <i className={"bi bi-person-dash me-2"}></i>
                                                    Remove contact
                                                </Button>}
                                            {status !== "BLOCKED" &&
                                                <Button as={"li"} className={"align-items-center justify-content-center mt-3 px-2 py-1 me-2 text-bg-danger bg-danger"} onClick={block}>
                                                    <i className={"bi bi-x-circle me-2"}></i>
                                                    Block user
                                                </Button>}
                                        </Row>
                                        </div>
                                        }
                                        {user_id === user.id &&
                                        <Button className={"w-100 mt-4"}
                                        onClick={openModal}
                                        >New Post</Button>}
                                    </div>
                                </Container>
                            </Container>
                        </div>
                    </Container>
                    {/*bio*/}
                    <Container fluid className={"d-flex flex-column my-4"}>
                        <div className={"bg-light border border-1 rounded-4 px-2 py-3"}>
                            <Container className={"pt-0 d-flex"}>
                                <div className={"pt-3"}>
                                    <h6>Bio</h6>
                                </div>
                            </Container>
                            <Container>
                                <p>
                                    {user_bio ? user_bio : 'No bio available yet.'}
                                </p>
                            </Container>
                            {user_id === user.id &&
                            <Button className={"w-100 mt-4"} onClick={e => setOpenBio(true)}>Edit Bio</Button>}
                        </div>
                    </Container>
                    </div>}
                </Col>}
            </Row>

            <Modal show={openEdit} size="md" className="mt-auto" centered onHide={e => setOpenEdit(false)}>
                <Container fluid className="d-flex flex-column px-4 my-4 justify-content-between align-items-center">
                    <h3 className='py-3'>Edit Profile</h3>
                    <div className='rounded-4 d-flex flex-column p-2 shadow-focus w-100' >
                        <Form.Label htmlFor='inputUsername'>Enter new username</Form.Label>
                        <Form.Control
                            id='inputUsername'
                            placeholder="Username"
                            className='border-1 shadow-none'
                            value={new_username}
                            onChange = {e => setNewUsername(e.target.value)}
                        />
                        {(usernameExists && user.username !== new_username) && <Form.Text className='error-msg'>Username already taken. Please try another one.</Form.Text>
                        }
                    </div>
                    <div className='rounded-4 d-flex flex-column p-2 shadow-focus w-100' >
                        <Form.Label htmlFor='inputEmail'>Email</Form.Label>
                        <Form.Control
                            id='inputUsername'
                            placeholder="Username"
                            className='border-1 shadow-none text-muted'
                            value={user.email}
                            disabled
                        />
                    </div>
                    <div className='mt-3'>
                        <Button 
                        className="rounded px-5 bg-primary border-0"
                        onClick={editUser}
                        disabled={!editActive}
                        >
                            Save
                        </Button>
                    </div>
                </Container>
            </Modal>

            <Modal show={openSocial} size="md" className="mt-auto" centered onHide={e => setOpenSocial(false)}>
                <Container fluid className="d-flex flex-column px-4 my-4 justify-content-between align-items-center">
                    <h3 className='py-3'>Edit Social Links</h3>
                    <div className='rounded-4 d-flex flex-column p-2 shadow-focus w-100' >
                        <Form.Label htmlFor='fb-link'>Facebook</Form.Label>
                        <Form.Control
                            id='fb-link'
                            placeholder="www.facebook.com/juandelacruz"
                            className='border-1 shadow-none'
                            value={new_fb_link}
                            onChange = {e => setNewFBLink(e.target.value)}
                        />
                        {(new_fb_link && !isValidFB) && <Form.Text className='error-msg'>Please enter a valid Facebook link.</Form.Text>}
                    </div>
                    <div className='rounded-4 d-flex flex-column p-2 shadow-focus w-100' >
                        <Form.Label htmlFor='twt-link'>Twitter</Form.Label>
                        <Form.Control
                            id='twt-link'
                            placeholder="www.twitter.com/juandelacruz"
                            className='border-1 shadow-none'
                            value={new_twt_link}
                            onChange = {e => setNewTwtLink(e.target.value)}
                        />
                        {(new_twt_link && !isValidTwt) && <Form.Text className='error-msg'>Please enter a valid Twitter link.</Form.Text>}
                    </div>
                    <div className='rounded-4 d-flex flex-column p-2 shadow-focus w-100' >
                        <Form.Label htmlFor='li-link'>LinkedIn</Form.Label>
                        <Form.Control
                            id='li-link'
                            placeholder="www.linkedin.com/in/juandelacruz"
                            className='border-1 shadow-none'
                            value={new_li_link}
                            onChange = {e => setNewLiLink(e.target.value)}
                        />
                        {(new_li_link && !isValidLi) && <Form.Text className='error-msg'>Please enter a valid LinkedIn link.</Form.Text>}

                    </div>
                    <div className='mt-3'>
                        <Button 
                        className="rounded px-5 bg-primary border-0"
                        onClick={editUser}
                        disabled={!socialActive}
                        >
                            Save
                        </Button>
                    </div>
                </Container>
            </Modal>

            <Modal show={openBio} size="md" className="mt-auto" centered onHide={e => setOpenBio(false)}>
                <Container fluid className="d-flex flex-column px-4 my-4 justify-content-between align-items-center">
                    <h3 className='py-3'>Edit Bio</h3>
                    <div className='rounded-4 d-flex flex-column p-2 shadow-focus w-100' >
                    <TextareaAutosize
                            className='content-box'
                            placeholder='What are your thoughts?'
                            minRows={5}
                            maxRows={7}
                            onChange = {e => setNewBio(e.target.value)}
                            value={newBio}
                        />
                    </div>
                    <div className='mt-3'>
                        <Button 
                        className="rounded px-5 bg-primary border-0"
                        onClick={editUser}
                        disabled={!socialActive}
                        >
                            Save
                        </Button>
                    </div>
                </Container>
            </Modal>

            <Modal show={open} size="lg" className="mt-auto" centered onHide={closeModal}>
                <Container fluid className="d-flex flex-column px-4 my-4 justify-content-between align-items-center">
                    <h3 className='py-3'>Create A New Post</h3>
                    <div className='rounded-4 d-flex flex-row p-2 shadow-focus w-100' >
                        <FormControl 
                            placeholder="Title"
                            className='border-0 w-100 shadow-none'
                            onChange = {e => setSubject(e.target.value)}
                            value={subject}
                        />
                    </div>
                    <div className='w-100'>
                        <TextareaAutosize
                            className='content-box'
                            placeholder='What are your thoughts?'
                            minRows={10}
                            maxRows={15}
                            onChange = {e => setContent(e.target.value)}
                            value={content}
                        />
                    </div>
                    <div className='mt-3'>
                        <Button 
                        className="rounded px-5 bg-primary border-0"
                        onClick={createPost}
                        disabled={!active}
                        >
                            Post
                        </Button>
                    </div>
                </Container>
            </Modal>

        </Container>
    );
}