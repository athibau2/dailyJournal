<template>
  <v-app>
    <v-container>
      <v-row justify="center" align="center">
        <v-card elevation="5" width="450" v-if="prompt !== null && prompt !== undefined">
          <v-card-title style="word-break: break-word">
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
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  @click="newPrompt()"
                >
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </template>
              <span>New Prompt</span>
            </v-tooltip>
            <v-btn @click="addEntry()">Submit Response</v-btn>
          </v-card-actions>
        </v-card>
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
  },

  data () {
    return {
      text: '',
      response: '',
      hover: false
    }
  },

  methods: {
    newPrompt () {
      this.$store.dispatch('accounts/getPrompt')
    },

    logout() {
      this.$store.dispatch('accounts/logout')
    },

    getItems() {
      this.$store.dispatch('journal/getList')
    },

    addEntry () {
      this.$store.commit('journal/add', this.text)
      this.text = ''
    }
  },

  computed: {
    list () {
      return this.$store.state.journal.list
    },

    user () {
      return this.$store.state.accounts.user
    },

    prompt () {
      return this.$store.state.accounts.prompt
    }
  },
}
</script>
