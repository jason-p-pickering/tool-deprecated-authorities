"use strict";

//CSS
import "./css/style.css";
//DataTables
import DataTable from "datatables.net-dt";


// Global variables
let userRoles = [];
let systemAuthorities = {};
let baseUrl = getContextPath() + "/api/";

"use strict";

function getContextPath() {
    var ctx = window.location.pathname.substring(
        0,
        window.location.pathname.indexOf("/", 2)
    );
    console.log("Context path is : ", ctx);
    if (ctx === "/api") {
        return "";
    }
    return ctx;
}


async function d2Fetch(endpoint) {
    return new Promise(function (resolve, reject) {
        fetch(baseUrl + endpoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                credentials: "include",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error, baseUrl + endpoint);
                reject(error);
            });
    });
}

async function fetchUserRoles() {
    try {
        const data = await d2Fetch("userRoles.json?fields=name,id,authorities");
        userRoles = data.userRoles;
        createTable();
    } catch (error) {
        console.error("Error fetching user roles:", error);
    }
}

async function fetchSystemAuthorities() {
    try {
        const data = await d2Fetch("authorities");
        data.systemAuthorities.forEach(authority => {
            systemAuthorities[authority.id] = authority.name;
        });
    } catch (error) {
        console.error("Error fetching system authorities:", error);
    }
}


function createTable() {
    const tableContainer = document.getElementById("table-container");
    tableContainer.innerHTML = `
        <table id="user-roles-table" class="display">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Authority</th>
                    <th>Select</th>
                </tr>
            </thead>
            <tbody>
                ${userRoles.map(userRole =>
        userRole.authorities.map(authority =>
            !Object.prototype.hasOwnProperty.call(systemAuthorities, authority) ? `
                            <tr>
                                <td>${userRole.id}</td>
                                <td>${userRole.name}</td>
                                <td>${authority}</td>
                                <td><input type="checkbox" class="select-row" data-user-role-id="${userRole.id}" data-authority="${authority}"></td>
                            </tr>
                        ` : ""
        ).join("")
    ).join("")}
            </tbody>
        </table>

    `;
    new DataTable(document.querySelector("#user-roles-table"));
    document.querySelector("#user-roles-table thead tr").insertAdjacentHTML("beforeend", `
        <th>
            <input type="checkbox" id="select-all">
        </th>
    `);

    document.getElementById("select-all").addEventListener("change", function () {
        const checkboxes = document.querySelectorAll(".select-row");
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });

    document.getElementById("remove-selected").addEventListener("click", removeSelectedAuthorities);
}

async function removeSelectedAuthorities() {
    const selectedRows = document.querySelectorAll(".select-row:checked");
    if (selectedRows.length === 0) {
        alert("Please select at least one authority to remove.");
        return;
    }

    const userRoleAuthoritiesMap = new Map();

    selectedRows.forEach(row => {
        const userRoleId = row.getAttribute("data-user-role-id");
        const authority = row.getAttribute("data-authority");

        if (!userRoleAuthoritiesMap.has(userRoleId)) {
            userRoleAuthoritiesMap.set(userRoleId, []);
        }
        userRoleAuthoritiesMap.get(userRoleId).push(authority);
    });

    const removePromises = [];
    userRoleAuthoritiesMap.forEach((authorities, userRoleId) => {
        console.log("Removing authorities: " + authorities + " from user role: " + userRoleId);
        removePromises.push(removeAuthorities(userRoleId, authorities));
    });

    try {
        await Promise.all(removePromises);
        alert("Selected authorities have been removed.");
        await fetchUserRoles();
        createTable();
    } catch (error) {
        console.error("Failed to remove some authorities:", error);
        alert("Failed to remove some authorities.");
    }
}

async function removeAuthorities(userRoleId, authorities) {
    try {
        // Fetch the user role
        const userRole = await d2Fetch(`userRoles/${userRoleId}`);
        // Remove the deprecated authorities
        userRole.authorities = userRole.authorities.filter(auth => !authorities.includes(auth));

        // Update the user role
        await fetch(`${baseUrl}userRoles/${userRoleId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                credentials: "include",
            },
            body: JSON.stringify(userRole),
        });

        console.log(`Authorities ${authorities} removed from user role ${userRoleId}`);
    } catch (error) {
        console.error(`Failed to remove authorities ${authorities} from user role ${userRoleId}:`, error);
        throw error;
    }
}

// Initial call to fetch user roles
fetchUserRoles();
fetchSystemAuthorities();