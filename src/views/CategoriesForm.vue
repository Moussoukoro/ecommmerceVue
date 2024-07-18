<template>
  <div>
    <div class="flex justify-between mb-8">
      <router-link to="/categories" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
        Retour
      </router-link>
    </div>

    <form @submit.prevent="submitForm" class="space-y-6">
      <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <label for="name" class="block text-sm font-medium text-gray-700">Nom de la catégorie</label>
        <input
            type="text"
            id="name"
            v-model="form.name"
            class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
        <p v-if="errors.name" class="mt-2 text-sm text-red-600">{{ errors.name }}</p>
      </div>

      <div>
        <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {{ isEditing ? 'Modifier' : 'Créer' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { reactive, onMounted, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

export default {
  name: 'CategoryForm',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const categoryId = ref(route.params.id);
    const form = reactive({name: ''});
    const errors = reactive({});
    const isEditing = computed(() => !!categoryId.value);

    const apiBaseUrl = 'http://127.0.0.1:8000/api';

    onMounted(async () => {
      if (isEditing.value) {
        await fetchCategory();
      }
    });

    const fetchCategory = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/categories/${categoryId.value}`);
        if (response.data && response.data.name) {
          form.name = response.data.name;
        }
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    };

    const submitForm = async () => {
      try {
        const url = isEditing.value
            ? `${apiBaseUrl}/categories/${categoryId.value}`
            : `${apiBaseUrl}/store/categories`;
        const method = isEditing.value ? 'put' : 'post';

        await axios({method, url, data: form});
        router.push('/categories');
      } catch (error) {
        if (error.response && error.response.data.errors) {
          errors.name = error.response.data.errors.name;
        } else {
          console.error('Error submitting form:', error);
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