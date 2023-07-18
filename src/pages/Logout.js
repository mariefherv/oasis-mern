import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';


export default function Logout(){
    const {unsetUser, setUser} = useContext(UserContext);

	unsetUser();
	
	useEffect(() => {
		setUser({id: null})

        Swal.fire({
            title: "Successfully logged out!",
            text: "please come back anytime :)",
            color: '#3A3530',
            confirmButtonText: "see you!",
            buttonsStyling: false,
            customClass: {
                confirmButton: 'button2'
            }
        })

	});
    return(
        <Navigate to="/"/>
    )


}