<template>
  <v-app>
    <v-container>
      <v-row justify="center" align="center">
        <v-card
          class="card"
          v-if="user !== null && user !== undefined"
          elevation="5"
          width="400"
        >
          <v-card-title style="color: #575757; font-family: Cochin; font-size: 25px;">
            {{user.firstname}} {{user.lastname}}
          </v-card-title>
          <v-card-subtitle>
            {{user.username}}
          </v-card-subtitle>
          <v-card-text>
            <v-text-field
              class="selector"
              background-color="#f0f0f0"
              dense
              solo
              rounded
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              @click:append="show1 = !show1"
              v-model="currentPass" 
              placeholder="Current Password"
            >
            </v-text-field>
            <v-text-field
              class="selector"
              background-color="#f0f0f0"
              dense
              solo
              rounded
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
            <v-btn color="#cccccc" @click="deleteAccount()">Delete Account</v-btn>
            <v-btn color="#abddd0" @click="updatePassword()">Update Password</v-btn>
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
        if (this.currentPass === "" || this.newPass === "") {
          alert('Neither field can be left blank')
        }
        else {
          this.$store.dispatch('accounts/update', {
              currentPass: this.currentPass,
              newPass: this.newPass,
              userid: this.user.id
          })
          this.currentPass = ""
          this.newPass = ""
        }
      },

      async deleteAccount () {
        if (confirm('Are you sure you want to delete your account?')) {
          await this.$store.dispatch('accounts/delete', {
              userid: this.user.id
          })
        }
      }
  },

  computed: {
    user () {
      return JSON.parse(this.$store.state.accounts.user)
    },
  },
}
</script>

<style scoped>
@import '~/assets/style.css';
</style>
