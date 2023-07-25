import Swal from 'sweetalert2'


export function addContact(user_id) {
    let loading
    Swal.fire({
        text: 'Please hold on a moment...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading()
            loading = true
            fetch(`https://oasis-api-nocv.onrender.com/contact/addContact/${user_id}`, {
            method : 'PUT',
            headers : {
                'Content-Type' : 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
            }
            }).then(res => res.json())
            .then(data => {
            if(data.status){
                Swal.fire({
                    title: "Contact requested!",
                    icon: "success",
                    text: "Please wait on their confirmation to establish you as a contact",
                    iconColor: '#3A3530',
                    color: '#3A3530',
                    confirmButtonText: "OK",
                    buttonsStyling: false,
                    customClass: {
                        confirmButton: 'button2'
                    }
                })
                return(data.status)
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
                })}
            })
            loading = false
        },
        willClose: () => !loading
    }
    )
}

export function removeContact(user_id) {
    let loading
    Swal.fire({
        text: 'Please hold on a moment...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading()
            loading = true
            fetch(`https://oasis-api-nocv.onrender.com/contact/removeContact/${user_id}`, {
                method : 'PATCH',
                headers : {
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
                }
                }).then(res => res.json())
                .then(data => {
                    if(data.status) {
                    Swal.fire({
                        title: "User Removed.",
                        icon: "success",
                        text: "This user has been removed from your contact list.",
                        iconColor: '#3A3530',
                        color: '#3A3530',
                        confirmButtonText: "OK",
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: 'button2'
                        }
                    })
                    return(data.status)
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
            })
    loading = false
    },
    willClose: () => !loading
    }
    )
}

export function blockContact(user_id) {
    let loading
    Swal.fire({
        text: 'Please hold on a moment...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading()
            loading = true
            fetch(`https://oasis-api-nocv.onrender.com/contact/blockContact/${user_id}`, {
                method : 'PUT',
                headers : {
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
                }
                }).then(res => res.json())
                .then(data => {
                if(data.status) {
                    Swal.fire({
                        title: "User Blocked",
                        icon: "success",
                        text: "This user has been blocked! They won't be able to message you and you will no longer see their posts.",
                        iconColor: '#3A3530',
                        color: '#3A3530',
                        confirmButtonText: "OK",
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: 'button2'
                        }
                    })
                    return(data.status)
                } else{
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
            })
            loading = false
        },
        willClose: () => !loading
    }
    )
}

export function unblockContact(user_id) {
    let loading
    Swal.fire({
        text: 'Please hold on a moment...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading()
            loading = true
            fetch(`https://oasis-api-nocv.onrender.com/contact/unblockContact/${user_id}`, {
                method : 'PATCH',
                headers : {
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
                }
                }).then(res => res.json())
                .then(data => {
                    if(data.status) {
                    Swal.fire({
                            title: "User Unblocked",
                            icon: "success",
                            text: "This user has been unblocked. They will now be able to add to you as their contact and send message to you.",
                            iconColor: '#3A3530',
                            color: '#3A3530',
                            confirmButtonText: "OK",
                            buttonsStyling: false,
                            customClass: {
                                confirmButton: 'button2'
                            }
                        })
                        return(data.status)
                    } else{
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
            })
            loading = false
        },
        willClose: () => !loading
    }
    )
}

export function confirmContact(user_id) {
    let loading
    Swal.fire({
        text: 'Please hold on a moment...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading()
            loading = true
            fetch(`https://oasis-api-nocv.onrender.com/contact/confirmContact/${user_id}`, {
                method : 'PATCH',
                headers : {
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
                },
                }).then(res => res.json())
                .then(data => {
                if(data.status){
                    Swal.fire({
                        title: "Contact established!",
                        icon: "success",
                        text: "You may now message each other.",
                        iconColor: '#3A3530',
                        color: '#3A3530',
                        confirmButtonText: "OK",
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: 'button2'
                        }
                    })
                    return(data.status)
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
                    })}
            })
            loading = false
        },
        willClose: () => !loading
    }
    )
}

export function declineContact(user_id) {
    let loading
    Swal.fire({
        text: 'Please hold on a moment...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading()
            loading = true
            fetch(`https://oasis-api-nocv.onrender.com/contact/declineContact/${user_id}`, {
                method : 'PATCH',
                headers : {
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
                },
                }).then(res => res.json())
                .then(data => {
                if(data.status){
                    Swal.fire({
                        title: "Contact declined.",
                        icon: "success",
                        text: "You may still add them whenever you change your mind.",
                        iconColor: '#3A3530',
                        color: '#3A3530',
                        confirmButtonText: "OK",
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: 'button2'
                        }
                    })
                    console.log(data.status)
                    return(data.status)
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
                    })}
            })
            loading = false
        },
        willClose: () => !loading
    }
    )
}

export function cancelContact(user_id) {
    let loading
    Swal.fire({
        text: 'Please hold on a moment...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading()
            loading = true
            fetch(`https://oasis-api-nocv.onrender.com/contact/cancelContact/${user_id}`, {
                method : 'DELETE',
                headers : {
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : true,
                        "status" : 200
                }
                }).then(res => res.json())
                .then(data => {
                if(data.status) {
                    Swal.fire({
                        title: "Contact Request Cancelled.",
                        icon: "success",
                        iconColor: '#3A3530',
                        color: '#3A3530',
                        confirmButtonText: "OK",
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: 'button2'
                        }
                    })
                    return(data.status)
                } else{
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
            })
            loading = false
        },
        willClose: () => !loading
    }
    )
}
