const api = "http://localhost:3000";

// REGISTER
if (document.getElementById("registerForm")) {
  document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${api}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      alert("Registered successfully!");
      window.location.href = "login.html";
    } else {
      alert("Registration failed!");
    }
  });
}

// LOGIN
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${api}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      alert("Login successful!");
      window.location.href = "users.html";
    } else {
      alert(data.error || "Login failed!");
    }
  });
}

// SHOW USERS
if (document.getElementById("userList")) {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
  } else {
    fetch(`${api}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((users) => {
        const list = document.getElementById("userList");
        users.forEach((u) => {
          const li = document.createElement("li");
          li.textContent = u.username;
          list.appendChild(li);
        });
      })
      .catch(() => alert("Failed to fetch users"));
  }

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });
}
