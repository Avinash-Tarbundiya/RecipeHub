document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = {
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        gender: document.getElementById("gender").value,
        dob: document.getElementById("dob").value,
        mobile: document.getElementById("mobile").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value
    };

    try {
        const res = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });

        const data = await res.json();

        if (res.ok) {
            alert("Registration Successful");
            window.location.href = "login.html";
        } else {
            alert(data.message || "Registration Failed");
        }
    } catch (error) {
        console.error(error);
        alert("Server not reachable or error occurred");
    }
});
