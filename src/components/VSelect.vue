<template>
    <div class="wrapper">
        <div class="select" @click="toggleDropdown">
            <span class="selected-option" v-if="selectedOption.length">
            <v-chip v-for="tag in selectedOption" :key="tag" :msg="tag" />
            </span>
            <span class="selected-option" v-else>
                Select an option
            </span>
            <span class="arrow">&#9660;</span>
        </div>
        <ul v-if="isOpen" class="dropdown">
            <li
                v-for="option in options"
                :key="option"
                @click="selectOption(option)"
                :class="{'selected': isSelected(option)}"
            >
                {{ option }}
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props: {
        options: {
            type: Array,
            required: true,
        },
        value: {
            type: [String, Array],
            default: () => []
        },
        multiple: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isOpen: false,
            selectedOption: Array.isArray(this.value) ? this.value : [this.value]
        }
    },
    watch: {
        value(newValue) {
            this.selectedOption = Array.isArray(newValue) ? newValue : [newValue];
        }
    },
    methods: {
        toggleDropdown() {
            this.isOpen = !this.isOpen;
        },
        selectOption(option) {
            if (this.multiple) {
                const index = this.selectedOption.indexOf(option);
                if (~index) {
                this.selectedOption.splice(index, 1);
                } else {
                this.selectedOption.push(option);
                }
            } else {
                this.selectedOption = [option];
                this.isOpen = false;
            }
            this.$emit('input', this.selectedOption);
        },
        isSelected(option) {
            return this.selectedOption.includes(option);
        }
    },
}
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  min-width: 200px;
  width: auto;
  font-family: Arial, sans-serif;
}

.select {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  background-color: #fff;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: aquamarine;
  }

  .selected-option {
    color: #333;
    font-size: 1rem;
    word-wrap: break-word;
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
  }

  .arrow {
    font-size: 12px;
    color: #333;
  }
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;

  li {
    padding: 0.5rem;
    cursor: pointer;
    transition: background-color 0.3s;

    &.selected {
      background-color: aquamarine;
      color: white;
    }

    &:hover {
      background-color: #f0f0f0;
    }
  }
}
</style>
  