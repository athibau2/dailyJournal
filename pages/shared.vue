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
            <v-card v-for="(entry, i) in item.tab === 'entries' ? sharedEntries : sharedPrompts" :key="i"
              class="card"
              elevation="5"
              width="450"
            >
              <v-card-title class="card-title">
                {{entry.prompttext}}
              </v-card-title>
              <v-card-subtitle v-if="item.tab === 'entries'">
                {{entry.firstname}} {{entry.lastname}}&nbsp;&nbsp;&nbsp;&nbsp;
                <em>{{entry.topictext}}</em>&nbsp;&nbsp;&nbsp;&nbsp;{{entry.date}}
              </v-card-subtitle>
              <v-card-subtitle v-else-if="item.tab === 'prompts'">
                {{entry.firstname}} {{entry.lastname}}&nbsp;&nbsp;&nbsp;&nbsp;
                <em>{{entry.topictext}}</em>
              </v-card-subtitle>
              <v-card-text v-if="item.tab === 'entries'">
                {{entry.text}}
              </v-card-text>
              <v-card-text v-else-if="item.tab === 'prompts'">
                <v-textarea
                  v-model="response"
                  placeholder="Enter your response here"
                >
                </v-textarea>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="#cccccc" @click="item.tab === 'entries' ? removeEntry(entry) : removePrompt(entry)">Remove</v-btn>
                <v-btn color="#abddd0" v-if="item.tab === 'prompts'" @click="submit(entry)">Submit</v-btn>
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
      response: ""
    }
  },

  methods: {
    async removeEntry (entry) {
      await this.$store.dispatch('share/unshareEntry', {
        entryid: entry.entryid,
        userid: this.user.id,
        type: "receiver"
      })
    },

    async removePrompt (entry) {
      await this.$store.dispatch('share/unsharePrompt', {
        promptid: entry.promptid,
        userid: this.user.id,
        sender: entry.userid
      })
    },

    async submit (entry) {
      const toShare = await this.$store.dispatch('journal/submit', {
        response: this.response,
        userid: this.user.id,
        promptid: entry.promptid
      })
      await this.$store.dispatch('share/shareEntry', {
        entryid: toShare.entryid,
        owner: this.user.id,
        users: [entry.userid]
      })
      await this.removePrompt(entry.promptid)
      this.response = ""
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
