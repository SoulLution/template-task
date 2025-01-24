<template>
  <span class="chip">{{msg}}</span>
</template>

<script>
export default {
  name: 'VChip',
  props: {
    msg: String
  }
}
</script>

<style scoped lang="scss">

.chip {
    background-color: aquamarine;
    border-radius: 999px;
    margin-bottom: 0.2rem;
    margin-right: 0.5rem;
    padding: 0.5rem 1rem;
}
</style>
