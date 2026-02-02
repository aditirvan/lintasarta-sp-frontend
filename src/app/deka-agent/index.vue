<template>
 <v-row style="height: 100%">

    <v-col
      class="d-flex flex-column justify-center"
      :class="{ 'order-2': $vuetify.breakpoint.xsOnly }"
    >
        <h3
                class="display-2"
                style="
                font-family: Fira sans !important;
                font-weight: 700;
                color: #556272;
                text-align: center;
              "
            >
        {{ message }}
        </h3>

    </v-col>

  </v-row>
</template>
<script>
import { onMounted, ref } from "@vue/composition-api";
import localstorage from "@/lib/localstorage";
export default {
  setup(props, context) {

    const message = ref();
    onMounted(() => {

      const currentURL = window.location.href;
      const searchParams = new URLSearchParams(currentURL.split('?')[1]);
      message.value = searchParams.get('message');
      console.log(`message.value: ${message.value}`);

    });
    return {
      message,
    };
  },
};
</script>
<style lang="scss" scoped>
.v-data-table {
  ::v-deep th:first-child {
    text-align: center;
  }
  ::v-deep th {
    text-align: inherit;
  }
}
</style>