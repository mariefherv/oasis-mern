import { addDays, addHours, addMonths, addWeeks, eachDayOfInterval, eachHourOfInterval, endOfDay, endOfMonth, format, isBefore, isToday, startOfDay, startOfMonth, startOfWeek } from 'date-fns';
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { Button, Container, Form, Modal, Row, Spinner } from "react-bootstrap";
import { DateRangePicker } from "rsuite";
import Swal from "sweetalert2";
import Typewriter from 'typewriter-effect';
import TherapistContext from "../TherapistContext";

export default function AddSlots() {

    const { therapist } = useContext(TherapistContext)

    const [dates, setDates] = useState(null)
    const [times, setTimes] = useState(null)

    const [loading, setLoading] = useState(false)

    const [active, setActive] = useState(false)

    const today = new Date()

    const predefinedDateRanges = [
        {
            label: 'Tomorrow',
            value: [startOfDay(addDays(today, 1)), endOfDay(addDays(today, 1))],
            placement: 'left'
        },
        {
            label: 'Next week',
            value: [startOfWeek(addWeeks(today, 1), { weekStartsOn: 1 }), addDays(startOfWeek(addWeeks(today, 1), { weekStartsOn: 1 }), 4)],
            placement: 'left'
        },
        {
            label: 'Next month',
            value: [startOfMonth(addMonths(today, 1)), endOfMonth(addMonths(today, 1))],
            placement: 'left'
        },
        {
            label: 'Next 3 Months',
            value: [startOfMonth(addMonths(today,1)), endOfMonth(addMonths(today,2))],
            placement: 'left'
        },
    ]

    const predefinedTimeRanges = [
        {
            label: 'Office Hours',
            value: [addHours(startOfDay(today),8), addHours(startOfDay(today),16)],
            placement: 'left'
        },
        {
            label: 'Morning',
            value: [addHours(startOfDay(today),8), addHours(startOfDay(today),11)],
            placement: 'left'
        },
        {
            label: 'Afternoon',
            value: [addHours(startOfDay(today),13), addHours(startOfDay(today),16)],
            placement: 'left'
        },
        {
            label: 'Evening',
            value: [addHours(startOfDay(today),17), addHours(startOfDay(today),20)],
            placement: 'left'
        },
    ]

    const disabledDate = (date) => {
        return isBefore(date, new Date()) || isToday(date);
    };

    useEffect(() => {
        dates !== null && times !== null ? setActive(true) : setActive(false)
    }, [dates, times])

    const handleSubmit = (e) => {
        e.preventDefault()

        if(dates.length !== 0) {
            setDates(times.map(date => {
            return format(date, 'MM/dd/yyyy')
            }))}

        if(times.length !== 0) {
            setTimes(times.map(time => {
            let t = new Date(time)
            return format((addHours(startOfDay(today), t.getHours())), 'HH:mm')
            }))}
    }

    function addSlot(e) {
        e.preventDefault()
        setLoading(true)

        let arr = []

        const datesArray = eachDayOfInterval({ start: dates[0], end: dates[1]})
        const timesArray = eachHourOfInterval({ start: times[0], end: times[1] })

        for(let i in datesArray) {
            for(let j in timesArray) {
                fetch(`https://oasis-api-nocv.onrender.com/therapist/addSlot`, {
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
                    },
                    body: JSON.stringify({
                        therapist_id: therapist.therapist_id,
                        date: dayjs(datesArray[i]).format('YYYY-MM-DD'),
                        time: dayjs(timesArray[j]).format('HH:mm')
                    })
                    }).then(res => res.json())
                    .then(data => {
                        if(data) arr.push(data)
                })
            }
        }

        if(checkAllTrue(arr)){
            fetch(`https://oasis-api-nocv.onrender.com/therapist/notification`, {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
                }
                }).then(res => res.json())
                .then(data => {
                    data ? 
                    Swal.fire({
                        title: "Slots Added!",
                        icon: "success",
                        iconColor: '#3A3530',
                        color: '#3A3530',
                        confirmButtonText: "OK",
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: 'button2'
                        }
                    }).then(setLoading(false)) 
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
                    }).then(setLoading(false))
            })
        } else {
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
    }
    }

    function checkAllTrue(array) {
        for (let i = 0; i < array.length; i++) {
          if (!array[i]) {
            return false; 
          }
        }
        return true;
      }

    return(
        <Container className={""}>
        <Form onSubmit={handleSubmit}>
            <Row className='justify-content-center align-items-center mt-4'>
                <DateRangePicker
                    placeholder="Select Available Dates"
                    cleanable
                    ranges={predefinedDateRanges}
                    preventOverflow
                    showOneCalendar
                    style={{ width: 300 }}
                    character=" - "
                    onChange={e => setDates(e)}
                    shouldDisableDate={disabledDate}
                />
            </Row>
            <Row className='justify-content-center align-items-center mt-4'>
                <DateRangePicker
                    placeholder="Select Available Time"
                    format="hh:00 aa"
                    showMeridian
                    cleanable
                    ranges={predefinedTimeRanges}
                    preventOverflow
                    style={{ width: 300 }}
                    character=" - "
                    onChange={e => setTimes(e)}
                />
            </Row>
            <Row className='justify-content-center align-items-center mt-4'>
                <Button type="submit" className="w-25 next-button" onClick={addSlot} disabled={!active}> Add slot </Button>
            </Row>
        </Form>
            

        <Modal show={loading} size="md" className='d-flex mt-auto loading' centered>
            <Spinner className="align-self-center"/>
            <div className="mt-2">
                <Typewriter 
                    options={{
                        strings: ['adding slots...'],
                        autoStart: true,
                        loop: true,
                        delay: 100,
                        deleteSpeed: .10,
                    }}
                />
            </div>
        </Modal>
        </Container>
    );
}