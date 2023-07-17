import dayjs from "dayjs";
import { useContext } from "react";
import { Col, Image, ListGroupItem, Row } from "react-bootstrap";
import UserContext from "../UserContext";
import Admin_f from "../static/images/admin_placeholder_f.svg";
import Admin_m from "../static/images/admin_placeholder_m.svg";
import Therapist_f from "../static/images/dr_placeholder_f.svg";
import Therapist_m from "../static/images/dr_placeholder_m.svg";
import User_f from "../static/images/nonuser_f.svg";
import User_m from "../static/images/nonuser_m.svg";
import Others from "../static/images/other_placeholder.svg";

export default function Chat({chatProp}){

    const { user } = useContext(UserContext)
    const { content, message_date, sender_id, sender_gender, sender_role } = chatProp
    
    const isUser = sender_id === user.id

    const relativeTime = require('dayjs/plugin/relativeTime')
    dayjs.extend(relativeTime)

    const time = dayjs(message_date).format(`hh:mm A`)
    const date = dayjs(message_date).format(`DD MMM YYYY`)
    const relative = dayjs(message_date).fromNow()

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
    const imageName = `${sender_role}_${sender_gender}`;

    return(
        <ListGroupItem className={"border-0"}>
            {isUser && <Row className={" d-flex align-items-center   flex-row-reverse justify-content-end "}>
                <Col md={2} className={"text-center"}>
                <Image className='chat-avatar' src={imageMap[imageName]} /></Col>
                <Col md={8} className={"text-end d-flex flex-column align-items-end justify-content-end"}>
                    <Row className="d-flex">
                        <p className="p-2 border border-1 rounded-5 fit-content m-0"> {content} </p>
                    </Row>
                    <Row className="d-flex">
                        <p small className="text-muted message-date">{time}, {date} ({relative})</p>
                    </Row>
                </Col>
                <Col md={2} className="text-end">
                </Col>

            </Row>}
            {!isUser && <Row className={" d-flex align-items-center   "}>
                <Col md={2} className={"text-center"}><Image className='chat-avatar' src={imageMap[imageName]} /></Col>
                <Col md={8} className={"text-end d-flex flex-column align-items-start justify-content-end"}>
                    <Row className="d-flex">
                        <p className="p-2 border border-1 rounded-5 fit-content m-0"> {content} </p>
                    </Row>
                    <Row className="d-flex">
                        <p small className="text-muted message-date">{time}, {date} ({relative})</p>
                    </Row>
                </Col>
                <Col lg={2}></Col>
            </Row>}
        </ListGroupItem>
        )
};
