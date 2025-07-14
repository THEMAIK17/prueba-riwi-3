export function renderVisitor(){
    return `
    <main class="events-container">
        <h2>available events</h2>

        <section>
            <ul id="event-list" class="event-list">
                <!-- Available events will be inserted here -->
            </ul>
        </section>
        <h3>my registrations</h3>
        <section>
            <ul id="my-registrations" class="registration-list">
                <!-- events in which you registered -->
            </ul>
        </section>
        <button id="logout">log out</button>
 
    </main>
    `;
}