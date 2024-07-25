<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
import GradientLineChart from "@/examples/Charts/GradientLineChart.vue";
import Carousel from "./components/Carousel.vue";

const orders = ref([]);
const totalAmount = ref(0);
const totalOrders = ref(0);
const completedOrders = ref(0);
const pendingOrders = ref(0);

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://127.0.0.1:8000/api/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    orders.value = response.data.orders;
    
    // Calculer les statistiques
    totalAmount.value = orders.value.reduce((sum, order) => sum + parseFloat(order.total), 0).toFixed(2);
    totalOrders.value = orders.value.length;
    completedOrders.value = orders.value.filter(order => order.status === 'Terminée').length;
    pendingOrders.value = orders.value.filter(order => order.status === 'En attente').length;
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
  }
});
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="row">
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="Total des ventes"
              :value="`$${totalAmount}`"
              :description="`${totalOrders} commandes au total`"
              :icon="{
                component: 'ni ni-money-coins',
                background: 'bg-gradient-primary',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="Commandes terminées"
              :value="completedOrders"
              :description="`${((completedOrders / totalOrders) * 100).toFixed(1)}% des commandes`"
              :icon="{
                component: 'ni ni-check-bold',
                background: 'bg-gradient-success',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="Commandes en attente"
              :value="pendingOrders"
              :description="`${((pendingOrders / totalOrders) * 100).toFixed(1)}% des commandes`"
              :icon="{
                component: 'ni ni-time-alarm',
                background: 'bg-gradient-warning',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="Clients uniques"
              :value="new Set(orders.map(order => order.customer_id)).size"
              description="Nombre total de clients"
              :icon="{
                component: 'ni ni-single-02',
                background: 'bg-gradient-info',
                shape: 'rounded-circle',
              }"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-lg-7 mb-lg">
            <div class="card z-index-2">
              <gradient-line-chart
                id="chart-line"
                title="Aperçu des ventes"
                description="<i class='fa fa-arrow-up text-success'></i>
                <span class='font-weight-bold'>4% de plus</span> que le mois dernier"
                :chart="{
                  labels: [
                    'Avr',
                    'Mai',
                    'Juin',
                    'Juil',
                    'Août',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Déc',
                  ],
                  datasets: [
                    {
                      label: 'Ventes mensuelles',
                      data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
                    },
                  ],
                }"
              />
            </div>
          </div>
          <div class="col-lg-5">
            <carousel />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>