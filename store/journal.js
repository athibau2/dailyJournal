export const state = () => ({
    list: [],
    
  })
  
// mutations should update state
export const mutations = {
  
}

// actions should call mutations
export const actions = {
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
