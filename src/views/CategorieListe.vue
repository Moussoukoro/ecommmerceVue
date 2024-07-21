<template>
  <div>
    <!-- Add category button -->
    <div class="flex justify-between items-center mb-4">
      <router-link to="categories/create" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Ajouter une catégorie</router-link>
    </div>

    <!-- Categories table -->
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
      <tr>
        <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nom</th>
        <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
      </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
      <tr v-for="category in categories" :key="category.id">
        <td class="px-6 py-4 whitespace-nowrap">{{ category.name }}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center space-x-2">
            <router-link :to="`categories/edit/${category.id}`" class="text-indigo-600 hover:text-indigo-900">Editer</router-link>
            <button @click="deleteCategory(category.id)" class="text-red-600 hover:text-red-900 ml-4">Supprimer</button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';


export default {
  data() {
    return {
      categories: [],
      errorMessage: '', // Pour afficher les messages d'erreur si nécessaire
    };
  },
  methods: {
    async fetchCategories() {
      try {
        await this.checkToken(); // Vérifiez le jeton avant de faire la requête
        const response = await axios.get('http://127.0.0.1:8000/api/categories', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.categories = response.data;
        console.log('Categories loaded');
      } catch (error) {
        console.error('Error fetching categories:', error);
        this.errorMessage = 'Erreur lors du chargement des catégories.';
        // Rediriger vers la page de connexion si l'erreur est liée à l'authentification
      }
    },

    async deleteCategory(categoryId) {
      try {
        await this.checkToken(); // Vérifiez le jeton avant de faire la requête
        await axios.delete(`http://127.0.0.1:8000/api/categories/${categoryId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.categories = this.categories.filter(category => category.id !== categoryId);
      } catch (error) {
        console.error('Error deleting category:', error);
        this.errorMessage = 'Erreur lors de la suppression de la catégorie.';
        // Rediriger vers la page de connexion si l'erreur est liée à l'authentification
      }
    },

    async checkToken() {
      const token = localStorage.getItem('token');
      const tokenExpiration = localStorage.getItem('tokenExpiration');

      if (!token || !tokenExpiration || Date.now() > tokenExpiration) {
        await this.refreshToken();
      }
    },

    async refreshToken() {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/refresh', {}, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('tokenExpiration', Date.now() + 3600 * 1000); // Jeton expire après 1 heure
      } catch (error) {
        console.error('Error refreshing token:', error);
        // Rediriger vers la page de connexion si le rafraîchissement échoue
      }
    }
  },
  created() {
    this.fetchCategories(); // Pas besoin de setTimeout pour l'initialisation
  }
};
</script>
