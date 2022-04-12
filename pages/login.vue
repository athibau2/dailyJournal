<template>
    <v-app>
      <v-row>
        <v-col cols="8">
          <h3 class="text-center">~Write now, right now~</h3>
          <p>
            <em>Write Now</em> keeps track of your thoughts, feelings, memories, hopes, and dreams in a simple way so that you don't forget!
          </p>
          <img src="~/assets/images/home-screen.png" height="250px">
          <img src="~/assets/images/my-entries.png" height="250px">
          <img src="~/assets/images/share.png" height="250px">
          <img src="~/assets/images/shared-with-me.png" height="250px">
        </v-col>
        <v-col cols="4">
            <v-row justify="center" align="center">
              <v-card class="card" elevation="5" width="350">
                <v-card-title class="headline">
                    Welcome to Write Now!
                </v-card-title>
                <v-card-subtitle>
                    <em>Sign In Here</em>
                </v-card-subtitle>
                <v-card-text>
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
                        @keyup.enter="login()"
                        placeholder="Enter your password"
                    >
                    </v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <nuxt-link to="/signup">Join Here</nuxt-link>
                    <span>&nbsp;</span>
                    <v-btn color="#abddd0" nuxt @click="login()">
                        Sign In
                    </v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
        </v-col>
      </v-row>
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
      if (this.email === "" || this.password === "") alert('No fields may be left blank')
      else {
          await this.$store.dispatch('accounts/login', {
            username: this.email,
            password: this.password,
            isNew: false
        })
      }
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

.card {
  position: fixed;
  top: 15%;
}

h3 {
  font-size: 25px;
  color: #575757;
  font-family: Georgia, 'Times New Roman', Times, serif;
}

</style>
