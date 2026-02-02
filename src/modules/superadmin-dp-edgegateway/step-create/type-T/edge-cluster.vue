<template>
  <div style="height: 100%">
    <v-row style="height: 100%">
      <v-col cols="12" class="d-flex flex-column px-6 pt-0">
        <div class="d-flex">
          <v-row>
            <v-col cols="12" md="8" class="pt-0 pb-0"><p class="font-weight-bold fz-16">Edge Cluster</p> </v-col>
          </v-row>
        </div>

        <div class="d-flex">
          <v-row>
            <v-col sm="12" md="12" class="pt-0 pb-0">
              <p class="font-weight-bold">Select Edge Cluster option for creating this edge gateway</p>
              <v-radio-group v-model="value.edgeType" hide-details class="mb-6">
                <v-radio label="Use the edge cluster of the provider Tier-O Gateway" value="notSpecific" class="mb-0"></v-radio>
                <span class="ml-9 mb-4 fz-12">
                  The edge cluster of selected Provider Tier-O Gateway will be used
                </span>
                <v-radio label="Select specific edge cluster" value="specific" class="mb-0"></v-radio>
                <span class="ml-9 fz-12">
                  Select from the list of the edge cluster available for the selected Organization VDC
                </span>
              </v-radio-group>

              <v-data-table
              v-if="value.edgeType == 'specific'"
              :headers="headers"
              :items="listEdgeCluster"
              :items-per-page="10"
              :server-items-length="listEdgeCluster.length"
              class="elevation-0 scroll"
              hide-default-footer
              item-key="id"
              >
                <template #[`item.id`]="{ item }">
                  <v-radio-group v-model="radioTable" class="my-0 py-0" hide-details>
                    <v-radio class="" :value="item.id" @click="() => { value.edgeCluster = item }" :key="listEdgeCluster.indexOf(item)"></v-radio>
                  </v-radio-group>
                </template>

                <template v-slot:item.description="{ item }">
                  {{ item.description ? item.description : '-' }}
                </template>

                <template v-slot:item.nodeType="{ item }">
                  <div style="text-transform: capitalize;">
                    {{ replaceName(item.nodeType) }}
                  </div>
                </template>

                <template v-slot:item.deploymentType="{ item }">
                  <div style="text-transform: capitalize;">
                    {{ replaceName(item.deploymentType) }}
                  </div>
                </template>
              </v-data-table>
              <p class="font-italic red--text" v-if="$v.rule.edgeCluster.$errors.length">*Please choose the edge cluster</p>
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
import { onMounted, ref } from '@vue/composition-api';
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { EDGEGATEWAY } from '../../namespace';
import useVuelidate from '@vuelidate/core';
import { required, requiredIf,  } from '@vuelidate/validators'

export default {
  props: ["value", "step", "provider"],
  setup(props, context) {
    const { fetchEdgeCluster } = useNamespacedActions(EDGEGATEWAY, ["fetchEdgeCluster"])
    const { isLoading, listEdgeCluster, TotalRowsEdgeCluster } = useNamespacedGetters(EDGEGATEWAY, ["isLoading", "listEdgeCluster", "TotalRowsEdgeCluster"])
    
    onMounted(async() => {
      console.log(props)
      radioTable.value = props.value?.edgeCluster?.id
      let href = props.provider?.href
      let replaceHref = href.replace("https://", '')
      let splitHref = replaceHref.split("/")
      // console.log(splitHref)
      providerId.value = splitHref[4]
      options.value = { ...options.value, providerId: providerId.value }

      await fetchEdgeCluster(options.value)
    })

    const radioTable = ref()
    const providerId = ref()
    const headers = ref([
      { text: "", value: "id", sortable: false, width: "15px" },
      { text: "Name", value: "name", sortable: false },
      { text: "Description", value: "description", sortable: false },
      { text: "Node Count", value: "nodeCount", sortable: false },
      { text: "Node Type", value: "nodeType", sortable: false },
      { text: "Deployment Type", value: "deploymentType", sortable: false },
    ])
    const options = ref({
      page: 1,
      itemsPerPage: 10,
      // providerId: props.provider
    })

    const $v = useVuelidate(
      {
        rule: {
          edgeCluster: { required: requiredIf(() => props.value.edgeType == 'specific') },
        }
      },
      {
        // name, description
        rule: props.value
      })

    const changePage = async(val) => {
      // console.log(val)
      let newVal = { ...val, providerId: providerId.value }
      await fetchEdgeCluster(newVal)
    }

    const replaceName = (data) => {
      return data.replace('_', ' ').toLowerCase()
    }
    
    const next = () => {
      // $v.value.$touch();
      // if ($v.value.$errors.length) return;

      context.emit("update:step", props.step + 1);
    };
    const prev = () => {
      context.emit("update:step", props.step - 1);
    };

    return{
      prev,
      next,
      radioTable,
      headers,
      changePage,
      listEdgeCluster,
      isLoading,
      replaceName,
      $v,
    }
  },
}
</script>