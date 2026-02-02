<template>
<div>
  <v-row>
    <v-col cols="12" class="py-0">
      <v-card class="rounded-lg" flat>
        <v-container fluid class="px-7 py-4">
          <!-- <v-card flat outlined class="rounded-lg"> -->
            <!-- <v-col md="12"> -->
              <v-row>
                <!-- <v-col cols="9">
                  <div class="firewall-title">Security Group</div>
                </v-col> -->
                <!-- <v-spacer></v-spacer> -->
                <!-- <v-col v-if="listSG.length" cols="3" class="text-right my-0 py-0">
                  <router-link to="#">
                    <v-btn
                      style="height: 45px; width: 150px; font-size: 12px"
                      class="secondary"
                      depressed
                      >Create Security Group</v-btn
                    >
                  </router-link>
                </v-col> -->
              </v-row>
              <br />
              <v-data-table
              v-if="listSG.length"
              :headers="headers"
              :items="listSG"
              :items-per-page="10"
              :options.sync="options"
              class="elevation-0"
              hide-default-footer
              >
                <template v-slot:item.security_group_name="{ item }">
                  <router-link :to="`/harbor/detail/${$route.params.harborid}/securitygroup/${item.security_group_id}/detail`">
                    <span class="primary--text">{{ item.security_group_name }}</span>
                  </router-link>
                </template>

                <template v-slot:item.rules="{ item }">
                  {{ totalRulesSG }}
                </template>

                <template v-slot:item.action="{ item }">
                  <router-link
                    :to="{
                      path: `/harbor/detail/${$route.params.harborid}/securitygroup/${item.security_group_id}/edit`
                    }"
                  >
                    <span class="primary--text edit">Edit</span>
                  </router-link>
                </template>

              </v-data-table>
              <v-card flat outlined class="rounded-lg" v-else>
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
                        Looks like you don’t have any Security Group
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
                            Manage access to the ports of your Harbor with
                            security groups
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
                            :to="`/harbor/detail/${$route.params.harborid}/securitygroup/create`"
                          >
                            Create Security Group
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-card>

              <!-- <v-card
                flat
                class="d-flex rounded-lg flex-grow-1 flex-column text-center ma-auto"
              >
                <v-card-text style="padding-top: 78px; padding-bottom: 78px">
                  <p
                    style="
                      font-size: 18px;
                      text-transform: capitalize;
                    "
                    class="font-weight-bold"
                  >
                    COMING SOON!
                  </p>
                </v-card-text>
              </v-card> -->
            <!-- </v-col> -->
          <!-- </v-card> -->
        </v-container>
      </v-card>
    </v-col>
  </v-row>
</div>
</template>

<script>
import { onMounted, ref, watch } from '@vue/composition-api';
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { HARBOR } from '../namespace'

export default {
  setup(props, context) {
    const { fetchSecurityGroup } = useNamespacedActions(HARBOR, ["fetchSecurityGroup"])
    const { listSG, totalRulesSG, getTotalRowsSG, isLoading } = useNamespacedGetters(HARBOR, ["listSG", "totalRulesSG", "getTotalRowsSG", "isLoading"])
    const {
        validateprivilages,
      } = useNamespacedActions("HOMEPAGE", [
        "validateprivilages",
      ]);

    const { harborid } = context.root._route.params;

    const headers = ref([
      { text: "Name", value: "sp_security_group_name", sortable: false },
      { text: "Rules", value: "rules", sortable: false },
      { text: "Action", sortable: false, align: "center", value: "action" }
    ])
    const options = ref({
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: [],
      harbor_id: harborid
    })

    watch(options,async (val) => {
      try {
        await fetchSecurityGroup(val)
      } finally {
          // loading.value = false;
      }
    },
      { deep: true }
    );

    const sg = ref([])

    onMounted(() => {
      fetchSecurityGroup(options.value)
    })

    return{
      headers,
      sg,
      options,
      isLoading,
      listSG,
      totalRulesSG,
      validateprivilages,
    }
  },
}
</script>
