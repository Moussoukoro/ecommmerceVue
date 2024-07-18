<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <router-link to="/admin/customers" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Retour</router-link>
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
          {{ form.id ? "Modifier" : "Créer" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import router from "@/router";

export default {
  name: 'CustomerForm',
  props: {
    customerId: {
      type: Number,
      default: null,
    },
  },
  setup(props) {
    const form = ref({
      id: null,
      firstname: '',
      lastname: '',
      address: '',
      phone: '',
      sex: '',
    });

    // Fetch customer data if editing existing customer
    const fetchCustomer = async () => {
      if (props.customerId) {
        try {
          const response = await axios.get(`/api/admin/customers/${props.customerId}`);
          const customer = response.data;
          form.value.id = customer.id;
          form.value.firstname = customer.firstname;
          form.value.lastname = customer.lastname;
          form.value.address = customer.address;
          form.value.phone = customer.phone;
          form.value.sex = customer.sex;
        } catch (error) {
          console.error('Error fetching customer:', error);
        }
      }
    };

    // Submit form data
    const submitForm = async () => {
      try {
        if (form.value.id) {
          await axios.patch(`/api/admin/customers/${form.value.id}`, form.value);
        } else {
          await axios.post('/api/admin/customers', form.value);
        }
        // Optionally, navigate to index or handle success
        router.push('/admin/customers');
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    };

    // Fetch customer data on component mount if editing
    fetchCustomer();

    return {
      form,
      submitForm,
    };
  },
};
</script>

<style scoped>
/* Add your scoped styles here */
</style>
