<template>
  <div style="height: 100%">
    <v-row style="height: 100%">
      <v-col cols="12" class="d-flex flex-column px-6 pt-0">
        <div class="d-flex">
          <v-row>
            <v-col cols="12" md="12" class="pt-0 pb-0 d-flex">
              <p class="font-weight-bold fz-16">Organization VDC</p>
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
              :items="listOrgVdc"
              :items-per-page="10"
              :server-items-length="TotalRowsOrgVdc"
              :loading="isLoading"
              class="elevation-0 scroll"
              hide-default-footer
              item-key="href"
              >
                <template #[`item.id`]="{ item }">
                  <v-radio-group v-model="radioTable" class="my-0 py-0" hide-details>
                    <v-radio class="" :value="item.href" @click="() => { value.orgVdc = item }" :key="listOrgVdc.indexOf(item)"></v-radio>
                  </v-radio-group>
                </template>

                <template v-slot:item.backingType="{ item }">
                  {{ filterType(item.networkProviderType) }}
                </template>

                <template v-slot:footer="{ props }">
                <custom-footer-datatable
                @input="
                  (val) => {
                    options = val;
                  }
                " 
                :props="props" />
              </template>
              </v-data-table>
              <p class="font-italic red--text" v-if="$v.rule.orgVdc.$errors.length">Please choose the organization VDC</p>
            </v-col>
          </v-row>
        </div>

        <div class="d-flex mt-auto align-self-end">
          <v-row>
            <v-col>
              <router-link :to="`/organization-detail/${$route.params.organizationid}/project/${$route.params.project}`"> <v-btn color="#a5b3bf" width="160px" class="white--text fz-12 mr-2" depressed height="40"> Cancel </v-btn></router-link>
              <v-btn v-if="step > 1" class="fz-12 mr-2" color="secondary" width="160px" depressed outlined height="40" @click="prev()"> Previous </v-btn>
              <v-btn v-if="step <= 6" class="white--text fz-12" color="secondary" width="160px" depressed height="40" @click="next()"> Next </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>


  </div>
</template>

<script>
import { onMounted, ref, watch } from '@vue/composition-api';
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { EDGEGATEWAY } from '../namespace';
import { ORGVDC } from '@/modules/superadmin-dp-orgVdc/namespace';
import useVuelidate from '@vuelidate/core';
import { required, minValue,  } from '@vuelidate/validators'

export default {
  props: ["value", "step"],
  setup(props, context) {
    const { fetchOrgVdc, fetchOrgVdcById } = useNamespacedActions(ORGVDC, ["fetchOrgVdc", "fetchOrgVdcById"])
    const { isLoading, listOrgVdc, TotalRowsOrgVdc, orgVdcById } = useNamespacedGetters(ORGVDC, ["isLoading", "listOrgVdc", "TotalRowsOrgVdc", "orgVdcById"])

    onMounted(async() => {
      radioTable.value = props.value?.orgVdc?.href
      vdcById.value = JSON.parse(localStorage.getItem("vdcById"))
      await fetchOrgVdc({ ...options.value, id: vdcById.value.id })
      // console.log(orgVdcById.value)
    })

    const radioTable = ref();
    const searchOrg = ref('')

     const headers = ref([
      { text: "", value: "id", sortable: false },
      { text: "Name", value: "name", sortable: false },
      { text: "Organization", value: "orgName", sortable: false },
      { text: "Backing Type", value: "backingType", sortable: false },
    ])
		
    const dummyOrg = ref([
			{id: 1, name: 'Jihan', organization: 'Jihan Lugas', backingType: 'NSX-T'},
			{id: 2, name: 'Lugas', organization: 'Lugas', backingType: 'NSX-V'},
			{id: 3, name: 'Dekaprime', organization: 'Deka Prime', backingType: 'NSX-T'},
		])

    const vdcById = ref()

    const options = ref({
      page: 1,
      itemsPerPage: 10,
    })

    watch(options,async (val) => {
      try {
          // await fetchOrgVdc(val)
          // await fetchOrgVdcById(val)
      } finally {
          // loading.value = false;
      }
    },
      { deep: true }
    );

    let search = null;
    watch(searchOrg, (val) => {
      if (search) {
          clearTimeout(search);
          search = setTimeout(function() {
          options.value.page = 1 
          options.value = { ...options.value, search: val };
          }, 1000);
      } else {
          search = setTimeout(function() {}, 1000);
      }
    });

    const $v = useVuelidate(
      {
        rule: {
          orgVdc: { required },
        }
      },
      {
        rule: props.value,
      })

    const filterType = (data) => {
      return data.replace("_", "-")
    }
    
    const getRow = (row) => {
      // organization.value = row
      // console.log(row)
    };

    const next = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return

      context.emit("update:step", props.step + 1);
    };
    const prev = () => {
      context.emit("update:step", props.step - 1);
    };

    const splitIOrgId = (data) => {
      let href = data
      let replaceHref = href.replace("https://", '')
      let splitHref = replaceHref.split("/")
      // let providerId = splitHref[4]
      return splitHref[4]
    }

    return{
      prev,
      next,
      getRow,
      radioTable,
      searchOrg,
      headers,
      options,
      dummyOrg,
      listOrgVdc,
      TotalRowsOrgVdc,
      isLoading,
      filterType,
      $v
    }
  },
}
</script>

<style lang="scss" scoped>
.scroll {
  max-height: 720px;
  overflow-y: auto;
  box-shadow: none !important;
  overflow-x: hidden;
  background-color: transparent;
}

::v-deep .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  // font-weight: bold;
  font-size: 12px !important;
}

::v-deep .v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  font-size: 14px !important;
}
</style>