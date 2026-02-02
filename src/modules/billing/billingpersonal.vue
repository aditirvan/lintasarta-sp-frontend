<template>
  <div>
    <Header />

    <v-card class="rounded-lg pa-7 mt-7" flat>
      <Tablepersonal />
    </v-card>
  </div>
</template>

<script>
import Header from "./header.vue";
import Tablepersonal from "./tablepersonal.vue";

export default {
  components: {
    Header,
    Tablepersonal
  },
}
</script>