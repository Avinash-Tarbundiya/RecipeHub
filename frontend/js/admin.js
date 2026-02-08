// ---------------- PAGE SWITCHING ----------------
document.querySelectorAll(".sidebar ul li").forEach((li) => {
  li.addEventListener("click", () => {
    document
      .querySelectorAll(".sidebar ul li")
      .forEach((x) => x.classList.remove("active"));
    li.classList.add("active");

    let page = li.dataset.page;
    if (!page) return;

    document
      .querySelectorAll(".page")
      .forEach((p) => p.classList.remove("active"));
    document.getElementById(page).classList.add("active");

    if (page === "users") loadUsers();
    if (page === "loginHistory") loadLoginHistory();
    if (page === "recipes") loadRecipes();
  });
});

// ---------------- USERS ----------------
async function loadUsers() {
  const container = document.getElementById("usersList");
  container.innerHTML = "Loading users...";

  try {
    const res = await fetch("http://localhost:3000/api/auth/users");
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const users = await res.json();

    if (!users || users.length === 0) {
      container.innerHTML = "<p>No users found.</p>";
      return;
    }

    // Create table
    let table = document.createElement("table");

    // Table header
    table.innerHTML = `
      <thead>
        <tr>
          <th>Full Name</th>
          <th>Email</th>
          <th>Gender</th>
          <th>DOB</th>
          <th>Mobile</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    `;

    const tbody = table.querySelector("tbody");

    users.forEach((u) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td data-label="Full Name">${u.firstName} ${u.lastName}</td>
        <td data-label="Email">${u.email}</td>
        <td data-label="Gender">${u.gender}</td>
        <td data-label="DOB">${u.dob}</td>
        <td data-label="Mobile">${u.mobile}</td>
        <td data-label="Actions">
          <button class="del" data-id="${u._id}">Delete</button>
        </td>
      `;

      // Delete button
      tr.querySelector(".del").onclick = async () => {
        if (!confirm("Delete this user?")) return;
        try {
          await fetch(`http://localhost:3000/api/auth/delete/${u._id}`, {
            method: "DELETE",
          });
          loadUsers();
        } catch (err) {
          alert("Failed to delete user.");
          console.error(err);
        }
      };

      tbody.appendChild(tr);
    });

    container.innerHTML = "";
    container.appendChild(table);
  } catch (err) {
    container.innerHTML =
      "<p>Failed to load users. Check server & console.</p>";
    console.error(err);
  }
}

// ---------------- LOGIN HISTORY ----------------
async function loadLoginHistory() {
  const container = document.getElementById("loginHistoryList");
  container.innerHTML = "Loading login history...";

  try {
    const res = await fetch("http://localhost:3000/api/auth/loginHistory");
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const history = await res.json();

    if (!history || history.length === 0) {
      container.innerHTML = "<p>No login history found.</p>";
      return;
    }

    // Create table
    let table = document.createElement("table");

    table.innerHTML = `
      <thead>
        <tr>
          <th>Email</th>
          <th>Login Time</th>
          <th>IP</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    `;

    const tbody = table.querySelector("tbody");

    history.forEach((h) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td data-label="Email">${h.email || "-"}</td>
        <td data-label="Login Time">${
          h.loginAt ? new Date(h.loginAt).toLocaleString() : "-"
        }</td>
        <td data-label="IP">${h.ip || "-"}</td>
      `;
      tbody.appendChild(tr);
    });

    container.innerHTML = "";
    container.appendChild(table);
  } catch (err) {
    container.innerHTML =
      "<p>Failed to load login history. Check server & console.</p>";
    console.error(err);
  }
}

// ---------------- RECIPES ----------------
async function loadRecipes() {
  const container = document.getElementById("recipeList");
  container.innerHTML = "Loading recipes...";

  try {
    const res = await fetch("http://localhost:3000/api/recipes");
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const recipes = await res.json();
    console.log("Recipes data:", recipes);

    container.innerHTML = "";

    if (!recipes || recipes.length === 0) {
      container.innerHTML = "<p>No recipes found.</p>";
      return;
    }

    recipes.forEach((r) => {
      let card = document.createElement("div");
      card.className = "recipe-card card"; // updated class

      card.innerHTML = `
        <img src="${r.image || "img/placeholder.png"}" alt="${
        r.name || "Recipe"
      }">
        <div class="card-content">
          <h3>${r.name || "-"}</h3>
          <p>${r.category || "-"}</p>
          <div class="actions" style="margin-top:8px;">
            <button class="edit" data-id="${r._id}">Edit</button>
            <button class="del" data-id="${r._id}">Delete</button>
          </div>
        </div>
      `;

      // Existing card code me ye add kar:
      card.querySelector("img").onclick = () => {
  window.location.href = `recipe-detail.html?id=${r._id}`;
};


      // Edit button
      card.querySelector(".edit").onclick = () => fillForm(r);

      // Delete button
      card.querySelector(".del").onclick = async () => {
        if (!confirm("Delete recipe?")) return;
        try {
          await fetch(`http://localhost:3000/api/recipes/${r._id}`, {
            method: "DELETE",
          });
          loadRecipes();
        } catch (err) {
          alert("Failed to delete recipe.");
          console.error(err);
        }
      };

      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML =
      "<p>Failed to load recipes. Check server & console.</p>";
    console.error("Error fetching recipes:", err);
  }
}

// ---------------- FILL EDIT FORM ----------------
function fillForm(r) {
  document.getElementById("rid").value = r._id;
  document.getElementById("rname").value = r.name || "";
  document.getElementById("rimg").value = r.image || "";
  document.getElementById("rcat").value = r.category || "";
  document.getElementById("ring").value = r.ingredients
    ? r.ingredients.join(",")
    : "";
  document.getElementById("rsteps").value = r.steps ? r.steps.join("\n") : "";

  document.querySelector('[data-page="addRecipe"]').click();
}

// ---------------- ADD / EDIT RECIPE ----------------
document.getElementById("addForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  let id = document.getElementById("rid").value;

  let data = {
    name: document.getElementById("rname").value,
    image: document.getElementById("rimg").value,
    category: document.getElementById("rcat").value,
    ingredients: document
      .getElementById("ring")
      .value.split(",")
      .map((i) => i.trim()),
    steps: document
      .getElementById("rsteps")
      .value.split("\n")
      .map((s) => s.trim()),
  };

  try {
    if (id) {
      await fetch(`http://localhost:3000/api/recipes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("http://localhost:3000/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    document.getElementById("addForm").reset();
    loadRecipes();
  } catch (err) {
    alert("Failed to save recipe. Check server & console.");
    console.error(err);
  }
});

// ---------------- CLEAR FORM ----------------
document.getElementById("clearBtn").onclick = () => {
  document.getElementById("addForm").reset();
  document.getElementById("rid").value = "";
};

// ---------------- LOGOUT ----------------
document.getElementById("logoutBtn").onclick = () => {
  sessionStorage.removeItem("loggedUser");
  window.location.href = "login.html";
};
