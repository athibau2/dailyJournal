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
              @keyup.enter="updateAccount()"
            >
            </v-text-field>
            <span>Notification Time: {{notifTime}}</span>
            <v-icon @click="clearTime()">mdi-pencil</v-icon>
            <br>
            <span v-if="time.length !== 0">New Time: {{time}}</span>
            <v-time-picker
                v-if="showTime"
                v-model="time"
                elevation="6"
            >
            <v-btn
                text
                color="primary"
                @click="prettyTime()"
            >
                OK
            </v-btn>
            </v-time-picker>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="#cccccc" @click="deleteAccount()">Delete Account</v-btn>
            <v-btn color="#abddd0" @click="updateAccount()">Update Account</v-btn>
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

  mounted () {
    this.$store.dispatch('accounts/getNotifTime')
  },

  data () {
    return {
        currentPass: undefined,
        newPass: undefined,
        show1: false,
        show2: false,
        showTime: false,
        time: "",
        rawTime: ""
    }
  },

  methods: {
      async updateAccount() {
        if ((this.currentPass === undefined || this.newPass === undefined) && this.time === "") {
          alert('No updates have been made to your account')
        }
        else if ((this.currentPass !== undefined && this.newPass !== undefined) || this.time !== "") {
          let parseTime = undefined
          if (this.time !== "") {
            parseTime = new Date('January 1, 2000 ' + this.rawTime + ':00').toTimeString()
          }
          await this.$store.dispatch('accounts/update', {
              currentPass: this.currentPass === "" ? undefined : this.currentPass,
              newPass: this.newPass === "" ? undefined : this.newPass,
              notif_time: parseTime,
              userid: this.user.id
          })
          this.currentPass = undefined
          this.newPass = undefined
          this.time = ""
        }
      },

      async deleteAccount () {
        if (confirm('Are you sure you want to delete your account?')) {
          await this.$store.dispatch('accounts/delete', {
              userid: this.user.id
          })
        }
      },

      prettyTime () {
          this.rawTime = this.time
          this.showTime = false
          let timeOfDay = ""
          let hour = this.time[0] + this.time[1]
          if (parseInt(hour) > 12) {
              timeOfDay = " PM"
              hour -= 12
          } else timeOfDay = " AM"
          if (hour < 10 && timeOfDay === " PM") hour = '0' + hour.toString()
          this.time = hour + this.time[2] + this.time[3] + this.time[4] + timeOfDay
      },

      clearTime () {
          this.time = ""
          this.showTime = true
      }
  },

  computed: {
    user () {
      return JSON.parse(this.$store.state.accounts.user)
    },

    timenow () {
      return new Date().toTimeString()
    },

    notifTime () {
      return this.$store.state.accounts.notifTime
    }
  },
}
</script>

<style scoped>
@import '~/assets/style.css';
</style>
