import * as PropTypes from "prop-types";
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import AppNavbar from "../components/AppNavbar";
import image2 from "../static/images/about_us/pexels-anete-lusina-5723269.jpg";
import image3 from "../static/images/about_us/pexels-anna-shvets-4672438.jpg";
import image1 from "../static/images/about_us/pexels-shvets-production-7176325.jpg";
import { useContext } from "react";
import UserContext from "../UserContext";
import { Link } from "react-router-dom";

function AboutUsCard(props) {
    return <Card className={props.className}>
        <Card.Body className={"d-flex flex-column align-items-center justify-content-center "}>
            <Card.Title className={"fw-bold"}>{props.title}</Card.Title>
            <Card.Subtitle className={"w-100"}>{props.text}</Card.Subtitle>
        </Card.Body>
    </Card>;
}

AboutUsCard.propTypes = {className: PropTypes.string};
const About = () => {
    const about_card = "about-us-card border-0 m-2 flex-grow-1 shadow-sm";
    const { user } = useContext(UserContext)
    return ( 
        <Container fluid >
            <Row className='d-flex flex-row '>
                {user.id !== null ?
                <Col lg={2}>
                    <AppNavbar/>
                </Col> : <Button as={Link} to='/' className="back-btn sticky-top">return to oasis</Button>}
                <Col>
                    <Container fluid className={" rounded-4 my-4"} >
                        <Container className="d-flex flex-row p-4  ">
                            <Row className={"align-items-center justify-content-between shadow rounded-4 text-bg-light"}>
                                <Col lg={6} >
                                    <h4 className={"about-us-label"}>who we are</h4>
                                    <p>oasis is a safe space for women in colleges and universities to come together—an
                                        oasis for their thoughts, experiences, and sufferings to be validated and given
                                        support.</p>
                                </Col>
                                <Col>
                                    <Image className="img-fluid p-2" src={image1}/>
                                </Col>
                            </Row>
                        </Container>

                        <Container className="d-flex flex-column p-4 align-items-center text-center  text-bg-light">
                            <p>oasis will provide an avenue for women to</p>
                            <Row className={"flex-nowrap overflow-auto w-100 text-white "}>
                                <AboutUsCard className={about_card} title={"feel safe"} text={"when sharing stories"}/>
                                <AboutUsCard className={about_card} title={"seek refugee"} text={"from psychiatrists"}/>
                                <AboutUsCard className={about_card} title={"find solace"} text={"in a community"}/>

                            </Row>
                        </Container>

                        <Container className="d-flex flex-row-reverse p-4 ">
                            <Row className={"align-items-center justify-content-between flex-row-reverse shadow rounded-4 text-bg-light"}>
                                <Col lg={6}>
                                    <h4 className={"about-us-label"}>mission</h4>
                                    <p>To provide a safe haven for women and young girls in schools and universities to
                                        seek refuge in, where they can form a community with shared experiences, all
                                        while being provided with proper access to help with their mental, emotional,
                                        and psychological needs.</p>
                                </Col>
                                <Col>
                                    <Image className="img-fluid p-2" src={image2}/>
                                </Col>
                            </Row>
                        </Container>

                        <Container className="d-flex flex-row p-4">
                            <Row className={"align-items-center justify-content-between shadow rounded-4 text-bg-light"}>
                                <Col lg={6}>
                                    <h4 className={"about-us-label"}>vision</h4>
                                    <p>To be a catalyst of change in pushing for a VAW-free society and act as a
                                        frontline service provider for struggling female students who experienced forms
                                        of abuse in universities and schools nationwide.</p>
                                </Col>
                                <Col>
                                    <Image className="img-fluid p-2" src={image3}/>
                                </Col>
                            </Row>
                        </Container>
                    </Container>
                </Col>
            </Row>

        </Container>
    );
}
 
export default About;