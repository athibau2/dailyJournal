<template>
  <v-app>
    <v-container>
      <v-row justify="center" align="center">
        <v-col cols="8">
          <h2 class="text-center">Submit Your Entry Here!</h2>
          <v-row justify="center" align="center">
            <v-card class="card" elevation="5" width="450" v-if="prompt !== null && prompt !== undefined">
              <v-card-title class="card-title">
                {{prompt.prompttext}}
              </v-card-title>
              <v-card-subtitle>
                <i>{{prompt.topictext}}</i>
              </v-card-subtitle>
              <v-card-text>
                <v-textarea
                  v-model="response"
                  placeholder="Enter your response here"
                >
                </v-textarea>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="#bdd0e7"
                      v-bind="attrs"
                      v-on="on"
                      @click="newPrompt()"
                    >
                      <v-icon>mdi-refresh</v-icon>
                    </v-btn>
                  </template>
                  <span>New Prompt</span>
                </v-tooltip>
                <v-btn color="#abddd0" @click="submit()">Submit</v-btn>
              </v-card-actions>
            </v-card>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'IndexPage',
  middleware: "auth",

  mounted() {
    this.$store.commit('accounts/setPrompt', JSON.parse(localStorage.getItem('prompt')))
    this.$store.dispatch('accounts/activePrompt')
  },

  data () {
    return {
      response: "",
      hover: false,
    }
  },

  methods: {
    newPrompt () {
      this.$store.dispatch('accounts/getPrompt', { isNew: false })
    },

    submit () {
      this.$store.dispatch('journal/submit', {
        response: this.response,
        userid: this.user.id,
        promptid: this.prompt.promptid
      })
      this.response = ""
    }
  },

  computed: {
    user () {
      return JSON.parse(this.$store.state.accounts.user)
    },

    prompt () {
      return this.$store.state.accounts.prompt
    },

    newestEntry () {
      return this.$store.state.journal.newestEntry
    }
  },
}
</script>

<style scoped>
@import '~/assets/style.css';

.card {
  margin-top: 20px;
}
</style>
