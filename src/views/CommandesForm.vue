<template>
  <div>
    <div class="bg-gray-100 p-4 mb-8 text-center rounded-3xl">
      <form @submit.prevent="handleSubmit">
        <div class="flex justify-between mb-8">
          <button type="button" @click="goBack" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Retour</button>
        </div>

        <div class="flex justify-between">
          <div class="px-3 py-2 w-1/3">
            <label for="numOrder" class="block font-medium text-sm text-gray-700">Numéro de Commande</label>
            <input type="text" id="numOrder" v-model="order.numOrder" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" readonly />
          </div>

          <div class="px-3 py-2 w-1/3">
            <label for="orderDate" class="block font-medium text-sm text-gray-700">Date de Commande</label>
            <input type="date" id="orderDate" v-model="order.orderDate" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          </div>

          <div class="px-3 py-2 w-1/3">
            <label for="payment" class="block font-medium text-sm text-gray-700">Mode de Paiement</label>
            <select id="payment" v-model="order.payment" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
              <option value="">Sélectionner un mode de paiement</option>
              <option value="Espece">Espece</option>
              <option value="Chèque">Chèque</option>
              <option value="Carte Bancaire">Carte Bancaire</option>
            </select>
          </div>
        </div>

        <div class="flex justify-between">
          <div v-if="canEdit" class="px-3 py-2 w-1/2">
            <label for="status" class="block font-medium text-sm text-gray-700">Statut</label>
            <select id="status" v-model="order.status" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
              <option v-for="status in orderStatuses" :key="status" :value="status">{{ status }}</option>
            </select>
          </div>

          <div v-else class="px-3 py-2 w-1/2">
            <label for="status" class="block font-medium text-sm text-gray-700">Statut</label>
            <input type="text" id="status" v-model="order.status" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" readonly />
          </div>

          <div class="px-3 py-2 w-1/2">
            <label for="user_name" class="block font-medium text-sm text-gray-700">Commande faite par</label>
            <input type="text" id="user_name" v-model="user.name" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" readonly />
            <input type="text" id="user_id" v-model="user.id" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm hidden" readonly />
          </div>
        </div>

        <div class="flex justify-between mb-4">
          <div class="px-3 py-2 w-1/3">
            <label for="customer_id" class="block font-medium text-sm text-gray-700">Client</label>
            <select id="customer_id" v-model="order.customer_id" @change="updateCustomer" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
              <option value="">Sélectionner un client</option>
              <option v-for="customer in customers" :key="customer.id" :value="customer.id">{{ customer.firstname + ' ' + customer.lastname }}</option>
            </select>
          </div>

          <div class="px-3 py-2 w-1/3">
            <label for="customerAddress" class="block font-medium text-sm text-gray-700">Adresse Client</label>
            <input type="text" id="customerAddress" v-model="customerAddress" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" readonly />
          </div>

          <div class="px-3 py-2 w-1/3">
            <label for="customerTel" class="block font-medium text-sm text-gray-700">Numéro de Telephone</label>
            <input type="text" id="customerTel" v-model="customerTel" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" readonly />
          </div>
        </div>

        <div class="flex justify-between mb-4">
          <div class="px-2 py-2 w-1/5">
            <label for="product1" class="block font-medium text-sm text-gray-700">Produit</label>
            <select id="product1" v-model="selectedProductId" @change="updateProduct" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
              <option value="">Choisir un produit</option>
              <option v-for="product in products" :key="product.id" :value="product.id">{{ product.name }}</option>
            </select>
          </div>

          <div class="px-2 py-2 w-1/5">
            <label for="quantityAvailable" class="block font-medium text-sm text-gray-700">Quantité disponible</label>
            <input type="number" id="quantityAvailable" v-model="quantityAvailable" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" readonly />
          </div>

          <div class="px-2 py-2 w-1/5">
            <label for="quantityToOrder" class="block font-medium text-sm text-gray-700">Quantité commandé</label>
            <input type="number" id="quantityToOrder" v-model="quantityToOrder" @input="updateTotal" min="1" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          </div>

          <div class="px-2 py-2 w-1/5">
            <label for="price" class="block font-medium text-sm text-gray-700">Prix Produit</label>
            <input type="text" id="price" v-model="price" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" readonly />
          </div>

          <div class="px-2 py-2 w-1/5">
            <label for="totalLine" class="block font-medium text-sm text-gray-700">Total</label>
            <input type="text" id="totalLine" v-model="totalLine" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" readonly />
          </div>
        </div>

        <div class="mb-4 flex justify-center">
          <div>
            <button type="button" @click="addProductRow" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">Ajouter Produit</button>
            <button type="button" @click="editProductOrder" class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mr-4" v-if="isEditing">Modifier Produit</button>
            <button type="button" @click="clearAddproductField" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Annuler</button>
          </div>
        </div>

        <div class="overflow-x-auto bg-white rounded shadow mb-8">
          <table class="w-full whitespace-no-wrap">
            <thead>
            <tr class="text-2xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
              <th class="px-4 py-3">Produit</th>
              <th class="px-4 py-3">Quantite Commandé</th>
              <th class="px-4 py-3">Prix Produit</th>
              <th class="px-4 py-3">Total Ligne</th>
              <th class="px-4 py-3">Actions</th>
            </tr>
            </thead>
            <tbody class="divide-y">
            <tr v-for="(product, index) in orderProducts" :key="index">
              <td class="px-4 py-3">
                <input type="text" :value="product.name" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" readonly />
              </td>
              <td class="px-4 py-3">
                <input type="number" :value="product.quantity" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" readonly />
              </td>
              <td class="px-4 py-3">
                <input type="text" :value="product.price" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" readonly />
              </td>
              <td class="px-4 py-3">
                <input type="text" :value="product.total" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" readonly />
              </td>
              <td class="px-4 py-3">
                <button type="button" @click="removeProductRow(index)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Supprimer</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="flex justify-between mb-8">
          <div class="px-3 py-2 w-1/2">
            <label for="totalOrder" class="block font-medium text-sm text-gray-700">Total de la Commande</label>
            <input type="text" id="totalOrder" v-model="totalOrder" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" readonly />
          </div>
        </div>

        <div class="flex justify-center mb-4">
          <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Enregistrer</button>
        </div>
      </form>
    </div>
  </div>
