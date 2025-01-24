import Vue from 'vue'
export default {
  namespaced: true,
  state: {
    templates: [],
    lastPage: 0,
    hasLoad: true,
    filter: {
      tags: [],
      name: ''
    }
  },
  getters: {
    getTemplates(state) {
      return state.templates
    },
    getFilter(state) {
      return state.filter
    },
    getTemplate: (state) => (id) => {
      const template = state.templates.find(x => x.id === id) || null
      if(template) {
        template.preview_image = template.preview_image || null
        template.new_image = null
      }
      return template
    },
    getLastPage(state) {
      return state.lastPage
    },
    getHasLoad(state) {
      return state.hasLoad
    }
  },
  actions: {
    async fetchTemplate(ctx, id) {
      const cachedTemplate = ctx.getters.getTemplate(id);
      if (cachedTemplate) return cachedTemplate
      const res = await Vue.prototype.$axios.get(`/canvas_templates/${id}`);
      if (res.status === 200) {
        return res.data;
      } else {
        console.error("Failed to fetch template:", res);
        return null;
      }
    },
    removeTemplate(ctx, id) {
      ctx.commit("removeTemplate", id)
    },
    getByPages(ctx, { page }) {
      ctx.commit("setPage", ++page)
    },
    updateFilterTags(ctx, tags) {
      ctx.commit("updateFilterTags", tags)
      ctx.commit("clearTemplates")
      ctx.commit("setPage", 1)
    },
    updateFilterName(ctx, name) {
      ctx.commit("updateFilterName", name)
      ctx.commit("clearTemplates")
      ctx.commit("setPage", 1)
    },
  },
  mutations: {
    async setPage(state, page) {
      if(!state.hasLoad) return
      state.hasLoad = false

      const res = await Vue.prototype.$axios.get(`/canvas_templates`, {
        params: {

          filter: state.filter,
          page: {
            number: page
          }
        }
      }).catch(()=> {})
      if(res.status === 200) {
        state.lastPage = page
        state.templates = state.templates.concat(res.data)
        if(!res.data.length) state.hasLoad = false
        else state.hasLoad = true
      }
    },
    async updateFilterTags(state, tags) {
      state.filter.tags = tags
    },
    async updateFilterName(state, str) {
      state.filter.name = str || ''
    },
    async clearTemplates(state) {
      state.templates = []
      state.hasLoad = true
    },
    removeTemplate(state, id) {
      state.templates = state.templates.filter(x => x.id != id)
    }

  },
}
