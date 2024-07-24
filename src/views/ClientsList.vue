<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>Liste des clients</h6>
    </div>

    <!-- <div class="mt-4 d-flex justify-content-between px-2">
    <router-link to="/customers/create" class="btn bg-gradient-primary">
      Ajouter un Client
    </router-link>
    <a href="#" class="btn bg-gradient-success">
      Exporter en PDF
    </a> -->
  <!-- </div> -->

    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Nom</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Prénom</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Adresse</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Téléphone</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Sexe</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in customers" :key="customer.id">
              <td>
                <div class="d-flex px-2 py-1">
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">{{ customer.lastname }}</h6>
                  </div>
                </div>
              </td>
              <td>
                <h6 class="mb-0 text-sm">{{ customer.firstname }}</h6>
              </td>
              <td>
                <p class="text-xs text-secondary mb-0">{{ customer.address }}</p>
              </td>
              <td>
                <p class="text-xs text-secondary mb-0">{{ customer.phone }}</p>
              </td>
              <td>
                <p class="text-xs text-secondary mb-0">{{ customer.sex }}</p>
              </td>
              <td class="align-middle">
                <router-link :to="`/customers/edit/${customer.id}`" class="text-secondary font-weight-bold text-xs" data-toggle="tooltip" data-original-title="Edit user">
                  Editer
                </router-link>
                <a href="javascript:;" @click="deleteCustomer(customer.id)" class="text-secondary font-weight-bold text-xs ms-3" data-toggle="tooltip" data-original-title="Delete user">
                  Supprimer
                </a>
              </td>
            </tr>
            <tr v-if="customers.length === 0">
              <td colspan="6" class="text-center py-4">Aucun client trouvé</td>
            </tr>
          </tbody>
        </table>
      </div>
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
