<template>
  <v-container fluid class="px-0">
    <v-card flat class="pa-7 rounded-lg">
      <v-row>
        <v-col class="d-flex flex-row align-center">
          <p class="mb-0 font-weight-bold fz-21">Voucher Credit</p>
          <v-spacer />
          <div class="d-flex">
            <v-text-field 
              placeholder="Enter voucher credit code here"
              outlined
              class="mr-4"
              style="width:300px;"
              v-model="voucherCreditCode"
            />
            <div class="text-center">
              <v-btn
                :disabled="!voucherCreditCode"
                depressed
                height="50"
                class="secondary"
                :loading="loading"
                v-on:click="claimProject = true">
                Claim
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col 
          cols="12" 
          md="6"
          v-for="item in voucherCreditDetails"
          :key="item.id"
        >
        <div
            class="card-voucher"
          >
            <div class="card-voucher__content">
              <v-row class="mb-4">
                <v-col cols="12" md="6">
                  <span class="card-voucher__name">{{ item.voucher_name }}</span>
                </v-col>
                <v-col cols="12" md="6">
                  <span class="card-voucher__name--black">{{ item.code }}</span>
                </v-col>
              </v-row>
              <v-row class="card-voucher__list-services">
                <v-col cols="12" md="12">
                  <v-row>
                    <v-col class="py-0" cols="12" md="6">
                      <span class="card-voucher__services">Project Name</span>
                    </v-col>
                    <v-col class="py-0" cols="12" md="6">
                      <span>{{ item.project_name }}</span>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12" md="12">
                  <v-row>
                    <v-col class="py-0" cols="12" md="6">
                      <span class="card-voucher__services">Type</span>
                    </v-col>
                    <v-col class="py-0" cols="12" md="6">
                      <span>{{ item.type }}</span>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12" md="12">
                  <v-row>
                    <v-col class="py-0" cols="12" md="6">
                      <span class="card-voucher__services">Status</span>
                    </v-col>
                    <v-col class="py-0" cols="12" md="6">
                      <span v-if="item.status === VoucherCreditDetailStatus.AVAILABLE" class="green--text">{{ item.status }}</span>
                      <span v-else-if="item.status === VoucherCreditDetailStatus.UNAVAILABLE" class="red--text">{{ item.status }}</span>
                      <span v-else class="red--text">-</span>
                    </v-col>
                  </v-row>
                </v-col>
                
                <v-col cols="12" md="12">
                  <v-row>
                    <v-col class="py-0" cols="12" md="6">
                      <span class="card-voucher__services">Amount</span>
                    </v-col>
                    <v-col class="py-0" cols="12" md="6">
                      <span>Rp {{ Rpformat.format(item.amount) }}</span>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12" md="12">
                  <v-row>
                    <v-col class="py-0" cols="12" md="6">
                      <span class="card-voucher__services">Disbursement Date</span>
                    </v-col>
                    <v-col class="py-0" cols="12" md="6">
                      <span>{{ item.next_disbursement_date ? moment(item.next_disbursement_date).format('DD/MM/YYYY') : '-' }}</span>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </div>
            <div class="card-voucher__valid-until">
              <span class="card-voucher__services">Validity Period</span><br>
              {{ item.claimed_at ? `From ${moment(item.claimed_at).format('DD/MM/YYYY')}`: '' }} {{ item.recurring_expired_date ? `Until ${moment(item.recurring_expired_date).format('DD/MM/YYYY')}`: ''}}<br/>
            </div>
          </div>
        </v-col>
      </v-row>
      <div class="mt-4 text-center" v-if="voucherCreditDetailPagination.count > options.itemsPerPage">
        <v-pagination
          :value="options.page"
          :total-visible="5"
          :length="voucherCreditDetailPagination.count / options.itemsPerPage"
          @input="
            (val) => {
              options.page = val
            }
          "
          circle
        ></v-pagination>
      </div>
    </v-card>
    <v-row justify="center">
      <v-dialog v-model="selectProjectDialog" scrollable max-width="300px">
        <v-card>
          <v-card-title>Select Project</v-card-title>
          <v-divider></v-divider>
          <v-card-text style="height: 300px;">
            <v-radio-group
              v-model="projectSelected"
              column
            >
              <v-radio v-for="item in projectList"
                :key="item.id"
                :label="item.name"
                :value="item"
              ></v-radio>
            </v-radio-group>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn
              color="blue darken-1"
              text
              @click="cancelSelectProject"
            >
              Cancel
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="doClaim"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
import moment from 'moment'
import { defineComponent, onMounted, ref, watch } from "@vue/composition-api";
import { useProjects } from "@/modules/project/useprojects";
import { useVoucher } from './useVoucher'
import { Rpformat } from '@/lib/formatter';
import { VoucherCreditDetailStatus } from '@/modules/superadmin-managevoucher/type';

