import Vue from 'vue'
export default {
  namespaced: true,
  state: {
    tags: [],
  },
  getters: {
    getTags(state) {
      return state.tags
    },
  },
  actions: {
    async fetchTags(ctx) {
      if (ctx.getters.getTags.length) return
      ctx.commit("init")
    },
  },
  mutations: {
    async init(state) {
      const res = await Vue.prototype.$axios.get(`/canvas_templates/tags/list`).catch(()=> {})
      if(res.status === 200) {
        state.tags = state.tags.concat(res.data)
      }
    }

  },
}
