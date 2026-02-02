<template>
  <v-container fluid class="px-0">
    <v-card flat class="pa-7 rounded-lg">
      <v-row>
        <v-col class="d-flex flex-row align-center">
          <p class="mb-0 font-weight-bold fz-21">Voucher Discount</p>
          <v-spacer />
          <div class="d-flex">
            <v-text-field 
              placeholder="Enter voucher credit code here"
              outlined
              class="mr-4"
              style="width:300px;"
              v-model="voucherDiscountCode"
            />
            <div class="text-center">
              <v-btn
                :disabled="!voucherDiscountCode"
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
          v-for="item in voucherDiscountProjects"
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
              </v-row>

              <v-row class="mt-4">
                <v-col cols="12" md="12">
                  <span class="card-voucher__name">Discount</span>
                </v-col>
              </v-row>

              <v-row class="card-voucher__list-services">
                <v-col cols="12" md="12">
                  <v-row v-if="item.voucher_discount_detail.type === VoucherDiscountDetailType.INSTANCE_BASED">
                    <v-col cols="12" md="6" class="py-0">
                      <v-row>
                        <v-col cols="12" md="8">
                          <span>Instance</span>
                        </v-col>
                        <v-col cols="12" md="4" class="d-flex justify-end">
                          <span>{{ item.voucher_discount_detail.instance_based }}%</span>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" md="6" class="py-0">
                      <v-row>
                        <v-col cols="12" md="8">
                          <span>Root Disk</span>
                        </v-col>
                        <v-col cols="12" md="4" class="d-flex justify-end">
                          <span>{{ item.voucher_discount_detail.root_disk }}%</span>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" md="6" class="py-0">
                      <v-row>
                        <v-col cols="12" md="8">
                          <span>OS Charging</span>
                        </v-col>
                        <v-col cols="12" md="4" class="d-flex justify-end">
                          <span>{{ item.voucher_discount_detail.os_charging }}%</span>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" md="6" class="py-0">
                      <v-row>
                        <v-col cols="12" md="8">
                          <span>Storage</span>
                        </v-col>
                        <v-col cols="12" md="4" class="d-flex justify-end">
                          <span>{{ item.voucher_discount_detail.storage }}%</span>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" md="6" class="py-0">
                      <v-row>
                        <v-col cols="12" md="8">
                          <span>Object Storage</span>
                        </v-col>
                        <v-col cols="12" md="4" class="d-flex justify-end">
                          <span>{{ item.voucher_discount_detail.object_storage }}%</span>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" md="6" class="py-0">
                      <v-row>
                        <v-col cols="12" md="8">
                          <span>Floating IP</span>
                        </v-col>
                        <v-col cols="12" md="4" class="d-flex justify-end">
                          <span>{{ item.voucher_discount_detail.floating_ip }}%</span>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" md="6" class="py-0">
                      <v-row>
                        <v-col cols="12" md="8">
                          <span>Snapshot</span>
                        </v-col>
                        <v-col cols="12" md="4" class="d-flex justify-end">
                          <span>{{ item.voucher_discount_detail.snapshot }}%</span>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>

                  <v-row v-if="item.voucher_discount_detail.type === VoucherDiscountDetailType.INSTANCE_FLAVOR && item.voucher_discount_detail.instance_flavors">
                    <v-col cols="12" md="6">
                      <v-btn
                      text
                      class="primary--text font-weight-bold px-0 fz-14"
                      v-on:click="() => showInstanceFlavors(item.voucher_discount_detail.instance_flavors)"
                      >
                        Instance Flavors ({{ item.voucher_discount_detail.instance_flavors.length }})
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>

            </div>
            <div class="card-voucher__valid-until">
              <span class="card-voucher__services">Validity Period</span><br>
              {{ item.claimed_at ? `From ${moment(item.claimed_at).format('DD/MM/YYYY')}`: '' }} {{ item.expired_at ? `Until ${moment(item.expired_at).format('DD/MM/YYYY')}`: ''}}<br/>
            </div>
          </div>
        </v-col>
      </v-row>
      <div class="mt-4 text-center" v-if="voucherDiscountProjectPagination.count > options.itemsPerPage">
        <v-pagination
          :value="options.page"
          :total-visible="5"
          :length="voucherDiscountProjectPagination.count / options.itemsPerPage"
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

    <v-row justify="center">
      <v-dialog v-model="openInstanceFlavorsDialog" scrollable max-width="300px">
        <v-card>
          <v-card-title>Instace Flavors Discount</v-card-title>
          <v-divider></v-divider>
          <v-card-text style="height: 300px;">
            <v-data-table
            :headers="instanceFlavorsHeader"
            :items="instanceFlavors"
            hide-default-footer
            disable-pagination
            class="mt-4"
            >
              <template v-slot:item.discount="{ item }">
                {{ item.discount }}%
              </template>
            </v-data-table>
          </v-card-text>
          <v-card-actions>
            <v-row class="ma-2">
              <v-col cols="12">
                <v-btn
                  color="accent"
                  block
                  depressed
                  height="50"
                  @click="
                    () => {
                      openInstanceFlavorsDialog = false
                    }
                  "
                >
                  <span class="fz-14">Cancel</span>
                </v-btn>
              </v-col>
            </v-row>
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
import { VoucherDiscountDetailType } from "../superadmin-managevoucher/type"

export default defineComponent({
  components: {
  },
  setup(props, { root }) {
    const { fetchVoucherDiscountProjects, voucherDiscountProjects, claimVoucherDiscount, voucherDiscountProjectPagination } = useVoucher()
    const voucherDiscountCode = ref('')
    const proj = JSON.parse(localStorage.getItem("currentProj"))

    const { fetchprojects } = useProjects();

    const claimProject = ref(false)
    const loading = ref(false)
    const projectList = ref([])
    const projectSelected = ref({id:null, name:null})
    const selectProjectDialog = ref(false)
    const openInstanceFlavorsDialog = ref(false)
    const instanceFlavors = ref(null)
    const instanceFlavorsHeader = ref([
      { text: "Instance Name", value: "package_instance.flavor_name", sortable: false },
      { text: "Discount", value: "discount", align: "end", sortable: false },
    ]);

    const options = ref(
      proj ? { page: 1, itemsPerPage: 10, search: "", projectID: proj.id, sortBy: [], sortDesc: [] }
      :
      { page: 1, itemsPerPage: 10, search: "", sortBy: [], sortDesc: [] });

    const cancelSelectProject = () =>{
      claimProject.value = false
      selectProjectDialog.value = false
    }

    const doClaim = async () => {
      await claimVoucherDiscount({
        code: voucherDiscountCode.value, 
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
          await fetchVoucherDiscountProjects(val);
        } finally {
          loading.value = false;
        }
      },
      { deep: true }
    );

    onMounted(async () => { 
      await fetchVoucherDiscountProjects(options.value)
    })

    const showInstanceFlavors = (flavors) => {
      instanceFlavors.value = flavors
      openInstanceFlavorsDialog.value = true
    }

    return {
      Rpformat,
      ...useVoucher(),
      doClaim,
      cancelSelectProject,
      VoucherDiscountDetailType,
      voucherDiscountProjects,
      voucherDiscountCode,
      moment,
      options,
      projectSelected,
      projectList,
      selectProjectDialog,
      loading,
      claimProject,
      voucherDiscountProjectPagination,
      openInstanceFlavorsDialog,
      instanceFlavors,
      showInstanceFlavors,
      instanceFlavorsHeader,
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