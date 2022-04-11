<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col :cols="showDate ? 4 : 2">
          <v-btn color="#bdd0e7" @click="loadEntries()">Entries Today</v-btn>
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
          <v-btn color="#bdd0e7" :disabled="!sortByDate" @click="showDate = !showDate">
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
              <v-btn color="#bdd0e7" v-bind="attrs" v-on="on" :disabled="!sortByTopic">{{topicSort}}</v-btn>
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
          <h2 class="text-center">{{filterMethod}}</h2>
          <v-row justify="center" align="center" v-for="(entry, i) in entriesList" :key="i">
            <v-card class="card" elevation="5" width="450">
              <v-card-title style="word-break: break-word">
                {{entry.prompttext}}
              </v-card-title>
              <v-card-subtitle>
                <em>{{entry.topictext}}</em>&nbsp;&nbsp;&nbsp;&nbsp;{{entry.date}}
              </v-card-subtitle>
              <v-card-text v-if="viewState === 'Save' && entryToEdit === entry.entryid">
                <v-textarea
                  :value="entry.text"
                  @input="textChanged($event)"
                >
                </v-textarea>
              </v-card-text>
              <v-card-text v-else>
                {{entry.text}}
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="#bdd0e7"
                      v-bind="attrs"
                      v-on="on"
                      @click="getSharedList(entry)"
                    >
                      <v-icon>mdi-share-variant</v-icon>
                    </v-btn>
                  </template>
                  <span>Share</span>
                </v-tooltip>
                <v-btn color="#cccccc" @click="deleteEntry(entry)">Delete</v-btn>
                <v-btn
                  color="#abddd0"
                  :disabled="entryToEdit === null ? false : entryToEdit === entry.entryid ? false : true" 
                  @click="(viewState === 'Edit') ? editMode(entry.entryid) : updateEntry(entry)"
                >
                  {{(entryToEdit === null) ? viewState : (entryToEdit === entry.entryid) ? "Save" : "Edit"}}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-row>
        </v-col>
        <v-col cols="8" v-else>
          <h2 class="text-center" v-if="entriesList.length === 0">No Entries Found For: {{filterMethod}}</h2>
        </v-col>
        <Share v-show="showShare" @close-modal="showShare = false" />
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import Share from '~/components/Share.vue'
export default {
  name: 'EntriesPage',
  middleware: "auth",

  components: {
    Share
  },

  mounted () {
    this.$store.dispatch('journal/loadEntries')
    this.$store.dispatch('journal/loadTopics')
  },

  data () {
    return {
      sortByTopic: false,
      sortByDate: true,
      dateHint: "Choose Date",
      afterDate: "",
      topicSort: "Choose Topic",
      showDate: false,
      filterMethod: "Entries Today",
      viewState: "Edit",
      entryToEdit: null,
      response: "",
      showShare: false
    }
  },

  methods: {
    textChanged (event) {
      this.response = event
    },

    editMode (entryid) {
      this.viewState = "Save"
      this.entryToEdit = entryid
    },

    updateEntry (e) {
      this.viewState = "Edit"
      let temp = ""
      if (this.filterMethod === "Entries Today") temp = "today"
      else if (this.filterMethod.split(':')[0] === "Entries Since") temp = this.afterDate
      else if (this.filterMethod.split(':')[0] === "Entries About") temp = e.topicid
      this.$store.dispatch('journal/updateEntry', {
        entryid: e.entryid,
        text: this.response,
        filterMethod: temp,
        userid: this.user.id
      })
      this.entryToEdit = null
    },

    async deleteEntry(e) {
      if (confirm('Are you sure you want to delete this entry?')) {
        let temp = ""
        if (this.filterMethod === "Entries Today") temp = "today"
        else if (this.filterMethod.split(':')[0] === "Entries Since") temp = this.afterDate
        else if (this.filterMethod.split(':')[0] === "Entries About") temp = e.topicid
        await this.$store.dispatch('journal/deleteEntry', {
          entryid: e.entryid,
          filterMethod: temp,
          userid: this.user.id
        })
      }
    },

    loadEntries () {
      this.filterMethod = "Entries Today"
      this.dateHint = "Choose Date"
      this.topicSort = "Choose Topic"
      this.$store.dispatch('journal/loadEntries')
    },

    filterDate () {
      this.showDate = !this.showDate
      const temp = this.afterDate.split('-')
      this.filterMethod = "Entries Since: " + temp[1] + ' / ' + temp[2] + ' / ' + temp[0]
      this.$store.dispatch('journal/filterDate', {
        afterDate: this.afterDate,
        userid: this.user.id
      })
    },

    filterTopic (t) {
      this.topicSort = t.topictext
      this.filterMethod = "Entries About: " + this.topicSort
      this.$store.dispatch('journal/filterTopic', {
        topicid: t.topicid,
        userid: this.user.id
      })
    },

    getSharedList (entry) {
      this.showShare = true
      this.$store.dispatch('share/getSharedList', {
        entryid: entry.entryid,
        promptid: entry.promptid
      })
    }
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
@import '~/assets/style.css';
.card {
  margin-top: 20px;
}

</style>
