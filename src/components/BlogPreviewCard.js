import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function BlogPreviewCard() {
    const article_title="END ONLINE ABUSE";
    const article_summary="We’re campaigning for the reforms of laws relating to online abuse and robust regulation of the tech platforms perpetrators use, so those responsible are held accountable.";
    const blog_image = "https://www.endviolenceagainstwomen.org.uk/wp-content/uploads/2022/11/EVAW-and-Glitch-04b.png";
    const article_link = "https://asiapacific.unwomen.org/en/countries/pakistan/ending-violence-against-women-evaw";


    return(
        <Card className={"text-bg-white"}>
            <Card.Header >
            <h6>featured article</h6>

                <Card.Img className="img-fluid" src={blog_image}></Card.Img>
            </Card.Header>
            <Card.Body >
                <Card.Title>{article_title}</Card.Title>
                <Card.Text>
                    {article_summary}
                </Card.Text>
            </Card.Body>
            <Card.Footer >
                <Link to={article_link} className={'nav-link'}>Read More</Link>
            </Card.Footer>

        </Card>
    );
}