import { useContext, useEffect, useState } from 'react';
import {
    Col,
    Container, Dropdown, Image,
    ListGroup,
    Row,
    Spinner
} from 'react-bootstrap';
import DropdownItem from "react-bootstrap/DropdownItem";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import { useParams } from 'react-router-dom';
import UserContext from '../UserContext';
import AppNavbar from '../components/AppNavbar';
import ContactItem from "../components/ContactItem";
import MessageBox from '../components/MessageBox';
import { addContact, blockContact, removeContact, unblockContact } from '../functions/contactFunctions';
import '../index.css';
import person_add from "../static/images/person/person-add.svg";
import person_remove from "../static/images/person/person-dash.svg";
import x_circle from "../static/images/x-circle.svg";


export default function Messaging() {
    const contact_id = useParams()

    const { user } = useContext(UserContext)

    const [contacts, setContacts] = useState([])
    const [activeContact, setActiveContact] = useState("")
    const [status, setStatus] = useState("INACTIVE")
    const [blocked_by, setBlockedBy] = useState(null)
    const [role, setRole] = useState('')
    const [prefix, setPrefix] = useState('')
    const [last_name, setLastName] = useState('')
    const [suffix, setSuffix] = useState('')

    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        fetch(`https://oasis-api-nocv.onrender.com/contact/viewAll`,
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
            setLoading(false)
            setContacts(data.map(contact => {
                return contact.status === 'ACTIVE' ?
                <ContactItem key={contact.contact_id} contactProp= {contact} active = {activeContact.username}/>            
                : null
            }))
        })

        fetch(`https://oasis-api-nocv.onrender.com/contact/viewContactDetails/${contact_id.contact_id}`,
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
            if(data.length !== 0) {
                setActiveContact(data[0])
                setStatus(data[0].status)
                setBlockedBy(data[0].blocked_by)
                setRole(data[0].role)
                setPrefix(data[0].prefix)
                setLastName(data[0].last_name)
                setSuffix(data[0].suffix)
            }
        })
    }, [contacts, contact_id, activeContact])

    function add(e){
        e.preventDefault()
        setStatus(addContact(activeContact.user_id))
    }

    function remove(e){
        e.preventDefault()
        setStatus(removeContact(activeContact.user_id))
    }
    
    function block(e){     
        e.preventDefault()
        setStatus(blockContact(activeContact.user_id))
    }

    function unblock(e){
        e.preventDefault()
        setStatus(unblockContact(activeContact.user_id))
    }

    return (
   
        <Container fluid>
            {loading ?
            <div className={"flex-grow-1 w-100 text-center mt-3 mb-0"}>
                <Spinner/>
            </div>
            :
            <Row className='d-flex flex-row'>
                <Col lg={2} className=''>
                    <AppNavbar/>
                </Col>
                <Col className='my-4 '>
                    <p className='fg-primary fw-bold display-6'>connect</p>
                    <Row>
                        <Col lg={4}>
                            <h5>active chats</h5>
                            <ListGroup id="chat-list" className={"p-2 bg-light "}>
                                {contacts}
                            </ListGroup>
                        </Col>
                        <Col  className={" px-0 me-4 pb-2 border border-2 rounded-3 bg-light"}>
                            <div className={"border-bottom shadow-sm d-flex align-items-center justify-content-center bg-secondary py-4 fw-bold  "}>
                                <Dropdown>
                                    <DropdownToggle className={"username  "}>
                                        {role !== 'Therapist' ? `@${activeContact.username}` : `${prefix ? prefix : ''} ${last_name} ${suffix ? suffix : ''}`}
                                    </DropdownToggle>
                                    <DropdownMenu  >
                                    {role === 'User' && 
                                    <DropdownItem onClick={""}  className={"ps-4"}><Image src={person_add} className={"pe-3"}></Image>View Profile</DropdownItem>}
                                    <Dropdown.Header>contact</Dropdown.Header>
                                    {(status === 'INACTIVE' && role !== 'Therapist') &&
                                        <DropdownItem onClick={add}  className={"ps-4"}><Image src={person_add} className={"pe-3"}></Image>Add</DropdownItem>}

                                    {status === 'ACTIVE' && <DropdownItem onClick={remove} className={"ps-4"}><Image src={person_remove} className={"pe-3"}></Image>Remove</DropdownItem>}
                                    
                                    {(status !== 'BLOCKED')&& <DropdownItem onClick={block} className={"ps-4"}><Image src={x_circle} className={"pe-3"}></Image>Block</DropdownItem>}

                                    {(status === 'BLOCKED' && blocked_by === user.id) && <DropdownItem onClick={unblock} className={"ps-4"}><Image src={x_circle} className={"pe-3"}></Image>Unblock</DropdownItem>}
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                            <MessageBox status={status} blocked_by={blocked_by}/>
                        </Col>
                    </Row>
                </Col>

            </Row>}
        </Container>
    );
}
