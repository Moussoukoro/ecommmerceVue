<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>Liste des commandes</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <!-- Formulaire de recherche -->
      <div class="p-4 mb-4">
        <form @submit.prevent="searchOrders" class="d-flex gap-2 justify-content-center">
          <input v-model="searchForm.order_number" type="text" placeholder="Numero commande" class="form-control form-control-sm">
          <input v-model="searchForm.customer_name" type="text" placeholder="Nom du Client" class="form-control form-control-sm">
          <select v-model="searchForm.order_status" class="form-select form-select-sm">
            <option value="">Tous les status</option>
            <option value="En attente">En attente</option>
            <option value="En cours de traitement">En cours de traitement</option>
            <option value="Terminée">Terminée</option>
            <option value="Annulée">Annulée</option>
          </select>
          <input v-model="searchForm.order_date" type="date" class="form-control form-control-sm">
          <button type="submit" class="btn btn-primary btn-sm">
            Rechercher
          </button>
        </form>
      </div>

      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
          <tr>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Numéro de commande</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Client</th>
            <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Date</th>
            <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Status</th>
            <th class="text-secondary opacity-7"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>
              <div class="d-flex px-2 py-1">
                <div class="d-flex flex-column justify-content-center">
                  <h6 class="mb-0 text-sm">{{ order.numOrder }}</h6>
                </div>
              </div>
            </td>
            <td>
              <p class="text-xs font-weight-bold mb-0">{{ order.customer.firstname }} {{ order.customer.lastname }}</p>
            </td>
            <td class="align-middle text-center text-sm">
              <span class="text-secondary text-xs font-weight-bold">{{ formatDate(order.created_at) }}</span>
            </td>
            <td class="align-middle text-center text-sm">
              <span :class="getStatusBadgeClass(order.status)">{{ order.status }}</span>
            </td>
            <td class="align-middle">
              <router-link :to="`/orders/${order.id}`" class="text-secondary font-weight-bold text-xs" data-toggle="tooltip" data-original-title="Voir commande">
                Voir
              </router-link>
              <a v-if="order.status === 'En cours de traitement'" @click.prevent="validateOrder(order.id)" href="#" class="text-success font-weight-bold text-xs ms-2" data-toggle="tooltip" data-original-title="Valider commande">
                Valider
              </a>
              <a v-if="order.status === 'En cours de traitement' || order.status === 'En attente'" @click.prevent="cancelOrder(order.id)" href="#" class="text-danger font-weight-bold text-xs ms-2" data-toggle="tooltip" data-original-title="Annuler commande">
                Annuler
              </a>
              <a v-if="order.status === 'En attente'" @click.prevent="processOrder(order.id)" href="#" class="text-info font-weight-bold text-xs ms-2" data-toggle="tooltip" data-original-title="En cours de traitement">
                En cours
              </a>

            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Bouton pour ajouter une commande -->
  <div class="mt-4">
    <router-link to="/orders/create" class="btn bg-gradient-primary">
      Ajouter une Commande
    </router-link>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Swal from "sweetalert2";

export default {
  name: 'CommandeList',
  setup() {
    const orders = ref([]);
    const searchForm = ref({
      order_number: '',
      customer_name: '',
      order_status: '',
      order_date: '',
    });

    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/orders',
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        orders.value = response.data.orders;
        console.log('Ceci est les commandes' + response.data)
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    const filteredOrders = computed(() => {
      if (!orders.value) return [];
      return orders.value.filter(order => {
        const matchOrderNumber = order.numOrder.toLowerCase().includes(searchForm.value.order_number.toLowerCase());
        const matchCustomerName = (order.customer.firstname + ' ' + order.customer.lastname).toLowerCase().includes(searchForm.value.customer_name.toLowerCase());
        const matchStatus = searchForm.value.order_status === '' || order.status === searchForm.value.order_status;
        const matchDate = searchForm.value.order_date === '' || order.orderDate === searchForm.value.order_date;

        return matchOrderNumber && matchCustomerName && matchStatus && matchDate;
      });
    });

    const searchOrders = () => {
      // Cette fonction peut être utilisée pour réinitialiser les filtres ou effectuer d'autres actions
      console.log('Recherche effectuée');
    };

    const deleteOrder = async (orderId) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette commande?')) {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/orders/${orderId}`);
          fetchOrders(); // Rafraîchir la liste après suppression
        } catch (error) {
          console.error('Error deleting order:', error);
        }
      }
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const getStatusBadgeClass = (status) => {
      switch (status) {
        case 'En attente':
          return 'badge badge-sm bg-gradient-warning';
        case 'En cours de traitement':
          return 'badge badge-sm bg-gradient-info';
        case 'Terminée':
          return 'badge badge-sm bg-gradient-success';
        case 'Annulée':
          return 'badge badge-sm bg-gradient-danger';
        default:
          return 'badge badge-sm bg-gradient-secondary';
      }
    };
    const validateOrder = async (orderId) => {
      const result = await Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: 'Vous ne pourrez pas revenir en arrière !',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, valider',
        cancelButtonText: 'Annuler'
      });
      if (result.isConfirmed) {
        try {
          await axios.put(`http://127.0.0.1:8000/api/orders/${orderId}/validate`, {},
              { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          );
          fetchOrders(); // Rafraîchir la liste après validation
        } catch (error) {
          console.error('Error validating order:', error);
        }
      }
    };
    const cancelOrder = async (orderId) => {
      const result = await Swal.fire({
        title: 'Êtes-vous sûr de vouloir annuler ?',
        text: 'Vous ne pourrez pas revenir en arrière !',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, annuler',
        cancelButtonText: 'Annuler'
      });
      if (result.isConfirmed) {
        try {
          await axios.put(`http://127.0.0.1:8000/api/orders/${orderId}/cancel`, {},
              { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          );
          fetchOrders(); // Rafraîchir la liste après annulation
        } catch (error) {
          console.error('Error canceling order:', error);
        }
      }
    };

    const processOrder = async (orderId) => {
      const result = await Swal.fire({
        title: 'Êtes-vous sûr de vouloir mettre cette commande en cours de traitement ?',
        text: 'Vous ne pourrez pas revenir en arrière !',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, traiter',
        cancelButtonText: 'Annuler'
      });
      if (result.isConfirmed) {
        try {
          await axios.put(`http://127.0.0.1:8000/api/orders/${orderId}/process`, {},
              { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          );
          fetchOrders(); // Rafraîchir la liste après mise en traitement
        } catch (error) {
          console.error('Error processing order:', error);
        }
      }
    };







    onMounted(fetchOrders);

    return {
      orders: filteredOrders,
      searchForm,
      searchOrders,
      deleteOrder,
      formatDate,
      getStatusBadgeClass,
      validateOrder,
      cancelOrder,
      processOrder
    };
  },
};
</script>

<style scoped>
.text-success {
  color: #28a745 !important;
}

.text-danger {
  color: #dc3545 !important;
}

.text-info {
  color: #17a2b8 !important;
}

/* Optionnel : ajoutez un effet de survol */
.text-success:hover, .text-danger:hover, .text-info:hover {
  text-decoration: underline;
  opacity: 0.8;
}
</style>