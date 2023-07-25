
import { useContext, useEffect, useState } from 'react';
import { Button, ButtonGroup, Container, Dropdown, FormControl, Image, Modal } from 'react-bootstrap';
// import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';
import '../index.css';
import Admin_f from "../static/images/admin_placeholder_f.svg";
import Admin_m from "../static/images/admin_placeholder_m.svg";
import Therapist_f from "../static/images/dr_placeholder_f.svg";
import Therapist_m from "../static/images/dr_placeholder_m.svg";
import User_f from "../static/images/nonuser_f.svg";
import User_m from "../static/images/nonuser_m.svg";
import Others from "../static/images/other_placeholder.svg";
import placeholder_f from "../static/images/user_placeholder_f.svg";
import placeholder_m from "../static/images/user_placeholder_m.svg";

export default function CreatePost() {
    // const isDesktopOrLaptop = useMediaQuery({
    //     query: '(min-width: 1224px)'
    // })

    // const isLandscape = useMediaQuery({ query: '(orientation: landscape)' })

    const [open, setOpen] = useState(false);

    const [subject, setSubject] = useState("")
    const [content, setContent] = useState("");

    const [active, setActive] = useState(false)

    const { user } = useContext(UserContext)

    useEffect(() => {
        subject !== '' && content !== '' ? setActive(true) : setActive(false)
    }, [subject, content])

    const openModal = (e) => {
        setOpen(true);
    }
    const closeModal = e => {
        setOpen(false);
    }

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
    const imageName = `${user.role}_${user.gender}`;

    return (
        <Container fluid>
            <Container fluid className="d-flex flex-row my-4 justify-content-between">
                <ButtonGroup className='rounded-4 d-flex flex-row p-2 shadow-focus w-100' >
                    <FormControl placeholder="Whats on your mind?" className='border-0 w-100 shadow-none'
                    onClick={openModal}
                    ></FormControl>
                    <Button className=" px-4 bg-primary border-0 "
                    onClick={openModal}
                    ><i className={"bi bi-plus-lg"}></i> </Button>
                </ButtonGroup>

                <Dropdown>
                    <Button type="button" data-bs-toggle="dropdown" aria-expanded="false" className="border-0"
                    style={{background: 'transparent'}}>
                    <Image src={user.role === 'User' ? user.gender === 'male' ? placeholder_m : user.gender === 'female' ? placeholder_f : Others :
                    imageMap[imageName] } className="mx-2 profile-avatar"/>
                    </Button>

                    <ul className="dropdown-menu dropdown-menu-end">
                        <Dropdown.Item as={Link} to={`/user/${user.id}`}>Profile</Dropdown.Item>
                        <Dropdown.Item href="logout">Logout</Dropdown.Item>
                    </ul>
                </Dropdown>
            </Container>

            <Modal show={open} size="lg" className="mt-auto" centered onHide={closeModal}>
                <Modal.Header closeButton className='py-3 text-bg-secondary text-center h3'>Create A New Post</Modal.Header>
                <Container fluid className="d-flex flex-column px-4 my-4 justify-content-between align-items-center text-bg-light">
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
    )
}