<template>
    <v-app>
        <v-col>
            <v-row justify="center" align="center">
                <v-card elevation="5" width="400">
                <v-card-title class="headline">
                    Welcome to MinuteMemory!
                </v-card-title>
                <v-card-subtitle>
                    Sign Up Here
                </v-card-subtitle>
                <v-card-text>
                    <input v-model="firstname" placeholder="Enter your first name" required>
                    <input v-model="lastname" placeholder="Enter your last name" required>
                    <div>
                        <input v-model="email" placeholder="Enter your email" required>
                    </div>
                    <div>
                        <input @keyup.enter="signup()" v-model="password" type="password" placeholder="Enter your password" required>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <nuxt-link to="/login">Sign In</nuxt-link>
                    <span>&nbsp;</span>
                    <v-btn color="primary" nuxt @click="signup()">
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
        password: ''
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
