<template>
  <div style="height: 100%">
    <v-row style="height: 100%">
      <v-col cols="12" class="d-flex flex-column px-6 pt-0">
        <div class="d-flex">
          <v-row>
            <v-col cols="12" md="12" class="pt-0 pb-0 d-flex">
              <p class="font-weight-bold fz-16">Sub-allocated IP Pools</p>
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
              :items="value.subIpPoolsItems"
              :items-per-page="10"
              :server-items-length="value.subIpPoolsItems.length"
              class="elevation-0 scroll"
              hide-default-footer
              item-key="id"
              >
                <template #[`item.id`]="{ item }">
                  <v-radio-group v-model="radioTable" class="my-0 py-0" hide-details>
                    <v-radio class="" :value="item.id" @click="() => { value.subIpChoice = item }" :key="value.subIpPoolsItems.indexOf(item)"></v-radio>
                  </v-radio-group>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </div>

        <div class="d-flex mt-auto align-self-end">
          <v-row>
            <v-col>
              <router-link :to="`/organization-detail/${$route.params.organizationid}/project/${$route.params.project}`"> <v-btn color="#a5b3bf" width="160px" class="white--text fz-16 mr-2" depressed height="40"> Cancel </v-btn></router-link>
              <v-btn v-if="step > 1" class="fz-16 mr-2" color="secondary" width="160px" depressed outlined height="40" @click="prev()"> Previous </v-btn>
              <v-btn v-if="step <= 7" class="white--text fz-16" color="secondary" width="160px" depressed height="40" @click="next()"> Next </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { onMounted, ref } from '@vue/composition-api';

export default {
  props: ["value", "step"],
  setup(props, context) {

    onMounted(() => {
      console.log(props.value)
      radioTable.value = props.value?.subIpChoice?.id
    })

    const radioTable = ref()

    const headers = ref([
      { text: "", value: "id", sortable: false },
      { text: "External Network", value: "name", sortable: false },
      { text: "Sub-allocated IP pools", value: "subIpPool", sortable: false },
    ])
    
    const next = () => {
      console.log(props.value)
      // $v.value.$touch();
      // if ($v.value.$errors.length) return

      context.emit("update:step", props.step + 1);
    };
    const prev = () => {
      context.emit("update:step", props.step - 1);
    };
    return{
      prev,
      next,
      radioTable,
      headers
    }
  },
}
</script>