export const state = () => ({
    results: [],
    sharedList: [],
    entryBeingShared: null,
    sharedWithMe: []
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
    },

    setSharedWithMe(state, data) {
        state.sharedWithMe = data
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

    async shareEntry({ dispatch }, { entryid, owner, users }) {
        try {
            for (let i = 0; i < users.length; ++i) {
                const res = await this.$axios.post(`/api/share`, {
                    entryid: entryid,
                    owner: owner,
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

    async unshareEntry({ dispatch }, { entryid, userid, type }) {
        try {
            const res = await this.$axios.delete(`/api/share/${entryid}/${userid}`)
            if (res.status === 204) {
                (type === "owner")
                    ? await dispatch('getSharedList', { entryid })
                    : await dispatch('getSharedWithMe', { userid })
            }
        } catch (err) {
            if (err.response.status === 400) {
                alert('Something went wrong, please try again')
            }
        }
    },

    async getSharedWithMe({ commit }, { userid }) {
        try {
            const res = await this.$axios.get(`/api/share/${userid}`)
            if (res.status === 200) {
                for (let i = 0; i < res.data.length; ++i) {
                    res.data[i].date = await parseDate(res.data[i].date)
                }
                await commit('setSharedWithMe', res.data)
            }
        } catch (err) {
            if (err.response.status === 400) {
                alert('Something went wrong, please try again')
            } else if (err.response.status === 404) {
                await commit('setSharedWithMe', [])
            }
        }
    },
}


/// External functions
async function parseDate(date) {
    let prettyDate = ""
    const yearMonth = date.split('-')
    let day = yearMonth[2].split('T')
    prettyDate += yearMonth[1] + " / " + day[0] + " / " + yearMonth[0]
    return prettyDate
}