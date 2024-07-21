<template>
  <div>
    <div class="flex justify-between mb-8">
      <router-link to="/users/create" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Ajouter un Utilisateur
      </router-link>
    </div>

    <div v-if="message" class="bg-green-200 text-green-800 p-4 rounded mb-4">
      {{ message }}
    </div>

    <div class="overflow-x-auto bg-white rounded shadow">
      <table class="w-full whitespace-no-wrap">
        <thead>
        <tr class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
          <th class="px-4 py-3">Nom</th>
          <th class="px-4 py-3">Email</th>
          <th class="px-4 py-3">Rôle</th>
          <th class="px-4 py-3">Actions</th>
        </tr>
        </thead>
        <tbody class="divide-y">
        <tr v-for="user in users" :key="user.id" class="text-gray-700">
          <td class="px-4 py-3">{{ user.name }}</td>
          <td class="px-4 py-3">{{ user.email }}</td>
          <td class="px-4 py-3">{{ roles[user.role] || 'Rôle inconnu' }}</td>
          <td class="px-4 py-3">
            <router-link :to="'/users/edit/' + user.id" class="text-indigo-600 hover:text-indigo-900">Modifier</router-link>
            <button @click="deleteUser(user.id)" class="text-red-600 hover:text-red-900 ml-4">Supprimer</button>
          </td>
        </tr>
        <tr v-if="!users.length">
          <td class="px-4 py-3 text-center" colspan="4">Aucun utilisateur trouvé</td>
        </tr>
        </tbody>
      </table>

      <!-- Pagination links if needed -->
      <!-- <pagination :data="paginationData" @paginate="fetchUsers" /> -->
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      users: [],
      roles: {
        admin: 'Administrateur',
        user: 'Utilisateur',
        responsable_clients: 'Responsable clients',
        responsable_commandes: 'Responsable commandes',
        responsable_produits: 'Responsable produits'
      },
      message: null
    };
  },
  methods: {
    fetchUsers() {
      axios.get('http://127.0.0.1:8000/api/admin/users')
          .then(response => {
            console.log('Response data:', response.data); // Inspecter les données reçues
            if (response.data && Array.isArray(response.data.data)) {
              this.users = response.data.data.filter(user => user && user.id);
            } else {
              console.error('Expected an array but got:', response.data.data);
              this.users = [];
            }
          })
          .catch(error => {
            console.error('Error fetching users:', error);
          });
    },



    deleteUser(userId) {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
        axios.delete(`http://127.0.0.1:8000/api/admin/users/${userId}`)
            .then(() => {
              this.message = 'Utilisateur supprimé avec succès.';
              this.fetchUsers();
            })
            .catch(error => {
              console.error('Error deleting user:', error);
              alert('Une erreur s\'est produite lors de la suppression de l\'utilisateur.');
            });
      }
    }
  },
  mounted() {
    this.fetchUsers();
  }
};
</script>
