document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:3000/api';
    const form = document.getElementById('form-profile');
    const userIdEl = document.getElementById('user_id');
    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const passwordEl = document.getElementById('password');
    const phoneEl = document.getElementById('phone');
    const favoriteFoodEl = document.getElementById('favorite_food');
    const favoriteTypeEl = document.getElementById('favorite_type');
    const profilePicEl = document.getElementById('profile_picture');

    // Assume userData is stored after login
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    if (userData && userData.id) {
        userIdEl.value = userData.id;
        nameEl.value = userData.name || '';
        emailEl.value = userData.email || '';
        
        // Fetch complete profile details to fill additional fields
        fetch(`${API_URL}/profile/${userData.id}`)
            .then(response => response.json())
            .then(data => {
                phoneEl.value = data.phone || '';
                favoriteFoodEl.value = data.favorite_food || '';
                favoriteTypeEl.value = data.favorite_type || '';
            })
            .catch(err => console.error(err));
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('id', userIdEl.value.trim());
        formData.append('name', nameEl.value.trim());
        formData.append('email', emailEl.value.trim());
        // Only send password if provided
        if (passwordEl.value) {
            formData.append('password', passwordEl.value);
        }
        formData.append('phone', phoneEl.value.trim());
        formData.append('favorite_food', favoriteFoodEl.value.trim());
        formData.append('favorite_type', favoriteTypeEl.value.trim());
        if (profilePicEl.files[0]) {
            formData.append('profile_picture', profilePicEl.files[0]);
        }
        try {
            const response = await fetch(`${API_URL}/profile`, {
                method: 'PUT',
                body: formData
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            alert('Perfil atualizado com sucesso!');
            // Atualize localStorage se necessário
            localStorage.setItem('userData', JSON.stringify(data));
        } catch (error) {
            alert(error.message);
        }
    });
});
