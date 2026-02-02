<template>
  <div style="height: 100%">
    <v-row style="height: 100%">
      <v-col cols="12" class="d-flex flex-column px-6 pt-0">
        <div class="d-flex">
          <v-row>
            <v-col cols="12" md="12" class="pt-0 pb-0 d-flex">
              <p class="font-weight-bold fz-16">Organization</p>
              <!-- <p>{{ organization }}</p> -->
              <v-spacer></v-spacer>
              <v-text-field
                class="search mr-2"
                placeholder="Search Organization"
                outlined
                hide-details
                style="max-width: 200px;"
                v-model="searchOrg"
                clearable
                dense
                ></v-text-field>
            </v-col>
          </v-row>
        </div>

        <div class="d-flex">
          <v-row>
            <v-col>
              <v-data-table
              :headers="headers"
              :items="listOrgVdcStep"
              :options.sync="options"
              :items-per-page="10"
              :server-items-length="TotalRowsOrgVdcStep"
              :loading="isLoading"
              class="elevation-0 scroll"
              hide-default-footer
              item-key="id"
              >
                <template #[`item.id`]="{ item }">
                  <v-radio-group v-model="radioTable" class="my-0 py-0" hide-details >
                    <v-radio :value="item.id" @click="getRow(item)" :key="listOrgVdcStep.indexOf(item)"></v-radio>
                  </v-radio-group>
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
              <p class="font-italic red--text" v-if="$v.organization.$errors.length">*Please choose the organization</p>
            </v-col>
          </v-row>
        </div>

        <div class="d-flex mt-auto align-self-end">
          <v-row>
            <v-col>
              <router-link to="/manage-orgvdc"> <v-btn color="#a5b3bf" width="160px" class="white--text fz-12 mr-2" depressed height="40"> Cancel </v-btn></router-link>
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
import { computed, onMounted, ref, watch } from '@vue/composition-api'
import useVuelidate from '@vuelidate/core';
import { required, minValue,  } from '@vuelidate/validators'
import { ORGVDC } from '../namespace'
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';

export default {
  props: ["value", "step"],
  setup(props, context) {
    const { fetchOrgVdcStep } = useNamespacedActions(ORGVDC, ["fetchOrgVdcStep"])
    const { listOrgVdcStep, TotalRowsOrgVdcStep, isLoading } = useNamespacedGetters(ORGVDC, ["listOrgVdcStep", "TotalRowsOrgVdcStep", "isLoading"])

    onMounted(async() => {
      if(props.value){
        radioTable.value = props.value.id
      }
    })
    
    const radioTable = ref();
    const searchOrg = ref('')

    const headers = ref([
      { text: "", value: "id", sortable: false },
      { text: "Name", value: "name", sortable: false },
      { text: "Full Name", value: "displayName", sortable: false },
    ])
		
		const row = ref(-1)

    const options = ref({
      page: 1,
      pageSize: 10,
    })

    watch(options,async (val) => {
      try {
          await fetchOrgVdcStep(val)
      } finally {
          // loading.value = false;
      }
    },
      { deep: true }
    );

    const organization = computed({
      get: () => {
        return props.value
      },
      set: (val) => {
        context.emit("input", val);
      },
    });

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
        organization: { required },
      },
      {
        organization,
      })

    const getRow = (row) => {
      organization.value = row
      // console.log(row)
    };

    const next = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return

      organization.value = {
        displayName: organization.value.displayName,
        name: organization.value.name,
        id: organization.value.id
      }
      context.emit("update:step", props.step + 1);
    };
    const prev = () => {
      context.emit("update:step", props.step - 1);
    };

    return{
      // selectedItems,
      headers,
      options,
      // isSinggle,
      next,
      prev,
      row,
      radioTable,
      getRow,
      $v,
      searchOrg,
      listOrgVdcStep,
      TotalRowsOrgVdcStep,
      isLoading,
      organization
    }
  },
}
</script>

<style lang="scss" scoped>
.selected {
    background-color: red
}
::v-deep .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  // font-weight: bold;
  font-size: 12px !important;
}

::v-deep .v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  font-size: 14px !important;
  // font-weight: bold;
}
.scroll {
  max-height: 700px;
  overflow-y: auto;
  box-shadow: none !important;
  overflow-x: hidden;
  background-color: transparent;
}
</style>