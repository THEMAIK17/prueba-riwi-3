import { settingsDashboardAdmin } from "./controllers/admin.js"; 
import { settingsDashboard } from "./controllers/dashboard.js"; 
import { settingsLogin } from "./controllers/login.js"; 
import { settingsRegister } from "./controllers/register.js"; 
import { render404 } from "./views/404.js"; 
import { renderAdmin } from "./views/admin.js"; 
import { renderLogin } from "./views/login.js"; 
import { renderRegister } from "./views/register.js"; 

const routes = {
  "/": {
    showView: renderLogin(), 
    afterRender: settingsLogin,
    private: false, 
  },
  "/login": {
    showView: renderLogin(), 
    afterRender: settingsLogin, 
    private: false, 
  },
  "/register": {
    showView: renderRegister(), 
    afterRender: settingsRegister, 
    private: false, 
  },
  "/dashboard": {
    showView: () => "", // HTML comes later (by role)
    afterRender: settingsDashboard, 
    private: true, // this is a private page
  },
  "/dashboard/events/create": {
    showView: renderAdmin, // show admin page
    afterRender: settingsDashboardAdmin, // run admin logic
    private: true, // 
  },
  "/dashboard/events/edit": {
    showView: renderAdmin,
    afterRender: settingsDashboardAdmin, 
    private: true, 
  },  
};

export function router() {
  const path = window.location.pathname || "/"; // get current URL path
  const app = document.getElementById("app"); // get app container
  const currentRoute = routes[path]; // find the route

  if (currentRoute) {
    const user = JSON.parse(localStorage.getItem("currentUser")); // get user from localStorage

    // 🔐 protect private pages
    if (currentRoute.private && !user) {
      history.pushState(null, null, "/login"); // go to login page
      window.dispatchEvent(new Event("popstate")); // reload page
      return;
    }

    // render HTML view
    app.innerHTML =
      typeof currentRoute.showView === "function"
        ? currentRoute.showView() // call the function
        : currentRoute.showView; // or use the string

    // run JS logic
    if (typeof currentRoute.afterRender === "function") {
      currentRoute.afterRender(); // call the function
    }
  } else {
    app.innerHTML = render404(); // show 404 page
  }
}

// SPA navigation
window.addEventListener("popstate", router); // when back or forward
window.addEventListener("load", router); // when page load

// intercept link clicks
document.addEventListener("click", (event) => {
  if (event.target.matches("[data-link]")) { // if link has data-link
    event.preventDefault(); // stop default action
    history.pushState(null, null, event.target.href); // change URL
    router(); // call router
  }
});