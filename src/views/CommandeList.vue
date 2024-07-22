<template>
  <div>
    <!-- Formulaire de filtrage -->
    <div class="bg-gray-100 p-4 mb-8 text-center rounded-3xl">
      <form @submit.prevent="filterOrders" class="container flex gap-2 justify-center">
        <div class="flex flex-col">
          <label for="order_number" class="text-sm font-medium text-gray-700">Numéro de commande</label>
          <input type="text" id="order_number" v-model="filters.order_number" placeholder="Numéro commande" class="form-input text-sm rounded-2xl">
        </div>
        <div class="flex flex-col">
          <label for="customer_name" class="text-sm font-medium text-gray-700">Nom du Client</label>
          <input type="text" id="customer_name" v-model="filters.customer_name" placeholder="Nom du Client" class="form-input text-sm rounded-2xl">
        </div>
        <div class="flex flex-col">
          <label for="order_status" class="text-sm font-medium text-gray-700">Statut</label>
          <select id="order_status" v-model="filters.order_status" class="form-select text-sm rounded-2xl">
            <option value="">Tous les statuts</option>
            <option value="En attente">En attente</option>
            <option value="En cours de traitement">En cours de traitement</option>
            <option value="Terminée">Terminée</option>
            <option value="Annulée">Annulée</option>
          </select>
        </div>
        <div class="flex flex-col">
          <label for="order_date" class="text-sm font-medium text-gray-700">Date</label>
          <input type="date" id="order_date" v-model="filters.order_date" class="form-input text-sm rounded-2xl">
        </div>
        <button type="submit" class="btn btn-primary btn-sm flex-grow-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 text-xs rounded">
          Rechercher
        </button>
      </form>
    </div>
    <router-link
        to="/orders/create"
        class="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded border border-blue-700"
    >
      Ajouter une Commande
    </router-link>

    <!-- Liste des commandes -->
    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
              <tr>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Numéro de commande</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 bg-gray-50"></th>
              </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="order in orders.data" :key="order.id">
                <td class="px-6 py-4 whitespace-no-wrap">
                  <div class="text-sm leading-5 font-medium text-gray-900">{{ order.numOrder }}</div>
                </td>
                <td class="px-6 py-4 whitespace-no-wrap">
                  <div class="text-sm leading-5 text-gray-900">{{ order.customer.firstname }} {{ order.customer.lastname }}</div>
                </td>
                <td class="px-6 py-4 whitespace-no-wrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ new Date(order.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-no-wrap">
                  <div class="text-sm leading-5 text-gray-900">
                    <span :class="statusClass(order.status)" class="py-1 px-3 rounded-full text-xs">{{ order.status }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium">
                  <router-link :to="{ name: 'order-show', params: { id: order.id } }" class="text-indigo-600 hover:text-indigo-900 mr-4">Voir</router-link>
                  <router-link :to="{ name: 'order-edit', params: { id: order.id } }" class="text-indigo-600 hover:text-indigo-900 mr-4">Modifier</router-link>
                  <button @click="deleteOrder(order.id)" class="text-red-600 hover:text-red-900">Supprimer</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Suppression de la pagination -->
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      orders: {data: [], meta: {}},
      filters: {
        order_number: '',
        customer_name: '',
        order_status: '',
        order_date: ''
      },
      isLoading: false,
      errorMessage: ""
    };
  },
  methods: {
    async fetchOrders() {
      this.isLoading = true;
      this.errorMessage = '';
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/orders', {
          params: {...this.filters},
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        this.orders = response.data;
        console.log('Orders loaded');
      } catch (error) {
        console.error('Error fetching orders:', error);
        this.errorMessage = 'Erreur lors du chargement des commandes.';
        if (error.response && error.response.status === 401) {
          this.$router.push('/signin');
        }
      } finally {
        this.isLoading = false;
      }
    },
    filterOrders() {
      this.fetchOrders();
    },
    async deleteOrder(orderId) {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/orders/${orderId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          });
          this.fetchOrders(); // Recharger la liste après la suppression
        } catch (error) {
          console.error('Erreur lors de la suppression de la commande:', error);
          this.errorMessage = 'Erreur lors de la suppression de la commande.';
        }
      }
    },
    statusClass(status) {
      switch (status) {
        case 'En attente':
          return 'bg-yellow-200 text-yellow-600';
        case 'En cours de traitement':
          return 'bg-blue-200 text-blue-600';
        case 'Terminée':
          return 'bg-green-200 text-green-600';
        case 'Annulée':
          return 'bg-red-200 text-red-600';
        default:
          return 'bg-gray-200 text-gray-600';
      }
    }
    },

    mounted() {
      this.fetchOrders();
    }
  };

</script>

<style scoped>
/* Ajoutez vos styles ici si nécessaire */
</style>