import './index.css';
import { UserProvider } from './UserContext';
// import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider
} from "react-router-dom";
import Welcome from './pages/Welcome';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home'
import { useState } from 'react';
import PostDetail from "./pages/PostDetail";
import Counselling from "./pages/Counselling";
import Logout from './pages/Logout';
import Messaging from "./pages/Messaging";
import { useEffect } from 'react';
import User from "./pages/User";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Therapist from './pages/Therapist';
import { PostProvider } from './PostContext';
import About from './pages/About';
import { TherapistProvider } from './TherapistContext'
import Admin from "./pages/Admin";
import Error from "./pages/Error";

function App() {

  const [user, setUser] = useState({
    id: null,
    username: null,
    email: null,
    gender: null,
    role: null,
    bio: null,
    registration_date: null,
    fb_link: null,
    twt_link: null,
    has_notifications: null
	});

  const [therapist, setTherapist] = useState({
    therapist_id: null,
    prefix: null,
    first_name: null,
    last_name: null,
    suffix: null,
    field: null,
    description: null,
    online: null,
    in_person: null,
    fb_link: null,
    twt_link: null,
    li_link: null
  })

  const unsetUser = () => {
		localStorage.clear();
	};

  useEffect(() => {
		fetch('http://localhost:4000/user/getUserDetails',{
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		}).then(res => res.json())
		.then(data =>{
			if(typeof data[0].user_id !== "undefined"){
				setUser({
					id: data[0].user_id,
					username: data[0].username,
					email: data[0].email,
          gender: data[0].gender,
					role: data[0].role,
          bio: data[0].bio,
          registration_date: data[0].registration_date,
          fb_link: data[0].fb_link,
          twt_link: data[0].twt_link,
          li_link: data[0].li_link,
          has_notifications: data[0].has_notifications
				});
			} else {
				setUser({
          id: null,
          username: null,
          email: null,
          gender: null,
          role: null,
          bio: null,
          registration_date: null,
          fb_link: null,
          twt_link: null,
          li_link: null,
          has_notifications: null
				})
			}
		})

    if(user.role === 'Therapist' ){
      fetch('http://localhost:4000/therapist/view',{
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		}).then(res => res.json())
		.then(data =>{
			if(typeof data[0].user_id !== "undefined"){
				setTherapist({
          therapist_id: data[0].therapist_id,
          prefix: data[0].prefix,
          first_name: data[0].first_name,
          last_name: data[0].last_name,
          suffix: data[0].suffix,
          field: data[0].field,
          description: data[0].description,
          online: data[0].online,
          in_person: data[0].in_person,
          fb_link: data[0].fb_link,
          twt_link: data[0].twt_link,
          li_link: data[0].li_link
				});
			} else {
				setTherapist({
          therapist_id: null,
          prefix: null,
          first_name: null,
          last_name: null,
          suffix: null,
          field: null,
          description: null,
          online: null,
          in_person: null,
          fb_link: null,
          twt_link: null,
          li_link: null
				})
			}
		})
    }
	}, [user.role, user.has_notifications])

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route >
                <Route exact path="/" element={<Welcome/>}/>
                <Route exact path="/about" element={<About/>}/>
                <Route exact path="/register" element={<Register/>}/>
                <Route exact path="/login" element={<Login/>}/>
                <Route exact path="/home" element={<Home/>}/>
                <Route exact path="/user/:user_id" element={<User/>}/>
                {user.role === 'Therapist' && <Route exact path="/therapist" element={<Therapist/>}/>}
                {user.role === 'Admin' && <Route exact path="/admin" element={<Admin />}/>}
                <Route exact path="/post/:post_id" element={<PostDetail/>}/>
                <Route exact path="/counselling" element={<Counselling/>}/>
                <Route exact path="/logout" element={<Logout/>}/>
                <Route exact path="/chats/:contact_id" element={<Messaging/>}/>
                <Route exact path="/*" element={<Error/>}/>
            </Route>
        )
    );
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <UserProvider value={{user, setUser, unsetUser}}>
    <TherapistProvider value={{therapist, setTherapist}}>
    <PostProvider>
        <RouterProvider router={router} />
    </PostProvider>
    </TherapistProvider>
    </UserProvider>
    </LocalizationProvider>
  );
}

export default App;
