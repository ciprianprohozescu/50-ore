let loginButton, logoutButton, signUpButton;

$(document).ready(function() {
    loginButton = document.getElementById("loginButton");
    logoutButton = document.getElementById("logoutButton");
    signUpButton = document.getElementById("signUpButton");
    if (!firebase.auth().currentUser) {
        logoutButton.style.visibility = "hidden";
    }
    else {
        loginButton.style.visibility = "hidden";
        signUpButton.style.visibility = "hidden";
    }
});

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        //User is signed in
        loginButton.style.visibility = "hidden";
        logoutButton.style.visibility = "visible";
        signUpButton.style.visibility = "hidden";
    }
    else {
        //No user is signed in
        loginButton.style.visibility = "visible";
        logoutButton.style.visibility = "hidden";
        signUpButton.style.visibility = "visible";
    }
});

function login() {
    let userEmail = document.getElementById("login-email-field").value;
    let userPassword = document.getElementById("login-password-field").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).then(function() {
        $('#loginModal').modal('hide');
    }).catch(function(error) {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        window.alert("Error: " + errorMessage + "\nError code: " + errorCode);
    });
}

function logout() {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
    }).catch(function(error) {
        // An error happened.
        let errorCode = error.code;
        let errorMessage = error.message;
        window.alert("Error: " + errorMessage + "\nError code: " + errorCode);
    });
}

function signUp() {
    let userEmail = document.getElementById("signUp-email-field").value;
    let userPassword = document.getElementById("signUp-password-field").value;

    firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).then(function() {
        $('#signUpModal').modal('hide');
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert("Error: " + errorMessage + "\nError code: " + errorCode);
    });
}