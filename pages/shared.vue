<template>
  <v-app>
    <v-container>
      Shared with me page
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'SharedPage',
  middleware: "auth",

  mounted () {
    
  },

  data () {
    return {
      
    }
  },

  methods: {

  },

  computed: {
    user () {
      return JSON.parse(this.$store.state.accounts.user)
    },

  },
}
</script>

<style scoped>

</style>
