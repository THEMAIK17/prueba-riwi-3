import { endpointEvents, endpointRegistrations } from "../services/api.js"; 

export async function settingsDashboardVisitor() {
  const user = JSON.parse(localStorage.getItem("currentUser")); // get user from localStorage

  if (!user || user.rolId !== 2) { // if no user or user is not visitor
    location.href = "/login"; // go to login page
    return;
  }

  const container = document.getElementById("event-list"); 
  const logoutBtn = document.getElementById("logout"); 

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser"); // remove user from storage
    history.pushState(null, null, "/login"); // go to login
    window.dispatchEvent(new Event("popstate")); // reload page
  });

  try {
    const res = await fetch(endpointEvents); 
    const events = await res.json();

    const resRegistrations = await fetch(endpointRegistrations); 
    const registrations = await resRegistrations.json(); 

    container.innerHTML = ""; // clear list

    if (events.length === 0) {
      container.innerHTML = "<p>There are no events available at this time.</p>"; // no events
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
        <button class="btn-register" data-id="${event.id}">Register</button>
        <hr>
      `;
      container.appendChild(li); // add to page
    });

    //  show my registrations
    const myRegistrations = registrations.filter(r => r.visitorId == user.id); // only my events
    const myList = document.getElementById("my-registrations"); // list container
    myList.innerHTML = ""; // clear list

    if (myRegistrations.length === 0) {
      myList.innerHTML = "<li>No estás inscrito en ningún evento.</li>"; // no events
    } else {
      for (const reg of myRegistrations) {
        const event = events.find(ev => ev.id == reg.eventId); // find event info
        if (event) {
          const li = document.createElement("li");
          li.innerHTML = `
            <strong>${event.name}</strong><br>
            date: ${event.date}<br>
            location: ${event.location}<br>
            register on: ${reg.date}
            <hr>
          `;
          myList.appendChild(li); // add to my list
        }
      }
    }

    // register to event
    container.onclick = async (e) => {
      if (!e.target.matches(".btn-register")) return; 

      const eventId = parseInt(e.target.dataset.id); 

      // check if already registered
      const yaRegistrado = registrations.some(
        (r) => parseInt(r.eventId) === eventId && r.visitorId === user.id
      );

      if (yaRegistrado) {
        alert("You are already registered for this event."); 
        return;
      }

      // check capacity
      const evento = events.find(ev => parseInt(ev.id) === eventId);
      const inscritos = registrations.filter(r => parseInt(r.eventId) === eventId).length;

      if (inscritos >= evento.capacity) {
        alert("This event no longer has available spaces."); 
        return;
      }

      // make registration
      const registration = {
        eventId: eventId,
        visitorId: user.id,
        date: new Date().toISOString().split("T")[0] // today date
      };

      try {
        const res = await fetch(endpointRegistrations, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(registration)
        });

        if (res.ok) {
          alert("successful registration to the event."); 
          settingsDashboardVisitor(); 
        } else {
          alert("Could not register for the event."); 
        }
      } catch (error) {
        console.error("error when registering:", error); 
        alert("an error occurred"); 
      }
    };

  } catch (error) {
    console.error("Error loading events:", error); 
    container.innerHTML = "<p>Error displaying events.</p>"; 
  }
}