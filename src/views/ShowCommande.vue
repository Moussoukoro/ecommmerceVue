<template>
  <div v-if="order && order.customer" class="card">
    <div class="card-header pb-0">
      <div class="d-flex justify-content-between align-items-center">
        <h6 class="mb-0">Détails de la commande</h6>
        <router-link to="/orders" class="btn btn-outline-secondary btn-sm mb-0">
          Retour aux commandes
        </router-link>
      </div>
    </div>
    <div class="card-body">
      <div class="row mb-4">
        <div class="col-md-6">
          <h6 class="text-sm text-uppercase">Informations de commande</h6>
          <p class="text-sm mb-1"><strong>Numéro de commande:</strong> {{ order.numOrder }}</p>
          <p class="text-sm mb-1"><strong>Date:</strong> {{ formatDate(order.orderDate) }}</p>
          <p class="text-sm mb-1"><strong>Statut:</strong> <span :class="getStatusClass()">{{ order.status }}</span></p>
          <p class="text-sm mb-1"><strong>Paiement:</strong> {{ order.payment }}</p>
          <p class="text-sm mb-1"><strong>Total:</strong> {{ order.total }} €</p>
        </div>
        <div class="col-md-6">
          <h6 class="text-sm text-uppercase">Informations client</h6>
          <p class="text-sm mb-1"><strong>Nom:</strong> {{ order.customer.firstname }} {{ order.customer.lastname }}</p>
          <p class="text-sm mb-1"><strong>Adresse:</strong> {{ order.customer.address }}</p>
          <p class="text-sm mb-1"><strong>Téléphone:</strong> {{ order.customer.phone }}</p>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Produit</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Prix unitaire</th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Quantité</th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in order.products" :key="product.id">
              <td>
                <div class="d-flex px-2 py-1">
                  <div>
                    <img :src="`http://127.0.0.1:8000/storage/${product.photo}`" class="avatar avatar-sm me-3" :alt="product.name">
                  </div>
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">{{ product.name }}</h6>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">{{ product.price }} €</p>
              </td>
              <td class="align-middle text-center text-sm">
                <p class="text-xs font-weight-bold mb-0">{{ product.pivot.quantity }}</p>
              </td>
              <td class="align-middle text-center text-sm">
                <p class="text-xs font-weight-bold mb-0">{{ product.price * product.pivot.quantity }} €</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Chargement...</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'ShowCommande',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const order = ref(null);

    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/orders/${props.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        order.value = response.data.order;
        // console.log(response.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusClass = () => {
      switch (order.value.status) {
        case 'Terminée':
          return 'badge bg-success';
        case 'En cours':
          return 'badge bg-warning';
        default:
          return 'badge bg-secondary';
      }
    };

    onMounted(fetchOrder);

    return {
      order,
      formatDate,
      getStatusClass
    };
  }
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

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.table th, .table td {
  padding: 1rem;
  vertical-align: middle;
  border-top: 1px solid #e9ecef;
}

.badge {
  padding: 0.35em 0.65em;
  font-size: 0.75em;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
}

.bg-success {
  background-color: #2dce89 !important;
}

.bg-warning {
  background-color: #fb6340 !important;
}

.bg-secondary {
  background-color: #8392ab !important;
}
</style>