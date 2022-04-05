<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col :cols="showDate ? 4 : 2">
          <v-btn @click="loadEntries()">Entries Today</v-btn>
          <br><br>
          <v-layout row wrap justify-center>
            <v-switch
              inset
              v-model="sortByDate"
              label="Sort By Date"
              @click="sortByTopic = !sortByTopic"
            >
            </v-switch>
          </v-layout>
          <v-btn :disabled="!sortByDate" @click="showDate = !showDate">
              {{(afterDate.length === 0) ? dateHint : afterDate}}
          </v-btn>
          <v-date-picker 
              v-if="showDate"
              v-model="afterDate"
              :max="today"
              elevation="6"
              @click:date="filterDate()"
          >
          </v-date-picker>
          <br><br>
          <v-layout row wrap justify-center>
            <v-switch
              inset
              v-model="sortByTopic"
              label="Sort By Topic"
              @click="sortByDate = !sortByDate"
            >
            </v-switch>
          </v-layout>
          <v-menu 
            bottom
            transition="slide-y-transition"
            :offset-y="true"
            :close-on-content-click="true"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" :disabled="!sortByTopic">{{topicSort}}</v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(t, i) in topics" :key="i" link>
                  <v-list-item-title
                    v-text="t.topictext"
                    style='font-size: 10pt;'
                    @click="filterTopic(t)"
                  >
                  </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
        <v-col cols="8" v-if="entriesList.length !== 0">
          <h2 class="text-center">Entries Today</h2>
          <v-row justify="center" align="center" v-for="(entry, i) in entriesList" :key="i">
            <v-card class="entries" elevation="5" width="450">
              <v-card-title style="word-break: break-word">
                {{entry.prompttext}}
              </v-card-title>
              <v-card-subtitle>
                <em>{{entry.topictext}}</em>&nbsp;&nbsp;&nbsp;&nbsp;{{entry.date}}
              </v-card-subtitle>
              <v-card-text>
                {{entry.text}}
              </v-card-text>
              <v-card-actions>
              </v-card-actions>
            </v-card>
          </v-row>
        </v-col>
        <v-col cols="8" v-else>
          <h2 class="text-center" v-if="entriesList.length === 0">No Entries Found</h2>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import topics from '~/api/controller/topics'
export default {
  name: 'EntriesPage',
  middleware: "auth",

  mounted () {
    this.$store.dispatch('journal/loadEntries')
  },

  data () {
    return {
      sortByTopic: false,
      sortByDate: true,
      dateHint: "Choose Date",
      afterDate: "",
      topicSort: "Choose Topic",
      showDate: false,
    }
  },

  methods: {
    loadEntries () {
      this.dateHint = "Choose Date"
      this.topicSort = "Choose Topic"
      this.$store.dispatch('journal/loadEntries')
    },

    filterDate () {
      this.showDate = !this.showDate
      this.$store.dispatch('journal/filterDate', {
        afterDate: this.afterDate,
        userid: this.user.id
      })
    },

    filterTopic (t) {
      this.topicSort = t.topictext
      this.$store.dispatch('journal/filterTopic', {
        topicid: t.topicid,
        userid: this.user.id
      })
    },
  },

  computed: {
    user () {
      return JSON.parse(this.$store.state.accounts.user)
    },

    entriesList () {
      return this.$store.state.journal.entriesList
    },

    topics () {
      return this.$store.state.journal.topics
    },

    today () {
      const year = new Date().getFullYear()
      let month = parseInt(new Date().getMonth()) + 1
      if (month < 10) month = '0' + month.toString()
      let day = parseInt(new Date().getDate())
      if (day < 10) day = '0' + day.toString()
      return year + "-" + month + '-' + day
    }
  },
}
</script>

<style scoped>
.entries {
  margin-top: 20px;
}
</style>
