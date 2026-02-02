<template>
  <!-- <div
    class="d-flex flex-row justify-end mt-3 pt-3 customfooter"
    :style="{
      'border-top': bordertop == '' ? '1px solid lightgrey' : '',
      visibility:
        hidden == '' &&
        props.pagination.pageCount <= 1 &&
        props.pagination.itemsPerPage == 10
          ? 'hidden'
          : '',
      display:
        hidden != '' &&
        props.pagination.pageCount <= 1 &&
        props.pagination.itemsPerPage == 10
          ? 'none !important'
          : '',
    }"
  > -->
  <div
    class="d-flex flex-row justify-end mt-3 pt-3 customfooter"
    :style="{
      'border-top': bordertop == '' ? '1px solid lightgrey' : '',
    }"
  >
    <v-spacer />
      <v-select
        dense
        class="rounded-lg flex-grow-0 selectFooter"
        hide-details
        @change="
          (val) => {
            change(val);
          }
        "
        :items="items"
        v-model="itemselected"
        item-text="text"
        item-value="value"
        outlined
      >
        <template v-slot:selection="{ item }">
          {{
            `${
              props.pagination.itemsPerPage * (props.pagination.page - 1) + 1
            } - ${
              props.pagination.itemsPerPage == -1
                ? props.pagination.itemsLength
                : item.value * props.pagination.page > props.pagination.itemsLength
                ? props.pagination.itemsLength
                : props.pagination.itemsPerPage * (props.pagination.page - 1) +
                  item.value
            } of ${props.pagination.itemsLength}`
          }}
        </template>
      </v-select>
    <div
      style="border: 1px solid #cad6e1"
      class="px-3 rounded-lg d-flex flex-row align-center ml-3"
    >
      <p
        id="Prev"
        class="mb-0"
        :class="{ linkpointer: props.pagination.page > 1 }"
        @click.prevent="
          () => {
            if (props.pagination.page <= 1) return;
            props.pagination.page > 1 ? props.options.page-- : '';
            $nextTick(() => {
              pagination();
            });
          }
        "
      >
        Prev
      </p>
      <div v-for="n in props.pagination.pageCount" :key="n">
        <v-btn
          v-show="showbutton(n)"
          height="25"
          width="25"
          style="background-color: transparent"
          :ripple="false"
          class="mx-1"
          depressed
          fab
          small
          :class="{
            primary: props.pagination.page == n,
            'accent--text': props.pagination.page != n,
          }"
          @click="
            () => {
              props.options.page = n;
              $emit('input', props.options);
            }
          "
          >{{ n }}</v-btn
        >
      </div>

      <p
        class="mb-0"
        :class="{
          linkpointer: props.pagination.page < props.pagination.pageCount,
        }"
        id="Next"
        @click.prevent="
          () => {
            if (props.pagination.page >= props.pagination.pageCount) return;
            props.options.page++;
            $nextTick(() => {
              pagination();
            });
          }
        "
      >
        Next
      </p>
    </div>
  </div>
</template>
<script>
import { watch, ref } from "@vue/composition-api";
function distance(x, props) {
  const currentPage = props.pagination.page;
  const pageCount = props.pagination.pageCount;
  let bataskanan = currentPage + x;
  let bataskiri = currentPage - x;
  if (bataskiri <= 0) {
    bataskanan -= bataskiri - 1;
  }
  if (bataskanan > pageCount) {
    bataskiri -= bataskanan - pageCount;
  }
  return function (n) {
    return n <= bataskanan && n >= bataskiri;
  };
}
export default {
  props: ["props", "bordertop", "hidden"],
  setup(props) {
    const itemselected = ref(10);
    return {
      itemselected,
    };
  },
  data() {
    return {
      items: [
        { text: "10", value: 10 },
        { text: "20", value: 20 },
        { text: "50", value: 50 },
        { text: "100", value: 100 },
      ],
    };
  },
  computed: {
    pageCountT() {
      return (
        this.props.pagination.itemsPerPage == 10 &&
        this.props.pagination.pageCount == 1
      );
    },
  },
  methods: {
    showbutton(n) {
      return distance(2, this.props)(n);
    },
    pagination() {
      this.$emit("input", this.props.options);
    },
    change(val) {
      this.props.options.itemsPerPage = val;
      this.props.options.page = 1;
      this.$emit("input", this.props.options);
    },
  },
};
</script>

<style lang="scss" scoped>
.linkpointer {
  cursor: pointer;
  color: #1f60a8;
}
.selectFooter ::v-deep {
 .v-select__selections input{
   max-width: 0px;
 }
}
</style>