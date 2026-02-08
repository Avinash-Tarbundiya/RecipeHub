// Fetch all recipes and display
async function loadRecipes() {
    const res = await fetch('http://localhost:3000/api/recipes');
    const recipes = await res.json();
    const container = document.getElementById('recipeContainer');
    if(container){
        container.innerHTML = '';
        recipes.forEach(recipe => {
            const div = document.createElement('div');
            div.className = 'recipe-card';
            div.innerHTML = `
                <h3>${recipe.name}</h3>
                <p><b>Category:</b> ${recipe.category}</p>
                <p><b>Ingredients:</b> ${recipe.ingredients}</p>
                <p><b>Steps:</b> ${recipe.steps}</p>
            `;
            container.appendChild(div);
        });
    }
}

// Add recipe form submit
const form = document.getElementById('recipeForm');
if(form){
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            name: form.name.value,
            category: form.category.value,
            ingredients: form.ingredients.value,
            steps: form.steps.value,
            image: form.image.value
        };
        await fetch('http://localhost:3000/api/recipes', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(data)
        });
        alert('Recipe Added!');
        form.reset();
    });
}

loadRecipes();
