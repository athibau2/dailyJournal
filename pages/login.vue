<template>
    <v-app>
        <v-col>
            <v-row justify="center" align="center">
                <v-card elevation="5" width="400">
                <v-card-title class="headline">
                    Welcome to Write Now!
                </v-card-title>
                <v-card-subtitle>
                    Sign In Here
                </v-card-subtitle>
                <v-card-text>
                    <v-text-field
                        class="selector"
                        dense
                        solo
                        rounded
                        background-color="light blue lighten-5"
                        v-model="email"
                        :append-icon="'mdi-email'"
                        placeholder="Enter your email"
                    >
                    </v-text-field>
                    <v-text-field
                        class="selector"
                        dense
                        solo
                        rounded
                        background-color="light blue lighten-5"
                        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show ? 'text' : 'password'"
                        @click:append="show = !show"
                        v-model="password"
                        @keyup.enter="login()"
                        placeholder="Enter your password"
                    >
                    </v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <nuxt-link to="/signup">Join Here</nuxt-link>
                    <span>&nbsp;</span>
                    <v-btn color="primary" nuxt @click="login()">
                        Sign In
                    </v-btn>
                </v-card-actions>
                </v-card>
            </v-row>
        </v-col>
    </v-app>
</template>

<script>
export default {
  name: 'LoginPage',
  layout: 'noauth',

  data () {
    return {
      email: "",
      password: "",
      show: false,
    }
  },

  methods: {
    async login() {
      await this.$store.dispatch('accounts/login', {
        username: this.email,
        password: this.password,
        isNew: false
      })
    },
  },

  computed: {
    user () {
      return this.$store.state.accounts.user
    }
  },

}
</script>

<style scoped>
@import '~/assets/style.css';

</style>
