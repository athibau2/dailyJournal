<template>
  <v-app dark>
    <v-app-bar
      color="#abddd0"
      :clipped-left="clipped"
      fixed
      app
    >
      <v-toolbar-title class="title">
        <span class="title-text">{{title}}&nbsp;</span>
        <v-icon class="icon">mdi-thought-bubble</v-icon>
      </v-toolbar-title>
      <v-spacer />
    </v-app-bar>
    <v-main class="main">
      <v-container class="main">
        <Nuxt class="main" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'NoauthLayout',
  data () {
    return {
      clipped: false,
      fixed: false,
      title: 'Write Now'
    }
  },
}
</script>

<style scoped>
@import '~/assets/style.css';


</style>
