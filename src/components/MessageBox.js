import '../index.css';
import {
    Container,
    ListGroup,
    Button, Image
} from 'react-bootstrap';
import Chat from "../components/Chat";
import TextareaAutosize from "react-textarea-autosize";
import send from "../static/images/send.svg";
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import UserContext from '../UserContext';
import ScrollToBottom from 'react-scroll-to-bottom';
import Swal from 'sweetalert2'
import { useContext } from 'react';

export default function MessageBox({status, blocked_by}) {
    const { user } = useContext(UserContext)
    const params = useParams()
    const [chatHistory, setChatHistory] = useState([])
    const [message, setMessage] = useState("")
    const [active, setActive] = useState(false)


    function sendMessage(e) {
        e.preventDefault()
        
        fetch(`http://localhost:4000/contact/viewContactDetails/${params.contact_id}`, {
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }}).then(res => res.json())
            .then(data => {
                if(data){
                    fetch(`http://localhost:4000/contact/sendMessage/${data[0].user_id}`, {
                        method : 'POST',
                        headers : {
                            'Content-Type' : 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({
                            content: message,
                            sender_id: user.id,
                            contact_id: params.contact_id
                        })
                        }).then(res => res.json())
                        .then(data => {
                            data ?
                            setMessage('')
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
                })}          
            })
    }

    useEffect(() => {
        fetch(`http://localhost:4000/contact/viewMessages/${params.contact_id}`,
        {method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
        }
        )
        .then(res => res.json())
        .then(data => {
            setChatHistory(data.map(message => {
                return(
                    <Chat key={message.message_id} chatProp= {message}/>            
                )
            }))
        })

        message !== '' ? setActive(true) : setActive(false)        
    }, [chatHistory, params, message])

    return(
        <Container >
            <ScrollToBottom className="chat-box d-flex flex-column ">
            <ListGroup className="py-5 ">
                {chatHistory}
            </ListGroup>
            </ScrollToBottom>
            {status !== 'BLOCKED' ?
            <Container fluid className="d-flex flex-row flex-nowrap align-items-center justify-content-between">
                <TextareaAutosize className="w-100 rounded-3 border-1 p-2"
                    onChange = {e => setMessage(e.target.value)}
                    value={message}
                    onKeyDown={(e) => (
                    e.key === 'Enter' ? {sendMessage} : null
                )}
                />
                <Button className="ms-2 rounded-5 text-center"
                onClick={sendMessage}
                disabled={!active}
                ><Image src={send} className={"img-fluid "}/></Button>
            </Container>
            :
            <Container className='pt-4'>
                {blocked_by === user.id ? 
                    <p className='text-muted blocked-text'>Contact blocked. You can no longer send or receive messages from this contact unless you unblock them.</p>
                    :
                    <p className='text-muted blocked-text'>You've been blocked. You can no longer send or receive messages from this contact.</p>
                    }
            </Container>}
        </Container>
        
    );
}