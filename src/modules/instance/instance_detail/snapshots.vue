<template>
  <v-container fluid>
    <v-row>
      <v-col class="pa-0" v-if="!read_only">
        <v-card flat class="rounded-lg pa-3">
          <v-card-text>
            <div class="headline font-weight-bold font--text">
              Take snapshot
            </div>
          </v-card-text>
          <v-card-text>
            <p>
              Power down your Instance before taking a snapshot to ensure data
              consistency.
            </p>
            <p>
              We recommend turning off your Instance before taking a snapshot to
              ensure data consistency.
            </p>
          </v-card-text>
          <v-card-text class="pt-0">
            <v-row>
              <v-col>
                <p class="font-weight-bold">Select Billing Type</p>
                <v-select
                  id="billingType"
                  placeholder="Choose Billing Type"
                  :error-messages="createErrorMessage('selectedBillingType', $vSnapshotInstance)"
                  v-model="selectedBillingType"
                  :items="billingTypes"
                  outlined
                  class="mb-3"
                  v-if="snapshotFrom.billing_type != 'Trial'"
                />
                <v-select
                    readonly="readonly"
                    disabled
                    id="billingType"
                    placeholder="Choose Billing Type"
                    :error-messages="createErrorMessage('snapshotFrom', $vSnapshotInstance)"
                    v-model="billingTypes[1].value"
                    :items="billingTypes"
                    outlined
                    class="mb-3"
                    v-else
                />
                <p class="font-weight-bold" v-if="snapshotFrom.billing_type === 'Trial' || selectedBillingType === 'Trial'">Select Voucher</p>
                <div v-if="snapshotFrom.billing_type === 'Trial' || selectedBillingType === 'Trial'">
                  <v-select
                    id="trialVoucher"
                    placeholder="Choose trial voucher to use"
                    v-model="selectedTrialVoucher"
                    :error-messages="createErrorMessage('selectedTrialVoucher', $vSnapshotInstance)"
                    :items="vouchers"
                    item-text="voucher.name"
                    item-value="id"
                    outlined
                    class="mb-3"
                  >
                    <template v-slot:selection="{ item }">
                      {{item.name}} - {{item.code}}
                    </template>
                    <template v-slot:item="{ item }">
                      {{item.name}} - {{item.code}}
                    </template>
                  </v-select>
                </div>
                <p class="font-weight-bold">Enter Snapshot Name</p>
                <v-text-field
                  maxlength="50"
                  v-model="snapshotName"
                  outlined
                  placeholder="Lintasarta-Super-Server-1606244240339"
                  :error-messages="createErrorMessage('snapshotName', $vSnapshotInstance)"
                ></v-text-field>
              </v-col>
              <!-- <div
                  style="display: inline-block; width: 30px; height: auto"
                ></div> -->
              <v-col md="3" class="d-flex align-end">
                <v-btn
                  :disabled="
                    isLoading ||
                    !['ACTIVE', 'SHUTOFF'].includes(instance.state) ||
                    ![null, ''].includes(instance.revert_expired)
                  "
                  depressed
                  class="secondary mb-3"
                  height="50"
                  width="150"
                  @click="
                    () => {
                      validateprivilages(['Instance', 'editor']).then(() => {
                        user.role.toLowerCase() !== 'superadmin' ? displaySnapshotDialog() : doTakeSnapshot();
                      });
                    }
                  "
                  >Take Snapshot</v-btn
                >
                <!-- {{ snapshotFrom.billing_type }} -->
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" class="px-0 py-5">
        <v-card flat class="rounded-lg pa-3">
          <v-card-text>
            <div class="headline font-weight-bold font--text">
              Snapshot List
              <!-- <span style="color:red; font-size: medium;" v-if="!read_only">( You're viewer only )</span> -->
            </div>
          </v-card-text>
          <v-card-text>
            <v-data-table
              hide-default-footer
              :headers="headers"
              :items="instanceSnapshots"
              :items-per-page="10"
            >
              <template v-slot:item.name="{ item }">
                <div class="d-flex">
                  <v-icon color="primary" class="mr-3"
                    >mdi-checkbox-blank-circle</v-icon
                  >
                  <div>
                    <p class="mb-0 primary--text">{{ item.name }}</p>
                  </div>
                </div>
              </template>
              <template v-slot:item.status="{ item }">
                <div>
                  <p v-if="item.is_upload_success" class="mb-0 primary--text">
                    Active
                  </p>
                  <p
                    v-else-if="item.is_upload_failed"
                    class="mb-0 danger--text"
                  >
                    Failed
                  </p>
                  <p v-else class="mb-0">Not ready yet</p>
                </div>
              </template>
              <template v-slot:item.size="{ item }">
                <div>{{ item.size ? `${item.size} GB` : "-" }}</div>
              </template>
              <template v-slot:item.createddate="{ item }">
                <div>
                  <p class="mb-0">
                    {{ moment(item.createddate).format("DD/MM/YYYY") }}
                  </p>
                </div>
              </template>
              <template v-slot:item.action="{ item }">
                <div class="linkpointer">
                  <div style="position: relative" @click="show($event, item)">
                    More
                    <v-icon color="primary">mdi-chevron-down</v-icon>
                  </div>
                </div>
              </template>
              <template
                v-if="instanceSnapshots.length > 5"
                v-slot:footer="{ props }"
              >
                <custom-footer-datatable :props="props" />
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-menu
      v-model="showMenu"
      :position-x="x - 10"
      :position-y="y"
      absolute
      allow-overflow
    >
      <v-list>
        <!-- <v-list-item :disabled="!validateprivilagesync(['Instance','editor'])" @click="()=>{opendialogrenameimage=true}"> -->
        <!-- <v-list-item disabled @click="()=>{opendialogrenameimage=true}">
          <v-list-item-title >Rename</v-list-item-title>
        </v-list-item> -->
        <v-list-item
          :disabled="
            disabledField || (showMenu && !activeSnapshot.is_upload_success)
          "
          :to= "!activeSnapshot ? '/instance/create' : `/instance/create?image_ref=${activeSnapshot.id}&instance_ref=${activeSnapshot.instance.id}`"
          @click.native="scrollTop"
        >
          <v-list-item-title>Create Instance</v-list-item-title>
        </v-list-item>
        <!-- <v-list-item :disabled="!validateprivilagesync(['Instance','editor'])" @click="()=>{opendialogrestoreinstance = true}"> -->

        <!-- <v-list-item @click="()=>{ 
            opendialogrestoreinstance = true 
          }"
          :disabled="showMenu && !activeSnapshot.is_upload_success"
        >
          <v-list-item-title>Restore Instance</v-list-item-title>
        </v-list-item> -->

        <!-- :disabled="disabledField" -->
        <v-list-item
          :disabled="true"
          @click="
            () => {
              validateprivilages(['Instance', 'editor']).then(() => {
                opendialogrestoreinstance = true;
              });
            }
          "
        >
          <v-list-item-title>Restore Instance</v-list-item-title>
        </v-list-item>
        <!-- temporary disabled
        disabledField -->

        <v-list-item style="min-height: 20px"><v-divider /></v-list-item>
        <v-list-item
          :disabled="disabledField || (showMenu && !activeSnapshot.is_upload_success)"
          @click="
            () => {
              validateprivilages(['Instance', 'editor']).then(() => {
                opendialogdeletesnapshot = true;
              });
            }
          "
        >
          <v-list-item-title class="error--text">Delete</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <dialogRenameImage
      v-if="selectedsnapshot"
      :snapshot="activeSnapshot"
      v-model="opendialogrenameimage"
      @close="
        ($event) => {
          opendialogrenameimage = $event;
        }
      "
    />

    <dialogBeforeRestoreInstance
      v-model="opendialogbeforerestoreinstance"
      @close="
        ($event) => {
          opendialogbeforerestoreinstance = $event;
        }
      "
      :item="payloadbeforerestore"
    />

    <dialogRestoreInstance
      v-model="opendialogrestoreinstance"
      :selectedSnapshot="activeSnapshot"
      :selectedInstance="instance"
      @close="
        ($event) => {
          opendialogrestoreinstance = $event;
        }
      "
      @submit="
        ($event) => {
          opendialogrestoreinstance = false;
          opendialogbeforerestoreinstance = true;
          payloadbeforerestore = $event;
        }
      "
    />

    <dialogDeleteSnapshot
      v-model="opendialogdeletesnapshot"
      :snapshot="activeSnapshot"
      :filterByInstanceID="true"
      @close="
        ($event) => {
          opendialogdeletesnapshot = $event;
        }
      "
    />

    <!-- <dialogSnapshotConfirmation
      v-if="snapshotDialog && snapshotData"
      :data="snapshotData"
      v-model="snapshotDialog"
      @confirm="
        () => {
          CreateSnapshot(true, selectedTrialVoucher, defaultSnapshotPrice.id);
          snapshotDialog = false;
        }
      "
      :loading="isLoading"
    />
    <dialogSnapshotValidationBalance
      v-if="snapshotValidation && snapshotData"
      v-model="snapshotValidation"
      :data="snapshotData"
      @confirm="
        () => {
          $router.push('/billing/payment');
        }
      "
      @input="
        () => {
          snapshotValidation = false;
        }
      "
    /> -->
    <!-- dialog purchase snapshot instance -->
    <dialogNewServiceAvailability
      v-if="snapshotDialog"
      :onClose="() => {snapshotDialog = false}"
      serviceName="Snapshot"
      actionName="Take Snapshot"
      :onAvailable="doTakeSnapshot"
    />
  </v-container>
