<template>
  <div>
    <div class="flex justify-between mb-8">
      <router-link to="/products/create" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Ajouter un Produit
      </router-link>
      <div class="flex justify-between">
        <a href="{{ route('products.export') }}" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Exporter
        </a>
        <a href="{{ route('products.import') }}" class="bg-teal-300 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4">
          Importer
        </a>
      </div>
    </div>

    <div class="overflow-x-auto bg-white rounded shadow">
      <table class="w-full whitespace-no-wrap">
        <thead>
        <tr class="text-2xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
          <th class="px-4 py-3">Nom</th>
          <th class="px-4 py-3">Description</th>
          <th class="px-4 py-3">Prix</th>
          <th class="px-4 py-3">Stock</th>
          <th class="px-4 py-3">Categorie</th>
          <th class="px-4 py-3">Actions</th>
        </tr>
        </thead>
        <tbody class="divide-y">
        <tr v-for="product in products" :key="product.id" class="text-gray-700">
          <td class="px-4 py-3">{{ product.name }}</td>
          <td class="px-4 py-3">{{ product.description.substring(0, 35) }}</td>
          <td class="px-4 py-3">{{ product.price }}</td>
          <td class="px-4 py-3">{{ product.stock }}</td>
          <td class="px-4 py-3">{{ product.category.name }}</td>
          <td class="px-4 py-3">
            <router-link :to="'/products/edit/' + product.id" class="text-indigo-600 hover:text-indigo-900">Modifier</router-link>
            <router-link :to="'/admin/products/show/' + product.id" class="text-indigo-600 hover:text-indigo-900 ml-4">Voir</router-link>
            <button @click="deleteProduct(product.id)" class="text-red-600 hover:text-red-900 ml-4">Supprimer</button>
          </td>
        </tr>
        <tr v-if="products.length === 0">
          <td class="px-4 py-3 text-center" colspan="5">Aucun produit trouvé</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-8">
      <pagination :data="products" @pagination-change-page="fetchProducts" />
    </div>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'Products',
  data() {
    return {
      products: [],
    };
  },
  methods: {
    fetchProducts(page = 1) {
      axios.get(`/api/admin/products?page=${page}`)
          .then(response => {
            this.products = response.data;
          })
          .catch(error => {
            console.error(error);
          });
    },
    deleteProduct(productId) {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        axios.delete(`/api/admin/products/${productId}`)
            .then(() => {
              alert('Produit supprimé avec succès.');
              this.fetchProducts();
            })
            .catch(error => {
              console.error(error);
              alert('Une erreur s\'est produite lors de la suppression du produit.');
            });
      }
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
/* Add your scoped styles here */
</style>
