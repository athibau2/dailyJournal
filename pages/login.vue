<template>
    <v-app>
      <v-row>
        <v-col class="intro-page" cols="8">
          <div class="full-intro">
            <h3 class="text-center">Write on, Write now: the new way to journal!</h3>
            <div class="intro text-center">
              Don't know what to write? <em>We'll tell you.</em>
            </div>
            <div class="intro text-center">
              Can't remember to write? <em>We'll remind you.</em>
            </div>
            <div class="intro text-center">
              Don't have a lot to say? <em>That's just fine.</em>
            </div>
          </div>
          <v-divider class="intro-divider" />

          <!-- Row 1 -->
          <v-row class="intro-rows" align="center">
            <v-col cols="4">
              <span class="intro">
                This no-excuses app prompts you to keep track of your feelings, hopes, and dreams. Don't like the prompt? <em>Generate a new one!</em>
              </span>
            </v-col>
            <v-col cols="8">
              <img class="intro-img" src="~/assets/images/home-screen.png" height="250px">
            </v-col>
          </v-row>

          <v-divider class="intro-divider" />

          <!-- Row 2 -->
          <v-row class="intro-rows" align="center">
            <v-col cols="8">
              <img class="intro-img" src="~/assets/images/my-entries.png" height="250px">
            </v-col>
            <v-col cols="4">
              <span class="intro">
                Head to the "My Entries" page to see all of your journal submissions. Filter them by date or topic!
              </span>
            </v-col>
          </v-row>

          <v-divider class="intro-divider" />

          <!-- Row 3 -->
          <v-row class="intro-rows" align="center">
            <v-col cols="4">
              <span class="intro">
                Stay connected with those you love by sharing your entry submissions with them. Or, share the prompt itself to see how they respond!
              </span>
            </v-col>
            <v-col cols="8">
              <img class="intro-img" src="~/assets/images/share.png" height="250px">
            </v-col>
          </v-row>

          <v-divider class="intro-divider" />
          
          <!-- Row 4 -->
          <v-row class="intro-rows" align="center">
            <v-col cols="8">
              <img class="intro-img" src="~/assets/images/shared-with-me.png" height="250px">
            </v-col>
            <v-col cols="4">
              <span class="intro">
                Check out the "Shared With Me" page to see what your loved ones have sent you! Respond to shared prompts and they will immediately see your response!
              </span>
            </v-col>
          </v-row>
        </v-col>

        <!-- Sign in Form -->
        <v-col cols="4">
            <v-row justify="center" align="center">
              <v-card class="card" elevation="5" width="350">
                <v-card-title class="headline" style="color: #575757">
                    <em>Sign In Here</em>
                </v-card-title>
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

.intro-page {
  animation: fadeInAnimation ease 3s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

@keyframes fadeInAnimation {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

.card {
  position: fixed;
  top: 15%;
  right: 30px;
  animation: fadeInAnimation ease 2s;
  opacity: 0;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  animation-delay: 1s;
}

.full-intro {
  background-color: #FAF9F6;
  border-radius: 20px;
  box-shadow: 0px 0px 6px #575757;
}

h3 {
  font-size: 25px;
  color: #575757;
  font-family: Georgia, 'Times New Roman', Times, serif;
}

.intro {
  font-size: 20px;
  color: #575757;
  font-family: Cochin;
}

.intro-rows {
  margin-top: 10px;
}

.intro-divider {
  margin-top: 10px;
}

.intro-img {
  border-radius: 10px;
  box-shadow: 0px 0px 4px #575757;
}


</style>
