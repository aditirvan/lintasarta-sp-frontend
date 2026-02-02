<template>
  <div class="text-center">
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
        <!-- <v-list-item v-for="(item, index) in items" :key="index">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item> -->

        <v-list-item>
          <v-list-item-title>
            <span
              class="cursor-pointer"
              @click="$router.push('/broadcast/' + id)"
            >
              <small class="primary--text">
                <b>Detail</b>
              </small>
            </span>
          </v-list-item-title>
        </v-list-item>

        <template v-if="(isDraft && !read_only) || (!isDraft && !read_only)">
          <div :style="{ borderTop: '1px solid lightgray' }" />

          <v-list-item>
            <v-list-item-title>
              <span
                class="cursor-pointer"
                @click="$router.push('/broadcast/' + id + '/edit')"
              >
                <small class="primary--text">
                  <b>Edit</b>
                </small>
              </span>
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>
              <span class="cursor-pointer" @click="deleteDialogOn = true">
                <small class="error--text">
                  <b>Delete</b>
                </small>
              </span>
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-menu>

    <ConfirmationDialog
      v-model="deleteDialogOn"
      @confirm="deleteBroadcast"
      :loading="loading"
      title="Delete Broadcast"
      desc="Are you sure you want to delete this broadcast?"
    />
  </div>
</template>

<script>
import api from "@/lib/api";
import ConfirmationDialog from "./dropdown-btn/confirmationDialog.vue";

import { AccessControl } from "@/lib/middleware";

export default {
  props: ["id", "isDraft"],
  components: {
    ConfirmationDialog,
  },
  data() {
    return {
      deleteDialogOn: false,
      loading: false,
    };
  },
  setup(props, context){
    const access_control = new AccessControl(context.root.$store);
    const read_only = access_control.is_read_mode('Broadcast');
    return {
      read_only
    }
  },
  methods: {
    async deleteBroadcast() {
      this.loading = true;

      try {
        await api.DELETE("/superadmin/broadcast/" + this.id);
        this.deleteDialogOn = false;
        this.$emit('refreshData')
        this.$store.dispatch(
          "HOMEPAGE/showSuccessToast",
          "Broadcast has been succesfully deleted"
        );
      } catch (err) {
        let errmsg = "Sorry, an error occurred while deleting broadcast";
        const thereIsErrorMessage = err && err.response && err.response.data;

        if (thereIsErrorMessage && err.response.data.data) {
          errmsg = err.response.data.data;
        }

        if (
          thereIsErrorMessage &&
          err.response.data.data !== "record not found"
        ) {
          this.$store.dispatch("HOMEPAGE/showErrorToast", errmsg);
        }
      }

      this.loading = false;
    },
  },
};
</script>

<style scoped>
.cursor-pointer:hover {
  cursor: pointer;
}

small {
  font-size: 14px;
}
</style>
