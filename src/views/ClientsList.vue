<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <router-link to="/customers/create" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Ajouter un Client
      </router-link>
      <a href="{{ route('customers.exportPDF') }}" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Exporter en PDF
      </a>
    </div>

    <div class="overflow-x-auto bg-white rounded shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-2xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
          <th class="px-6 py-3 text-left text-2xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
          <th class="px-6 py-3 text-left text-2xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
          <th class="px-6 py-3 text-left text-2xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
          <th class="px-6 py-3 text-left text-2xs font-medium text-gray-500 uppercase tracking-wider">Sexe</th>
          <th class="px-6 py-3 text-left text-2xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="customer in customers" :key="customer.id">
          <td class="px-6 py-4 whitespace-nowrap">{{ customer.lastname }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ customer.firstname }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ customer.address }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ customer.phone }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ customer.sex }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <router-link :to="`/customers/edit/${customer.id}`" class="text-indigo-600 hover:text-indigo-900">Editer</router-link>
            <button @click="deleteCustomer(customer.id)" class="text-red-600 hover:text-red-900 ml-4">Supprimer</button>
<!--            <router-link :to="{ name: 'admin.customers.show', params: { id: customer.id }}" class="text-indigo-600 hover:text-indigo-900 ml-4">-->
<!--              Historique-->
<!--            </router-link>-->
          </td>
        </tr>
        <tr v-if="customers.length === 0">
          <td class="px-6 py-4 text-center" colspan="6">Aucun client trouvé</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-6">
      <pagination :data="customers" @pagination-change-page="fetchCustomers" :hide-if-empty="true" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'Clients',
  setup() {
    const customers = ref([]);

    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/customers');
        customers.value = response.data;
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    const deleteCustomer = async (customerId) => {
      if (confirm('Voulez-vous vraiment supprimer ce client ?')) {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/customers/${customerId}`);
          // Optionally, update state or notify user
          fetchCustomers();
        } catch (error) {
          console.error('Error deleting customer:', error);
        }
      }
    };

    // Fetch customers on component mount
    onMounted(fetchCustomers);

    return {
      customers,
      fetchCustomers,
      deleteCustomer,
    };
  },
};
</script>

<style scoped>
/* Add your scoped styles here */
</style>
