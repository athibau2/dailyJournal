<template>
  <v-app dark>
    <v-app-bar
      color="#abddd0"
      :clipped-left="clipped"
      fixed
      app
    >
      <!-- <v-toolbar-title class="title">
        <span class="title-text">{{title}}&nbsp;</span>
        <v-icon class="icon" size="30">mdi-thought-bubble</v-icon>
      </v-toolbar-title> -->
      <img src="~/assets/images/logo-dark.png" width="200px" />
      <v-spacer />
      <v-btn color="#e4dfcd88" @click="showLogin = true">Login</v-btn>
    </v-app-bar>
    <v-main class="noauth">
      <v-container class="noauth">
        <Nuxt class="noauth" />
      </v-container>
    </v-main>
    <Login v-show="showLogin" @close-modal="showLogin = false" />
  </v-app>
</template>

<script>
import Login from "~/components/Login.vue"
export default {
  name: 'NoauthLayout',

  components: {
    Login
  },

  data () {
    return {
      clipped: false,
      fixed: false,
      title: 'Write Now',
      showLogin: false,
    }
  },
}
</script>

<style scoped>
@import '~/assets/style.css';

.title-text {
    font-family: 'Courier New', Courier, monospace;
    color: #575757;
}

.icon {
    color: #8ea9c9;
}

</style>
