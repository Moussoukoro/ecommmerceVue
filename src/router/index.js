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
    path: '/admin/products',
    name: 'ProductsIndex',
    component: ProduitsList,
  },
  {
    path: '/admin/products/create',
    name: 'ProductsCreate',
    component: ProduitsForm,
  },
  {
    path: '/admin/products/:id/edit',
    name: 'ProductsEdit',
    component: ProduitsForm,
    props: true,
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

export default router;
