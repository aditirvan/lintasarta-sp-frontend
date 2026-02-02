<template>
  <div style="margin-bottom: 3rem">
    <v-data-table
      :headers="images.headers"
      :items="customImages.filter((x) => x.is_custom && !x.is_snapshot)"
      :items-per-page="10"
      hide-default-footer
      class="elevation-0"
    >
      <template v-slot:item.name="{ item }">
        <div class="d-flex">
          <div class="dotblue mt-2"></div>
          <div>
            <span class="primary--text">{{ item.name }}</span>
            <p>Version {{ item.version }}</p>
          </div>
        </div>
      </template>

      <template v-slot:item.status="{ item }">
        <p class="mb-0 primary--text" v-if="item.is_upload_success">Active</p>
        <p class="mb-0" v-else-if="item.is_upload_failed">Failed</p>
        <p class="mb-0 red--text" v-else>Not Ready Yet</p>
      </template>

      <template v-slot:item.size="{ item }">
        <p class="mb-0">{{ item.size ? `${item.size} GB` : '-' }}</p>
      </template>

      <template v-slot:item.created="{ item }">
        <p class="mb-0">{{ moment(item.created_at).format("DD/MM/YYYY") }}</p>
      </template>

      <template v-slot:item.action="{ item }">
        <span
          class="linkpointer error--text"
          @click="
            () => {
              selectedCustomImage = item;
              showDialogDeleteCustomImage = true;
            }
          "
          >Delete</span
        >
      </template>

      <template v-if="customImages.length > 5" v-slot:footer="{ props }">
        <custom-footer-datatable :props="props" />
      </template>
      <template v-slot:no-data>
         <v-progress-circular v-if="loading"
          indeterminate
          color="primary"
        ></v-progress-circular>
        <div class="my-7 text-center" v-else>
          <p
            style="
              font-size: 16px;
              margin-bottom: 10px;
              text-transform: capitalize;
            "
            class="font-weight-bold"
          >
            Looks like you don’t have any Images
          </p>
          <v-row class="d-flex justify-center">
            <v-col
              cols="12"
              lg="6"
              md="12"
              class="text-center"
              style="color: #a5b3bf;font-weight: normal;"
            >
              <p style="font-size: 12px; color: #a5b3bf; margin-bottom: 20px">
                You can get started by importing an image via URL, drag/dropping
                your image on the the page, or clicking the Upload button.
              </p>
            </v-col>
          </v-row>

          <v-btn
            v-if="!read_only"
            to="/image/customimage"
            width="100%"
            max-width="300"
            height="50"
            depressed
            class="secondary"
            exact
          >
            Import Image
          </v-btn>
        </div>
      </template>
    </v-data-table>
    <dialogDeleteCustomImage
      v-model="showDialogDeleteCustomImage"
      :selectedCustomImage="selectedCustomImage"
    />
  </div>
</template>
<script>
import dialogDeleteCustomImage from "@/modules/images/dialogDeleteCustomImage";
import moment from "moment";
import { ref, reactive, onMounted } from "@vue/composition-api";
import {
  useNamespacedState,
  useNamespacedActions,
} from "vuex-composition-helpers";

import { AccessControl } from "@/lib/middleware";

export default {
  components: {
    dialogDeleteCustomImage,
  },
  setup(props, context) {
    const loading = ref(true);
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode("Manage Image"));
    const images = reactive({
      headers: [
        { text: "Name", value: "name" },
        { text: "Status", value: "status" },
        { text: "Created Date", value: "created" },
        { text: "Action", value: "action", sortable: false },
      ],
      data: [],
    });

    const { customImages } = useNamespacedState("IMAGES", ["customImages"]);
    const { ImagesfetchCustom } = useNamespacedActions("IMAGES", [
      "ImagesfetchCustom",
    ]);

    onMounted(async () => {
      loading.value = true
      await ImagesfetchCustom();
      loading.value = false
      if(read_only){
        images.headers.pop()
      }
    });

    const showDialogDeleteCustomImage = false;
    const selectedCustomImage = ref(null);

    return {
      read_only,

      showDialogDeleteCustomImage,
      selectedCustomImage,
      moment,
      customImages,
      loading,
      images,
      ...useNamespacedState("OBJECTSTORAGE", ["objectStorages"]),
      ...useNamespacedState("INSTANCE", ["instances"]),
    };
  },
};
</script>