import { useContext } from "react";
import { Col, Container, Row } from "react-bootstrap";
import TherapistContext from "../TherapistContext";
import AppNavbar from "../components/AppNavbar";
import AppointmentList from "../components/AppointmentList";

export default function Therapist() {

    const { therapist } = useContext(TherapistContext)

    return(
        <Container fluid>
            <Row>
                <Col lg={2}><AppNavbar /></Col>
                <Col className={"me-5 mt-4"}>
                    <p className={'fg-primary fw-bold display-6'}>welcome, {therapist.prefix ? therapist.prefix : ''} {therapist.last_name}</p>
                    <AppointmentList/>
                </Col>
            </Row>
        </Container>
    );
}