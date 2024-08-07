<template>
  <div class="card">
    <div class="card-header pb-0">
      <div class="d-flex justify-content-between">
        <h6>{{ isEditing ? 'Modifier la catégorie' : 'Créer une nouvelle catégorie' }}</h6>
        <router-link to="/categories" class="btn btn-outline-secondary btn-sm mb-0">
          Retour
        </router-link>
      </div>
    </div>
    <div class="card-body">
      <form @submit.prevent="submitForm">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="name" class="form-control-label">Nom de la catégorie</label>
              <input
                type="text"
                id="name"
                v-model="form.name"
                class="form-control"
                :class="{ 'is-invalid': errors.name }"
              />
              <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-12">
            <button type="submit" class="btn bg-gradient-primary">
              {{ isEditing ? 'Modifier' : 'Créer' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>



<script>
import { reactive, onMounted, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import Swal from "sweetalert2";

export default {
  name: 'CategoryForm',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const categoryId = ref(route.params.id);
    const form = reactive({name: ''});
    const errors = reactive({});
    const isEditing = computed(() => !!categoryId.value);

    const getToken = () => {
      return localStorage.getItem('token');
    };

    const api = axios.create({
      baseURL: 'http://127.0.0.1:8000/api',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });

    onMounted(async () => {
      if (isEditing.value) {
        await fetchCategory();
      }
    });

    const fetchCategory = async () => {
      try {
        const response = await api.get(`/categories/${categoryId.value}`);
        if (response.data && response.data.name) {
          form.name = response.data.name;
        }
      } catch (error) {
        console.error('Error fetching category:', error);
        // Gérer l'erreur (par exemple, rediriger vers une page d'erreur ou afficher un message)
      }
    };

    const submitForm = async () => {
      try {
        const url = isEditing.value
          ? `/categories/${categoryId.value}`
          : `/store/categories`;
        const method = isEditing.value ? 'put' : 'post';
        await api({method, url, data: form});

        Swal.fire({
        title: "Fait !",
        text: "La catégorie a été enregistrée avec succès",
        icon: "success"
      });

        router.push('/categories');
        
      } catch (error) {
        if (error.response && error.response.data.errors) {
          errors.name = error.response.data.errors.name;
        } else {
          console.error('Error submitting form:', error);
          // Gérer l'erreur (par exemple, afficher un message d'erreur générique)
        }
      }
    };

    return {
      form,
      errors,
      submitForm,
      isEditing,
    };
  },
};
</script>
