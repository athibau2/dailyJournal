export const state = () => ({
    list: [],
  })
  
// mutations should update state
export const mutations = {
  add(state, text) {
    state.list.push({
      text,
      done: false
    })
  },
  remove(state, { todo }) {
    state.list.splice(state.list.indexOf(todo), 1)
  },
}

// actions should call mutations
export const actions = {
  getList ({ commit, state }) {
    console.log('Making ajax call')
    const list = [
        { done: false, text: 'Item 1'},
        { done: true, text: 'Item 2'},
        { done: false, text: 'Item 3'}
    ]
    list.forEach(item => {
        commit('add', item)
    })
  },

  async submit({ commit, state }, promptid) {
    const response = await this.$axios.post('/api/entries/${promptid}', {
            entryid: '',
            text: '',
            date: ''
        })
    if (response.status === 200) {
        commit('setCookie', getUserFromCookie())
    }
},
}
