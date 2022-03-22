<template>
  <v-app>
    <v-container>
        <!-- <Filter-Text myText="Whatever" @updateLength="length = $event">
        </Filter-Text>
        {{length}} -->

    </v-container>
  </v-app>
</template>

<script>
import FilterText from '~/components/Filter-Text.vue'
export default {
  name: 'EntriesPage',
  middleware: "auth",

  components: {
      FilterText
  },

  data () {
    return {
      length: 0
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
