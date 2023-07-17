import dayjs from "dayjs";
import { Col, Image, ListGroupItem, Row } from "react-bootstrap";
import Therapist_f from "../static/images/dr_placeholder_f.svg";
import Therapist_m from "../static/images/dr_placeholder_m.svg";
import Others from "../static/images/other_placeholder.svg";

export default function ConsultationCard({bookingProp}){

    const { prefix, last_name, gender, date, time, consultation_type } = bookingProp

    const humanizedDate = dayjs(date, 'YYYY-MM-DD').format('MMMM DD, YYYY (dddd)')
    const humanizedTime = dayjs(time, 'HH:mm:ss').format('hh:mm A')


    return(
        <ListGroupItem className={' p-4'} >
            <Row >
                <Col className={'col-4 d-flex flex-row align-items-center justify-content-center'}>
                    <Image src={gender === 'male' ? Therapist_m : gender === 'female' ? Therapist_f : Others} className='profile-avatar'></Image>
                </Col>
                <Col className={' '}>
                    <div className={'fw-bold'}>{prefix ? prefix : null} {last_name}</div>
                    <div >{humanizedDate}</div>
                    <small className={'fg-light'}><div>{humanizedTime}</div></small>
                    <br/>
                    <small className={'text-muted'}><div >{consultation_type === 'online' ? 'Online Consultation' : 'In-person Consultation'}</div></small>
                </Col>
            </Row>
        </ListGroupItem>
    );
}