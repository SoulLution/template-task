import Vue from 'vue'
import Vuex from 'vuex'
import profile from "@/store/modules/profile"
import templates from "@/store/modules/templates"
import tags from "@/store/modules/tags"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    profile,
    templates,
    tags,
  },
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
})