</template>

 <script>
 import axios from 'axios';
 const ORDER_STATUSES = [
   'En attente',
   'En cours de traitement',
   'Annulée',
   'Terminée'
 ];
 export default {
   data() {
     return {
       orderStatuses: ORDER_STATUSES,
       order: {
         numOrder: this.generateOrderNumber(),
         orderDate: '',
         payment: '',
         status: 'en attente',
         customer_id: '',
         canEdit: false,
         isAdmin: false,



       },
       user: {
         id: '',
         name: ''
       },
       customers: [],
       products: [],
       orderProducts: [],
       selectedProductId: '',
       quantityAvailable: 0,
       quantityToOrder: 0,
       price: 0,
       totalLine: 0,
       totalOrder: 0,
       customerAddress: '',
       customerTel: '',
       canEdit: false,
       isEditing: false,
       editIndex: null // Index of the product being edited
     };
   },
   methods: {
     async fetchCurrentUser() {
       try {
         const token = localStorage.getItem('token');
         const response = await axios.get('http://127.0.0.1:8000/api/user', {
           headers: {
             'Authorization': `Bearer ${token}`
           }
         });
         this.user.id = response.data.id;
         this.user.name = response.data.name;
         this.isAdmin = response.data.role === 'admin'; // Assurez-vous que votre API renvoie le rôle de l'utilisateur
         this.checkEditPermission();
       } catch (error) {
         console.error('Erreur lors de la récupération des données utilisateur:', error);
       }
     },
     checkEditPermission() {
       // Seul un admin peut modifier le statut
       this.canEdit = this.isAdmin;
     },

     userHasEditRole() {
       // Vérifie si l'utilisateur a le rôle d'admin
       return this.isAdmin;
     },

     generateOrderNumber() {
       const prefix = 'CMD';
       const timestamp = Date.now().toString();
       const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
       return `${prefix}-${timestamp}-${random}`;
     },
     async fetchCustomers() {
       try {
         const token = localStorage.getItem('token');
         const response = await axios.get('http://127.0.0.1:8000/api/customers',{
         headers: {
           'Authorization': `Bearer ${token}`
         }
         });
         this.customers = response.data;
       } catch (error) {
         console.error('Error fetching customers:', error);
       }
     },

     async fetchProducts() {
       try {
         const token = localStorage.getItem('token');
         const response = await axios.get('http://127.0.0.1:8000/api/products',{

           headers: {
             'Authorization': `Bearer ${token}`
           }
         });
         this.products = response.data;
       } catch (error) {
         console.error('Error fetching products:', error);
       }
     },

     async submitOrder() {
       // Validation des champs
       if (!this.order.customer_id) {
         alert('Veuillez sélectionner un client.');
         return;
       }
       if (!this.order.payment) {
         alert('Veuillez sélectionner un mode de paiement.');
         return;
       }
       if (this.orderProducts.length === 0) {
         alert('Veuillez ajouter au moins un produit à la commande.');
         return;
       }
       if (!this.order.orderDate) {
         alert('Veuillez spécifier une date de commande.');
         return;
       }
       if (!this.order.status) {
         alert('Veuillez sélectionner un statut pour la commande.');
         return;
       }
       if (this.totalOrder <= 0) {
         alert('Le total de la commande doit être supérieur à zéro.');
         return;
       }
       for (const product of this.orderProducts) {
         if (product.quantity <= 0) {
           alert(`La quantité pour ${product.name} doit être supérieure à zéro.`);
           return;
         }
       }
       if (!this.user.id) {
         alert('Erreur : Utilisateur non identifié. Veuillez vous reconnecter.');
         return;
       }


       try {
         const token = localStorage.getItem('token');
         const orderData = {
           customer_id: this.order.customer_id,
           user_id: this.user.id,
           status: this.order.status,
           payment: this.order.payment,
           numOrder: this.order.numOrder,
           orderDate: this.order.orderDate,
           total: this.totalOrder.toString(), // Convertir en chaîne de caractères
           products: this.orderProducts.map(p => p.id),
           quantities: this.orderProducts.map(p => p.quantity)
         };

         const response = await axios.post('http://127.0.0.1:8000/api/store/orders', orderData, {
           headers: {
             'Authorization': `Bearer ${token}`
           }
         });

         console.log('Commande soumise avec succès:', response.data);
         this.resetForm();
         // Optionnel : afficher un message de succès à l'utilisateur
       } catch (error) {
         console.error('Erreur lors de la soumission de la commande:', error);
         // Afficher un message d'erreur à l'utilisateur
         // Afficher un message d'erreur à l'utilisateur
         alert('Veuillez vérifier tous les champs');
       }
     },
     resetForm() {
       this.order = {
         numOrder: this.generateOrderNumber(),
         orderDate: new Date().toISOString().substr(0, 10),
         payment: '',
         status: 'En attente',
         customer_id: ''
       };
       this.orderProducts = [];
       this.selectedProductId = '';
       this.quantityToOrder = 0;
       this.price = 0;
       this.totalLine = 0;
       this.totalOrder = 0;
       this.customerAddress = '';
       this.customerTel = '';
     },
     handleSubmit() {
       this.submitOrder();
     },
     goBack() {
       this.$router.push('/orders');
     },
     async updateCustomer() {
       try {
         ``
         const token = localStorage.getItem('token');
         const response = await axios.get(`http://127.0.0.1:8000/api/customers/${this.order.customer_id}`,{
           headers: {
             'Authorization': `Bearer ${token}`
           }
         });
         const customer = response.data;
         this.customerAddress = customer.address;
         this.customerTel = customer.phone;
       } catch (error) {
         console.error('Error fetching customer details:', error);
       }
     },
     async updateProduct() {
       try {
         const token = localStorage.getItem('token');
         const response = await axios.get(`http://127.0.0.1:8000/api/products/${this.selectedProductId}`,{
         headers: {
           'Authorization': `Bearer ${token}`
         }
       });
         const product = response.data;
         this.quantityAvailable = product.quantity;
         this.price = product.price;
         this.totalLine = this.quantityToOrder * this.price;
       } catch (error) {
         console.error('Error fetching product details:', error);
       }
     },
     addProductRow() {
       if (this.quantityToOrder > 0) {
         const product = this.products.find(p => p.id === this.selectedProductId);
         if (product) {
           this.orderProducts.push({
             id: product.id,
             name: product.name,
             quantity: this.quantityToOrder,
             price: this.price,
             total: this.totalLine
           });
           this.updateTotal();
           this.clearAddproductField();
         }
       }
     },
     editProductOrder() {
       if (this.isEditing && this.editIndex !== null) {
         const product = this.products.find(p => p.id === this.selectedProductId);
         if (product) {
           // Update the product in the orderProducts array
           this.orderProducts[this.editIndex] = {
             id: product.id,
             name: product.name,
             quantity: this.quantityToOrder,
             price: this.price,
             total: this.totalLine
           };
           this.isEditing = false; // Exit editing mode
           this.editIndex = null; // Clear the edit index
           this.clearAddproductField(); // Clear fields after editing
           this.updateTotal(); // Recalculate the total
         }
       }
     },
     removeProductRow(index) {
       this.orderProducts.splice(index, 1);
       this.calculateTotalOrder();
     },
     clearAddproductField() {
       this.selectedProductId = '';
       this.quantityToOrder = 0;
       this.price = 0;
       this.totalLine = 0;
     },
     updateTotal() {
       this.totalLine = this.quantityToOrder * this.price;
       this.calculateTotalOrder();
     },
     calculateTotalOrder() {
       this.totalOrder = this.orderProducts.reduce((sum, product) => sum + product.total, 0);
     }
   },
   mounted() {
     this.fetchCustomers();
     this.fetchProducts();
     this.fetchCurrentUser(); // Ajoutez cette ligne
     this.order.orderDate = new Date().toISOString().substr(0, 10); // Set today's date
     this.order.numOrder = this.generateOrderNumber();
   }
 };
 </script>