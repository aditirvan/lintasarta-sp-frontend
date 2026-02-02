<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4">
            <v-row>
              <v-col cols="9">
                <div class="firewall-title">General {{ $route.params.name }}</div>
              </v-col>
            </v-row>
            <br />
            <v-row
              ><v-col md="3"
                ><v-btn
                  block
                  color="primary"
                  dark
                  @click="
                    () => {
                      open('edit');
                    }
                  "
                  >Edit</v-btn
                ></v-col
              ></v-row
            >

            <v-card class="rounded-lg mt-4 mb-4" flat>
              <v-expansion-panels v-model="panel">
                <v-expansion-panel>
                  <v-expansion-panel-header color="#f1f2f2">Info</v-expansion-panel-header>
                  <div :style="hide == true ? '' : 'display: none'">
                    <v-row class="ma-0">
                      <v-col md="6"><v-expansion-panel-content> Name </v-expansion-panel-content></v-col
                      ><v-col md="6"><v-expansion-panel-content> Test vApp </v-expansion-panel-content></v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <v-row class="ma-0">
                      <v-col md="6"><v-expansion-panel-content> State </v-expansion-panel-content></v-col
                      ><v-col md="6"><v-expansion-panel-content> Resolved </v-expansion-panel-content></v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <v-row class="ma-0">
                      <v-col md="6"><v-expansion-panel-content> Description </v-expansion-panel-content></v-col
                      ><v-col md="6"><v-expansion-panel-content> test_apps </v-expansion-panel-content></v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <v-row class="ma-0">
                      <v-col md="6"><v-expansion-panel-content> Data Center </v-expansion-panel-content></v-col
                      ><v-col md="6"><v-expansion-panel-content> ITS-JAH </v-expansion-panel-content></v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <v-row class="ma-0">
                      <v-col md="6"><v-expansion-panel-content> Owner </v-expansion-panel-content></v-col
                      ><v-col md="6"><v-expansion-panel-content> res </v-expansion-panel-content></v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <v-row class="ma-0">
                      <v-col md="6"><v-expansion-panel-content> Snapshot </v-expansion-panel-content></v-col
                      ><v-col md="6"><v-expansion-panel-content> - </v-expansion-panel-content></v-col>
                    </v-row>
                  </div>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card>
            <br />
            <v-row
              ><v-col md="3"
                ><v-btn
                  block
                  color="primary"
                  dark
                  @click="
                    () => {
                      openLeases();
                    }
                  "
                  >Edit</v-btn
                ></v-col
              ></v-row
            >
            <v-card class="rounded-lg mt-4 mb-4" flat>
              <v-expansion-panels v-model="panel1">
                <v-expansion-panel>
                  <v-expansion-panel-header color="#f1f2f2">Lease</v-expansion-panel-header>
                  <div :style="hide1 == true ? '' : 'display: none'">
                    <v-row class="ma-0">
                      <v-col md="6"><v-expansion-panel-content> Runtime Lease </v-expansion-panel-content></v-col
                      ><v-col md="6"><v-expansion-panel-content> Never expires </v-expansion-panel-content></v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <v-row class="ma-0">
                      <v-col md="6"><v-expansion-panel-content> Storage Lease </v-expansion-panel-content></v-col
                      ><v-col md="6"><v-expansion-panel-content> Never expires </v-expansion-panel-content></v-col>
                    </v-row>
                  </div>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <DialogCreateVapps :dialog.sync="openDialog" :action="action"></DialogCreateVapps>
    <DialogEditLeases :leases.sync="dialogLeases"></DialogEditLeases>
  </div>
</template>

<script>
import { ref, computed } from "@vue/composition-api";
import DialogCreateVapps from "./dialog/dialog-create-vapps.vue";
import DialogEditLeases from "./dialog/dialog-edit-leases.vue";

export default {
  components: {
    DialogCreateVapps,
    DialogEditLeases,
  },
  setup() {
    const action = ref("");
    const openDialog = ref(false);
    const dialogLeases = ref(false);
    const panel = ref(0);
    const panel1 = ref(0);
    const hide = computed(() => {
      return Number.isInteger(panel.value);
    });
    const hide1 = computed(() => {
      return Number.isInteger(panel1.value);
    });

    const open = (event) => {
      openDialog.value = true;
      action.value = event;
    };
    const openLeases = () => {
      dialogLeases.value = true;
    };
    return {
      panel,
      hide,
      panel1,
      hide1,
      open,
      openLeases,
      action,
      openDialog,
      dialogLeases,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-expansion-panel-content__wrap {
  padding-top: 10px;
  padding-right: 20px;
  padding-bottom: 10px;
  padding-left: 20px;
}
::v-deep .v-application {
  line-height: 0;
}
</style>
