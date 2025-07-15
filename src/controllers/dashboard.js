import { renderAdmin } from "../views/admin.js"; 
import { renderVisitor } from "../views/visitor.js"; 

import { settingsDashboardAdmin } from "./admin.js"; 
import { settingsDashboardVisitor } from "./visitor.js"; 

export function settingsDashboard() {
  const user = JSON.parse(localStorage.getItem("currentUser")); // get user from localStorage

  if (!user) {
    history.pushState(null, null, "/login"); // go to login page
    window.dispatchEvent(new Event("popstate")); // reload router
    return;
  }

  const app = document.getElementById("app"); // get container

  if (user.rolId === 1) { // if user is admin
    app.innerHTML = renderAdmin(); // show admin page
    settingsDashboardAdmin(); // run admin logic
  } else { // if user is visitor
    app.innerHTML = renderVisitor(); // show visitor page
    settingsDashboardVisitor(); // run visitor logic
  }
}