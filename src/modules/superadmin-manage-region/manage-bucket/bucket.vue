<template>
  <v-card flat class="rounded-lg pa-4 mt-3">
    <v-card-text class="d-flex flex-row align-center">
      <v-row>
        <v-col class="d-flex flex-row align-center">
          <p class="mb-0 font-weight-bold fz-21">Management Site</p>
          <v-spacer />
          <div style="height: auto; width: 30px" />
          <v-btn
            id="CreateNewZone"
            depressed
            height="50"
            width="150"
            class="secondary"
            @click="openDialogAdd = true"
          >
            <span class="fz-14">Create New Site</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text>
      <v-row>
        <v-col>
          <v-data-table
            id="my-table"
            hide-default-footer
            :headers="headers"
            :items="buckets"
            :options.sync="options"
            class="table-zone"
          >
            <template v-slot:item.created_at="{ item }">
              {{ $moment(new Date(item.created_at)).format("DD/MM/YYYY") }}
          </template>
            <template v-slot:item.action="{ item }">
              <popupquote v-model="item.open" :offsetTop="20" :documentid="'popup' + item.id" offset-y allow-overflow>
                <template v-slot:activator="{ on, attrs }">
                  <label
                    v-bind="attrs"
                    class="primary--text linkpointer"
                    style="position: relative; white-space: nowrap"
                    @click="
                      ($event) => {
                        on.click($event);
                        show($event, item);
                      }
                    "
                    >More
                    <v-icon
                      :class="{
                        rotate: item.open,
                      }"
                      :id="'popup' + item.id"
                      color="primary"
                      >mdi-chevron-down</v-icon
                    >
                  </label>
                </template>
                
                <v-list>
                  <v-list-item
                    @click="
                      () => {
                        selectedBucket = item;
                        openDialogDelete = true;
                      }
                    "
                  >
                    <v-list-item-title class="error--text">Delete</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    @click="
                      () => {
                        selectedBucket = item;
                        openDialogEdit = true;
                      }
                    "
                  >
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                </v-list>
              </popupquote>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
    <!-- <dialogAdd v-model="openDialogAdd" @create="(payload) => doCreate(payload)" @update="(payload) => doUpdate(payload)" /> -->
    <dialogAdd v-model="openDialogAdd" :selectedBucket="selectedBucket" @create="(payload) => doCreate(payload)" @update="(payload) => doUpdate(payload)" />
    <dialogDelete v-model="openDialogDelete" :selectedBucket="selectedBucket" @delete="(payload) => doDelete(payload)" />
     <dialogEdit v-model="openDialogEdit" :selectedBucket="selectedBucket" @create="(payload) => doCreate(payload)" @update="(payload) => doUpdate(payload)" />

  </v-card>
</template>

<script>
import { defineComponent, ref,onMounted,watch } from "@vue/composition-api";
import { DEKABOXREGION } from "../namespace";
import { useNamespacedState, useNamespacedActions } from "vuex-composition-helpers";
import dialogAdd from "./dialogAdd.vue";
import dialogDelete from "./dialogDelete.vue";
import dialogEdit from "./dialogEdit.vue";

export default defineComponent({
  components: {
    dialogAdd,
    dialogDelete,
    dialogEdit,
  },
  setup(props, context) {
    const url = context.root._route.path;
    const lastIndex = url.lastIndexOf("/");
    const objectStorageId = url.substring(lastIndex + 1);
    const { buckets  } = useNamespacedState(DEKABOXREGION, ["buckets"]);
    const selectedBucket = ref(null);
    const openDialogDelete = ref(false);
    const openDialogAdd = ref(false);
    const openDialogEdit = ref(false);
    const options = ref(null);



    const { fetchBuckets,createBucketRegion,deletehBucketById,updateBucketRegion } = useNamespacedActions(DEKABOXREGION, ["fetchBuckets","createBucketRegion","deletehBucketById","updateBucketRegion"]);

    
    onMounted(() => {
      fetchBuckets(objectStorageId);
    });
  


   

    const headers = [
      { text: "Name", value: "name" },
      { text: "Region", value: "region" },
      { text: "S3 URL", value: "s3_url" },
      { text: "Type", value: "site" },
      {text:"Created Date", value:"created_at"},
      { text: "Action", value: "action" },
    ];
    


    const doCreate = async (payload) => {
      const response = await createBucketRegion(payload);
      if (response.status == 200) {
        openDialogAdd.value = false;
        fetchBuckets(objectStorageId);
      }
    };



    const doUpdate = async (payload) => {
      // Placeholder for update functionality
      console.log("Updating zone with payload:", payload);
      
      const response = await updateBucketRegion(payload);
      if (response.status == 200) {
        openDialogEdit.value = false;
        fetchBuckets(objectStorageId);
      }
    };

    const doDelete = async (id) => {
      const response = await deletehBucketById(id);
      openDialogDelete.value = false;
      fetchBuckets(objectStorageId);
    };

    

    

    return {
      openDialogAdd,
      headers,
      buckets,
      doCreate,
      doUpdate,
      show: ($event, item) => {
        selectedBucket.value = item;
      },
      selectedBucket,
      openDialogDelete,
      doDelete,
      openDialogEdit,
      options,
    };
  },
});
</script>
