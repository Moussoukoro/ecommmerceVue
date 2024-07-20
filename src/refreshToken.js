import axios from 'axios';

export function startTokenRefreshInterval() {
    setInterval(() => {
        const tokenExpiration = localStorage.getItem('tokenExpiration');
        const currentTime = Date.now();

        // Rafraîchir le jeton 5 minutes avant son expiration
        if (tokenExpiration - currentTime < 5 * 60 * 1000) {
            refreshToken();
        }
    }, 60 * 1000); // Vérifier chaque minute
}

async function refreshToken() {
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/refresh', {}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Utilisez l'ancien jeton pour authentifier la requête
                'Content-Type': 'application/json'
            }
        });


        const newToken = response.data.token;

        // Stockez le nouveau jeton
        localStorage.setItem('token', newToken);

        // Calculez et stockez l'heure d'expiration (60 minutes à partir de maintenant)
        const tokenExpiration = Date.now() + 60 * 60 * 1000;
        localStorage.setItem('tokenExpiration', tokenExpiration);
    } catch (error) {
        console.error('Erreur lors du rafraîchissement du jeton', error);
    }
}