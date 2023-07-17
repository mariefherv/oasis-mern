import { FormControl, FormGroup, InputLabel, MenuItem, Select } from "@mui/material";
import { DateCalendar, DateField } from "@mui/x-date-pickers";
import { parse } from "date-fns";
import dayjs from 'dayjs';
import { useEffect, useState } from "react";
import { Button, Col, Form, Image, ListGroupItem, Modal, ModalBody, ModalTitle, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Therapist_f from "../static/images/dr_placeholder_f.svg";
import Therapist_m from "../static/images/dr_placeholder_m.svg";
import fb from '../static/images/facebook.svg';
import lnk from '../static/images/linkedin.svg';
import Others from "../static/images/other_placeholder.svg";
import thumbs_up from '../static/images/thumbs_up.svg';
import twt from '../static/images/twitter.svg';

export default function TherapistCard({therapistProp}){

    const {therapist_id, prefix, first_name, last_name, suffix, field, description, online, in_person, fb_link, twt_link, li_link, user_therapist_id, gender} = therapistProp

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    
    const maxSteps = 3;
    const [currentStep, setCurrentStep] = useState(1);
    const [mode, setMode] = useState('')
    const [date, setDate] = useState(null)
    const [time, setTime] = useState(null)
    const [openCalendar, setOpenCalendar] = useState(false)
    const [datetime, setDateTime] = useState('')
    const [slot_id, setSlotID] = useState(null)
    const [active, setActive] = useState(false)
    const [timeslots, setTimeslots] = useState([])
    const [days, setDays] = useState([])

    const [available, setAvailable] = useState(false)

    let [humanizedDate, setHumanizedDate] = useState('')
    let [humanizedTime, setHumanizedTime] = useState('')

    const tomorrow = dayjs().add(1, 'day')

    const handleInputChange = (e) => {
        setMode(e.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if(currentStep === 2) {
            setCurrentStep(currentStep + 1);
            fetch(`http://localhost:4000/therapist/getSlotsByDate/${therapist_id}`, {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    date: dayjs(date).format('YYYY-MM-DD'),
                    time: dayjs(time, 'hh:mm A').format('HH:mm:ss')
                })
                }).then(res => res.json())
                .then(data => {
                    console.log(data)
                    if(data.length !== 0) {
                        const datetime = parse(data[0].date.concat(" ", data[0].time), 'yyyy-MM-dd HH:mm:ss', new Date());
                        console.log(datetime)
                        setSlotID(data[0].slot_id)
                        setDateTime(datetime)
                    }
                })
        } else if (currentStep < maxSteps) {
            setCurrentStep(currentStep + 1);
        } else {
            fetch(`http://localhost:4000/booking/bookSlot/${slot_id}`, {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    therapist_id: therapist_id,
                    consultation_date: datetime,
                    user_therapist_id: user_therapist_id,
                    consultation_type: mode
                })
                }).then(res => res.json())
                .then(data => {
                    data ?
                    Swal.fire({
                        title: "Successfully booked!",
                        icon: "success",
                        text: `Please wait on the confirmation of ${prefix} ${last_name}.`,
                        iconColor: '#3A3530',
                        color: '#3A3530',
                        confirmButtonText: "OK",
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: 'button2'
                        }
                    })
                    :
                    Swal.fire({
                        title: "Oh No!",
                        icon: "error",
                        text: "Something went wrong :( Please try again!",
                        iconColor: '#3A3530',
                        color: '#3A3530',
                        confirmButtonText: "OK",
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: 'button2'
                        }
                })
            })
            setTime('')
            setDate(null)
            setSlotID(null)
            setCurrentStep(1)
            handleClose()
            }
        };

    const handleBack = () => {
        setCurrentStep(currentStep - 1);
    }

    useEffect(() => {
        setHumanizedTime(dayjs(time).format('hh:mm A'))
        setHumanizedDate(dayjs(new Date(date)).format('MMMM DD[,] YYYY'))

        setDateTime(new Date(humanizedDate.concat(" "+humanizedTime)))

        time !== null && date !== null ? setActive(true) : setActive(false)

        if(date !== null) {
            fetch(`http://localhost:4000/therapist/getTimeSlotByDate/${therapist_id}`, {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    date: dayjs(date).format('YYYY-MM-DD'),
                })
                }).then(res => res.json())
                .then(data => {
                    setTimeslots(data.map(timeslot => {
                        const parsedTime = parse(timeslot.time, 'HH:mm:ss', new Date())
                        const hDate = dayjs(parsedTime).format('hh:mm A')
                            
                        return <MenuItem key={timeslot.slot_id} value={hDate}> {hDate} </MenuItem>
                            }
                            
                            ))}
                        )
                }

            fetch(`http://localhost:4000/therapist/getDays/${therapist_id}`, {
                    method : 'GET',
                    headers : {
                        'Content-Type' : 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                    }).then(res => res.json())
                    .then(data => {
                        setDays(data)})

            fetch(`http://localhost:4000/therapist/checkSlots/${therapist_id}`, {
                    method : 'GET',
                    headers : {
                        'Content-Type' : 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                    }).then(res => res.json())
                    .then(data => {
                        data.length !== 0 ? setAvailable(true) : setAvailable(false)
                    })
        }, [time, date, humanizedDate, humanizedTime, therapist_id])

        const enableSpecificDays = (day) => {
            const formatDate = dayjs(day).format('YYYY-MM-DD')

            // Check if the date is present in the disabledDays array
            for (let i = 0; i < days.length; i++) {
                if (formatDate === days[i].date) {
                return false; // Disable the date
                }
            }
            return true; // Enable the date
        };

        const location = useNavigate()

        const goTo = (link) => {
            location(link)
        }

    return (
        <ListGroupItem className={'border-0 bg-light rounded-4 border border-1 my-2'}>
        <Row className={'p-4'}>
            <Col className={'col-3 d-flex flex-column align-items-center justify-content-center'}>
                <Image src={gender === 'male' ? Therapist_m : gender === 'female' ? Therapist_f : Others}
                className={'p-2 therapist-avatar'} onClick={e => goTo('/user/'+user_therapist_id)}></Image>
                <Row>
                    {fb_link && <Col><a href={"https://"+fb_link} target="_blank" rel="noopener noreferrer"><Image src={fb}/></a></Col>}
                    {twt_link && <Col><a href={"https://"+twt_link} target="_blank" rel="noopener noreferrer"><Image src={twt}/></a></Col>}
                    {li_link && <Col><a href={"https://"+li_link} target="_blank" rel="noopener noreferrer"><Image src={lnk}/></a></Col>}
                </Row>

            </Col>
            <Col className={'w-100 '}>
                <h4>{prefix ? prefix : ''} {first_name} {last_name} {suffix ? suffix : ''}</h4>
                <small className={'text-muted'}><p>{field}</p></small>
                <p>{description}</p>
                <Row className={'align-items-center'}>
                    <Col>
                        {online ? 
                        <Row>
                            <Col className={'col-1'}><Image src={thumbs_up}></Image></Col>
                            <Col >Online Consultation</Col>
                        </Row> : ''}
                        {in_person ?
                        <Row>
                            <Col className={'col-1'}><Image src={thumbs_up}></Image></Col>
                            <Col >In-Person Consultation</Col>
                        </Row> : ''}
                    </Col>
                    <Col className={'col-4 d-flex flex-row '}>
                        {available ?
                        <Button className={'w-100'} onClick={handleShow}>Book Now</Button>
                        :
                        <em className="text-muted">No slots available</em>
                        }
                        <Modal show={show} onHide={handleClose} centered size='md'>
                            <ModalTitle className="mx-3 mt-4"><h4>Book an appointment</h4></ModalTitle>
                            <ModalBody>
                                        <Form onSubmit={handleSubmit} className={" d-flex flex-column  px-2 pb-3"} >
                                            {currentStep === 1 && (
                                                <>
                                                <Form.Group >

                                                    <Form.Label htmlFor="consultation-mode" className='pb-3 fw-bold'>Mode of consultation</Form.Label>
                                                    <select
                                                        className={"form-control"}
                                                        id="consultation-mode"
                                                        onChange={handleInputChange}
                                                        value={mode}
                                                        >
                                                            <option value=''>--select options--</option>
                                                            <option value={"online"} disabled={!online}>Online Consultation</option>
                                                            <option value={"in_person"} disabled={!in_person}>In-Person Consultation</option>
                                                    </select>
                                                </Form.Group>
                                                </>

                                            )}
                                            {currentStep === 2 && (
                                                <>
                                                    <Form.Label className='pb-3 fw-bold'>Set Date and Time</Form.Label>
                                                    <Row>
                                                        <Col>
                                                            <DateField
                                                                onClick={e => setOpenCalendar(true)}
                                                                value = {date}
                                                                label="Select Date"
                                                                slotProps={{
                                                                textField: {
                                                                helperText: 'MM/DD/YYYY',
                                                                }
                                                            }}
                                                            />
                                                            {openCalendar &&
                                                                <DateCalendar
                                                                minDate={tomorrow}
                                                                shouldDisableDate={enableSpecificDays}
                                                                onChange={e => {
                                                                    setDate(e)
                                                                    setOpenCalendar(false)}} />
                                                            }
                                                        </Col>
                                                        <Col >
                                                        <FormGroup>
                                                        <FormControl>
                                                            <InputLabel id="time-select-label">Select Time</InputLabel>
                                                            <Select
                                                                labelId="time-select-label"
                                                                disabled = { date === null }
                                                                value={time}
                                                                label="Select Time"
                                                                onChange={e => {
                                                                    setTime(e.target.value)
                                                                }}
                                                                >
                                                                {timeslots}
                                                            </Select>
                                                        </FormControl>
                                                        </FormGroup>
                                                            
                                                        </Col>
                                                    </Row>
                                                </>

                                            )}
                                            {currentStep === 3 && (
                                                <>
                                                    <Form.Label className={"fw-bold"}>Confirm Appointment</Form.Label>
                                                        <p> Are you sure you want to book an <b>{mode==='in_person' ? "In-Person Consultation": "Online Consultation"}</b> with <b> {prefix ? prefix : ''} {last_name} {suffix ? suffix : ''}</b>on the following date and time?<br/></p>
                                                        <div className='d-flex mt-4 justify-content-center'><b className='fw-bold'>{humanizedDate} ({time})</b></div>
                                                </>
                                            )}
                                            {/*buttons*/}
                                            <Form.Group className={"align-self-end mt-2 "}>
                                                        {(currentStep > 1) && (
                                                            <Button onClick={handleBack} className={"m-1"}>Back</Button>
                                                        )}
                                                        {(currentStep === maxSteps ) ?
                                                            (<Button type="submit" className={"m-1"}>Confirm</Button>)
                                                            :(<Button type="submit" className={"m-1 next-button"} disabled={(currentStep === 2 && !active)}>Next</Button>)}
                                            </Form.Group>
                                        </Form>
                            </ModalBody>
                        </Modal>
                    </Col>
                </Row>
            </Col>
        </Row>
        </ListGroupItem>
    )
}