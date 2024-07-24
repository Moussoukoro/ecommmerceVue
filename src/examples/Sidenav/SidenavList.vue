<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import SidenavItem from "./SidenavItem.vue";
// import SidenavCard from "./SidenavCard.vue";

const store = useStore();
const isRTL = computed(() => store.state.isRTL);

const getRoute = () => {
  const route = useRoute();
  const routeArr = route.path.split("/");
  return routeArr[1];
};
</script>
<template>
  <div
    class="collapse navbar-collapse w-auto h-auto h-100"
    id="sidenav-collapse-main"
  >
    <ul class="navbar-nav">
      <li class="nav-item">
        <sidenav-item
          to="/dashboard-default"
          :class="getRoute() === 'dashboard-default' ? 'active' : ''"
          :navText="isRTL ? 'لوحة القيادة' : 'Dashboard'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/categories"
          :class="getRoute() === 'categories' ? 'active' : ''"
          :navText="isRTL ? 'الواقع الافتراضي' : 'Categories'"
        >
          <template v-slot:icon>
            <i class="fas fa-tags text-warning text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/products"
          :class="getRoute() === 'products' ? 'active' : ''"
          :navText="isRTL ? 'الجداول' : 'Produits'"
        >
          <template v-slot:icon>
            <i class="fas fa-box text-warning text-sm opacity-10"></i>

          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/customers"
          :class="getRoute() === 'customers' ? 'active' : ''"
          :navText="isRTL ? 'الفواتیر' : 'Clients'"
        >
          <template v-slot:icon>
            <i class="fas fa-user text-warning text-sm opacity-10"></i>

          </template>
        </sidenav-item>
      </li>

      

      <li class="nav-item">
        <sidenav-item
          to="/orders"
          :class="getRoute() === 'orders' ? 'active' : ''"
          navText="Commandes"
        >
          <template v-slot:icon>
            <i class="fas fa-shopping-cart text-warning text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <!-- Fin -->

      <!-- <li class="nav-item">
        <sidenav-item
          to="/profile"
          :class="getRoute() === 'profile' ? 'active' : ''"
          :navText="isRTL ? 'حساب تعريفي' : 'Profile'"
        >
          <template v-slot:icon>
            <i class="ni ni-single-02 text-dark text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/signin"
          :class="getRoute() === 'signin' ? 'active' : ''"
          :navText="isRTL ? 'تسجيل الدخول' : 'Sign In'"
        >
          <template v-slot:icon>
            <i class="ni ni-single-copy-04 text-danger text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/signup"
          :class="getRoute() === 'signup' ? 'active' : ''"
          :navText="isRTL ? 'اشتراك' : 'Sign Up'"
        >
          <template v-slot:icon>
            <i class="ni ni-collection text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li> -->
    </ul>
  </div>

  <!-- <div class="pt-3 mx-3 mt-3 sidenav-footer">
    <sidenav-card
      :card="{
        title: 'Need Help?',
        description: 'Please check our docs',
        links: [
          {
            label: 'Documentation',
            route:
              'https://www.creative-tim.com/learning-lab/vue/overview/argon-dashboard/',
            color: 'dark',
          },
          {
            label: 'Buy now',
            route:
              'https://www.creative-tim.com/product/vue-argon-dashboard-pro?ref=vadp',
            color: 'success',
          },
        ],
      }"
    />
  </div> -->
</template>
