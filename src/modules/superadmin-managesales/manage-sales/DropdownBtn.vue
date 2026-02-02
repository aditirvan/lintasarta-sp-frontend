<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="primary--text"
        color="white"
        elevation="0"
        v-bind="attrs"
        v-on="on"
      >
        More <v-icon>mdi-chevron-down</v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item>
        <v-list-item-title>
          <span class="cursor-pointer primary--text" @click="$emit('detail')">
            <b>Detail</b>
          </span>
        </v-list-item-title>
      </v-list-item>

      <v-list-item v-if="!read_only">
        <v-list-item-title>
          <span
            class="cursor-pointer primary--text"
            @click="$emit('editPopupOn')"
          >
            <b>Edit</b>
          </span>
        </v-list-item-title>
      </v-list-item>

      <v-list-item v-if="!read_only">
        <v-list-item-title>
          <span class="cursor-pointer error--text" @click="$emit('delete')">
            <b>Delete</b>
          </span>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { AccessControl } from "@/lib/middleware";
import { ref } from "@vue/composition-api";
export default {
  props: ["id"],
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Manage Sales'));
    return {
      read_only,
    };
  }
};
</script>
