<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4">
            <v-row>
              <v-col cols="9">
                <div class="firewall-title">List Security</div>
              </v-col>
            </v-row>
            <br />
            <v-data-table :headers="headers" :items="listNetwork" item-key="id" single-line class="elevation-0" hide-default-footer>
              <template #[`item.name`]="{ item }">
                <router-link :to="`/networking/${item.name}/security`"> {{ item.name }}</router-link>
              </template>
            </v-data-table>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
export default {
  setup() {
    onMounted(() => {});

    const headers = ref([
      { text: "Name", value: "name" },
      { text: "Status", value: "status" },
      { text: "Scope", value: "scope" },
      { text: "Gateway CIDR", value: "gateway" },
      { text: "Network Type", value: "network" },
      { text: "Connected To", value: "connect" },
      { text: "IP Pool Consumed", value: "ip" },
      { text: "Shared", value: "shared" },
      { text: "Route Advertised", value: "route" },
    ]);
    const listNetwork = ref([
      {
        name: "racher-network-312dwkjlm1234",
        status: "Normal",
        scope: "ITS-development",
        gateway: "10.10.10.16/24",
        network: "Isolated",
        connect: "ITS-development_Edge",
        ip: "4",
        shared: "-",
        route: "-",
      },
    ]);
    return {
      headers,
      listNetwork,
    };
  },
};
</script>

<style lang="scss" scoped></style>
