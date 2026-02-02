<template>
  <v-menu
    v-model="dialog"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope"/>
    </template>
  </v-menu>
</template>
<script lang="ts">
import { ref, watch, SetupContext, computed, Ref, defineComponent } from "@vue/composition-api";
export default defineComponent({
  props: ["value","coordinate","documentid","offsetTop"],
  setup(props:any, context: SetupContext) {
    context;
    const dialog = ref('')
    const x = ref(0)
    const y = ref(0)
    return {
      dialog,
      x,
      y,
    };
  },
  data():{tri:{img:HTMLElement|null}}{
    return{
      tri:{
        img: null
      }
    }
  },
  watch:{
    dialog(val){
      const content = document.getElementById(this.documentid)
      if (val && content) {
        const img = document.createElement("img");
        img.src = require("@/assets/tri.png");
        img.style.position = "absolute";
        img.style.top = `${ this.offsetTop }px`;
        // img.style.left = `${content.offsetLeft}px`;
        img.style.zIndex = "20";
        this.tri.img = img;
        content.insertBefore(img, content.firstElementChild);
      } else {
        this.tri.img?.remove()
      }
    }
  },
  destroyed(){
    this.tri.img?.remove()
  }
});
</script>
<style lang="scss" scoped>
[role="menu"] {
  margin-top:14px;
  ::v-deep .v-list-item {
    min-height: 38px;
  }
  ::v-deep .v-list-item__title {
    font-weight: 600;
  }

}

</style>