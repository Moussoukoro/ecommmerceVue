<template>
  <div class="card my-5">
    <div class="card-header pb-0 d-flex justify-content-between">
      <h6>Liste des catégories</h6>
      <div class="mt-4">
        <router-link 
          to="categories/create" 
          class="btn bg-gradient-primary"
        >
          Ajouter une catégorie
        </router-link>
      </div>
    </div>

     <!-- Add category button -->


    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                Nom
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categories" :key="category.id">
              <td>
                <div class="d-flex px-2 py-1">
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">{{ category.name }}</h6>
                  </div>
                </div>
              </td>
              <td>
                <div class="d-flex">
                  <router-link 
                    :to="`categories/edit/${category.id}`" 
                    class="text-secondary font-weight-bold text-xs me-3"
                    data-toggle="tooltip"
                    data-original-title="Edit category"
                  >
                    Editer
                  </router-link>
                  <a
                    href="javascript:;"
                    class="text-secondary font-weight-bold text-xs"
                    data-toggle="tooltip"
                    data-original-title="Delete category"
                    @click="deleteCategory(category.id)"
                  >
                    Supprimer
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  
 
</template>

<script>
import axios from 'axios';
import Swal from "sweetalert2";


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
        // Demander une confirmation avant de supprimer avec SweetAlert
        const result = await Swal.fire({
          title: 'Êtes-vous sûr ?',
          text: 'Vous ne pourrez pas revenir en arrière !',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Oui, supprimer',
          cancelButtonText: 'Annuler'
        });
        
        if (!result.isConfirmed) {
          return;
        }
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
