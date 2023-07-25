import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Button, Col, Collapse, Container, Form, ListGroup, Modal, ModalBody, ModalHeader, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import AppNavbar from "../components/AppNavbar";
import PaginatedListGroup from "../components/PaginatedListGroup";
import ReportItem from "../components/ReportItem";

function UserManagementItem({userProp}) {

    const {username, user_id, role, prefix, first_name, last_name, suffix, field, description, online, in_person, fb_link, twt_link, li_link, banned} = userProp

    const [new_first_name, setNewFirstName] = useState(first_name)
    const [new_last_name, setNewLastName] = useState(last_name)
    const [new_prefix, setNewPrefix] = useState(prefix)
    const [new_suffix, setNewSuffix] = useState(suffix)
    const [new_field, setNewField] =useState(field)
    const [new_description, setNewDescription] = useState(description)
    const [new_online, setNewOnline] = useState(online)
    const [new_in_person, setNewInPerson] = useState(in_person)
    const [new_fb_link, setNewFBLink] = useState(fb_link)
    const [new_twt_link, setNewTwtLink] = useState(twt_link)
    const [new_li_link, setNewLiLink] = useState(li_link)

    const [isValidFB, setValidFB] = useState(false)
    const [isValidTwt, setValidTwt] = useState(false)
    const [isValidLi, setValidLi] = useState(false)

    const [value, setValue] = useState(role)
    const [new_role, setNewRole] = useState(role)

    const [showRoles, setShowRoles] = useState(false);

    const [active, setActive] = useState(false)

    function handleSubmit() {
        if(value === 'Therapist') {
            fetch(`https://oasis-api-nocv.onrender.com/admin/toTherapist/${user_id}`, {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
                },
                body: JSON.stringify({
                    first_name: new_first_name,
                    last_name: new_last_name,
                    prefix: new_prefix,
                    suffix: new_suffix,
                    field: new_field,
                    description: new_description,
                    online: new_online,
                    in_person: new_in_person,
                    fb_link: new_fb_link,
                    twt_link: new_twt_link,
                    li_link: new_li_link
                })
                }).then(res => res.json())
                .then(data => {
                    data ?
                    Swal.fire({
                        title: "Role successfully modified!",
                        icon: "success",
                        iconColor: '#3A3530',
                        color: '#3A3530',
                        confirmButtonText: "OK",
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: 'button2'
                        }
                    }).then(setNewRole(value)).then(setShowRoles(false))
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
        } else {
            fetch(`https://oasis-api-nocv.onrender.com/admin/updateRole/${user_id}`, {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
                },
                body: JSON.stringify({
                    role: value
                })
                }).then(res => res.json())
                .then(data => {
                    data ?
                    Swal.fire({
                        title: "Role successfully modified!",
                        icon: "success",
                        iconColor: '#3A3530',
                        color: '#3A3530',
                        confirmButtonText: "OK",
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: 'button2'
                        }
                    }).then(setNewRole(value)).then(setShowRoles(false))
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
        }
    }

    function banUser(e) {
        e.preventDefault()

        Swal.fire({
            title: "Ban User?",
            text: "This will disable them from logging into the app.",
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
                fetch(`https://oasis-api-nocv.onrender.com/admin/banUser/${user_id}`, {
                    method : 'PATCH',
                    headers : {
                        'Content-Type' : 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
                    }
                    }).then(res => res.json())
                    .then(data => {
                        data ?
                        Swal.fire({
                            title: "User Banned.",
                            text: `@${username} will no longer be able to access the website unless you unban them.`,
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

            }
        })
    }

    function unbanUser(e) {
        e.preventDefault()

        Swal.fire({
            title: "Unban User?",
            text: "This will allow them to access the website.",
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
                fetch(`https://oasis-api-nocv.onrender.com/admin/unbanUser/${user_id}`, {
                    method : 'PATCH',
                    headers : {
                        'Content-Type' : 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
                    }
                    }).then(res => res.json())
                    .then(data => {
                        data ?
                        Swal.fire({
                            title: "User Unbanned!",
                            text: `@${username} can now access the website.`,
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

            }
        })
    }

    useEffect(() => {
        const fb_valid = /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9(.?)?]/
        const twt_valid = /^(https?:\/\/)?(www\.)?twitter\.com\/[a-zA-Z0-9_]{1,15}$/
        const li_valid = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9_-]+\/?$/


        if (value === 'Therapist') {

            if(new_fb_link){new_fb_link.match(fb_valid) ? setValidFB(true) : setValidFB(false)}
            if(new_twt_link){new_twt_link.match(twt_valid) ? setValidTwt(true) : setValidTwt(false)}
            if(new_li_link){new_li_link.match(li_valid) ? setValidLi(true) : setValidLi(false)}

            (first_name !== new_first_name || last_name !== new_last_name || prefix !== new_prefix || suffix !== new_suffix || field !== new_field || description !== new_description || online !== new_online || in_person !== new_in_person || fb_link !== new_fb_link || twt_link !== new_twt_link || li_link !== new_li_link) && ((!new_fb_link || isValidFB) && (!new_twt_link || isValidTwt) && (!new_li_link || isValidLi)) ? setActive(true) : setActive(false)
            
        } else if (value === new_role) {
            setActive(false) 
        } else {
            setActive(true)
        }

    }, [value, new_role, new_fb_link, new_twt_link, new_li_link, isValidFB, isValidTwt, isValidLi, first_name, new_first_name, last_name, new_last_name, prefix, new_prefix, suffix, new_suffix, field, new_field, description, new_description, online, new_online, in_person, new_in_person, fb_link, twt_link, li_link])

    useEffect(() => {})

    const colors = [
        {
            role: 'User',
            color: 'bg-secondary'
        },
        {
            role: 'Therapist',
            color: 'bg-primary'
        },
        {
            role: 'Admin',
            color: 'bg-warning'
        },
    ]

    function getColor(role){
        const contactStatus = colors.find(item => item.role === role)
        return contactStatus.color
    }


    return <ListGroup.Item className={"rounded-1 mb-2 align-items-center "}>
        <Row className={"mt-3 text-bg-white "}>
            <Col sm={2} className={"fw-bold"}>@{username}</Col>
            {!banned ?
            <Col sm={2}><span className={`px-3 text-center rounded-pill ${getColor(new_role)}`}>{new_role}</span></Col>
            :
            <Col sm={2}><span className={`px-3 text-center rounded-pill text-bg-danger`}>BANNED</span></Col>}
            {!banned ? 
            <Col>
                <Button onClick={()=>{setShowRoles(true)}} className={"me-2"}>Modify Role</Button>
                <Modal show={showRoles} onHide={()=>{setShowRoles(false)}} centered size={value === 'Therapist' ? 'lg' : 'md'}>
                    <Modal.Header>Choose a Role</Modal.Header>
                    <Modal.Body className="">
                        <Form.Control as="select" className={"mb-2"} 
                        onChange={e => setValue(e.target.value)}
                        value={value}>
                            <option value='Admin'>Admin</option>
                            <option value='User'>User</option>
                            <option value='Therapist'>Therapist</option>
                        </Form.Control>
                        {value==='Therapist' &&
                        <Container fluid className="d-flex flex-column px-4 my-4">
                        <Row className="justify-content-center text-center mb-2">
                            <h5>Modify Therapist Details</h5>
                        </Row>
                        <Row>
                            <Col>
                            <h6>Therapist Information</h6>
                                <Row>
                                <Col>
                                    <div className='rounded-4 d-flex flex-column p-2 shadow-focus w-100' >
                                        <Form.Label htmlFor='prefix'>Prefix</Form.Label>
                                        <Form.Control
                                            id='prefix'
                                            placeholder="Dr. / Atty. / etc."
                                            className='border-1 shadow-none'
                                            value={new_prefix}
                                            onChange = {e => setNewPrefix(e.target.value)}
                                        />
                                    </div>
                                </Col>
                                <Col>
                                    <div className='rounded-4 d-flex flex-column p-2 shadow-focus w-100' >
                                        <Form.Label htmlFor='suffix'>Suffix</Form.Label>
                                        <Form.Control
                                            id='suffix'
                                            placeholder="Jr. / Sr. / etc."
                                            className='border-1 shadow-none'
                                            value={new_suffix}
                                            onChange = {e => setNewSuffix(e.target.value)}
                                        />
                                    </div>
                                </Col>
                                </Row>
                                <div className='rounded-4 d-flex flex-column p-2 shadow-focus w-100' >
                                        <Form.Label htmlFor='first_name'>First Name</Form.Label>
                                        <Form.Control
                                            id='first_name'
                                            placeholder="Juana"
                                            className='border-1 shadow-none'
                                            value={new_first_name}
                                            onChange = {e => setNewFirstName(e.target.value)}
                                        />
                                </div>
                                <div className='rounded-4 d-flex flex-column p-2 shadow-focus w-100' >
                                        <Form.Label htmlFor='last_name'>Last Name</Form.Label>
                                        <Form.Control
                                            id='last_name'
                                            placeholder="Dela Cruz"
                                            className='border-1 shadow-none'
                                            value={new_last_name}
                                            onChange = {e => setNewLastName(e.target.value)}
                                        />
                                </div>
                                <div className='rounded-4 d-flex flex-column p-2 shadow-focus w-100' >
                                        <Form.Label htmlFor='field'>Field</Form.Label>
                                        <Form.Control
                                            id='field'
                                            placeholder="Pyschology, Public Health, etc."
                                            className='border-1 shadow-none'
                                            value={new_field}
                                            onChange = {e => setNewField(e.target.value)}
                                        />
                                </div>
                                <div className='rounded-4 d-flex flex-column p-2 shadow-focus w-100' >
                                <Form.Label htmlFor='li-link'>Description</Form.Label>
                                <Form.Control
                                id='description'
                                as='textarea'
                                placeholder='Dr. Juana Dela Cruz is a ...'
                                onChange = {e => setNewDescription(e.target.value)}
                                value={new_description}
                                />
                            </div>

                            </Col>
                            <Col>
                            <h6>Social Links</h6>
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
                            <h6 className="py-2">Type of Consultation</h6>
                            <div className='rounded-4 d-flex flex-column p-2 shadow-focus w-100' >
                                <Form.Check
                                    type='checkbox'
                                    id='online'
                                    className='border-1 shadow-none'
                                    onChange = {e => setNewOnline(e.target.checked)}
                                    label = 'Online Consultation'
                                    checked = {new_online}
                                />
                            </div>
                            <div className='rounded-4 d-flex flex-column p-2 shadow-focus w-100' >
                                <Form.Check
                                    type='checkbox'
                                    id='online'
                                    className='border-1 shadow-none'
                                    onChange = {e => setNewInPerson(e.target.checked)}
                                    label = 'In-person Consultation'
                                    checked = {new_in_person}
                                />
                            </div>

                            </Col>
                        </Row>
                    </Container>
                }
                    <div className="text-center">
                        <Button className={"me-2 bg-primary"} disabled={!active} onClick={handleSubmit}>Save</Button>
                        <Button onClick={()=>{setShowRoles(false)}}>Cancel</Button>
                    </div> 
                    </Modal.Body>
                </Modal>
                <Button onClick={banUser} className={"text-bg-danger me-2"}>Ban User</Button>
            </Col>
            :
            <Col>
                <Button onClick={unbanUser} className={"me-2 bg-secondary"}>Unban User</Button>
            </Col>
            }
        </Row>

    </ListGroup.Item>;
}

function PostManagementItem({postProp}) {

    const {p_id, username, subject, date_posted, reported} = postProp

    const humanizedDate = dayjs(new Date(date_posted)).format('MMMM DD, YYYY')

    const [open, setOpen] = useState(false)
    const [reports, setReports] = useState([])
    const [reportsLoading, setReportsLoading] = useState(false)

    const openModal = (e) => {
        setOpen(true);
    }
    const closeModal = e => {
        setOpen(false);
    }

    useEffect(() => {})


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
                fetch(`https://oasis-api-nocv.onrender.com/admin/deletePost/${p_id}`, {
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
                })
            }
        })
    }

    function retrieveReports(e){
        openModal()
        setReportsLoading(true)

        fetch(`https://oasis-api-nocv.onrender.com/admin/viewReports/${p_id}`,
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
            setReportsLoading(false)
            setReports(data.map(report =>
                {
                    return <ReportItem reportProp = {report}/>
                }
            ))

        })

    }

    return <ListGroup.Item className={"rounded-1 mb-2 align-items-center "}>
        <Row className={"mt-3 text-bg-white "}>
            <Col sm={3} className={"fw-bold"}>{subject}</Col>
            <Col sm={2}><small>@{username}</small></Col>
            <Col sm={2}><span className={"px-2 rounded-pill bg-secondary"}>{humanizedDate}</span></Col>
            <Col sm={1}><span className={`px-3 text-center rounded-pill ${reported ? 'text-bg-danger' : 'bg-secondary'}`}>{reported ? 'Yes' : 'No'}</span>
            </Col>
            {reported ?
            <Col className='text-center'>
                <span className="d-flex justify-content-center notif-view" onClick={retrieveReports}><small>View reports</small></span>
            </Col> : null}
            <Col className='text-end'>
                <Button className={"me-2"} as={Link} to={`/post/${p_id}`}>View</Button>
                <Button onClick={deletePost} className={"text-bg-danger"}>Delete</Button>
            </Col>
        </Row>

        <Modal show={open} size="lg" className="mt-auto" centered onHide={closeModal}>
            <ModalHeader><h5>Reports</h5></ModalHeader>
                <ModalBody>
                    {reportsLoading ?
                    <div className={"flex-grow-1 w-100 text-center mt-3 mb-0"}>
                        <Spinner/>
                    </div>
                    :
                    <ListGroup>
                        <Row className={"px-3"}>
                            <Col sm={3}>Report Id</Col>
                            <Col sm={2}>Type</Col>
                            <Col sm={2}>Reported By</Col>
                            <Col className='text-end me-5'>Details</Col>
                        </Row>
                            {reports}
                    </ListGroup>
}
                </ModalBody>
        </Modal>

    </ListGroup.Item>;
}

