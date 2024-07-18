<template>
  <div>
    <div class="flex justify-between mb-8">
      <router-link to="/admin/products" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
        Retour
      </router-link>
    </div>

    <form class="space-y-6" @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <label class="block text-sm font-medium text-gray-700">Nom de la Produit</label>
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
        <label for="image" class="block text-sm font-medium text-gray-700">Image</label>
        <div class="mt-1 flex items-center">
          <img v-if="formData.photo" :src="formData.photoUrl" alt="Product Image" class="h-48 w-48 rounded-full">
          <img v-else src="defaultImageSrc" alt="Default Image" class="h-48 w-48 rounded-full">
          <input type="file" name="photo" id="image" @change="handleFileUpload" class="ml-5 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        </div>
        <span v-if="formErrors.photo" class="text-red-500 mt-1 text-sm">{{ formErrors.photo }}</span>
      </div>

      <div class="flex justify-center">
        <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {{ formTitle }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
  name: 'ProductForm',
  props: {
    product: Object, // This should be passed as a prop from the parent component
    categories: Array, // This should be passed as a prop from the parent component
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

    const formTitle = ref(props.product.exists ? 'Modifier' : 'Ajouter');
    const defaultImageSrc = ref('defaultImageSrc'); // Provide the URL for the default image

    const formErrors = ref({
      photo: '', // To store validation error for photo upload
    });

    const handleFileUpload = (event) => {
      formData.value.photo = event.target.files[0];
    };

    const handleSubmit = async () => {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('name', formData.value.name);
      formDataToSubmit.append('price', formData.value.price);
      formDataToSubmit.append('stock', formData.value.stock);
      formDataToSubmit.append('category_id', formData.value.category_id);
      formDataToSubmit.append('description', formData.value.description);
      formDataToSubmit.append('photo', formData.value.photo);

      try {
        if (props.product.exists) {
          await axios.patch(`/api/admin/products/${props.product.id}`, formDataToSubmit, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } else {
          await axios.post('/api/admin/products', formDataToSubmit, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }
        // Optionally, handle success actions like redirect or notify user
      } catch (error) {
        if (error.response && error.response.data.errors) {
          const errors = error.response.data.errors;
          if (errors.photo) {
            formErrors.value.photo = errors.photo[0];
          }
          // Handle other validation errors as needed
        }
        // Handle other errors like network issues
        console.error(error);
      }
    };

    return {
      formData,
      formTitle,
      defaultImageSrc,
      formErrors,
      handleFileUpload,
      handleSubmit,
    };
  },
};
</script>

<!--<style scoped>-->
<!--//.input-field {-->
<!--//  // Add your custom input styles here-->
<!--//}-->
<!--</style>-->
