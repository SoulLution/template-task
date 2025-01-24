<template>
    <div class="modal">
        <div class="bg" @click="close()"></div>
        <div class="card">
            <h3 class="title">
                <slot name="title">{{title}}</slot>
            </h3>
            <div class="content">
                <slot>{{content}}</slot>
            </div>
            <div class="space"></div>
            <div class="actions">
                <button v-if="!noCancel" @click="close()" style="--color: #999">Cancel</button>
                <button @click="action()">Ok</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: "title"
        },
        content: {
            type: String,
            default: "content"
        },
        noCancel: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        action() {
            this.$emit("action")
            this.close()
        },
        close() {
            this.$emit("close")
        }
    }
}
</script>
<style lang="scss" scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    & .bg {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: black;
        opacity: 0.2;
        z-index: 1;
    }
    & .card {
        position: relative;
        z-index: 2;
        max-width: 960px;
        width: 90%;
        max-height: 320px;
        height: 90%;
        background-color: white;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        border: 1px solid #adadad;
        box-shadow: 1px 1px 10px beige;
        padding: 1rem;
        & .title {
            margin: 0;
            text-align: left;
        }
        & .content {
            padding: 1rem 0.5rem;
            text-align: left;
            margin: 0;
            border-top: 1px solid #adadad;
        }
        & .space {
            height: 100%;
        }
        & .actions {
            border-top: 1px solid #adadad;
            display: flex;
            width: 100%;
            padding-top: 1rem;
            flex-direction: row-reverse;
        }
    }
}
</style>