export const state = () => {
    return {
        user: getUserFromCookie(),
        prompt: {}
    }
}
  
// mutations should update state
export const mutations = {
  setUser(state, cookieValue) {
      state.user = cookieValue
  },

  setPrompt(state, data) {
    state.prompt = data
  }
}

// actions should call mutations
export const actions = {
    async getPrompt({ commit, state }, { isNew }) {
        // generate new prompt
        const response = await this.$axios.get('/api/prompts')
        if (response.status === 200) {
            commit('setPrompt', response.data)
            localStorage.setItem('prompt', JSON.stringify(response.data))
            
            // new user signing up
            if (isNew) {
              try {
                // add that new prompt to active_prompt table
                const res = await this.$axios.post('/api/prompts', {
                    userid: JSON.parse(state.user).id,
                    promptid: response.data.promptid,
                    dateadded: new Date().toDateString()
                })
                if (res.status === 201) {
                }
              } catch (err) {
                  // do something
              }
          }
          // not a new user
          else {
              try {
                // update the user's active prompt
                const res = await this.$axios.put(`/api/prompts/${JSON.parse(state.user).id}`, {
                    promptid: response.data.promptid,
                    dateadded: new Date().toDateString()
                })
                if (res.status === 200) {
                    console.log('Success!!')
                }
              } catch (err) {
                  // do something
              }
          }
        }
    },

    async activePrompt({ commit, dispatch, state }) {
        const today = new Date().toDateString()
        try {
            // get the user's active prompt
            const active_prompt = await this.$axios.get(`/api/prompts/${JSON.parse(state.user).id}`)
            // prompt is old, get a new one
            if (active_prompt.data.dateadded !== today) {
                dispatch('getPrompt', { isNew: false })
            }
            // maintain current active prompt
            else {
                commit('setPrompt', active_prompt.data)
                localStorage.setItem('prompt', JSON.stringify(active_prompt.data))
            }
        } catch (err) {
            // do something
        }
    },

    async signup({ dispatch, commit }, { firstname, lastname, username, password }) {
        const response = await this.$axios.post('/api/accounts', {
            firstname: firstname,
            lastname: lastname,
            username: username,
            password: password
        })
        if (response.status === 201) {
            dispatch('login', {
                username: username, password: password, isNew: true
            })
        }
    },

    async login({ dispatch, commit }, { username, password, isNew }) {
        try {
            const response = await this.$axios.put('/api/authentication/login', {
                username,
                password
            })
            if (response.status === 200) {
                await commit('setUser', getUserFromCookie())
                this.$router.push('/')
                isNew ? dispatch('getPrompt', { isNew: true }) : dispatch('activePrompt')
            }
        } catch (err) {
            this.$router.push('/login')
            alert('Something went wrong')
        }
    },

    async logout ({ commit }) {
        const res = await this.$axios.put('/api/authentication/logout')
        if (res.status === 200) {
            localStorage.removeItem('prompt')
            localStorage.removeItem('newestEntry')
            localStorage.removeItem('entriesList')
            commit('setUser', null)
            this.$router.push('/login')
        }
    },

    async update({ commit }, { currentPass, newPass, userid }) {
        try {
            const res = await this.$axios.put('/api/accounts/' + userid, {
                currentPass: currentPass,
                newPass: newPass
            })
            if (res.status === 200) {
                alert('Your password has been successfully updated')
            }
        } catch (err) {
            if (err.response.status === 401) {
                alert('The current password you provided was incorrect')
            }
        }
    },

    async delete({ commit }, { userid }) {
        try {
            const res = await this.$axios.delete('/api/accounts/' + userid)
            if (res.status === 204) {
                commit('setUser', null)
                localStorage.removeItem('prompt')
                localStorage.removeItem('newestEntry')
                localStorage.removeItem('entriesList')
                this.$router.push('/signup')
            }
        } catch (err) {
            if (err.response.status === 400) {
                alert('Something went wrong, please try again')
            }
            else if (err.response.status === 403) {
                alert('You do not have permission to delete this account')
            }
        }
    }
}

export const getters = {
  isLoggedIn: state => {
    return state.user
  }
}


// Check if the user cookie is set and if so get the cookie value.
// This cookie is set in addition to the session cookie when the user
// authenticated, but this cookie is made accessible to the browser's
// JavaScript.
function getUserFromCookie () {
    const re = new RegExp("user=([^;]+)") 
    const value = re.exec(document.cookie)
    return value != null ? unescape(value[1]) : null
}

