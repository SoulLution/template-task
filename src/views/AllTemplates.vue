<template>
    <div class="main">
    <div class="topbar">
        <input type="text" class="search" placeholder="search" v-model="search.name">
        <v-select :options="tags" multiple v-model="search.tags"></v-select>
    </div>
    <div class="content" ref="main" @scroll="checkScroll">
        <div class="template" v-for="template in templates" :key="template.id">
            <router-link
                class="template-card"
                :to="{name: 'template', params: { id: template.id}}"
            >
                <div class="name">
                    {{ template.name }}
                </div>
                <div class="img" :style="{'--img': `url(${template.preview_image})`}">
                </div>
            </router-link>
        </div>
    </div>
</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
    data() {
        return {
            search: {
                timer: null,
                name: this.$store.state.templates.filter.name,
                tags: this.$store.state.templates.filter.tags
            }
        }
    },
    computed: {
        ...mapGetters("tags", { tags: "getTags" }),
        ...mapGetters("templates", {
            templates: "getTemplates",
            lastPage: "getLastPage",
            hasLoad: "getHasLoad",
            filter: "getFilter"
        })
    },
    watch: {
        'search.tags'(newData) {
            this.updateFilterTags(newData)
        },
        'search.name'(newData) {
            if(this.search.timer) clearTimeout(this.search.timer)
            this.search.timer = setTimeout(() => {
                this.updateFilterName(newData)
            }, 1000);
        },
        hasLoad(newData) {
            if (newData) {
                const main = this.$refs.main
                if (main.clientHeight >= main.scrollHeight)
                this.onLoadTemplates()
            }
        }
    },
    async created() {
        await this.onLoadTemplates()
        this.fetchTags()
    },
    methods: {
        ...mapActions("tags", ["fetchTags"]),
        ...mapActions("templates", ["updateFilterName", "updateFilterTags"]),
        checkScroll() {
            const main = this.$refs.main
            if (main.scrollTop + main.clientHeight > main.scrollHeight * 0.9)
                this.onLoadTemplates()
        },
        async onLoadTemplates () {
            await this.$store.dispatch("templates/getByPages", { page: this.lastPage })
        }
    }
}
</script>

<style lang="scss" scoped>
.main {
    flex-direction: column;
    display: flex;
}
.content {
    display: flex;
    flex-wrap: wrap;
}
.template {
    width: calc(33.33% - 2rem);
    padding: 1rem;
    // height: 150px;
    &-card {
        margin: 1rem;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        position: relative;
        width: 100%;
        height: 500px;
        min-height: 500px;
        background-color: white;
        border: 1px solid #adadad;
        border-radius: 4px;
        padding: 1rem;
        box-shadow: 1px 1px 10px beige;
        color: black;
        text-decoration: none;
        cursor: pointer;
        transition: 0.3s;
        &:hover {
            color: aquamarine;
            transform: scale(1.1);
        }
    }
    & .img {
        background-image: var(--img);
        background-size: auto 100%;
        background-position: center;
        background-repeat: no-repeat;
        width: 100%;
        height: 100%;
    }
}

.topbar {
    position: sticky;
    top: 0;
    background-color: #f3f3f3;
    display: flex;
    padding: 1rem 0.5rem;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin: 1rem 0;
    transition: 0.3s;
    box-shadow: 1px 1px 10px 10px #f3f3f3;
    z-index: 1;
    & .search {
        height: 24px;
        margin-right: 1rem;
        margin-bottom: 0;
    }
}
</style>