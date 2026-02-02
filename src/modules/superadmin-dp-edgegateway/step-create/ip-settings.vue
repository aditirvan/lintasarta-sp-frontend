<template>
  <div style="height: 100%">
    <v-row style="height: 100%">
      <v-col cols="12" class="d-flex flex-column px-6 pt-0">
        <div class="d-flex">
          <v-row>
            <v-col cols="12" md="12" class="pt-0 pb-0 d-flex">
              <p class="font-weight-bold fz-16">IP Settings</p>
              <!-- <p>{{ organization }}</p> -->
              <v-spacer></v-spacer>
              <!-- <v-text-field
                class="search mr-2"
                placeholder="Search Organization"
                outlined
                hide-details
                style="max-width: 200px;"
                v-model="searchOrg"
                clearable
                dense
                ></v-text-field> -->
            </v-col>
          </v-row>
        </div>

        <div class="d-flex">
          <v-row>
            <v-col>
              <v-data-table
              :headers="headers"
              :items="value.ipSettings"
              :items-per-page="10"
              :server-items-length="value.ipSettings.length"
              class="elevation-0 scroll"
              hide-default-footer
              item-key=""
              >
                <template #[`item`]="{ item, index }">
                  <tr>
                    <!-- No -->
                    <td>
                      <v-card class="" elevation="0">
                        <span class="grey--text text--darken-1">
                          {{ item.name }}
                        </span>
                      </v-card>
                    </td>
                    <td>
                      <v-card elevation="0">
                        <div v-for="(sub, i) in item.subnets" :key="i" class="my-3">
                          <span class="grey--text text--darken-1">{{ sub.gateway }}</span>
                        </div>
                      </v-card>
                    </td>
                    <td>
                      <v-card elevation="0">
                        <div v-for="(subnetRow, i) in item.subnets" :key="i">
                          <input-ip  v-model="item.subnets[i]" /> 
                        </div>
                      </v-card>
                    </td>
                  </tr>
                </template>
                <!-- <template v-slot:item.backingType="{ item }">
                  {{ filterType(item.networkProviderType) }}
                </template> -->

                <!-- <template v-slot:footer="{ props }">
                  <custom-footer-datatable
                  @input="
                    (val) => {
                      options = val;
                    }
                  " 
                  :props="props" />
                </template> -->
              </v-data-table>
              <!-- <p class="font-italic red--text" v-if="$v.rule.orgVdc.$errors.length">Please choose the organization VDC</p> -->
            </v-col>
          </v-row>
        </div>

        <div class="d-flex mt-auto align-self-end">
          <v-row>
            <v-col>
              <router-link :to="`/organization-detail/${$route.params.organizationid}/project/${$route.params.project}`"> <v-btn color="#a5b3bf" width="160px" class="white--text fz-16 mr-2" depressed height="40"> Cancel </v-btn></router-link>
              <v-btn v-if="step > 1" class="fz-16 mr-2" color="secondary" width="160px" depressed outlined height="40" @click="prev()"> Previous </v-btn>
              <v-btn v-if="step <= 6" class="white--text fz-16" color="secondary" width="160px" depressed height="40" @click="next()"> Next </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { onMounted, ref } from '@vue/composition-api'
import inputIp from './input-ip-address.vue'

export default {
  components: {
    inputIp
  },
  props: ["value", "step"],
  setup(props, context) {

    onMounted(() => {
      console.log(props.value)
    })
    
    const headers = ref([
      { text: "Name", value: "name", sortable: false },
      { text: "Subnets", value: "subnets", sortable: false },
      { text: "IP Addresses", value: "ipAddresses", sortable: false },
    ])

    const next = () => {
      console.log(props.value.ipSettings)
      // $v.value.$touch();
      // if ($v.value.$errors.length) return

      context.emit("update:step", props.step + 1);
    };
    const prev = () => {
      context.emit("update:step", props.step - 1);
    };

    return{
      headers,
      prev,
      next
    }
  },
}
</script>