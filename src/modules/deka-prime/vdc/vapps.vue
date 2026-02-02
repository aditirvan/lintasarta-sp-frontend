<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4">
            <br />
            <v-row
              ><v-col md="3"
                ><v-btn
                  block
                  color="primary"
                  dark
                  @click="
                    () => {
                      open('new');
                    }
                  "
                  >New</v-btn
                ></v-col
              ></v-row
            >
            <br />
            <v-data-table :headers="headers" :items="listVdc" item-key="id" single-line class="elevation-0" hide-default-footer>
              <template #[`item.name`]="{ item }">
                <router-link :to="`/vdc/vapps/${$route.params.id}/${item.name}`"> {{ item.name }}</router-link>
              </template>
            </v-data-table>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <DialogCreateVapps :dialog.sync="openDialog" :action="action"></DialogCreateVapps>
  </div>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
import DialogCreateVapps from "./dialog/dialog-create-vapps.vue";
export default {
  components: {
    DialogCreateVapps,
  },
  setup() {
    onMounted(() => {});
    const action = ref("");

    const headers = ref([
      { text: "Name", value: "name" },
      { text: "VMs", value: "vms" },
      { text: "State", value: "state", width: "9%" },
      { text: "Runtime Lease", value: "runtime", width: "10%" },
      { text: "Storage Lease", value: "storageL", width: "10%" },
      { text: "CPUs", value: "cpu", width: "11%" },
      { text: "Memory", value: "memory", width: "11%" },
      { text: "Storage", value: "storage", width: "11%" },
      { text: "Owner", value: "owner", width: "10%" },
      { text: "Created On", value: "created", width: "11%" },
      { text: "Networks", value: "networks", width: "11%" },
      { text: "Shared", value: "shared", width: "11%" },
      { text: "Snapshot", value: "snapshot", width: "11%" },
    ]);
    const listVdc = ref([
      {
        name: "wordpress_replika",
        vms: "1",
        state: "Powered off",
        runtime: "-",
        storageL: "Never",
        cpus: "4",
        memory: "4 GB",
        storage: "58 GB",
        owner: "System",
        created: "04/09/2022",
        networks: "Network-vCloud",
        shared: "-",
        snapshot: "-",
      },
    ]);
    const openDialog = ref(false);
    const open = (item) => {
      openDialog.value = true;
      action.value = item
    }
    return {
      headers,
      listVdc,
      openDialog,
      action,
      open
    };
  },
};
</script>

<style lang="scss" scoped></style>
