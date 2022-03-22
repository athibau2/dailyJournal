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
    async getPrompt({ commit, state }) {
        const response = await this.$axios.get('/api/prompts')
        if (response.status === 200) {
          commit('setPrompt', response.data)
          localStorage.setItem('prompt', JSON.stringify(response.data))
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
            dispatch('login',{
                username: username, password: password
            })
        }
    },

    async login({ dispatch, commit }, { username, password }) {
        const response = await this.$axios.put('/api/authentication/login', {
                username,
                password
        })
        if (response.status === 200) {
            await commit('setUser', getUserFromCookie())
            this.$router.push('/')
        }
    },

    async logout ({ commit }) {
        const res = await this.$axios.put('/api/authentication/logout')
        if (res.status === 200) {
            commit('setUser', null)
            this.$router.push('/login')
        }
    },

    async update({ commit }, { password, username }) {
        const res = await this.$axios.put('/api/accounts/' + username, {
            password: password
        })
        if (res.status === 200) {
            alert('Your password has been successfully updated')
        }
    },

    async delete({ commit }, { username }) {
        const res = await this.$axios.delete('/api/accounts/' + username)
        console.log(res.status)
        if (res.status === 204) {
            commit('setUser', null)
            this.$router.push('/login')
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

