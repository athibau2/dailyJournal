<template>
  <v-app>
    <v-container>
      <v-row justify="center" align="center">
        <v-card
          elevation="5"
          width="400"
        >
          <v-card-title>
            {{user.firstname}} {{user.lastname}}
          </v-card-title>
          <v-card-subtitle>
            {{user.username}}
          </v-card-subtitle>
          <v-card-text>
            <input v-model="password" type="password" placeholder="Update Password Here">
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="updatePassword()">Update Password</v-btn>
            <v-btn @click="deleteAccount()">Delete Account</v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'AccountPage',
  middleware: "auth",

  data () {
    return {
        password: "",
    }
  },

  methods: {
      updatePassword() {
          this.$store.dispatch('accounts/update', {
              password: this.password,
              username: this.user.username
          })
          this.password = ""
      },

      deleteAccount () {
          this.$store.dispatch('accounts/delete', {
              username: this.user.username
          })
      }
  },

  computed: {
    user () {
      return JSON.parse(this.$store.state.accounts.user)
    },
  },
}
</script>
