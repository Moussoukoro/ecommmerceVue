import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Tables from "../views/Tables.vue";
import Billing from "../views/Billing.vue";
import VirtualReality from "../views/VirtualReality.vue";
import RTL from "../views/Rtl.vue";
import Profile from "../views/Profile.vue";
import Signup from "../views/Signup.vue";
import Signin from "../views/Signin.vue";

import CategoriesForm from "../views/CategoriesForm.vue";
import ProduitsForm from "../views/produitsForm.vue";
import ProduitsList from "../views/ProduitsList.vue";
import ClientsList from "../views/ClientsList.vue";
import ClientForm from "../views/ClientForm.vue";
import CategorieListe from "@/views/CategorieListe.vue";
import UsersForm from "@/views/UsersForm.vue";
import UsersList from "@/views/UsersList.vue";
import commandeList from "@/views/CommandeList.vue";
import commandesForm from "@/views/CommandesForm.vue";


const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/Signin",
  },
  {
    path: "/dashboard-default",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/tables",
    name: "Tables",
    component: Tables,
  },
  {
    path: "/billing",
    name: "Billing",
    component: Billing,
  },
  {
    path: "/virtual-reality",
    name: "Virtual Reality",
    component: VirtualReality,
  },
  {
    path: "/rtl-page",
    name: "RTL",
    component: RTL,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
  path: '/categories',
    name: 'CategoriesList',
    component: CategorieListe,
    meta: { requiresAuth: true }  // Ajoute la métadonnée pour la protection de la route
},
  {
    path: '/categories/create',
    name: 'CategoryCreate',
    component: CategoriesForm,
  },
  {
    path: '/categories/edit/:id',
    name: 'CategoryEdit',
    component: CategoriesForm,
  },
  {
    path: '/products',
    name: 'ProductsIndex',
    component: ProduitsList,
  },
  {
    path: '/products/create',
    name: 'ProductsCreate',
    component: ProduitsForm,
  },
  {
    path: '/products/:id/edit',
    name: 'ProductsEdit',
    component: ProduitsForm,
  },
  {
    path: '/customers',
    name: 'CustomersIndex',
    component: ClientsList,
  },
  {
    path: '/customers/create',
    name: 'CustomersCreate',
    component: ClientForm,
  },
  {
    path: '/customers/edit/:id',
    name: 'CustomersEdit',
    component: ClientForm,

  },
  {
    path: '/orders',
    name: 'ordersIndex',
    component: commandeList,
  },
  {
    path: '/orders/create',
    name: 'ordersCreate',
    component: commandesForm,
  },
  {
    path: '/orders/edit/:id',
    name: 'ordersEdit',
    component: commandesForm,

  },
  {
    path: '/users',
    name: 'UsersIndex',
    component: UsersList,
  },
  {
    path: '/users/create',
    name: 'CustomersCreate',
    component: UsersForm,
  },
  {
    path: '/users/edit/:id',
    name: 'CustomersEdit',
    component: UsersForm,

  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

// Garde de navigation globale
router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('token');
  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    next('/signin');
  } else {
    next();
  }
});
export default router;
