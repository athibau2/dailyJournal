<template>
  <v-app>
    <span>
        <v-tabs left v-model="tab">
          <v-tabs-slider></v-tabs-slider>
            <v-tab v-for="item in items" :key="item.tab">
              {{ item.tab }} ({{item.tab === 'entries' ? sharedEntries.length : sharedPrompts.length}})
            </v-tab>
        </v-tabs>
    </span>
    <v-tabs-items v-model="tab">
      <v-col v-for="item in items" :key="item.tab">
        <v-row justify="center" align="center">
          <v-tab-item>
            <v-card
              class="card"
              elevation="5"
              width="450"
              v-for="(entry, i) in item.tab === 'entries' ? sharedEntries : sharedPrompts" :key="i"
            >
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
                <v-btn  @click="removeEntry(entry)">Remove</v-btn>
              </v-card-actions>
            </v-card>
          </v-tab-item>
        </v-row>
      </v-col>
    </v-tabs-items>

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
      tab: null,
      items: [
        { tab: 'entries' },
        { tab: 'prompts' },
      ],
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
    
    sharedEntries () {
      return this.$store.state.share.sharedEntries
    },

    sharedPrompts () {
      return this.$store.state.share.sharedPrompts
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
