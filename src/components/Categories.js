
import { Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";


export default function Categories() {
    return <Container fluid className={" my-3 mb-2 "}>
        <div className={" p-2 overflow-hidden carousel"}>
            <div className={"d-flex flex-row justify-content-between align-items-end mb-2 w-100"}>
                <h5>categories</h5>
                    <Link className={"text-secondary"} > show all </Link>
            </div>

            <Row className={"flex-nowrap overflow-scroll   "}>
                <CategoryCard/>
                <CategoryCard/>
                <CategoryCard/>
                <CategoryCard/>
                <CategoryCard/>
                <CategoryCard/>
                <CategoryCard/>

            </Row>
        </div>
    </Container>;
}