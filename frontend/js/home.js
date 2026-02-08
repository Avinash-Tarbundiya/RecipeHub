// require session check if needed
const user = JSON.parse(sessionStorage.getItem('loggedUser') || 'null');
if (!user) {
  // optional: allow exploring; remove redirect if you allow public
  // window.location.href = 'login.html';
  console.log('No logged user');
}

// logout
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  sessionStorage.removeItem('loggedUser');
  window.location.href = 'login.html';
});

// load recipes from backend
async function fetchRecipes(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `http://localhost:3000/api/recipes${query ? '?' + query : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Fetch error');
  return res.json();
}

async function loadAll() {
  try {
    const list = await fetchRecipes();
    renderRecipes(list);
  } catch (err) {
    console.error(err);
  }
}

function renderRecipes(list) {
  const container = document.getElementById('recipeContainer');
  container.innerHTML = '';
  if (!list.length) {
    container.innerHTML = `<p style="padding:20px; color:#666">No recipes found.</p>`;
    return;
  }

  list.forEach(r => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.innerHTML = `
      <img src="${r.image || 'img/placeholder.jpg'}" alt="${r.name}">
      <h3>${r.name}</h3>
      <p class="cat">${r.category || ''}</p>
    `;

    // IMAGE CLICK → recipe-detail.html
    card.querySelector("img").onclick = (e) => {
      e.stopPropagation(); // card ke click event ko rok de
      window.location.href = `recipe-detail.html?id=${r._id}`;
    };

    // Optional: agar poore card pe click se recipe.html kholna hai, ye rakh sakte ho
    // card.addEventListener('click', () => {
    //   sessionStorage.setItem('selectedRecipeId', r._id);
    //   window.location.href = 'recipe.html';
    // });

    container.appendChild(card);
  });
}

// search
document.getElementById('searchBtn').addEventListener('click', async () => {
  const q = document.getElementById('searchInput').value.trim();
  try {
    const list = await fetchRecipes({ q });
    renderRecipes(list);
  } catch(e) { console.error(e) }
});

// category links
document.querySelectorAll('.dropdown-content a[data-cat]').forEach(a => {
  a.addEventListener('click', async (e) => {
    e.preventDefault();
    const cat = a.dataset.cat.trim();
    const list = await fetchRecipes({ category: cat });
    renderRecipes(list);
  });
});

// initial load
loadAll();
