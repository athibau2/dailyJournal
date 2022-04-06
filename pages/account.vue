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
            <v-text-field
              class="selector"
              dense
              solo
              rounded
              background-color="light blue lighten-5"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              @click:append="show1 = !show1"
              v-model="currentPass" 
              placeholder="Current Password"
            >
            </v-text-field>
            <v-text-field
              class="selector"
              dense
              solo
              rounded
              background-color="light blue lighten-5"
              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show2 ? 'text' : 'password'"
              @click:append="show2 = !show2"
              v-model="newPass" 
              placeholder="New Password"
              @keyup.enter="updatePassword()"
            >
            </v-text-field>
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
        currentPass: "",
        newPass: "",
        show1: false,
        show2: false
    }
  },

  methods: {
      updatePassword() {
          this.$store.dispatch('accounts/update', {
              currentPass: this.currentPass,
              newPass: this.newPass,
              username: this.user.username
          })
          this.currentPass = ""
          this.newPass = ""
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
