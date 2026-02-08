async function fetchRecipe(id){
  const res = await fetch(`http://localhost:3000/api/recipes/${id}`);
  if(!res.ok) throw new Error('Not found');
  return res.json();
}

async function postReview(id, body){
  const res = await fetch(`http://localhost:3000/api/recipes/${id}/reviews`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(body)
  });
  return res.json();
}

(async function init(){
  const id = sessionStorage.getItem('selectedRecipeId');
  if(!id) return window.location.href = 'home.html';
  try {
    const r = await fetchRecipe(id);
    const detailEl = document.getElementById('recipeDetail');
    detailEl.innerHTML = `
      <div class="hero">
        <img src="${r.image || 'img/placeholder.jpg'}" alt="${r.name}">
        <div class="meta">
          <h1>${r.name}</h1>
          <p class="cat">${r.category || ''}</p>
          <p class="rating">Rating: ${r.rating || 0} / 5</p>
        </div>
      </div>
      <div class="cols">
        <div class="col">
          <h3>Ingredients</h3>
          <ul>${(r.ingredients || []).map(i => `<li>${i}</li>`).join('')}</ul>
        </div>
        <div class="col">
          <h3>Steps</h3>
          <ol>${(r.steps || []).map(s => `<li>${s}</li>`).join('')}</ol>
        </div>
      </div>
    `;

    // reviews
    const list = document.getElementById('reviewsList');
    list.innerHTML = (r.reviews || []).map(rv => `
      <div class="rev">
        <strong>${rv.user}</strong> <span class="rdate">${new Date(rv.createdAt).toLocaleString()}</span>
        <div class="rr">${rv.comment}</div>
        <div class="rrating">Rating: ${rv.rating}/5</div>
      </div>
    `).join('');

    // review submit
    document.getElementById('reviewForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const body = {
        user: document.getElementById('rvUser').value.trim(),
        comment: document.getElementById('rvComment').value.trim(),
        rating: Number(document.getElementById('rvRating').value)
      };
      await postReview(id, body);
      window.location.reload();
    });

  } catch(err){
    console.error(err);
    window.location.href = 'home.html';
  }
})();
