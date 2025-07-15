import { endpointUsers } from "../services/api"; 

export function settingsRegister() {
  const $form = document.getElementById("form-register"); 

  const $registerName = document.getElementById("register-name");
  const $registerUser = document.getElementById("register-username"); 
  const $registerEmail = document.getElementById("register-email"); 
  const $registerPassword = document.getElementById("register-password"); 

  $form.addEventListener("submit", async function (event) {
    event.preventDefault(); // stop normal form action

    // check if email or username already exists
    const exists = await existUser($registerEmail, $registerUser);
    if (exists) return; // stop if exists

    const newUser = {
      name: $registerName.value,
      userName: $registerUser.value,
      email: $registerEmail.value,
      password: $registerPassword.value,
      rolId: 2 // role visitor
    };

    try {
      const response = await fetch(endpointUsers, {
        method: "POST", 
        headers: {
          "content-type": "application/json" 
        },
        body: JSON.stringify(newUser) // convert object to string
      });

      if (response.status === 201) {
        alert("Successfully registered user"); 
        const savedUser = await response.json();
        localStorage.setItem("currentUser", JSON.stringify(savedUser)); 
        history.pushState(null, null, "/dashboard"); // go to dashboard
        window.dispatchEvent(new Event("popstate")); // reload page
      } else {
        alert("Try again later"); 
        throw new Error("Request error"); 
      }
    } catch (error) {
      console.error(error.message); 
    }
  });
}

//  function to check duplicate email and username
async function existUser($registerEmail, $registerUser) {
  const response = await fetch(endpointUsers); 
  const users = await response.json(); 

  const emailExists = users.some(user => user.email === $registerEmail.value); // check email
  const userExists = users.some(user => user.userName === $registerUser.value); // check username

  if (emailExists) {
    alert("Email already registered");
    return true;
  } else if (userExists) {
    alert("Username already exists"); 
    return true;
  }

  return false; // all good
}
