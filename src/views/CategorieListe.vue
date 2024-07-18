<template>
  <div>
    <!-- Add category button -->
    <div class="flex justify-between items-center mb-4">
      <router-link to="/admin/categories/create" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Ajouter une catégorie</router-link>
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
      categories: []
    };
  },
  methods: {
    fetchCategories() {
      axios.get('http://127.0.0.1:8000/api/categories')
          .then(response => {
            this.categories = response.data;
            console.log('Categories loaded');
          })
          .catch(error => {
            console.error('Error fetching categories:', error);
          });
    },
    deleteCategory(categoryId) {
      axios.delete(`http://127.0.0.1:8000/api/categories/${categoryId}`)
          .then(() => {
            this.categories = this.categories.filter(category => category.id !== categoryId);
          })
          .catch(error => {
            console.error('Error deleting category:', error);
          });
    }
  },
  created() {
    setTimeout(() => {
      this.fetchCategories();
    }, 100);
  }
};
</script>