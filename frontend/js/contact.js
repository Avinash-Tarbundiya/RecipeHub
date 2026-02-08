document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    try {
        const res = await fetch('http://localhost:3000/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, message })
        });
        const data = await res.json();
        alert(data.message);
        document.getElementById('feedbackForm').reset();
    } catch(err) {
        console.error(err);
        alert('Something went wrong. Please try again.');
    }
});