export default defineComponent({
  components: {
  },
  setup(props, { root }) {
    const { fetchVoucherCreditDetails, voucherCreditDetails, claimVoucherCredit, voucherCreditDetailPagination } = useVoucher()
    const voucherCreditCode = ref('')
    const proj = JSON.parse(localStorage.getItem("currentProj"))

    const { fetchprojects } = useProjects();

    const claimProject = ref(false)
    const loading = ref(false)
    const projectList = ref([])
    const projectSelected = ref({id:null, name:null})
    const selectProjectDialog = ref(false)
    const options = ref(
      proj ? { page: 1, itemsPerPage: 10, search: "", projectID: proj.id, sortBy: [], sortDesc: [] }
      :
      { page: 1, itemsPerPage: 10, search: "", sortBy: [], sortDesc: [] });

    const cancelSelectProject = () =>{
      claimProject.value = false
      selectProjectDialog.value = false
    }

    const doClaim = async () => {
      await claimVoucherCredit({
        code: voucherCreditCode.value, 
        project_id: projectSelected.value.id,
        organization_id: projectSelected.value.organization_id
      })
      cancelSelectProject()
    }

    // watch claim
    watch(claimProject, (val)=>{
      if (val){
        loading.value = true
        fetchprojects().then((res)=>{
          selectProjectDialog.value = true
          loading.value = false
          projectList.value = res
        });
      }else{
        cancelSelectProject()
      }
    })

    // watch page change
    watch(
      options,
      async (val) => {
        loading.value = true;
        try {
          await fetchVoucherCreditDetails(val);
        } finally {
          loading.value = false;
        }
      },
      { deep: true }
    );

    onMounted(async () => { await fetchVoucherCreditDetails(options.value)})

    return {
      VoucherCreditDetailStatus,
      Rpformat,
      ...useVoucher(),
      doClaim,
      cancelSelectProject,
      voucherCreditDetails,
      voucherCreditCode,
      moment,
      options,
      projectSelected,
      projectList,
      selectProjectDialog,
      loading,
      claimProject,
      voucherCreditDetailPagination
    }
  },
});
</script>
<style lang="scss" scoped>

.v-input--switch {
  ::v-deep .v-input--switch__track {
    height: 20px;
    width: 42px;
    border-radius: 10px;
  }
  ::v-deep .v-input--selection-controls__ripple {
    display: none;
  }
  ::v-deep .v-input--switch__thumb {
    left: 8px;
    top: 8.5px;
    height: 12px;
    width: 12px;
  }
}

.card-voucher {
  border: 1px solid #2C94D2;
  background: rgba(44, 148, 210, 0.02);
  border-radius: 10px;
}

.card-voucher__content,
.card-voucher__valid-until {
  padding: 1rem 1.8rem;
}

.card-voucher__name {
  font-size: 16px;
  font-weight: 800;
  color: #1F60A8;
}

.card-voucher__name--black {
  font-size: 16px;
  font-weight: 800;
  color: #556272;
}

.card-voucher__services {
  color: #556272;
  font-weight: 600;
}

.card-voucher [class*="col-"] {
  padding-top: .5rem;
  padding-bottom: .25rem;
}

.card-voucher__list-services {
  font-size: 14px;
}

.card-voucher__valid-until {
  font-size: 14px;
  border-top: 1px dashed #2C94D2;
}

</style>