export default function Admin() {

    const [users, setUsers] = useState([])
    const [posts, setPosts] = useState([])
    const [keywordUser, setKeywordUser] = useState('')
    const [keywordPost, setKeywordPost] = useState('')
    
    const [showUsers, setShowUsers] = useState(false)
    const [showPosts, setShowPosts] = useState(false)




    useEffect(() => {
        fetch(`https://oasis-api-nocv.onrender.com/admin/${keywordUser === '' ? `getUsers` : `getUsersSearch/${keywordUser}`}`,
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
            setUsers(data.map(user => {
                return <UserManagementItem key={user.user_id} userProp= {user} />            
            }))
        })

        fetch(`https://oasis-api-nocv.onrender.com/admin/${keywordPost === '' ? `getPosts` : `getPostsSearch/${keywordPost}`}`,
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
            setPosts(data.map(post => {
                return <PostManagementItem key={post.post_id} postProp= {post} />            
            }))
        })



    }, [keywordUser, keywordPost, posts, users])

    return (
        <>
            <Container fluid>
                <Row className='d-flex flex-row'>
                    <Col sm={2} className=''>
                        <AppNavbar/>
                    </Col>


                    <Col sm={10}>
                        <Container className={"text-bg-light rounded-2 px-2 py-3 my-4"}>
                            <div className={"d-flex flex-row flex-nowrap justify-content-between"}>
                                <Link to={""} onClick={()=>{setShowUsers(!showUsers)}}>
                                    <h5 >
                                        User Management
                                        {showUsers ? <i className="bi bi-caret-up-fill"></i> : <i className="bi bi-caret-right-fill"></i>}
                                    </h5>
                                </Link>
                                <Form className={"d-flex flex-row flex-nowrap mb-4"} >
                                    <Form.Control 
                                    placeholder={"search by username"}
                                    onChange={e => setKeywordUser(e.target.value)}
                                    />
                                </Form>
                            </div>
                            <Collapse in={showUsers}>
                                <div>
                                    <Row className={"px-3"}>
                                        <Col sm={2}>Username</Col>
                                        <Col sm={2}>Role</Col>
                                        <Col>Actions</Col>
                                    </Row>
                                    <PaginatedListGroup data={users} itemsPerPage={5}/>

                                </div>
                            </Collapse>

                        </Container>
                        <Container className={"text-bg-light rounded-2 px-2 pt-3 my-4"}>


                            <div className={"d-flex flex-row flex-nowrap justify-content-between"}>
                                <Link to={""} onClick={()=>{setShowPosts(!showPosts)}}>
                                    <h5 >
                                        Post Management
                                        {showPosts ? <i className="bi bi-caret-up-fill"></i> : <i className="bi bi-caret-right-fill"></i>}
                                    </h5>
                                </Link>
                                <Form className={"d-flex flex-row flex-nowrap mb-4"} >
                                    <Form.Control 
                                    placeholder={"search by username"}
                                    onChange={e => setKeywordPost(e.target.value)}
                                    />
                                </Form>
                            </div>


                            <Collapse in={showPosts}>
                                <div>
                                    <Row className={"px-3"}>
                                        <Col sm={3}>Post</Col>
                                        <Col sm={2}>Posted by</Col>
                                        <Col sm={2}>Date Posted</Col>
                                        <Col sm={1}>Reported</Col>
                                        <Col className='text-end me-5'>Actions</Col>
                                    </Row>
                                    <PaginatedListGroup data={posts} itemsPerPage={5}/>

                                </div>
                            </Collapse>
                        </Container>


                    </Col>
                </Row>
            </Container>
        </>
    );
}