export const state = () => ({
      newestEntry: {},
      entriesList: [],
      topics: [],
  })
  
// mutations should update state
export const mutations = {
    newestEntry(state, data) {
      state.newestEntry = data
    },

    entriesList(state, data) {
      state.entriesList = data
    },

    topics(state, data) {
      state.topics = data
    }
}

// actions should call mutations
export const actions = {
  async submit({ dispatch, commit }, { response, userid, promptid }) {
    const res = await this.$axios.post('/api/entries', {
            response: response,
            date: await todayTimestamp(),
            userid: userid,
            promptid: promptid
        })
    if (res.status === 201) {
        commit('newestEntry', res.data)
        localStorage.setItem('newestEntry', JSON.stringify(res.data))
        dispatch('loadEntries')
    }
  },

  async loadEntries({ commit, rootState }) {
    let today = await todayTimestamp()
    let userid = JSON.parse(rootState.accounts.user).id
    const res = await this.$axios.get(`/api/entries/${userid}/${today}`)
    if (res.status === 200) {
      for (let i = 0; i < res.data.length; ++i) {
        res.data[i].date = await parseDate(res.data[i].date)
      }
      commit('entriesList', res.data)
    }

    const topics = await this.$axios.get(`/api/topics`)
    if (topics.status === 200) {
      commit('topics', topics.data)
    }
  },

  async filterDate({ commit }, { afterDate, userid }) {
    await commit('entriesList', [])
    afterDate += 'T00:00:00.000Z'
    const res = await this.$axios.get(`/api/entries?afterdate=${afterDate}&userid=${userid}`)
    if (res.status === 200) {
      for (let i = 0; i < res.data.length; ++i) {
        res.data[i].date = await parseDate(res.data[i].date)
      }
      commit('entriesList', res.data)
    }
  },

  async filterTopic({ commit }, { topicid, userid }) {
    await commit('entriesList', [])
    const res = await this.$axios.get(`/api/entries?topicid=${topicid}&userid=${userid}`)
    if (res.status === 200) {
      for (let i = 0; i < res.data.length; ++i) {
        res.data[i].date = await parseDate(res.data[i].date)
      }
      commit('entriesList', res.data)
    }
  },
}


/// External functions

async function todayTimestamp() {
    let year = new Date().getFullYear()
    let month = parseInt(new Date().getMonth()) + 1
    if (month < 10) month = '0' + month.toString()
    let date = parseInt(new Date().getDate())
    if (date < 10) date = '0' + date.toString()
    let fullDate = year + '-' + month + '-' + date + 'T00:00:00.000Z'
    return fullDate
}

async function parseDate(date) {
  let prettyDate = ""
  const yearMonth = date.split('-')
  let day = yearMonth[2].split('T')
  prettyDate += yearMonth[1] + " / " + day[0] + " / " + yearMonth[0]
  return prettyDate
}
