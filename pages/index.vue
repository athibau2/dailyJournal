<template>
  <v-app>
    <v-container>
      <v-row justify="center" align="center">
        <v-card elevation="5" width="400" v-if="prompt !== null && prompt !== undefined">
          <v-card-title>
            {{prompt.prompttext}}
          </v-card-title>
          <v-card-subtitle>
            Topic
          </v-card-subtitle>
          <v-card-text>
            <input v-model="response" placeholder="Enter your response here">
          </v-card-text>
          <v-card-actions>
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

  data () {
    return {
      text: '',
      response: '',
    }
  },

  methods: {

    logout() {
      this.$store.dispatch('accounts/logout',)
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
      return this.$store.state.journal.prompt
    }
  },
}
</script>
