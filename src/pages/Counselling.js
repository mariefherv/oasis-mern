import { useEffect, useState } from 'react';
import {
    Col,
    Container,
    FormLabel,
    FormSelect,
    ListGroup,
    Row,
    Spinner
} from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import ConsultationCard from "../components/ConsultationCard";
import TherapistCard from "../components/TherapistCard";
import '../index.css';


export default function Counselling() {

    const [therapists, setTherapists] = useState([])
    const [upcomingBookings, setUpcomingBookings] = useState([])
    const [pastBookings, setPastBookings] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [upcomingLoading, setUpcomingLoading] = useState(true)
    const [recentLoading, setRecentLoading] = useState(true)

    const location = useLocation()
    const history = useNavigate()

    const getConsultation = new URLSearchParams(location.search).get('consultation')

    const [consultation, setConsultation] = useState(getConsultation ? getConsultation : '')

    function sortConsultation(val){
        setConsultation(val)        
        val !== '' ? 
        history(`${location.pathname}?consultation=${val}`)
        : history(`${location.pathname}`)
    }

    const getAvailability = new URLSearchParams(location.search).get('availability')

    const [availability, setAvailability] = useState(getAvailability ? getAvailability : '')

    function sortAvailability(val){
        setAvailability(val)        
        val !== '' ? 
        history(`${location.pathname}?availability=${val}`)
        : history(`${location.pathname}`)
    }

    const [view, setView] = useState('')
    
    useEffect(() => {
        if(consultation !== '' && availability !== '') {
            setView(`viewAllByConsultationAvailability/${consultation}/${availability}`)
        } else if(consultation !== '') {
            setView(`viewAllByConsultation/${consultation}`)
        } else if(availability !== '') {
            setView(`viewAllByAvailability/${availability}`)
        } else {
            setView(`viewAll`)
        }

        fetch(`http://127.0.0.1:4000/therapist/${view}`,
        {method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
        }
        )
        .then(res => res.json())
        .then(data => {
            setIsLoading(false)
            setTherapists(data.map(therapist => {
                return(
                <TherapistCard key={therapist.therapist_id} therapistProp= {therapist}/>            
            )
        }))
        })

        fetch(`https://oasis-api-nocv.onrender.com/booking/retrieveConfirmedBookings`,
        {method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
        }
        )
        .then(res => res.json())
        .then(data => {
            setUpcomingLoading(false)
            data.length !== 0 ?
            setUpcomingBookings(data.map(booking => {
                return(
                <ConsultationCard key={booking.booking_id} bookingProp= {booking}/>            
            )
            }))
            :
            setUpcomingBookings(<small><em>You have no upcoming consultations.</em></small>)
        })
        

        fetch(`https://oasis-api-nocv.onrender.com/booking/retrievePastBookings`,
        {method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
        }
        )
        .then(res => res.json())
        .then(data => {
            setRecentLoading(false)
            data.length !== 0 ?
            setPastBookings(data.map(booking => {
                return(
                <ConsultationCard key={booking.booking_id} bookingProp= {booking}/>            
            )
            }))
            :
            setPastBookings(<small><em> You have no recent consultations.</em></small>)         

        })
    }, [availability, consultation, therapists, view])

    return (
        <Container fluid>
            <Row className='d-flex flex-row'>
                <Col lg={2} className=''>
                    <AppNavbar/>
                </Col>
                <Col className={'my-4 '}>
                    <p className={'fg-primary fw-bold display-6'}>connect with our therapists</p>
                    <Row className={'w-100 my-4'}>
                        <Col className={'d-flex flex-row align-items-center'}>
                            <FormLabel htmlFor={'sort-type'} className={'col-2'} >sort by</FormLabel>
                            <FormSelect id='sort-type'
                            onChange={e => {
                                    sortConsultation(e.target.value)
                            }}>
                                <option value = ''>-- choose consultation type --</option>
                                <option value = 'online'>online</option>
                                <option value = 'in_person'> in-person</option>
                            </FormSelect>
                        </Col>
                        <Col className={'d-flex flex-row align-items-center'}>
                            <FormLabel htmlFor={'availability'} className={'col-4'}>available dates</FormLabel>
                            <FormSelect id='availability'
                            onChange={e => {
                                    sortAvailability(e.target.value)
                            }}>
                                <option value = ''>-- no selected dates --</option>
                                <option value = 'day'> today </option>
                                <option value = 'week'> this week </option>
                                <option value = 'month'> this month </option>
                            </FormSelect>
                        </Col>
            </Row>

                    <ListGroup >
                        {isLoading ?
                            <div className={"flex-grow-1 w-100 text-center mt-3 mb-0"}>
                                <Spinner/>
                            </div>
                            :
                            therapists}
                    </ListGroup>
                </Col>
                <Col lg={3} >
                    <Container fluid className={'sticky-top'}>
                        <h5 className={'fg-primary pt-4'}>upcoming consultations</h5>
                        <ListGroup className={'my-2 overflow-auto counselling-bar'}>
                        {upcomingLoading ?
                            <div className={"flex-grow-1 w-100 text-center mt-3 mb-0"}>
                                <Spinner/>
                            </div>
                            :
                            upcomingBookings}
                        </ListGroup>
                        <h5 className={'fg-primary pt-4'}>recent consultations</h5>
                        <ListGroup className={'overflow-auto counselling-bar'}>
                            {recentLoading ?
                            <div className={"flex-grow-1 w-100 text-center mt-3 mb-0"}>
                                <Spinner/>
                            </div>
                            :
                            pastBookings}
                        </ListGroup>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}
