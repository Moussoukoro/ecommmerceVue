<template>
  <div>
    <h1 class="text-xl font-bold mb-4">{{ user.id ? 'Modifier Utilisateur' : 'Ajouter Utilisateur' }}</h1>

    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Nom</label>
          <input v-model="user.name" type="text" id="name" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
          <span v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</span>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="user.email" type="email" id="email" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
          <span v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</span>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
          <input v-model="user.password" type="password" id="password" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" :required="!user.id">
          <span v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</span>
        </div>

        <div>
          <label for="role" class="block text-sm font-medium text-gray-700">Rôle</label>
          <select v-model="user.role" id="role" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
            <option v-for="(label, key) in roles" :key="key" :value="key">{{ label }}</option>
          </select>
          <span v-if="errors.role" class="text-red-500 text-sm">{{ errors.role }}</span>
        </div>

        <div>
          <label for="photo" class="block text-sm font-medium text-gray-700">Photo</label>
          <input type="file" id="photo" @change="handleFileUpload" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
          <img v-if="user.photo" :src="user.photoUrl" alt="Photo de profil" class="mt-2 w-32 h-32 object-cover rounded-md">
          <span v-if="errors.photo" class="text-red-500 text-sm">{{ errors.photo }}</span>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {{ user.id ? 'Modifier' : 'Ajouter' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: {
        id: null,
        name: '',
        email: '',
        password: '',
        role: 'admin', // Role par défaut défini comme administrateur
        photo: null,
        photoUrl: null
      },
      roles: {
        admin: 'Administrateur',
        user: 'Utilisateur',
        responsable_clients: 'Responsable clients',
        responsable_commandes: 'Responsable commandes',
        responsable_produits: 'Responsable produits'
      },
      errors: {}
    };
  },
  methods: {
    handleFileUpload(event) {
      this.user.photo = event.target.files[0];
    },
    async handleSubmit() {
      const formData = new FormData();
      for (const key in this.user) {
        if (this.user[key] !== null) {
          formData.append(key, this.user[key]);
        }
      }
      try {
        if (this.user.id) {
          await axios.put(`/api/admin/users/${this.user.id}`, formData);
          alert('Utilisateur modifié avec succès.');
        } else {
          await axios.post('/api/admin/users', formData);
          alert('Utilisateur ajouté avec succès.');
        }
        this.$router.push('/users');
      } catch (error) {
        this.errors = error.response.data.errors || {};
        console.error('Error submitting form:', error);
      }
    },
    async fetchUser(userId) {
      try {
        const response = await axios.get(`/api/admin/users/${userId}`);
        this.user = response.data;
        this.user.photoUrl = `/storage/${this.user.photo}`;
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
  },
  created() {
    const userId = this.$route.params.id;
    if (userId) {
      this.user.id = userId;
      this.fetchUser(userId);
    }
  }
};
</script>

<style scoped>
/* Add your scoped styles here */
</style>
