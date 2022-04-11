<template>
    <v-app>
        <v-col>
            <v-row justify="center" align="center">
                <v-card class="card" elevation="5" width="400">
                    <v-card-title class="headline">
                        Welcome to Write Now!
                    </v-card-title>
                    <v-card-subtitle>
                        <em>Sign Up Here</em>
                    </v-card-subtitle>
                    <v-card-text>
                        <v-text-field
                            class="selector"
                            background-color="#f0f0f0"
                            dense
                            solo
                            rounded
                            v-model="firstname"
                            placeholder="First name"
                        >
                        </v-text-field>
                        <v-text-field
                            class="selector"
                            background-color="#f0f0f0"
                            dense
                            solo
                            rounded
                            v-model="lastname"
                            placeholder="Last name"
                        >
                        </v-text-field>
                        <v-text-field
                            class="selector"
                            background-color="#f0f0f0"
                            dense
                            solo
                            rounded
                            v-model="email"
                            :append-icon="'mdi-email'"
                            placeholder="Enter your email"
                        >
                        </v-text-field>
                        <v-text-field
                            class="selector"
                            background-color="#f0f0f0"
                            dense
                            solo
                            rounded
                            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show ? 'text' : 'password'"
                            @click:append="show = !show"
                            v-model="password"
                            @keyup.enter="signup()"
                            placeholder="Enter your password"
                        >
                        </v-text-field>
                        <em><h5>&nbsp;Password must be at least 8 characters</h5></em>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <nuxt-link to="/login">Sign In</nuxt-link>
                        <span>&nbsp;</span>
                        <v-btn color="#abddd0" nuxt @click="signup()">
                            Sign Up
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-row>
        </v-col>
    </v-app>
</template>

<script>
export default {
  name: 'SignupPage',
  layout: 'noauth',

  data () {
    return {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        show: false
    }
  },

  methods: {
    signup() {
        this.$store.dispatch('accounts/signup', {
            firstname: this.firstname,
            lastname: this.lastname,
            username: this.email,
            password: this.password
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
