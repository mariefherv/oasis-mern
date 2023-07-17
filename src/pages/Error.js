import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Error(){
    const[time,setTime] = useState(5)
    const location = useNavigate()

    useEffect(() => {
        let timerInterval = setTimeout(() => setTime(time-1), 1000)

        if(time===0){
            location("/home");
        }

        return () => {
            clearTimeout(timerInterval)
        }
    })

    return(
        <>
            <Container fluid className={"error_page"}>
                <div className={"d-flex align-items-center justify-content-center vh-100 "}>
                    <Container className={"text-center my-auto"}>
                        <div className={"h2"}> Oh no! You can't access this page.</div>
                        <p>Redirecting you to homepage in {time} {time > 1 ? 'seconds' : 'second'}...</p>
                    </Container>
                </div>
            </Container>
        </>
    );
}