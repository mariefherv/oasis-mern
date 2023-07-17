import { Container } from "react-bootstrap";
export default function Error(){
    return(
        <>
            <Container fluid className={"error_page"}>
                <div className={"d-flex align-items-center justify-content-center vh-100 "}>
                    <Container className={"text-center my-auto"}>
                        <div className={"h2"}> Oh no! You can't access this page.</div>
                        <p>Redirecting you to homepage in 5 seconds...</p>
                    </Container>
                </div>
            </Container>
        </>
    );
}