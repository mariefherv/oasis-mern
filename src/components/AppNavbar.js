import { useContext, useState } from "react";
import { Button, Col, Image, ListGroup, Modal, Navbar, Row } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { NavLink } from 'react-router-dom';
import UserContext from '../UserContext';
import logo from '../static/images/logo.png';
import telephone from '../static/images/telephone.svg';
import HotlineItem from "./HotlineItem";

export default function AppNavbar() {
	const { user } = useContext(UserContext)

	const [hotlinesShow, setHotlinesShow]= useState(false);

	const isDesktopOrLaptop = useMediaQuery({
		query: '(min-width: 1224px)'
	})

	return (
		<Navbar className="m-0 d-flex flex-column sticky-top vh-100 overflow-auto navbar">
			{isDesktopOrLaptop && 
			<Row>
				<NavLink to="/home" className='d-flex flex-column align-items-center justify-content-center  text-decoration-none'>
					<Row className='title '>
						<Col className='p-0'>
							<img src={logo}
								alt="oasis logo"
								className="logo"
							/>
						</Col>
						<Col className='p-0'>
							<p className='logo-title '>oasis</p>
						</Col>
					</Row>
					<div className='mb-1'></div>
					<Row className='tagline '>
						you are safe here
					</Row>
				</NavLink>
			</Row>}
			<Row className='bg-light rounded-4 m-2 p-3'>
					<NavLink to={'/home'} className='nav-links' >Community</NavLink>
					{(user.role === 'User' || user.role === 'Admin') && <NavLink to={'/counselling'} className='nav-links'>Look for Support</NavLink>}
					{user.role === 'Therapist' && <NavLink to={'/therapist'} className='nav-links'>Appointments</NavLink>}
					{user.role === 'Admin' && <NavLink to={'/admin'} className='nav-links'>Admin</NavLink>}
					{/*<NavLink to={'/blogs'} className='nav-links'>Blog</NavLink>*/}
					<NavLink to={'/about'} className='nav-links'>About Us</NavLink>
					{!isDesktopOrLaptop && <NavLink className='nav-links '>
						VAWC Hotlines
					</NavLink>
					}
			</Row>

			<div className='d-flex flex-column flex-grow-1 mt-auto'></div>
			<Col className={"d-flex flex-column  bg-light rounded-4 p-4 align-items-center gradient"}>
				<Image src={telephone} className={"img-fluid ms-5"}></Image>
				<h6 className={"fw-bold "}>24/7 Helpline</h6>
				<p><small>Always to help you.</small></p>
				<Button onClick={()=> setHotlinesShow(true)} className='contact-button'>Hotlines</Button>
				<Modal show={hotlinesShow} onHide={() => setHotlinesShow(false)}>
					<Modal.Header closeButton>
						<h3>VAWC Hotlines</h3>
					</Modal.Header>
					<Modal.Body>
						<ListGroup className={'overflow-auto  	'} >
							<HotlineItem hotlineProps={
								{
									hotlineName: "Provincial Social Welfare",
									hotlineAddress: "Capital Building",
									hotlineNumber:"(036)266-3426"
								}
							}/>
							<HotlineItem hotlineProps={
								{
									hotlineName: "Women and Children Protection",
									hotlineAddress: "Angel Salazar Memorial Hospital",
									hotlineNumber:"(036)266-3426"
								}
							}/>
							<HotlineItem hotlineProps={
								{
									hotlineName: "Provincial Social Welfare",
									hotlineAddress: "Capital Building",
									hotlineNumber:"(036)266-3426"
								}
							}/>
							<HotlineItem hotlineProps={
								{
									hotlineName: "Women and Children Protection",
									hotlineAddress: "Angel Salazar Memorial Hospital",
									hotlineNumber:"(036)266-3426"
								}
							}/>
						</ListGroup>
					</Modal.Body>
				</Modal>
			</Col>
		</Navbar>
	)
};

