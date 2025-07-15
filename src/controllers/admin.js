import { endpointEvents } from "../services/api.js"; 

export async function settingsDashboardAdmin() {
  const user = JSON.parse(localStorage.getItem("currentUser")); // get user from storage

  if (!user || user.rolId !== 1) { // if no user or not admin
    location.href = "/login"; // go to login page
    return;
  }

  const container = document.getElementById("event-list"); 
  const logoutBtn = document.getElementById("logout"); 
  const form = document.getElementById("form-event"); 
  const cancelBtn = document.getElementById("cancel-event-form"); 

  // logout user
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser"); // remove user from storage
    history.pushState(null, null, "/login"); // go to login
    window.dispatchEvent(new Event("popstate")); // reload page
  });

  // load all events
  async function loadEvents() {
    try {
      const res = await fetch(endpointEvents); 
      const events = await res.json(); 

      container.innerHTML = ""; // clear list

      if (events.length === 0) {
        container.innerHTML = "<p>There are not registered events.</p>"; // no events
        return;
      }

      events.forEach((event) => {
        const li = document.createElement("li"); // create list item
        li.innerHTML = `
          <strong>${event.name}</strong><br>
          Description: ${event.description}<br>
          date: ${event.date}<br>
          Location: ${event.location}<br>
          available places: ${event.capacity ?? "Sin definir"}<br>
          <button class="edit-btn" data-id="${event.id}">Edit</button>
          <button class="delete-btn" data-id="${event.id}">Delete</button>
          <hr>
        `;
        container.appendChild(li); // add to container
      });
    } catch (error) {
      console.error("Error to load the events:", error); 
      container.innerHTML = "<p>Error to load the events.</p>"; 
    }
  }

  loadEvents(); 

  // create or update event
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // stop form

    const eventId = document.getElementById("event-id").value; 
    const name = document.getElementById("event-name").value; 
    const description = document.getElementById("event-description").value;
    const date = document.getElementById("event-date").value; 
    const location = document.getElementById("event-location").value; 
    const capacity = parseInt(document.getElementById("event-capacity").value); 
    const newEvent = { name, description, date, location, capacity }; 
    try {
      if (eventId) {
        // update event
        await fetch(`${endpointEvents}/${eventId}`, {
          method: "PUT", // update method
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEvent),
        });
      } else {
        // create new event
        await fetch(endpointEvents, {
          method: "POST", // create method
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEvent),
        });
      }

      form.reset(); // clean form
      cancelBtn.classList.add("hidden"); 
      loadEvents(); 
    } catch (error) {
      console.error("Error to event save:", error); 
    }
  });

  // cancel editing
  cancelBtn.addEventListener("click", () => {
    form.reset(); // clean form
    document.getElementById("event-id").value = ""; // clear ID
    cancelBtn.classList.add("hidden"); // hide button
  });

  // handle edit and delete buttons
  container.addEventListener("click", async (e) => {
    const id = e.target.dataset.id; // get event ID

    if (e.target.classList.contains("edit-btn")) {
      try {
        const res = await fetch(`${endpointEvents}/${id}`); 
        const event = await res.json(); 

        // fill form with event data
        document.getElementById("event-id").value = event.id;
        document.getElementById("event-name").value = event.name;
        document.getElementById("event-description").value = event.description;
        document.getElementById("event-date").value = event.date;
        document.getElementById("event-location").value = event.location;
        document.getElementById("event-capacity").value = event.capacity;
        cancelBtn.classList.remove("hidden"); // show cancel button
      } catch (error) {
        console.error("Error editing :", error); // show error
      }
    }

    if (e.target.classList.contains("delete-btn")) {
      try {
        await fetch(`${endpointEvents}/${id}`, { method: "DELETE" }); // delete event
        loadEvents(); // reload list
      } catch (error) {
        console.error("Error to delete:", error); // show error
      }
    }
  });
}