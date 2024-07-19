<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <router-link to="/customers" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Retour</router-link>
    </div>
    <form @submit.prevent="submitForm" class="space-y-6">
      <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <label for="firstname" class="block text-sm font-medium text-gray-700">Prénom</label>
        <input v-model="form.firstname" type="text" id="firstname" name="firstname" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        <label for="lastname" class="block text-sm font-medium text-gray-700">Nom</label>
        <input v-model="form.lastname" type="text" id="lastname" name="lastname" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        <label for="address" class="block text-sm font-medium text-gray-700">Adresse</label>
        <input v-model="form.address" type="text" id="address" name="address" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">

        <label for="phone" class="block text-sm font-medium text-gray-700">Téléphone</label>
        <input v-model="form.phone" type="text" id="phone" name="phone" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">

        <label for="sex" class="block text-sm font-medium text-gray-700">Sexe</label>
        <select v-model="form.sex" id="sex" name="sex" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option value="">Sélectionner le sexe</option>
          <option value="M">Masculin</option>
          <option value="F">Féminin</option>
        </select>
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
  name: 'ClientForm',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const customerId = ref(route.params.id);
    const form = reactive({
      firstname: '',
      lastname: '',
      address: '',
      phone: '',
      sex: ''
    });
    const errors = reactive({});
    const isEditing = computed(() => !!customerId.value);

    const apiBaseUrl = 'http://127.0.0.1:8000/api';

    onMounted(async () => {
      if (isEditing.value) {
        await fetchCustomer();
      }
    });

    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/customers/${customerId.value}`);
        if (response.data) {
          Object.assign(form, response.data);
        }
      } catch (error) {
        console.error('Error fetching customer:', error);
        errors.value = { fetch: 'Failed to load customer data' };
      }
    };

    const submitForm = async () => {
      try {
        let url, method;
        if (isEditing.value) {
          url = `${apiBaseUrl}/customers/${customerId.value}`;
          method = 'put';
        } else {
          url = `${apiBaseUrl}/store/customers`;
          method = 'post';
        }

        await axios({method, url, data: form});
        router.push('/customers');
      } catch (error) {
        if (error.response && error.response.data.errors) {
          errors.value = error.response.data.errors;
        } else {
          console.error('Error submitting form:', error);
          errors.value = { submit: 'An error occurred while submitting the form' };
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