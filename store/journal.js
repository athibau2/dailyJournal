import { Store } from "express-session"

export const state = () => ({
    list: [],
    user: Store.user
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
  toggle(state, todo) {
    todo.done = !todo.done
  }
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

  login({ commit, state }) {
    // login here
  }
}

export const getters = {
  isLoggedIn: state => {
    return state.user
  }
}
