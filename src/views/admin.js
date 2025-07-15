export function renderAdmin(){
    return `
    <main class="dashboard-admin">
        <h2>Event Management Panel</h2>

        <!-- form for create or events edit -->
        <form id="form-event" class="event-form">
            <input type="hidden" id="event-id" />
            <input type="text" id="event-name" placeholder="event name" required />
            <input type="text" id="event-description" placeholder="Description" required />
            <input type="date" id="event-date" required />
            <input type="text" id="event-location" placeholder="location" required />
            <input type="number" id="event-capacity" placeholder="event capacity" required />
            <button type="submit">event save</button>
            <button type="button" id="cancel-event-form" class="hidden">cancel</button>
        </form>

        <!-- list of exist events -->
        <section>
            <h3>register events</h3>
            <ul id="event-list" class="event-list">
            <!--  events will be displayed here -->
            </ul>
        </section>
        <button id="logout">log out</button>
    </main>
  `;
}
