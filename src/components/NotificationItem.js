import { useContext, useEffect, useState } from "react";
import { Button, Dropdown, Image, ListGroupItem } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UserContext from "../UserContext";
import { confirmContact, declineContact } from "../functions/contactFunctions";
import Admin_f from "../static/images/admin_placeholder_f.svg";
import Admin_m from "../static/images/admin_placeholder_m.svg";
import Therapist_f from "../static/images/dr_placeholder_f.svg";
import Therapist_m from "../static/images/dr_placeholder_m.svg";
import User_f from "../static/images/nonuser_f.svg";
import User_m from "../static/images/nonuser_m.svg";
import Others from "../static/images/other_placeholder.svg";
import placeholder_f from "../static/images/user_placeholder_f.svg";
import placeholder_m from "../static/images/user_placeholder_m.svg";

const NotificationItem = ({notificationProp, modal}) => {

    const { user, setUser } = useContext(UserContext)

    const { triggered_by, notification_id, triggered_by_username, type, marked_read, contact_id, post_id, like_count, user_username, comment_id, comment_count, prefix, last_name, triggered_by_gender, triggered_by_role } = notificationProp

    const [new_type, setNewType] = useState(type)
    const [readStatus, setReadStatus] = useState(marked_read)

    const [post, setPost] = useState(null)
    const [comment, setComment] = useState(null)

    const texts = [
        {
            type: 'like_post',
            text: like_count > 1 ?
            `@${triggered_by_username} and ${like_count-1} others liked your post ${post ? `"${post.subject}"` : ''}`
            : `@${triggered_by_username} liked your post ${post ? `"${post.subject}"` : ''}`
        },
        {
            type: 'like_comment',
            text: like_count > 1 ?
            `@${triggered_by_username} and ${like_count-1} others liked your comment ${comment ? `"${comment.content}"` : ''} on ${user_username}'s post ${post ? `"${post.subject}"` : ''}`
            : `@${triggered_by_username} liked your comment ${comment ? `"${comment.content}"` : ''} on ${user_username}'s post ${post ? `"${post.subject}"` : ''}`
        },
        {
            type: 'comment',
            text: comment_count > 1 ?
            `@${triggered_by_username} and ${comment_count-1} others commented on your post ${post ? `"${post.subject}"` : ''}`
            : `@${triggered_by_username} commented on your post ${post ? `"${post.subject}"` : ''}`
        },
        {
            type: 'contact_request',
            text: `@${triggered_by_username} has requested to add you as a contact`
        },
        {
            type: 'contact_confirmed_user',
            text: `@${triggered_by_username} has requested to add you as a contact.`
        },
        {
            type: 'contact_confirmed_triggered_by',
            text: `@${triggered_by_username} has accepted your contact request.`
        },
        {
            type: 'booking',
            text: `@${triggered_by_username} has booked a session with you.`
        },
        {
            type: 'confirm_booking',
            text: `${prefix} ${last_name} has confirmed your appointment! You may now reach out to them.`
        },
        {
            type: 'decline_booking',
            text: `Sorry, ${prefix} ${last_name} has declined your set appointment. Check our counselling page for more available slots.`
        },
        {
            type: 'slots',
            text: `${prefix} ${last_name} has added new appointment slots. Check them out now!`
        },
    ]

    function notificationText(notifType){
        const notif = texts.find(text => text.type === notifType)
        return notif.text
    }

    function confirm(e){
        e.preventDefault()
        e.stopPropagation()
        
        confirmContact(triggered_by)
        setNewType('contact_confirmed_user')
    }

    function decline(e){
        e.preventDefault()
        e.stopPropagation()
        
        declineContact(triggered_by)
        setNewType('contact_declined')
    }

    function markRead(e){
        e.preventDefault()

        fetch(`https://oasis-api-nocv.onrender.com/notifications/markRead/${notification_id}`, {
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
            if(data) {
                setReadStatus(data)
                setUser({has_notifications: false})
            }
        }
        )
    }

    const location = useNavigate();

    const goToLink = (type, id) => {
        location(`/${type}/${id}`)
    }

    useEffect(() => {
        if(post_id){
            fetch(`https://oasis-api-nocv.onrender.com/post/view/${post_id}`,
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
                data.length !== 0 ? setPost(data[0]) : setPost(null)
            })
        }

        if(comment_id){
            fetch(`https://oasis-api-nocv.onrender.com/post/comment/view/${comment_id}`,
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
                if(data.length !== 0){
                    setComment(data[0])

                    fetch(`https://oasis-api-nocv.onrender.com/post/view/${data[0].post_id}`,
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
                        data.length !== 0 ? setPost(data[0]) : setPost(null)
                    })
                }
                
            })
        }
    })

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
        const imageName = `${triggered_by_role}_${triggered_by_gender}`;

    return (
        <>
        <ListGroupItem className={readStatus ? "notif p-3" : "p-3 notif-unread"} onMouseEnter={!modal ? markRead : null}>
        {new_type === 'contact_request' &&
            <div className="d-flex flex-row flex-nowrap align-items-center " onClick={e=> goToLink('user',triggered_by)}>
                <span><Image src={user.id === triggered_by ?
                 user.role === 'User' ? user.gender === 'male' ? placeholder_m : user.gender === 'female' ? placeholder_f : Others 
                 :
                 imageMap[imageName] : imageMap[imageName]}
                className={"img-fluid pe-3 notification-avatar"}/></span>
                <span>
                    <div className="d-flex flex-row w-100 align-items-center">
                        <h6>{notificationText(new_type)}</h6>
                    </div>
                    <div className="d-flex flex-row w-100 align-items-center">
                        <Button className = 'mx-2' onClick={confirm}>Confirm</Button>
                        <Button className = 'mx-2 deny-button' onClick={decline}>Decline</Button>
                    </div>
                </span>
                <span className="d-flex flex-grow-1 justify-content-end">
                <Dropdown onClick={e => e.stopPropagation()}>
                    <Button className="border-0 post-options" type="button" data-bs-toggle="dropdown" aria-expanded="false" >
                        <i className="bi bi-three-dots"></i> 
                    </Button>
                        <ul className="dropdown-menu" >
                        <Dropdown.Item onClick={e=> goToLink('user',triggered_by)}>View profile</Dropdown.Item>
                        <Dropdown.Item>Block user</Dropdown.Item>
                    </ul>
                    </Dropdown>
                </span>
            </div>}
        {new_type === 'contact_confirmed_user' &&
            <div className="d-flex flex-row flex-nowrap align-items-center " onClick={e=> goToLink('user',triggered_by)}>
                <span><Image src={user.id === triggered_by ?
                 user.role === 'User' ? user.gender === 'male' ? placeholder_m : user.gender === 'female' ? placeholder_f : Others 
                 :
                 imageMap[imageName] : imageMap[imageName]} className={"img-fluid pe-3 notification-avatar"}/></span>
                <span>
                    <small className="text-muted"><em>{notificationText(new_type)}</em></small>
                    <h6> Request confirmed. </h6>
                </span>
                <span className="d-flex flex-grow-1 justify-content-end">
                <Dropdown onClick={e => e.stopPropagation()}>
                    <Button className="border-0 post-options" type="button" data-bs-toggle="dropdown" aria-expanded="false" >
                        <i className="bi bi-three-dots"></i> 
                    </Button>
                        <ul className="dropdown-menu" >
                        <Dropdown.Item onClick={e=> goToLink('user',triggered_by)}>View profile</Dropdown.Item>
                        <Dropdown.Item>Block user</Dropdown.Item>
                    </ul>
                    </Dropdown>
                </span>     
            </div>}
        {new_type === 'contact_confirmed_triggered_by' &&
            <div className="d-flex flex-row flex-nowrap align-items-center " onClick={e=> goToLink('user',triggered_by)}>
                <span><Image src={user.id === triggered_by ?
                 user.role === 'User' ? user.gender === 'male' ? placeholder_m : user.gender === 'female' ? placeholder_f : Others 
                 :
                 imageMap[imageName] : imageMap[imageName]} className={"img-fluid pe-3 notification-avatar"}/></span>
                <span>
                    <h6> {notificationText(new_type)} </h6>
                </span>
                <span className="d-flex flex-grow-1 justify-content-end">
                <Dropdown onClick={e => e.stopPropagation()}>
                    <Button className="border-0 post-options" type="button" data-bs-toggle="dropdown" aria-expanded="false" >
                        <i className="bi bi-three-dots"></i> 
                    </Button>
                        <ul className="dropdown-menu">
                        <Dropdown.Item onClick={e=> goToLink('user',triggered_by)}>View profile</Dropdown.Item>
                        <Dropdown.Item>Block user</Dropdown.Item>
                    </ul>
                </Dropdown>
                </span>
            </div>}
        {(new_type === 'contact_declined') &&
            <div className="d-flex flex-row flex-nowrap align-items-center " onClick={e=> goToLink('user', triggered_by)}>
                <span><Image src={user.id === triggered_by ?
                 user.role === 'User' ? user.gender === 'male' ? placeholder_m : user.gender === 'female' ? placeholder_f : Others 
                 :
                 imageMap[imageName] : imageMap[imageName]} className={"img-fluid pe-3 notification-avatar"}/></span>
                <span>
                    <small className="text-muted"><em>{notificationText("contact_request")}</em></small>
                    <h6> Request declined. </h6>
                </span>
                <span className="d-flex flex-grow-1 justify-content-end">
                <Dropdown onClick={e => e.stopPropagation()}>
                    <Button className="border-0 post-options" type="button" data-bs-toggle="dropdown" aria-expanded="false" >
                        <i className="bi bi-three-dots"></i> 
                    </Button>
                        <ul className="dropdown-menu" >
                        <Dropdown.Item onClick={e=> goToLink('user',triggered_by)}>View profile</Dropdown.Item>
                        <Dropdown.Item>Block user</Dropdown.Item>
                    </ul>
                </Dropdown>
                </span>
            </div>}
            {(new_type === 'like_post' || new_type === "comment") &&
            <div className="d-flex flex-row flex-nowrap align-items-center notif-view" onClick={e=> goToLink('post',post_id)}>
                <span><Image src={user.id === triggered_by ?
                 user.role === 'User' ? user.gender === 'male' ? placeholder_m : user.gender === 'female' ? placeholder_f : Others 
                 :
                 imageMap[imageName] : imageMap[imageName]} className={"img-fluid pe-3 notification-avatar"}/></span>
                <span>
                    <h6> {notificationText(new_type)} </h6>
                </span>
                <span className="d-flex flex-grow-1 justify-content-end">
                <Dropdown onClick={e => e.stopPropagation()}>
                    <Button className="border-0 post-options" type="button" data-bs-toggle="dropdown" aria-expanded="false" >
                        <i className="bi bi-three-dots"></i> 
                    </Button>
                        <ul className="dropdown-menu" >
                        <Dropdown.Item onClick={e=> goToLink('post',post_id)}>View profile</Dropdown.Item>
                        <Dropdown.Item>Block user</Dropdown.Item>
                    </ul>
                </Dropdown>
                </span>
            </div>}
            {(new_type === 'like_comment') &&
            <div className="d-flex flex-row flex-nowrap align-items-center notif-view" onClick={e=> goToLink('post',post_id)}>
                <span><Image src={user.id === triggered_by ?
                 user.role === 'User' ? user.gender === 'male' ? placeholder_m : user.gender === 'female' ? placeholder_f : Others 
                 :
                 imageMap[imageName] : imageMap[imageName]} className={"img-fluid pe-3 notification-avatar"}/></span>
                <span>
                    <h6> {notificationText(new_type)} </h6>
                </span>
                <span className="d-flex flex-grow-1 justify-content-end">
                <Dropdown onClick={e => e.stopPropagation()}>
                    <Button className="border-0 post-options" type="button" data-bs-toggle="dropdown" aria-expanded="false" >
                        <i className="bi bi-three-dots"></i> 
                    </Button>
                        <ul className="dropdown-menu" >
                        <Dropdown.Item onClick={e=> goToLink('post',post.post_id)}>View profile</Dropdown.Item>
                        <Dropdown.Item>Block user</Dropdown.Item>
                    </ul>
                </Dropdown>
                </span>
            </div>}
            {(new_type === 'slots' || new_type === 'decline_booking') &&
            <div className="d-flex flex-row flex-nowrap align-items-center notif-view" onClick={e=> goToLink('counselling','')}>
                <span><Image src={user.id === triggered_by ?
                 user.role === 'User' ? user.gender === 'male' ? placeholder_m : user.gender === 'female' ? placeholder_f : Others 
                 :
                 imageMap[imageName] : imageMap[imageName]} className={"img-fluid pe-3 notification-avatar"}/></span>
                <span>
                    <h6> {notificationText(new_type)} </h6>
                </span>
            </div>}
            {(new_type === 'booking') &&
            <div className="d-flex flex-row flex-nowrap align-items-center notif-view" onClick={e=> goToLink('therapist','')}>
                <span><Image src={user.id === triggered_by ?
                 user.role === 'User' ? user.gender === 'male' ? placeholder_m : user.gender === 'female' ? placeholder_f : Others 
                 :
                 imageMap[imageName] : imageMap[imageName]} className={"img-fluid pe-3 notification-avatar"}/></span>
                <span>
                    <h6> {notificationText(new_type)} </h6>
                </span>
            </div>}
            {(new_type === 'confirm_booking') &&
            <div className="d-flex flex-row flex-nowrap align-items-center notif-view" onClick={e=> goToLink('chats', contact_id)}>
                <span><Image src={user.id === triggered_by ?
                 user.role === 'User' ? user.gender === 'male' ? placeholder_m : user.gender === 'female' ? placeholder_f : Others 
                 :
                 imageMap[imageName] : imageMap[imageName]} className={"img-fluid pe-3 notification-avatar"}/></span>
                <span>
                    <h6> {notificationText(new_type)} </h6>
                </span>
            </div>}
        </ListGroupItem>
        </> 
    );
}

export default NotificationItem;