import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Container, Dropdown, Image, ListGroupItem, Modal, Row, Spinner } from "react-bootstrap";
import DropdownItem from "react-bootstrap/DropdownItem";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Admin_f from "../static/images/admin_placeholder_f.svg";
import Admin_m from "../static/images/admin_placeholder_m.svg";
import Therapist_f from "../static/images/dr_placeholder_f.svg";
import Therapist_m from "../static/images/dr_placeholder_m.svg";
import User_f from "../static/images/nonuser_f.svg";
import User_m from "../static/images/nonuser_m.svg";
import Others from "../static/images/other_placeholder.svg";
import Typewriter from 'typewriter-effect';


export default function Booking({bookingProp, tab}){

    const { username, gender, role, availability, booking_id, user_id, date, time, confirmation, denied} = bookingProp

    const [contactId, setContactId] = useState(null)

    let [humanizedDate, setHumanizedDate] = useState('')
    let [humanizedTime, setHumanizedTime] = useState('')

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setHumanizedDate(dayjs(new Date(date)).format('MMMM DD'))
        setHumanizedTime(dayjs(time, 'HH:mm:ss').format('hh:mm A'))

    }, [booking_id, date, time]
    
    )

    function confirm(e){
        e.preventDefault()
        setLoading(true)

        fetch(`http://localhost:4000/booking/confirmBooking/${booking_id}`, {
            method : 'PATCH',
            headers : {
                'Content-Type' : 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                contact_person_id: user_id
            })
            }).then(res => res.json())
            .then(data => {
                if(data) {
                setContactId(data.contact_id)
                Swal.fire({
                    title: "Appointment confirmed!",
                    icon: "success",
                    text: "You can now reach out to each other.",
                    iconColor: '#3A3530',
                    color: '#3A3530',
                    confirmButtonText: "OK",
                    buttonsStyling: false,
                    customClass: {
                        confirmButton: 'button2'
                    }
                }).then(setLoading(false))
                } else {
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
            }
        })
    }

    function deny(e){
        e.preventDefault()
        setLoading(true)

        fetch(`http://localhost:4000/booking/denyBooking/${booking_id}`, {
            method : 'PATCH',
            headers : {
                'Content-Type' : 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                contact_person_id: user_id
            })
            }).then(res => res.json())
            .then(data => {
                data ?
                Swal.fire({
                    title: "Appointment denied.",
                    icon: "success",
                    text: "We understand that you have your reasons for declining.",
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


    return(
        <ListGroupItem className={"border-0 my-1"}>
        <Container>
            {!availability ?
            <Row>
                <Col sm={6} className="d-flex align-items-center">
                    <Col sm={1} className="d-flex align-items-center">
                        <Image src={imageMap[imageName]}
                        className={"img-fluid slot-img"}></Image>
                    </Col>
                    <Col className="px-4">

                        <Row>
                            <Dropdown>
                                <DropdownToggle className={"border-start border-2 rounded-0 username"}>{username}</DropdownToggle>
                                <DropdownMenu  >
                                    <DropdownItem as={Link} to={`/user/${user_id}`} className={"ps-4"}><i
                                        className="bi bi-person-fill pe-3"></i>View Profile</DropdownItem>
                                    <DropdownItem className={"ps-4"} onClick={()=>{}}><i className={"bi bi-person-add pe-3"}></i>Add</DropdownItem>
                                    <DropdownItem onClick={()=>{}} className={"ps-4"}><i className="bi bi-x-circle pe-3"></i>Block</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </Row>
                    </Col>
                </Col>
                <Col sm={2} className="d-flex align-items-center">
                    <small className="text-muted"> {humanizedDate} ({humanizedTime}) </small>
                </Col>
                <Col sm={2} className="d-flex align-items-center justify-content-start" >
                    {confirmation ?
                        <small className="text-muted"><em>confirmed</em></small>
                        :
                        null
                    }
                    {denied ? <small className="text-muted"><em>denied</em></small> : null}
                    {!confirmation && !denied ?
                        <ButtonGroup>
                            <Button className="deny-button" onClick={deny}>Deny</Button>
                            <Button onClick={confirm}>Confirm</Button>
                        </ButtonGroup>
                        :
                        null
                    }

                </Col>
                {!denied &&
                <Col sm={2} className={"d-flex align-items-center justify-content-end"}>
                    <Link as={"button"} to={"/chats/"+contactId} className={"btn ms-3 border"}><i className={"bi bi-chat-dots-fill text-white"}></i></Link>
                </Col>}
            </Row>
            :
            <Row>
                <Col sm={6} className="d-flex align-items-center">
                    <small className="text-muted">There are no bookings for this slot.</small>
                </Col>
                <Col sm={2} className="d-flex align-items-center">
                    <small className="text-muted"> {humanizedDate} ({humanizedTime}) </small>                 </Col>
                <Col sm={4} className="d-flex align-items-center justify-content-end">
                </Col>
            </Row>
            }

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
        </ListGroupItem>
        )
};
