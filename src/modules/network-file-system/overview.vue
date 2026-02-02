<template>
    <div>
        Overview : {{ hello_var }}
    </div>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";


export default {
  setup(props, context) {
    let hello_var = ref("hello from overview");

    onMounted(async () => {
      console.log(hello_var.value)
    });
    return {
        hello_var
    };
  },
};
</script>