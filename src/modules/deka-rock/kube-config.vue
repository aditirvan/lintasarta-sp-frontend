<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4">
            <v-row class="d-flex justify-center"
              ><v-col cols="9">
                <div class="headline font-weight-bold font--text mb-2">Config</div>
                <p style="color: #a5b3bf">Helps to provide high availability and performance by distributing the service spatially relative to end user.</p>
              </v-col>
              <v-col md="1"></v-col>
              <v-col md="2">
                <v-btn height="45" width="150" depressed class="secondary fz-14" @click="download()" :disabled="listKubeConfig.length == 0">Download</v-btn>
              </v-col></v-row
            >
            <v-row>
              <v-col md="12">
                <v-data-table :headers="headers" :items="listKubeConfig" item-key="id" single-line class="elevation-0" hide-default-footer
                  ><template #[`item.config`]="{ item }">
                    <span>********</span>
                    <v-icon
                      small
                      class="mb-2 ml-2 secondary white--text py-1 px-2 rounded"
                      style="cursor: pointer"
                      @click="
                        () => {
                          dialogFile(item);
                        }
                      "
                      >mdi-eye</v-icon
                    >
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <DialogKeys :show.sync="openDialog"></DialogKeys>
  </div>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
import DialogKeys from "./dialog-keys.vue";
import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers";
import { DEKAROCK } from "./namespace";
export default {
  components: {
    DialogKeys,
  },
  setup(props, context) {
    const { downloadKubeConfig, getListKubeConfig } = useNamespacedActions(DEKAROCK, ["downloadKubeConfig", "getListKubeConfig"]);
    const { listKubeConfig } = useNamespacedState(DEKAROCK, ["listKubeConfig"]);

    onMounted(async () => {
      await getListKubeConfig(context.root.$route.params.id);
    });

    const headers = ref([
      { text: "Filename", value: "name", sortable: false },
      { text: "Content", value: "config", sortable: false },
    ]);

    const openDialog = ref(false);

    const dialogFile = (item) => {
      openDialog.value = true;
    };
    const download = () => {
      const params = { params: { token: localStorage.getItem("token") }, id: context.root.$route.params.id, filename: "config" };
      downloadKubeConfig(params);
    };

    return {
      headers,
      openDialog,
      dialogFile,
      download,
      listKubeConfig,
    };
  },
};
</script>

<style lang="scss" scoped></style>
