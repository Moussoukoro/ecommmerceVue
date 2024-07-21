<template>
  <div>
    <div class="flex justify-between mb-8">
      <router-link to="/products" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
        Retour
      </router-link>
    </div>

    <form class="space-y-6" @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <label class="block text-sm font-medium text-gray-700">Nom du Produit</label>
        <input v-model="formData.name" type="text" name="name" class="input-field" />

        <label class="block text-sm font-medium text-gray-700">Prix</label>
        <input v-model="formData.price" type="number" name="price" class="input-field" />

        <label class="block text-sm font-medium text-gray-700">Stock</label>
        <input v-model="formData.stock" type="number" name="stock" class="input-field" />

        <label class="block text-sm font-medium text-gray-700">Catégorie</label>
        <select v-model="formData.category_id" name="category_id" class="input-field">
          <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>
      </div>

      <label class="block text-sm font-medium text-gray-700">Description</label>
      <textarea v-model="formData.description" name="description" class="input-field"></textarea>

      <div>
        <div class="mt-1 flex items-center">
          <img v-if="formData.photo" :src="formData.photoUrl" alt="Product Image" class="h-48 w-48 rounded-full">
          <input type="file" name="photo" id="image" @change="handleFileUpload" class="ml-5 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        </div>
        <span v-if="formErrors.photo" class="text-red-500 mt-1 text-sm">{{ formErrors.photo }}</span>
      </div>

      <div class="flex justify-center">
        <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {{ isEditing ? 'Modifier' : 'Ajouter' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'ProductForm',
  props: {
    product: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const formData = ref({
      name: props.product.name || '',
      price: props.product.price || '',
      stock: props.product.stock || '',
      category_id: props.product.category_id || '',
      description: props.product.description || '',
      photo: null,
    });

    const categories = ref([]);
    const isEditing = computed(() => !!props.product.id);
    const formErrors = ref({
      photo: '',
    });

    const handleFileUpload = (event) => {
      formData.value.photo = event.target.files[0];
    };

    const createProduct = async (formDataToSubmit) => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/store/products', formDataToSubmit, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
        console.log('Produit créé:', response.data);
        // Réinitialiser le formulaire ou rediriger l'utilisateur
      } catch (error) {
        handleError(error);
      }
    };

    const updateProduct = async (formDataToSubmit) => {
      try {
        const response = await axios.patch(`http://127.0.0.1:8000/api/products/${props.product.id}`, formDataToSubmit, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
        console.log('Produit mis à jour:', response.data);
        // Peut-être rediriger l'utilisateur ou afficher un message de succès
      } catch (error) {
        handleError(error);
      }
    };

    const handleSubmit = async () => {
      const formDataToSubmit = new FormData();
      Object.keys(formData.value).forEach(key => {
        if (formData.value[key] !== null) {
          formDataToSubmit.append(key, formData.value[key]);
        }
      });

      if (isEditing.value) {
        await updateProduct(formDataToSubmit);
      } else {
        await createProduct(formDataToSubmit);
      }
    };

    const handleError = (error) => {
      if (error.response && error.response.data.errors) {
        const errors = error.response.data.errors;
        if (errors.photo) {
          formErrors.value.photo = errors.photo[0];
        }
        // Gérer d'autres erreurs de validation si nécessaire
      }
      console.error('Erreur:', error);
    };

    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token is missing');
        }

        const response = await axios.get('http://127.0.0.1:8000/api/categories', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        categories.value = response.data;
        console.log('Categories loaded');
      } catch (error) {
        console.error('Error fetching categories:', error);
        if (error.response && error.response.status === 401) {
          // Rediriger vers la page de connexion si le token est invalide ou manquant
          // Vous pouvez ajouter une redirection ici
          window.location.href = '/signin';
        }
      }
    };

    // Récupérer les catégories au chargement du composant
    onMounted(fetchCategories);

    return {
      formData,
      categories,
      isEditing,
      formErrors,
      handleFileUpload,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
/* Ajoutez vos styles CSS ici si nécessaire */
</style>
