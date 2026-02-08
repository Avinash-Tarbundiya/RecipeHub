// Get logged user
const user = JSON.parse(sessionStorage.getItem('loggedUser'));

if(!user){
    alert('Please login first');
    window.location.href = 'login.html';
} else {
    document.getElementById('profileData').innerHTML = `
        <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Mobile:</strong> ${user.mobile}</p>
        <p><strong>Gender:</strong> ${user.gender}</p>
        <p><strong>Date of Birth:</strong> ${user.dob}</p>
    `;
}
