<template>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0">
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">Sign In</h4>
                  <p class="mb-0">Enter your email and password to sign in</p>
                </div>
                <div class="card-body">
                  <form @submit.prevent="handleSubmit">
                    <div class="mb-3">
                      <ArgonInput
                          id="email"
                          v-model="email"
                          type="email"
                          placeholder="Email"
                          name="email"
                          size="lg"
                      />
                    </div>
                    <div class="mb-3">
                      <ArgonInput
                          id="password"
                          v-model="password"
                          type="password"
                          placeholder="Password"
                          name="password"
                          size="lg"
                      />
                    </div>
                    <ArgonSwitch id="rememberMe" name="remember-me">Remember me</ArgonSwitch>
                    <div v-if="errorMessage" class="alert alert-danger">
                      {{ errorMessage }}
                    </div>
                    <div class="text-center">
                      <ArgonButton
                          class="mt-4"
                          variant="gradient"
                          color="success"
                          fullWidth
                          size="lg"
                          type="submit"
                      >Sign in</ArgonButton>
                    </div>
                  </form>
                </div>
<!--                <div class="px-1 pt-0 text-center card-footer px-lg-2">-->
<!--                  <p class="mx-auto mb-4 text-sm">-->
<!--                    Don't have an account?-->
<!--                    <a href="javascript:;" class="text-success text-gradient font-weight-bold">Sign up</a>-->
<!--                  </p>-->
<!--                </div>-->
              </div>
            </div>
            <div class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column">
              <div class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                   style="background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-ill.jpg'); background-size: cover;">
                <span class="mask bg-gradient-success opacity-6"></span>
                <h4 class="mt-5 text-white font-weight-bolder position-relative">"Attention is the new currency"</h4>
                <p class="text-white position-relative">
                  The more effortless the writing looks, the more effort the writer actually put into the process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import {ref, onBeforeMount, onBeforeUnmount} from 'vue';
import axios from 'axios';
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
// import Navbar from '@/examples/PageLayout/Navbar.vue';
import ArgonInput from '@/components/ArgonInput.vue';
import ArgonSwitch from '@/components/ArgonSwitch.vue';
import ArgonButton from '@/components/ArgonButton.vue';

const body = document.getElementsByTagName('body')[0];
const store = useStore();
const router = useRouter(); // Déclarer router en utilisant useRouter()

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const handleSubmit = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/login', {
      email: email.value,
      password: password.value,
    });

    // Affichage pour déboguer la réponse de l'API
    console.log('API Response:', response.data);

    // Accéder correctement aux données de la réponse
    const tokenData = response.data.token.original;
    const user = response.data.user;

    if (tokenData && user) {
      const { access_token, expires_at } = tokenData;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('tokenExpiration', new Date(expires_at).getTime());
      router.push('/categories');
    } else {
      throw new Error('Token ou utilisateur manquant dans la réponse');
    }
  } catch (error) {
    console.error('Error during login:', error);
    errorMessage.value = 'Une erreur est survenue lors de la connexion. Veuillez réessayer.';
  }
};



onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = false;
  body.classList.remove('bg-gray-100');
});

onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
  body.classList.add('bg-gray-100');
});
</script>

<style scoped>
/* Ajoutez vos styles CSS ici si nécessaire */
</style>