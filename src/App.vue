<template>
  <div id="app">
    <div class="topbar">
      <router-link class="logo" :class="{back: isChildView}" to="/">
        <img src="@/assets/logo.png" alt="">
      </router-link>
      <div class="right" v-if="profile">
        <span>{{profile.position}}</span>
        <button @click="logout()">Logout</button>
      </div>
    </div>
    <router-view class="layout-content"/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("profile", { profile: "getUser" }),
    isChildView() {
      return this.$route.name === "template"
    }
  },
  methods: {
    ...mapActions("profile", ["logout"])
  }
}
</script>
<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden;
  & > .layout-content {
    overflow: auto;
    width: 100vw;
    height: calc(100vh - 90px);
    background-color: #f3f3f3;
  }
  & .topbar {
    background-color: aquamarine;
    display: flex;
    justify-content: space-between;
    align-items: center;
    & .right {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 1rem;
      & button {
        height: auto;
      }
    }
  }
  & .logo {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    & img {
      height: 90px;
      transition: 0.3s;
    }
    &.back {
      & img {
        transform: rotate(90deg);
      }
    }
  }
}
</style>
