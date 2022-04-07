export const state = () => ({
    results: [],
    sharedList: [],
    entryBeingShared: null
})

// mutations should update state
export const mutations = {
    updateResults(state, data) {
        state.results = data
    },

    entryBeingShared(state, data) {
        state.entryBeingShared = data
    },

    setSharedList(state, data) {
        state.sharedList = data
    }
}

// actions should call mutations
export const actions = {
    async search({ commit }, { searchText }) {
        try {
            const res = await this.$axios.get(`/api/share?searchtext=${searchText}`)
            if (res.status === 200) {
                await commit('updateResults', res.data)
            }
        } catch (err) {
            if (err.response.status === 404) {
                await commit('updateResults', undefined)
            }
        }
    },

    async getSharedList({ commit }, { entryid }) {
        await commit('entryBeingShared', entryid)
        try {
            const res = await this.$axios.get(`/api/share?entryid=${entryid}`)
            if (res.status === 200) {
                await commit('setSharedList', res.data)
            }
        } catch (err) {
            if (err.response.status === 404) {
                await commit('setSharedList', [])
            }
        }
    },

    async shareEntry({ dispatch }, { entryid, users }) {
        try {
            for (let i = 0; i < users.length; ++i) {
                const res = await this.$axios.post(`/api/share`, {
                    entryid: entryid,
                    userid: users[i].userid
                })
                if (res.status === 201) {
                    continue
                }
            }
            await dispatch('getSharedList', { entryid })
            alert('Your entry has been shared')
        } catch (err) {
            if (err.response.status === 400) {
                alert('Something went wrong, please try again')
            }
        }
    },

    async unshareEntry({ dispatch }, { entryid, userid }) {
        try {
            const res = await this.$axios.delete(`/api/share/${entryid}/${userid}`)
            if (res.status === 204) {
                await dispatch('getSharedList', { entryid })
            }
        } catch (err) {
            if (err.response.status === 400) {
                alert('Something went wrong, please try again')
            }
        }
    },
}


