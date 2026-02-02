<template>
    <p v-on:click="count++">You clicked me {{ count }} times.</p>
</template>
<script>
export default {
    data: function () {
    return {
      count: 0
    }
  },
}
</script>