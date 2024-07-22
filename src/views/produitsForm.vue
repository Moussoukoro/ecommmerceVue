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
    const refreshToken = async () => {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('http://127.0.0.1:8000/api/refresh', {
          refresh_token: refreshToken
        });
        const { access_token, refresh_token } = response.data;
        localStorage.setItem('token', access_token);
        localStorage.setItem('refreshToken', refresh_token);
      } catch (error) {
        console.error('Erreur lors du rafraîchissement du token:', error);
        throw error;
      }
    };

    const updateProduct = async (formDataToSubmit) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token dauthentification non trouvé');
        }

        const response = await axios.patch(
            `http://127.0.0.1:8000/api/products/${props.product.id}`,
        formDataToSubmit,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
              },
            }
      );

        console.log('Produit mis à jour:', response.data);
        // Ici, vous pouvez ajouter du code pour gérer le succès, par exemple :
        // - Mettre à jour l'état local
        // - Afficher un message de succès
        // - Rediriger l'utilisateur

      } catch (error) {
        if (error.response) {
          // La requête a été faite et le serveur a répondu avec un code d'état
          // qui ne fait pas partie de la plage 2xx
          console.error('Erreur de réponse du serveur:', error.response.data);
          console.error('Status:', error.response.status);

          if (error.response.status === 401) {
            // Token invalide ou expiré
            console.error('Token invalide ou expiré. Tentative de rafraîchissement...');
            try {
              await refreshToken(); // Assurez-vous d'avoir défini cette fonction
              // Réessayez la mise à jour après le rafraîchissement du token
              return updateProduct(formDataToSubmit);
            } catch (refreshError) {
              console.error('Échec du rafraîchissement du token:', refreshError);
              // Rediriger vers la page de connexion ou afficher un message d'erreur
            }
          }
        } else if (error.request) {
          // La requête a été faite mais aucune réponse n'a été reçue
          console.error('Aucune réponse reçue:', error.request);
        } else {
          // Une erreur s'est produite lors de la configuration de la requête
          console.error('Erreur de configuration de la requête:', error.message);
        }

        // Gérer l'erreur de manière appropriée (par exemple, afficher un message à l'utilisateur)
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