</template>

<script>
import moment from "moment";
import dialogRenameImage from "../../images/dialogRenameImage";
import dialogBeforeRestoreInstance from "@/modules/images/dialogBeforeRestoreInstance.vue";
import dialogRestoreInstance from "../../images/dialogRestoreInstance";
import dialogDeleteSnapshot from "../../images/dialogDelete";
// import dialogSnapshotConfirmation from "./dialogSnapshotConfirmation.vue";
// import dialogSnapshotValidationBalance from "./dialogSnapshotValidationBalance.vue";

import { useCreateSnapshot } from "../../images/composableapi/usecreatesnapshot";
import { ref, onMounted } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { mapGetters } from "vuex";
import { useVoucher } from "../../voucher/useVoucher";
import localstorage from "@/lib/localstorage";
import libProject from "@/lib/project";
import dialogNewServiceAvailability from "@/modules/project/dialogNewServiceAvailability.vue";
import useNewServiceAvailability from "@/modules/project/useNewServiceAvailability";
import { toIDRWithDotFormat } from "@/lib/formatter";
import useVuelidate from "@vuelidate/core";
import { required, requiredIf, helpers, minLength } from "@vuelidate/validators";
import { AccessControl } from "@/lib/middleware";

export default {
  props: ["instance"],
  components: {
    dialogRenameImage,
    dialogBeforeRestoreInstance,
    dialogRestoreInstance,
    dialogDeleteSnapshot,
    // dialogSnapshotConfirmation,
    // dialogSnapshotValidationBalance,
    dialogNewServiceAvailability,
  },
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Project Images'));
    const Composable = {
      ...useCreateSnapshot(),
      ...useVoucher(),
    };

    const {
      selectedBillingType,
      CreateSnapshot,
      snapshotName,
      snapshotFrom,
      instanceSnapshots,
      fetchInstanceSnapshots,
      fetchInstanceSnapshotsByInstanceID,
    } = Composable;

    const disabledField = ref(false);
    snapshotFrom.value = props.instance;
    snapshotFrom.value.__typename = "instance";

    const {
      validateprivilages,
      validateprivilagesync,
      validateprivilagesyncnew,
    } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
      "validateprivilagesync",
      "validateprivilagesyncnew",
    ]);
    const { checkValidationSnapshot } = useNamespacedActions("IMAGES", [
      "checkValidationSnapshot",
    ]);

    validateprivilagesyncnew(["Instance", "editor"]).then((res) => {
      disabledField.value = res;
    });

    const { getDefaultSnapshotPrice } = useNamespacedActions("IMAGESBILLING", [
      "getDefaultSnapshotPrice",
    ]);
    const { defaultSnapshotPrice } = useNamespacedGetters("IMAGESBILLING", [
      "defaultSnapshotPrice",
    ]);
    const {checkAvailability} = useNewServiceAvailability()

    const { fetchVouchers, vouchers } = useVoucher();

    const instance_id = context.root._route.params.instanceid;
    onMounted(async () => {
      fetchVouchers();
      if (instance_id)
        await fetchInstanceSnapshotsByInstanceID({ instance_id });
      // else await fetchInstanceSnapshots()

      await getDefaultSnapshotPrice()
    });
    const defaultBillingTypes = [
      {
        text: "Pay Per Use (PPU)",
        value: "PPU",
      },
      {
        text: "Trial",
        value: "Trial",
      },
    ];

    const fixedPostpaid = [
      {
        text: "Fixed",
        value: "Fixed",
      },
      {
        text: "Trial",
        value: "Trial",
      },
    ];

    const selectedTrialVoucher = ref(null);

    const projJson = localStorage.getItem("currentProj");
    const projObj =
      projJson && projJson !== "undefined" ? JSON.parse(projJson) : {};
    const postpaid_type = projObj.postpaid_type;

    const billingTypes =
      postpaid_type && postpaid_type === "fixed"
        ? fixedPostpaid
        : defaultBillingTypes;

    const snapshotDialog = ref(false);
    const snapshotValidation = ref(false);
    const snapshotData = ref();

    const $vSnapshotInstance = useVuelidate(
      {
        selectedBillingType: { required },
        snapshotName: {
          required,
          minLength: minLength(5),
          specialChars: helpers.withMessage("Cannot contain special character", (val) => {
            return !val.match(/[^A-Za-z0-9-_]/g);
          }),
        },
        snapshotFrom: { required },
        selectedTrialVoucher: {
          required: requiredIf((val) => {
            return selectedBillingType.value === "Trial";
          }),
        },
      },
      {
        selectedBillingType,
        snapshotName,
        snapshotFrom,
        selectedTrialVoucher, 
      },
      { lazy: true }
    );

    const displaySnapshotDialog = async () => {
      $vSnapshotInstance.value.$touch();

      if (
        $vSnapshotInstance.value.selectedTrialVoucher.$invalid ||
        $vSnapshotInstance.value.snapshotName.$invalid ||
        $vSnapshotInstance.value.snapshotFrom.$invalid ||
        $vSnapshotInstance.value.selectedBillingType.$invalid
      )
        return false;

      if (selectedBillingType.value.toLowerCase() === "trial") {
        await doTakeSnapshot();
        return;
      }

      await checkAvailability(
        {
          by: "service", 
          item: {
            service_name: 'SNAPSHOT', 
            id: defaultSnapshotPrice.value.id,
            tags: [
              {
                name:'Volume',
                qty: parseInt(snapshotFrom.value.root_disk_package.volume_size),
              }
            ]
          }
        }
      )

      snapshotDialog.value = true;
    };

    const doTakeSnapshot = async () => {
      $vSnapshotInstance.value.$touch();

      if (
        $vSnapshotInstance.value.selectedTrialVoucher.$invalid ||
        $vSnapshotInstance.value.snapshotName.$invalid ||
        $vSnapshotInstance.value.snapshotFrom.$invalid ||
        $vSnapshotInstance.value.selectedBillingType.$invalid
      ) {
        return false;
      }

      const currProj = await libProject.getActiveProject();
      
      const payload = {
        billing_type: selectedBillingType.value,
        project_id: currProj.id,
        size: parseInt(snapshotFrom.value.root_disk_package.volume_size),
        voucher_id: selectedTrialVoucher.value,
        snapshot_service_id: defaultSnapshotPrice.value.id
      };
      if (props.instance.billing_type === "Trial" || selectedBillingType === 'Trial') {
          payload.billing_type = "Trial"
          if (!selectedTrialVoucher.value){
            snapshotValidation.value = true;
            return false;
          }
      }
      await CreateSnapshot(true, selectedTrialVoucher.value, defaultSnapshotPrice.value.id);
    
      snapshotName.value = null;
      selectedTrialVoucher.value = null;
      selectedBillingType.value = "Default";
      snapshotDialog.value = false;

      $vSnapshotInstance.value.$reset();
      snapshotDialog.value = false;
    };

    const createErrorMessage = (element, validate) => {
      return validate[element].$errors.length ? validate[element].$errors[0].$message : "";
    };

    return {
      read_only,

      disabledField,
      validateprivilages,
      validateprivilagesyncnew,
      selectedTrialVoucher,
      moment,
      instanceSnapshots,
      validateprivilagesync,
      selectedsnapshot: ref(""),
      ...Composable,
      billingTypes,
      snapshotDialog,
      doTakeSnapshot,
      snapshotValidation,
      checkValidationSnapshot,
      snapshotData,
      selectedBillingType,
      $vSnapshotInstance,
      defaultSnapshotPrice,
      displaySnapshotDialog,
      createErrorMessage,
    };
  },
  data() {
    return {
      opendialogbeforerestoreinstance: false,
      payloadbeforerestore: null,
      opendialogdeletesnapshot: false,
      opendialogrestoreinstance: false,
      opendialogrenameimage: false,
      x: 0,
      y: 0,
      showMenu: false,
      activeSnapshot: null,
      headers: [
        {
          text: "Snapshot name",
          value: "name",
        },
        {
          text: "Status",
          value: "status",
        },
        {
          text: "Size",
          value: "size",
        },
        {
          text: "Created Date",
          value: "createddate",
        },
        {
          text: "Action",
          value: "action",
        },
      ],
    };
  },
  mounted(){
    if (this.read_only){
      this.headers.pop()
    }
  },
  computed: {
    isCorporate() {
      return localstorage.getItem("type") === "C";
    },
    ...mapGetters({
      user: "ROLEPERMISSION/getuser",
    }),
  },
  methods: {
    scrollTop() {
      document.documentElement.scrollTop = 0;
    },
    show(e, snapshot) {
      e.preventDefault();
      this.showMenu = false;
      this.activeSnapshot = snapshot;
      this.x = e.clientX;
      this.y = e.clientY;
      this.$nextTick(() => {
        this.showMenu = true;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.headline {
  font-weight: 600;
  font-family: "Poppins", sans-serif;
}
[role="menu"] {
  box-shadow: none;
  &::before {
    content: url("~@/assets/tri.png");
    position: relative;
    left: 5px;
  }
  .v-list-item {
    min-height: 38px;
  }
  .v-list-item__title {
    font-weight: 600;
  }
  .v-list {
    border-radius: 5px;
    margin: -8px 2px 2px 2px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
}
</style>
