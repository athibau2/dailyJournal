<template>
    <div class="modal-overlay" @click="$emit('close-modal')">
        <div class="modal" @click.stop>
            <h6>Share Entry</h6>
            <v-divider />
            <div>
              <v-menu
                bottom
                :offset-y="true"
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-on="on"
                    v-bind="attrs"
                    v-model="searchText"
                    class="name-search"
                    @input="search()"
                  >
                  </v-text-field>
                </template>
                <v-list class="result-list">
                    <v-list-item 
                      v-for="(r, i) in results" :key="i" link 
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
              <span class="share-item" v-for="(s, i) in shareList" :key="i">
                {{s.username}}&nbsp;<v-icon size="20" @click="shareList.splice(i, 1)">mdi-close</v-icon>
              </span>
            </div>
            <v-btn @click="$emit('close-modal')">Exit</v-btn>
            <v-btn @click="shareEntry()">Share</v-btn>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Share',

  mounted () {
    this.$store.commit('share/updateResults', undefined)
  },

  data () {
    return {
        searchText: "",
        shareList: []
    }
  },

  methods: {
    search () {
      this.$store.dispatch('share/search', {
        searchText: this.searchText
      })
    },

    pushToList (r) {
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
        for (let i = 0; i < this.shareList.length; ++i) {
          if (this.shareList[i].userid === r.userid) {
            alert(`User ${r.username} has already been added`)
            break
          }
          else counter2++
        }
        if (counter2 === this.shareList.length) this.shareList.push(r)
      }
    },

    async shareEntry () {
      await this.$store.dispatch('share/shareEntry', {
        entryid: this.entryBeingShared,
        owner: this.user.id,
        users: this.shareList
      })
      this.shareList = []
    },

    unshareEntry (s) {
      this.$store.dispatch('share/unshareEntry', {
        entryid: this.entryBeingShared,
        userid: s.userid,
        type: "owner"
      })
    },
  },

  computed: {
    user () {
      return JSON.parse(this.$store.state.accounts.user)
    },

    results () {
      return this.$store.state.share.results
    },

    sharedList () {
      return this.$store.state.share.sharedList
    },

    entryBeingShared () {
      return this.$store.state.share.entryBeingShared
    },
  },
}
</script>

<style scoped>

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
  background-color: rgb(226, 225, 209);
  text-align: left;
  width: 100%;
  bottom: 30px;
}

.shared-items {
  background-color: rgb(220, 245, 243);
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
  background-color: rgb(243, 175, 170);
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

h6 {
  font-weight: 500;
  font-size: 28px;
}
</style>
