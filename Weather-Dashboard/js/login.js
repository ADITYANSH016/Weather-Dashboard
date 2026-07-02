const loginForm = document.getElementById("loginForm");
const error = document.getElementById("error");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {

        const response = await fetch("data/users.json");
        const users = await response.json();

        const user = users.find(function (u) {
            return u.username === username && u.password === password;
        });

        if (user) {

            window.location.href = "dashboard.html";

        } else {

            error.textContent = "Invalid Username or Password";

        }

    } catch (err) {

        error.textContent = "Something went wrong.";

    }

});
