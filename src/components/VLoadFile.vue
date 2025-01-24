<template>
  <form
    enctype="multipart/form-data"
    novalidate
    class="load-file"
    :class="{ active: drag }"
    @dragover="drag = true"
  >
    <p>
      Drop File
    </p>
    <div
      class="content-image"
    >
      <template v-for="(file, i) in files">
        <div
          :key="i"
          class="image-item"
          :title="file.name"
          :class="{ load: file.load }"
        >
          <svg
            v-if="file.load"
            class="loader"
            width="4rem"
            height="4rem"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
          >
            <circle
              cx="50"
              cy="50"
              fill="none"
              stroke-width="10"
              r="35"
              stroke-dasharray="164.93361431346415 56.97787143782138"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                repeatCount="indefinite"
                dur="1s"
                values="0 50 50;360 50 50"
                keyTimes="0;1"
              />
            </circle>
          </svg>
          <div class="close" @click.stop="deleteMe(i)">
            X
          </div>
          <img :src="file.file" />
        </div>
      </template>
    </div>
    <input
      ref="file"
      type="file"
      :accept="accept"
      :class="{ 'd-none': !drag }"
      :multiple="multiple"
      @dragleave="drag = false"
      @change="getFile"
    />
    <button @click.prevent="$refs.file.click()">
      Find in files
    </button>
  </form>
</template>

<script>
export default {
  props: {
    accept: {
      type: String,
      default: "image/*",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: "",
    },
    path: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      files: this.value
        ? [
            {
              file: this.value,
            },
          ]
        : [],
      drag: false,
    }
  },
  methods: {
    deleteMe(index) {
      this.files.splice(index, 1)
      this.$emit("input", "")
    },
    getFile(e) {
      this.drag = false
      Array.from(e.target.files).forEach((x) => {
        if (this.multiple)
          this.files.push({
            file: URL.createObjectURL(x),
            originalFile: x,
            name: x.name,
            size: x.size,
            load: true,
          })
        else
          this.files = [
            {
              file: URL.createObjectURL(x),
              name: x.name,
              originalFile: x,
              size: x.size,
              load: true,
            },
          ]
      })
      this.files.forEach(async (x) => {
        // x.file = await this.sendFile(x.originalFile)
        x.load = false
      })
      if(this.files.length)
        this.$emit("input", this.files[0].originalFile)
    },
    async sendFile(file) {
      const formData = new FormData()
      formData.append("file", file)
      const res = await this.$axios.post("space/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      this.$emit("input", res.data)
      return res.data
    },
  },
}
</script>
<style lang="scss" scoped>

.load-file {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  height: 100%;
  width: 100%;
  border: 1px dashed #000000;
  border-radius: 8px;
  &.active {
    background: rgba(123, 202, 200, 0.12);
  }
}
.content-image {
  max-height: 80%;
  overflow: auto hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.load {
  & > img {
    filter: blur(3px);
  }
}
.loader {
  position: absolute;
  z-index: 2;
  & > circle {
    stroke: aquamarine;
  }
}
.image-item {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 33.33%;
  padding: 0.5rem;
  & > img {
    width: 100%;
  }
  &:hover {
    & .close {
      display: flex;
      cursor: pointer;
    }
  }
  & .close {
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
    display: none;
    z-index: 1;
  }
}
input {
  position: absolute;
  height: 100%;
  width: 100%;
  opacity: 0;
  &.d-none {
    height: 0%;
    width: 0%;
  }
}
</style>
