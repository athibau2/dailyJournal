<template>
    <div class="modal-overlay" @click="close()">
        <div class="modal" @click.stop>
            <v-btn-toggle
              mandatory
              rounded
              v-model="sharing"
            >
              <v-btn>Share Entry</v-btn>
              <v-btn>Share Prompt</v-btn>
            </v-btn-toggle>
            <v-divider />
            <div v-if="sharing === 0">
              <div>
                <v-menu
                  bottom
                  :offset-y="true"
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      class="name-search"
                      v-on="on"
                      v-bind="attrs"
                      v-model="searchText1"
                      placeholder="Search by email..."
                      @input="search()"
                    >
                    </v-text-field>
                  </template>
                  <v-list class="result-list">
                      <v-list-item 
                        v-for="(r, i) in resultsE" :key="i" link 
                        @click="pushToList(r)">
                          <v-list-item-subtitle>
                            {{r.firstname}} {{r.lastname}}<v-spacer />{{r.username}}
                          </v-list-item-subtitle>
                          <v-divider />
                      </v-list-item>
                  </v-list>
                </v-menu>
              </div>
              <div class="share-list">
                <span class="shared-items" v-for="(s, i) in sharedList" :key="i">
                  {{s.username}}&nbsp;<v-icon size="20" @click="unshareEntry(s)">mdi-close</v-icon>
                </span>
                <span class="share-item" v-for="(s, i) in shareEntryList" :key="i">
                  {{s.username}}&nbsp;<v-icon size="20" @click="shareEntryList.splice(i, 1)">mdi-close</v-icon>
                </span>
              </div>
            </div>
            <div v-else-if="sharing === 1">
              <div>
                <v-menu
                  bottom
                  :offset-y="true"
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      class="name-search"
                      v-on="on"
                      v-bind="attrs"
                      v-model="searchText2"
                      placeholder="Search by email..."
                      @input="search()"
                    >
                    </v-text-field>
                  </template>
                  <v-list class="result-list">
                      <v-list-item 
                        v-for="(r, i) in resultsP" :key="i" link 
                        @click="pushToList(r)">
                          <v-list-item-subtitle>
                            {{r.firstname}} {{r.lastname}}<v-spacer />{{r.username}}
                          </v-list-item-subtitle>
                          <v-divider />
                      </v-list-item>
                  </v-list>
                </v-menu>
              </div>
              <div class="share-list">
                <span class="share-item" v-for="(s, i) in sharePromptList" :key="i">
                  {{s.username}}&nbsp;<v-icon size="20" @click="sharePromptList.splice(i, 1)">mdi-close</v-icon>
                </span>
              </div>
            </div>
            <v-btn @click="close()">Exit</v-btn>
            <v-btn @click="sharing === 0 ? shareEntry() : sharePrompt()">Share</v-btn>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Share',

  mounted () {
    this.$store.commit('share/updateResultsE', undefined)
    this.$store.commit('share/updateResultsP', undefined)
  },

  data () {
    return {
        searchText1: "",
        searchText2: "",
        shareEntryList: [],
        sharePromptList: [],
        sharing: 0
    }
  },

  methods: {
    async search () {
      (this.sharing === 0)
      ? await this.$store.dispatch('share/search', {
        searchText: this.searchText1,
        sharing: this.sharing
      })
      : await this.$store.dispatch('share/search', {
        searchText: this.searchText2,
        sharing: this.sharing
      })
    },

    pushToList (r) {
      if (this.sharing === 0) {
        let counter1 = 0
        let counter2 = 0
        for (let i = 0; i < this.sharedList.length; ++i) {
          if (this.sharedList[i].userid === r.userid) {
            alert(`User ${r.username} has already been added`)
            break
          }
          else counter1++
        }
        if (counter1 === this.sharedList.length) {
          for (let i = 0; i < this.shareEntryList.length; ++i) {
            if (this.shareEntryList[i].userid === r.userid) {
              alert(`User ${r.username} has already been added`)
              break
            }
            else counter2++
          }
          if (counter2 === this.shareEntryList.length) this.shareEntryList.push(r)
        }
      }
      else if (this.sharing === 1) {
        let counter = 0
        for (let i = 0; i < this.sharePromptList.length; ++i) {
            if (this.sharePromptList[i].userid === r.userid) {
              alert(`User ${r.username} has already been added`)
              break
            }
            else counter++
          }
          if (counter === this.sharePromptList.length) this.sharePromptList.push(r)
      }
    },

    async sharePrompt() {
      await this.$store.dispatch('share/sharePrompt', {
        promptid: this.promptBeingShared,
        sender: this.user.id,
        users: this.sharePromptList
      })
      this.sharePromptList = []
    },

    async shareEntry () {
      for (let i = 0; i < this.shareEntryList.length; ++i) {
        this.shareEntryList[i] = this.shareEntryList[i].userid
      }
      await this.$store.dispatch('share/shareEntry', {
        entryid: this.entryBeingShared,
        owner: this.user.id,
        users: this.shareEntryList
      })
      this.shareEntryList = []
    },

    unshareEntry (s) {
      this.$store.dispatch('share/unshareEntry', {
        entryid: this.entryBeingShared,
        userid: s.userid,
        type: "owner"
      })
    },

    close () {
      this.shareEntryList = []
      this.sharePromptList = []
      this.$emit('close-modal')
    }
  },

  computed: {
    user () {
      return JSON.parse(this.$store.state.accounts.user)
    },

    resultsE () {
      return this.$store.state.share.resultsE
    },

    resultsP () {
      return this.$store.state.share.resultsP
    },

    sharedList () {
      return this.$store.state.share.sharedList
    },

    entryBeingShared () {
      return this.$store.state.share.entryBeingShared
    },

    promptBeingShared () {
      return this.$store.state.share.promptBeingShared
    }
  },
}
</script>

<style scoped>
@import '~/assets/style.css';

.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: #000000da;
}

.modal {
  text-align: center;
  background-color: white;
  height: 475px;
  width: 500px;
  margin-top: 6%;
  padding: 0px 0;
  border-radius: 20px;
}

.result-list {
  max-height: 150px;
  position: relative;
}

.share-list {
  position: inherit;
  margin-top: 35%;
  height: 125px;
  overflow: auto;
  text-align: left;
  width: 100%;
  bottom: 30px;
}

.shared-items {
  position: relative;
  word-wrap: break-word;
  display: inline-block;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  padding: 3px;
  margin-right: 5px;
  margin-top: 5px;
  border-radius: 8px;
}

.share-item {
  position: relative;
  word-wrap: break-word;
  display: inline-block;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  padding: 3px;
  margin-right: 5px;
  margin-top: 5px;
  border-radius: 8px;
}

.name-search {
  padding: 5px;
}

</style>
