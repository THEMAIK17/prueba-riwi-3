import { endpointUsers } from "../services/api.js"; // import users URL

export function settingsLogin() {
  const $loginUser = document.getElementById("login-email"); 
  const $loginPassword = document.getElementById("login-password"); 
  const $form = document.getElementById("form-login"); 

  $form.addEventListener("submit", async function (event) {
    event.preventDefault(); // stop normal form action

    // get user from API using email
    let response = await fetch(`${endpointUsers}?email=${$loginUser.value}`);
    let data = await response.json(); // convert to JSON

    if (data.length != 1) {
      alert("it's account doesn't exist"); // account not found
      return;
    }

    // check if password is correct
    if (data[0].password === $loginPassword.value) {
      localStorage.setItem("currentUser", JSON.stringify(data[0])); // save user
      history.pushState(null, null, "/dashboard"); // go to dashboard
      window.dispatchEvent(new Event("popstate")); // reload page
    }
  });
}