import { Card, Col } from "react-bootstrap";
import category_placeholder from "../static/images/pexels-elīna-arāja-3570362.jpg";

export default function CategoryCard(){
    return(
        <Col lg={4} >
            <Card className={"category-card "}>
                    <Card.Img src={category_placeholder}  />
                    <Card.ImgOverlay><h5 >Mental Health</h5></Card.ImgOverlay>

            </Card>
        </Col>
    );
}