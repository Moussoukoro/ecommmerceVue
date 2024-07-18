<template>
  <div>
    <div class="flex justify-between mb-8">
      <a href="{{ route('admin.orders.index') }}" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Retour</a>
    </div>

    <form @submit.prevent="saveOrder">
      <!-- Commande details -->
      <div class="flex justify-between">
        <div class="px-3 py-2 w-1/3">
          <label for="numOrder" class="block font-medium text-sm text-gray-700">Numéro de Commande</label>
          <input type="text" v-model="order.numOrder" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" readonly>
          <span v-if="errors.numOrder" class="text-sm text-red-500 mt-1">{{ errors.numOrder }}</span>
        </div>

        <div class="px-3 py-2 w-1/3">
          <label for="orderDate" class="block font-medium text-sm text-gray-700">Date de Commande</label>
          <input type="date" v-model="order.orderDate" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          <span v-if="errors.orderDate" class="text-sm text-red-500 mt-1">{{ errors.orderDate }}</span>
        </div>

        <div class="px-3 py-2 w-1/3">
          <label for="payment" class="block font-medium text-sm text-gray-700">Mode de Paiement</label>
          <select v-model="order.payment" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            <option value="">Sélectionner un mode de paiement</option>
            <option value="Espece">Espece</option>
            <option value="Chèque">Chèque</option>
            <option value="Carte Bancaire">Carte Bancaire</option>
          </select>
          <span v-if="errors.payment" class="text-sm text-red-500 mt-1">{{ errors.payment }}</span>
        </div>
      </div>

      <!-- Statut et Utilisateur -->
      <div class="flex justify-between">
        <div class="px-3 py-2 w-1/2">
          <label for="status" class="block font-medium text-sm text-gray-700">Statut</label>
          <select v-model="order.status" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            <option value="">Sélectionner un statut</option>
            <option value="En attente">En attente</option>
            <option value="En cours de traitement">En cours de traitement</option>
            <option value="Terminée">Terminée</option>
            <option value="Annulée">Annulée</option>
          </select>
          <span v-if="errors.status" class="text-sm text-red-500 mt-1">{{ errors.status }}</span>
        </div>

        <div class="px-3 py-2 w-1/2">
          <label for="user_name" class="block font-medium text-sm text-gray-700">Commande faite par</label>
          <input type="text" v-model="order.userName" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" readonly>
          <input type="hidden" v-model="order.userId">
          <span v-if="errors.user_id" class="text-sm text-red-500 mt-1">{{ errors.user_id }}</span>
        </div>
      </div>

      <!-- Choix du client -->
      <div class="flex justify-between mb-4">
        <div class="px-3 py-2 w-1/3">
          <label for="customer_id" class="block font-medium text-sm text-gray-700">Client</label><select v-model="order.customerId" @change="fetchCustomerDetails" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          <option value="">Sélectionner un client</option>
          <option v-for="customer in customers" :key="customer.id" :value="customer.id">
            {{ customer.firstname }} {{ customer.lastname }}
          </option>
        </select>
          <span v-if="errors.customer_id" class="text-sm text-red-500 mt-1">{{ errors.customer_id }}</span>
        </div>

        <div class="px-3 py-2 w-1/3">
          <label for="customerAddress" class="block font-medium text-sm text-gray-700">Adresse Client</label>
          <input type="text" v-model="customerAddress" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" readonly>
        </div>

        <div class="px-3 py-2 w-1/3">
          <label for="customerTel" class="block font-medium text-sm text-gray-700">Numéro de Téléphone</label>
          <input type="text" v-model="customerTel" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" readonly>
        </div>
      </div>

      <!-- Tableau des produits -->
      <div class="overflow-x-auto bg-white rounded shadow mb-8">
        <table class="w-full whitespace-no-wrap">
          <thead>
          <tr class="text-2xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
            <th class="px-4 py-3">Produit</th>
            <th class="px-4 py-3">Quantité Commandée</th>
            <th class="px-4 py-3">Prix Produit</th>
            <th class="px-4 py-3">Total Ligne</th>
            <th class="px-4 py-3">Actions</th>
          </tr>
          </thead>
          <tbody class="divide-y">
          <tr v-for="(product, index) in order.products" :key="index">
            <td class="px-4 py-3">
              <input type="text" v-model="product.productId" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" readonly>
              <span v-if="errors.products && errors.products[index] && errors.products[index].productId" class="text-sm text-red-500 mt-1">{{ errors.products[index].productId }}</span>
            </td>
            <td class="px-4 py-3">
              <input type="text" v-model="product.quantity" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              <span v-if="errors.products && errors.products[index] && errors.products[index].quantity" class="text-sm text-red-500 mt-1">{{ errors.products[index].quantity }}</span>
            </td>
            <td class="px-4 py-3">
              <input type="text" v-model="product.price" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" readonly>
              <span v-if="errors.products && errors.products[index] && errors.products[index].price" class="text-sm text-red-500 mt-1">{{ errors.products[index].price }}</span>
            </td>
            <td class="px-4 py-3">
              <input type="text" v-model="product.total" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" readonly>
              <span v-if="errors.products && errors.products[index] && errors.products[index].total" class="text-sm text-red-500 mt-1">{{ errors.products[index].total }}</span>
            </td>
            <td class="px-4 py-3">
              <a href="#" class="text-red-500 hover:text-red-700 mr-2" @click.prevent="deleteProduct(index)">Supprimer</a>
              <a href="#" class="text-blue-500 hover:text-blue-700" @click.prevent="editProduct(index)">Modifier</a>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Actions -->
      <div class="flex justify-between mb-8">
        <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Enregistrer</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      order: {},
      customers: [],
      customerAddress: '',
      customerTel: '',
      errors: {}
    };
  },
  methods: {
    saveOrder() {
      // Logic to save the order using API or Vuex actions
      console.log('Saving order...', this.order);
      // Example of API call
      axios.post('/api/orders', this.order)
          .then(response => {
            console.log('Order saved successfully!', response.data);
            // Optionally redirect or show success message
          })
          .catch(error => {
            console.error('Error saving order:', error.response.data);
            // Handle errors and show validation errors if any
            this.errors = error.response.data.errors;
          });
    },
    deleteProduct(index) {
      this.order.products.splice(index, 1);
    },
    editProduct(index) {
      // Handle editing logic here
    },
    fetchCustomerDetails() {
      // Fetch customer details based on selected customer ID
      if (this.order.customerId) {
        axios.get(`/api/customers/${this.order.customerId}`)
            .then(response => {
              console.log('Customer details:', response.data);
              this.customerAddress = response.data.address;
              this.customerTel = response.data.phone;
            })
            .catch(error => {
              console.error('Error fetching customer details:', error);
            });
      } else {
        this.customerAddress = '';
        this.customerTel = '';
      }
    }
  },
  mounted() {
    // Fetch initial data like order details and customer list
    axios.get(`/api/orders/${orderId}`)
        .then(response => {
          console.log('Order details:', response.data);
          this.order = response.data.order;
          this.customers = response.data.customers;
          this.fetchCustomerDetails(); // Fetch customer details initially
        })
        .catch(error => {
          console.error('Error fetching order details:', error);
        });
  }
};
</script>
