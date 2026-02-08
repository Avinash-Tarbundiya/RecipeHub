document.getElementById('forgetForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const newPassword = document.getElementById('newPassword').value.trim();

  try {
    const res = await fetch('http://localhost:3000/api/users/reset-password', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email, newPassword })
    });
    const data = await res.json();
    alert(data.message);
    document.getElementById('forgetForm').reset();
  } catch(err) { console.error(err); }
});
