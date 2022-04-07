<template>
  <v-app>
    <v-container>
      <v-col v-if="sharedWithMe.length !== 0">
          <v-row justify="center" align="center" v-for="(entry, i) in sharedWithMe" :key="i">
            <v-card class="entries" elevation="5" width="450">
              <v-card-title style="word-break: break-word">
                {{entry.prompttext}}
              </v-card-title>
              <v-card-subtitle>
                {{entry.firstname}} {{entry.lastname}}&nbsp;&nbsp;&nbsp;&nbsp;
                <em>{{entry.topictext}}</em>&nbsp;&nbsp;&nbsp;&nbsp;{{entry.date}}
              </v-card-subtitle>
              <v-card-text>
                {{entry.text}}
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn @click="removeEntry(entry)">Remove</v-btn>
              </v-card-actions>
            </v-card>
          </v-row>
        </v-col>
        <v-col v-else>
          <h2 class="text-center" v-if="sharedWithMe.length === 0">No Entries Have Been Shared With You</h2>
        </v-col>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'SharedPage',
  middleware: "auth",

  mounted () {
    this.$store.dispatch('share/getSharedWithMe', { userid: this.user.id })
  },

  data () {
    return {
      
    }
  },

  methods: {
    removeEntry (entry) {
      this.$store.dispatch('share/unshareEntry', {
        entryid: entry.entryid,
        userid: this.user.id,
        type: "receiver"
      })
    }
  },

  computed: {
    user () {
      return JSON.parse(this.$store.state.accounts.user)
    },

    sharedWithMe () {
      return this.$store.state.share.sharedWithMe
    }
  },
}
</script>

<style scoped>

.entries {
  margin-top: 20px;
}
</style>
