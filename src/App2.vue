<template>
  <vue-topprogress ref="topProgress"></vue-topprogress>
</template>

<script lang="ts">
export default {
  mounted() {
    this.$store.commit('settopbarloading', this.$refs.topProgress)
  }
}
</script>