<template>
  <v-card class="rounded-lg pa-7" flat>
    <v-row>
      <v-col class="d-flex align-center justify-end pt-0 pb-4">
        <v-btn
        width="150"
        class="secondary fz-14"
        depressed
        to="/network/vpn/psk/create"
        v-if="psk.length"
        >
            Create Pre Shared Keys
        </v-btn>
      </v-col>
    </v-row>
    <v-data-table
      v-if="psk.length"
      :headers="headers"
      :items="psk"
      :items-per-page="10"
      class="elevation-0"
      hide-default-footer
      >
        <template v-slot:item.action="{ item }">
          <router-link
              class="primary--text edit"
              :to="{ path: '/network/psk/edit', query: { id: item.id } }"
              >Edit</router-link
          ><span
          class="error--text pr-3 delete ml-4"
          @click="
          () => {

          }
          "
          >Delete</span
          >
        </template>
        <!-- <template v-slot:footer="{ props }">
            <custom-footer-datatable v-if="vpns.length > 5" :props="props" />
        </template> -->
    </v-data-table>
    <v-card flat outlined class="rounded-lg" v-else>
      <v-row>
        <v-col md="12">
          <v-card
          flat
          class="d-flex rounded-lg flex-grow-1 flex-column text-center ma-auto"
          >
            <v-card-text style="padding-top: 72px; padding-bottom: 78px">
              <p
              style="
                  font-size: 16px;
                  margin-bottom: 10px;
                  text-transform: capitalize;
              "
              class="font-weight-bold"
              >
              Looks like you don’t have any Pre Shared Keys
              </p>
              <v-row>
                <v-col>
                    <p
                    style="
                    font-size: 12px;
                    color: #a5b3bf;
                    margin-bottom: 20px;
                    "
                    >
                    
                    </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                    <v-btn
                    width="100%"
                    append
                    max-width="300"
                    height="50"
                    depressed
                    class="secondary"
                    exact
                    to="/network/vpn/psk/create"
                    >
                    Create Pre Shared Keys
                    </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-card>
</template>

<script>
import { ref } from "@vue/composition-api";

export default {
    setup() {
        const psk = ref([])
        const headers = ref([
            { text: "Identifier", value: "identifier" },
            { text: "Type", value: "type" },
            { text: "Pre-Shared Keys", value: "presharedkeys" },
            { text: "Action", value: "action", align: "center" },
        ]);
        return {
            psk,
            headers
        }
    },
}
</script>


<style scoped>
.v-btn {
  height: 55px !important;
}
</style>