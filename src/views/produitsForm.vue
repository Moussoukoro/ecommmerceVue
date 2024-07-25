<template>
  <div class="card">
    <div class="card-header pb-0">
      <div class="d-flex justify-content-between align-items-center">
        <h6 class="mb-0">{{ isEditing ? 'Modifier le produit' : 'Ajouter un produit' }}</h6>
        <router-link to="/products" class="btn btn-outline-secondary btn-sm mb-0">
          Retour
        </router-link>
      </div>
    </div>
    <div class="card-body">
      <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="name" class="form-control-label">Nom du Produit</label>
              <input v-model="formData.name" type="text" id="name" class="form-control" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="price" class="form-control-label">Prix</label>
              <input v-model="formData.price" type="number" id="price" class="form-control" />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="stock" class="form-control-label">Stock</label>
              <input v-model="formData.stock" type="number" id="stock" class="form-control" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="category" class="form-control-label">Catégorie</label>
              <select v-model="formData.category_id" id="category" class="form-select">
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="description" class="form-control-label">Description</label>
          <textarea v-model="formData.description" id="description" class="form-control" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label for="photo" class="form-control-label">Photo</label>
          <div class="d-flex align-items-center">
            <img v-if="formData.photo" :src="formData.photoUrl" alt="Product Image" class="avatar avatar-sm me-3">
            <input type="file" id="photo" @change="handleFileUpload" class="form-control" />
          </div>
          <small v-if="formErrors.photo" class="text-danger">{{ formErrors.photo }}</small>
        </div>
        <div class="d-flex justify-content-end mt-4">
          <button type="submit" class="btn bg-gradient-primary btn-sm mb-0">
            {{ isEditing ? 'Modifier' : 'Ajouter' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>


<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import router from "@/router";
import Swal from "sweetalert2";

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

        Swal.fire({
          title: 'Produit ajouté',
          text: 'Le produit a été ajouté avec succès',
          icon: 'success',
          confirmButtonText: 'OK'
        });

        // Redirection vers la page de liste des produits
        router.push('/products');
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

        Swal.fire({
          title: 'Produit mis à jour',
          text: 'Le produit a été mis à jour avec succès',
          icon: 'success',
          confirmButtonText: 'OK'
        });

        // Redirection vers la page de liste des produits
        router.push('/products');

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
.card {
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 20px 27px 0 rgb(0 0 0 / 5%);
}

.card-header {
  padding: 1.5rem;
  background-color: transparent;
  border-bottom: 1px solid #e9ecef;
}

.card-body {
  padding: 1.5rem;
}

.form-control-label {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #344767;
}

.form-control, .form-select {
  font-size: 0.875rem;
  transition: all 0.2s ease-in-out;
  border-radius: 0.5rem;
}

.form-control:focus, .form-select:focus {
  border-color: #5e72e4;
  box-shadow: 0 0 0 2px rgb(94 114 228 / 25%);
}

.btn {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  transition: all 0.15s ease-in;
}

.btn-outline-secondary {
  color: #8392ab;
  border-color: #8392ab;
}

.btn-outline-secondary:hover {
  color: #ffffff;
  background-color: #8392ab;
  border-color: #8392ab;
}

.bg-gradient-primary {
  background-image: linear-gradient(310deg, #5e72e4 0%, #825ee4 100%);
  color: #ffffff;
  border: none;
}

.bg-gradient-primary:hover {
  background-image: linear-gradient(310deg, #5e72e4 0%, #825ee4 100%);
  opacity: 0.9;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
</style>