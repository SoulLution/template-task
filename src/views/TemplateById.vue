<template>
    <div class="template" v-if="template || editableTemplate">
        <div class="topbar">
            <template v-if="isEdit">
                <button style="--color: #999" @click="getTemplate(template.id)">Remove</button>
                <button @click="updateTemplate()">Save</button>
            </template>
            <template v-else>
                <button @click="openEdit()">Update</button>
                <button style="--color: red" @click="openDeleteModal()">Delete</button>
            </template>
        </div>
        <div class="body" v-if="!isEdit">
            <div class="col cols-12">
                <div class="legend">Name</div>
                <div class="content">{{ template.name }}</div>
            </div>
            <div class="col cols-6">
                <div class="legend">Width</div>
                <div class="content">{{ template.width }}</div>
            </div>
            <div class="col cols-6">
                <div class="legend">Height</div>
                <div class="content">{{ template.height }}</div>
            </div>
            <div class="col cols-12">
                <div class="legend">Tags</div>
                <div class="content">
                    <v-chip v-for="tag in template.tags" :key="tag" :msg="tag" />
                </div>
            </div>
            <div class="col cols-12">
                <img :src="template.preview_image" :style="{'--height': template.height, '--width': template.width}">
            </div>
        </div>
        <div class="body" v-else>
            <div class="col cols-12">
                <div class="legend">Name</div>
                <input type="text" v-model="editableTemplate.name" :class="{error: !editableTemplate.name}">
            </div>
            <div class="col cols-6">
                <div class="legend">Width</div>
                <input type="number" v-model="editableTemplate.width" :class="{error: !editableTemplate.width}">
            </div>
            <div class="col cols-6">
                <div class="legend">Height</div>
                <input type="number" v-model="editableTemplate.height" :class="{error: !editableTemplate.height}">
            </div>
            <div class="col cols-12">
                <div class="legend">Tags</div>
                <div class="content">
                    <div class="col">
                        <v-select multiple :options="tags" v-model="editableTemplate.tags" />
                    </div>
                </div>
            </div>
            <div class="col cols-12">
                <VLoadFile v-model="editableTemplate.new_image" />
            </div>
        </div>
        <v-modal v-if="errors.length" no-cancel title="Error" @close="errors = []">
            <div v-for="error in errors" :key="error" class="error-message">
                {{ error }}
            </div>
        </v-modal>
        <v-modal
            v-if="deleteModal"
            :title="'Delete template ' + template.name"
            content="Do You realy want to delete this template?"
            @close="openDeleteModal()" @action="remove()"
        />
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
    data() {
        return {
            template: null,
            editableTemplate: null,
            isEdit: false,
            errors: [],
            deleteModal: false
        }
    },
    computed: {
        ...mapGetters("tags", { tags: "getTags" })
    },
    async created() {
        if(!this.$route.params.id) this.$router.push('/')
        this.fetchTags()
        if (this.$route.params.id === 'new') {
            this.isEdit = true
            this.editableTemplate = {
                height: "",
                name: "",
                preview_image: null,
                new_image: null,
                tags: [],
                width: "",
            }
        } else
            await this.getTemplate(this.$route.params.id)
    },
    methods: {
        ...mapActions("templates", ["fetchTemplate", "removeTemplate"]),
        ...mapActions("tags", ["fetchTags"]),
        async getTemplate(id) {
            if(this.isEdit && this.editableTemplate) {
                if(localStorage.getItem('template-' + this.editableTemplate.id))
                localStorage.setItem('template-' + this.template.id, JSON.stringify(this.editableTemplate))
            }
            this.isEdit = false
            try {

            const template = await this.fetchTemplate(id);
            this.template = JSON.parse(JSON.stringify(template))
            } catch(err) {
                console.error("Template not found or failed to load.");
                this.$router.push('/')
            }
        },
        openEdit() {
            this.isEdit = true
            const cashedTemplate = localStorage.getItem('template-' + this.template.id)
            
            if(cashedTemplate)
                return this.editableTemplate = JSON.parse(cashedTemplate)

            this.editableTemplate = JSON.parse(JSON.stringify(this.template))
            localStorage.setItem('template-' + this.template.id, JSON.stringify(this.editableTemplate))
        },
        async updateTemplate() {
            if(localStorage.getItem('template-' + this.editableTemplate.id))
                localStorage.removeItem('template-' + this.editableTemplate.id)

            let data = JSON.parse(JSON.stringify(this.editableTemplate))
            
            if(this.dataChecker(data)) return

            delete data.preview_image
            if(data.new_image) {
                delete  data.new_image
                data = this.jsonToFormData(data)
                data.append("preview_image", this.editableTemplate.new_image)
            }
            const res = await this.$axios.post(`/canvas_templates${data.id ? '/' + data.id + '?_method=PATCH' : ''}`, data)
            .catch(() => {
                this.errors.push("Something went wrong. Please try later!")
            })
            if(res.data.id != this.$route.params.id)
                this.$router.push({name: 'template', params: { id: res.data.id}})

            this.template = JSON.parse(JSON.stringify(res.data))
            this.isEdit = false

        },
        openDeleteModal() {
            this.deleteModal = !this.deleteModal
        },
        async remove() {
            try{
                await this.$axios.delete(`/canvas_templates`, { data: {id: this.template.id } })
                this.removeTemplate(this.template.id)
                this.$router.push("/")
            } catch (err) {
                this.errors.push("Something went wrong. Please try later!")
            }
           
        },
        dataChecker(data) {
            this.errors = []

            if(!data.name)
                this.errors.push('Atribute "name" has been required!')
            
            if(!data.width || isNaN(data.width))
                this.errors.push('Atribute "width" has been required and must be Number!')
            
            if(!data.height || isNaN(data.height))
                this.errors.push('Atribute "height" has been required and must be Number!')

            return !!this.errors.length
        },
        jsonToFormData(json, parentKey = "", formData = new FormData()) {
            for (const key in json) {
                if (Object.hasOwn(json, key)) {
                const value = json[key]
                const formKey = parentKey ? `${parentKey}[${key}]` : key

                if (Array.isArray(value)) {
                    value.forEach((item) => {
                    formData.append(`${formKey}[]`, item)
                    })
                } else if (value instanceof Object && !(value instanceof File)) {
                    this.jsonToFormData(value, formKey, formData)
                } else {
                    formData.append(formKey, value)
                }
                }
            }
            return formData
        }

    }
}
</script>

<style lang="scss" scoped>
.body {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    background-color: white;
    border: 1px solid #adadad;
    border-radius: 4px;
    padding: 1rem;
    box-shadow: 1px 1px 10px beige;
    margin: 1rem;
}
.col {
    display: flex;
    align-items: start;
    justify-content: center;
    flex-direction: column;
    border-bottom: 1px solid #adadad;
    &.cols-12 {
        flex: 0 0 100%;
        max-width: 100%;
    }
    &.cols-6 {
        flex: 0 0 50%;
        max-width: 50%;
    }
}
.legend {
    color: #999999;
    margin: 1rem 0 0.5rem 0.5rem;
    font-size: 1.2rem;
}
.content {
    display: flex;
    margin-left: 0.2rem;
    align-items: center;
}
img {
    width: 100%;
    max-width: calc(var(--width) * 1px);
    max-height: calc(var(--height) * 1px);
    margin-top: 1rem;
}
input {
    border-radius: 4px;
    border: 1px solid black;
    margin-bottom: 0.5rem;
    &.error {
        border-color: red;
    }
}
.topbar {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-start;
    margin: 1rem 0;
}
.error-message {
    color: rgb(190, 0, 0);
}
</style>