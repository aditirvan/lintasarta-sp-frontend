<template>
  <v-dialog v-model="dialog" width="800" :retain-focus="false">
    <v-card flat class="rounded-lg">
      <v-card-title>
        <v-row>
          <v-col cols="8">
            <div class="headline font-weight-bold font--text">
              Select Project
            </div>
          </v-col>
        </v-row>
      </v-card-title>
      <div
        id="search"
        style="max-width: 775px; padding-left: 25px; padding-bottom: 15px"
      >
        <v-text-field
          maxlength="50"
          placeholder="Search Organization or Project"
          prepend-inner-icon="mdi-magnify"
          single-line
          outlined
          v-model="search"
        >
        </v-text-field>
      </div>
      <v-card-text style="min-height: 250px; height: calc(100vh - 500px); overflow-y: auto">
        <p class="font-weight-bold">By Payment Type</p>
        <div>
          <v-checkbox label="All Project" v-model="selectedPaymentType['all']" @change="onSelectPaymentType($event, 'all')" :ripple="false" class="pa-0 pl-4 ma-0"/>
          <v-checkbox label="Prepaid" v-model="selectedPaymentType['prepaid']" @change="onSelectPaymentType($event, 'prepaid')" :ripple="false" class="pa-0 pl-4 ma-0"/>
          <v-checkbox label="Postpaid" v-model="selectedPaymentType['postpaid']" @change="onSelectPaymentType($event, 'postpaid')" :ripple="false" class="pa-0 pl-4 ma-0 h-0"/>
        </div>
        <p class="mt-0 font-weight-bold">By Organization Or Projects</p>
        <v-treeview
          selectable
          open-on-click
          transition
          class="grey lighten-5"
          :items="treeItems"
          v-model="selectedIds"
          :disabled="disableTreeview"
          :search="search"
        >
          <template slot="append">
            <div v-intersect="onEndIntersect" />
          </template>
        </v-treeview>
      </v-card-text>
      <v-row class="px-4 py-2">
        <v-col cols="6">
          <v-btn @click="dialog = false" block height="50" depressed class="accent">
            <span style="font-size:14px"> Cancel </span>
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn
            height="50"
            depressed
            block
            color="secondary"
            @click="$emit('onSelectProjects', getSelected())"
          >
            <span style="font-size: 16px"> Select </span>
          </v-btn>
        </v-col>
      </v-row>

      <v-divider></v-divider>
    </v-card>
  </v-dialog>
</template>

<script lang='ts'>
import { ref, onMounted } from "@vue/composition-api"
import { useDialog } from '@/composable/usedialog'
import { defineComponent } from '@vue/composition-api';
import {
  useNamespacedActions,
  useNamespacedState
} from "vuex-composition-helpers";
import { SUPERADMIN } from "./namespace"

export default defineComponent({
  props: ["value", "excludePostpaidType"],
  data() {
    return {
      headersProject: [
        { text: "Organization", value: "organizationName", sortable: false },
        { text: "Project", value: "projectName", sortable: false },
      ],
      search: null,
    };
  },
  computed: {
    filter () {
      return this.caseSensitive
        ? (item, search, textKey) => item[textKey].indexOf(search) > -1
        : undefined
    }
  },
  setup(props: any, context) {
    const limit = 5
    const selectedPaymentType = ref({
      all: false,
      prepaid: false,
      postpaid: false,
    })
    const disableTreeview = ref(false)
    const treeItems = ref([])
    const selectedIds = ref([])
    const { dialog } = useDialog(props, context)
    const { orgswithprojects, orgswithprojectspagination } = useNamespacedState(SUPERADMIN, [
      "orgswithprojects", "orgswithprojectspagination"
    ]);
    
    const { fetchorgswithprojects } = useNamespacedActions(SUPERADMIN, 
    ["fetchorgswithprojects"]);

    const loading = ref(false);

    onMounted(async () => {
      loading.value = true
      let params = {page: 1, limit: limit}
      if (props.excludePostpaidType) {
        params['not_postpaid_type'] = props.excludePostpaidType
      }
      await fetchorgswithprojects(params)
      if (orgswithprojects) {
        treeItems.value = orgswithprojects.value.map(org => {
          return {
            id: org.id,
            name: org.name,
            children: org.projects
          }
        });
      }
      loading.value = false
    })

    const onSelectPaymentType = (val, name) => {
      let allPaymentTypeDisabled = true
      Object.keys(selectedPaymentType.value).forEach(key => {
        if(key === name) {
          selectedPaymentType.value[key] = val
        } else {
          selectedPaymentType.value[key] = false
        }

        if(allPaymentTypeDisabled && selectedPaymentType.value[key] === true) {
          allPaymentTypeDisabled = false
        }
      })
      disableTreeview.value = !allPaymentTypeDisabled
    }

    const onEndIntersect = async (isIntersecting) => {
      if (isIntersecting && !loading.value) {
        if (orgswithprojectspagination.value.page >= orgswithprojectspagination.value.totalpage) {
          return
        }
        loading.value = true
        const requestPage = orgswithprojectspagination.value.page + 1
        let params = {page: requestPage, limit: limit}
        if (props.excludePostpaidType) {
          params['not_postpaid_type'] = props.excludePostpaidType
        }
        await fetchorgswithprojects(params)
        treeItems.value = [...treeItems.value, ...orgswithprojects.value.map(org => {
          return {
            id: org.id,
            name: org.name,
            children: org.projects
          }
        })]
        loading.value = false
      }
    }

    const getSelected = () => {
      let selectedKey = null
      Object.keys(selectedPaymentType.value).forEach(key => {
        if (selectedPaymentType.value[key] === true) {
          selectedKey = key
          return
        }
      })

      return {
        paymentMethod: selectedKey, 
        projectIds: selectedIds.value.length > 0 ? selectedIds.value  : null
      }
    }

    return {
      dialog,
      disableTreeview,
      selectedPaymentType,
      onSelectPaymentType,
      treeItems,
      selectedIds,
      onEndIntersect,
      getSelected,
    }
  },
});
</script>