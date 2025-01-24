<template>
    <div class="login-main">
        <form :class="{error}" @submit.prevent="login()">
            <h4>SIGN IN</h4>
            <input type="email" v-model="profile.email" placeholder="email">
            <input type="password" v-model="profile.password" placeholder="password">
            <label>
                <input type="checkbox" v-model="profile.remember_me"  placeholder="">
                remember me
            </label>
            <button type="submit">Login</button>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            profile: {
                email: "hello@aiscreen.io",
                password: "Demo!1234",
                remember_me: false
            },
            error: false
        }
    },
    methods: {
        async login() {
            this.error = false
            const data = Object.assign({}, this.profile)
            data.remember_me = data.remember_me ? 1 : 0
            const res = await this.$axios.post('/login', data).catch(() => this.error = true)
            if(res.status === 200) {
                this.$store.dispatch('profile/set', {...res.data, remember_me: !!data.remember_me})
                this.$router.push("/")
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.login-main {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    & form {
        margin: auto;
        width: 100%;
        max-width: 520px;
        padding: 1rem 2rem;
        border-radius: 4px;
        border: 1px solid black;
        box-shadow: 1px 1px 1px black;
        display: flex;
        flex-direction: column;
        & h4 {
            margin-top: 0;  
        }
        &.error {
        & input {
            border-color: red;
        }

        }
    }
}
</style>