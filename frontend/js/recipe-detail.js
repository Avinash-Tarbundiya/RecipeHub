// URL se recipe id le
const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get("id");

const container = document.getElementById("recipeDetail");

async function loadRecipe() {
  if (!recipeId) {
    container.innerHTML = "<p>Recipe not found.</p>";
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/api/recipes/${recipeId}`);
    if (!res.ok) throw new Error("Recipe not found");

    const r = await res.json();

    container.innerHTML = `
  <img src="${r.image || "img/placeholder.png"}" alt="${
      r.name
    }" class="detail-img">

  <div class="detail-content">
    <h2>${r.name}</h2>

    <p><strong>Category:</strong> ${r.category || "-"}</p>

    <p><strong>Ingredients:</strong></p>
    <ul>
      ${r.ingredients.map((i) => `<li>${i}</li>`).join("")}
    </ul>

    <p><strong>Steps:</strong></p>
    <ol>
      ${r.steps.map((s) => `<li>${s}</li>`).join("")}
    </ol>
  </div>
`;
  } catch (err) {
    container.innerHTML = "<p>Failed to load recipe. Check console.</p>";
    console.error(err);
  }
}

function goBack() {
  window.history.back();
}

loadRecipe();
