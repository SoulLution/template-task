import router from '@/router';

export default {
  namespaced: true,
  state: {
    token: localStorage.getItem('token') ? localStorage.getItem('token') : null,
    user:  localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  },
  getters: {
    getUser(state) {
      return state.user
    }
  },
  actions: {
    set(ctx, newData) {
      if(!newData) return

      if(newData.token)
        ctx.commit("setToken", { token: newData.token, remember_me: newData.remember_me })
      if(newData.user)
        ctx.commit("setUser", { user: newData.user, remember_me: newData.remember_me })
    },
    logout(ctx) {
      ctx.commit("logout")
    }
  },
  mutations: {
    setToken(state, { token, remember_me }) {
      state.token = token
      if(remember_me)
        localStorage.setItem('token', token)
      
    },
    setUser(state, { user, remember_me }) {
      state.user = user
      if(remember_me)
        localStorage.setItem('user', JSON.stringify(user))
    },
    logout(state) {
      state.token = null
      state.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push({ name: "login" });

    }
  },
}
