export const state = () => ({
    list: [],
    
  })
  
// mutations should update state
export const mutations = {
  
}

// actions should call mutations
export const actions = {
  async submit({ commit }, { response, userid, promptid }) {
    let year = new Date().getFullYear()
    let month = new Date().getMonth()
    let date = new Date().getDate()
    let fullDate = year + '-' + month + '-' + date
    const res = await this.$axios.post('/api/entries', {
            response: response,
            date: fullDate,
            userid: userid,
            promptid: promptid
        })
    if (res.status === 201) {
        //commit('setCookie', getUserFromCookie())
    }
  },
}
