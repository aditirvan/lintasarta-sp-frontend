<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4">
            <v-row>
              <v-col cols="9">
                <div class="firewall-title">
                  Deka DNS Management for {{ detailDns.name }}
                </div>
              </v-col>
            </v-row>
            <br />

            <v-card flat outlined class="rounded-lg">
              <v-col md="12">
                <v-card
                  flat
                  class="d-flex rounded-lg flex-grow-1 flex-column ma-auto"
                >
                  <v-row>
                    <v-col md="8">
                      <v-text-field
                        class="icon-search"
                        outlined
                        append-icon="mdi-magnify"
                        label="Search Deka DNS Record by Name"
                        v-model="search"
                      ></v-text-field>
                    </v-col>
                    <v-col md="2" class="add-btn p-2"
                      v-if="!read_only"
                      ><v-btn
                        color="blue-grey"
                        class="white--text fz16"
                        height="55"
                        width="150"
                        ><v-icon left dark> mdi-content-save </v-icon>Advanced
                      </v-btn></v-col
                    >
                    <v-col md="2" class="add-btn p-2"
                      v-if="!read_only"
                      ><v-btn
                        color="primary"
                        class="fz16"
                        @click="show()"
                        height="55"
                        width="150"
                        ><v-icon left dark> mdi-plus </v-icon>Add Record
                      </v-btn></v-col
                    >
                  </v-row>
                </v-card>
                <div v-if="showMenu" class="mb-10">
                  <v-row>
                    <v-col cols="2">
                      <span>Type</span>
                      <v-select
                        :items="dataListType"
                        item-text="name"
                        item-value="name"
                        v-model="recordType"
                        label="Select"
                        solo
                      ></v-select
                    ></v-col>
                    <v-col>
                      <span>Name</span>
                      <v-text-field
                        solo
                        placeholder="Name"
                        v-model="recordName"
                        height="30px"
                        :suffix="`.${detailDns.name}`"
                      ></v-text-field>
                    </v-col>
                    <v-col v-if="recordType == 'A'"
                      ><span>IPv4 address</span>
                      <v-text-field
                        solo
                        placeholder="172.0.0.0"
                        onkeypress="return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46 "
                        v-model="recordContent"
                        height="30px"
                        :rules="[rules.cekIP]"
                      ></v-text-field
                    ></v-col>

                    <v-col v-else-if="recordType == 'AAAA'"
                      ><span>IPv6 address</span>
                      <v-text-field
                        solo
                        placeholder="IPv6 address"
                        v-model="recordContent"
                        height="30px"
                      ></v-text-field
                    ></v-col>

                    <v-col v-else
                      ><span>Content</span>
                      <v-text-field
                        solo
                        height="30px"
                        placeholder="Content"
                        v-model="recordContent"
                      ></v-text-field
                    ></v-col>

                    <!-- <v-col class="btn-switch">
                      <span>Status</span>
                      <v-switch
                        inset
                        v-model="recordProxy"
                        class="mt-0"
                        readonly
                      ></v-switch>
                    </v-col>
                    <v-col class="btn-switch">
                      <span>Cache Status</span>
                      <v-switch
                        inset
                        readonly
                        v-model="recordCache"
                        class="mt-0"
                      >
                      </v-switch>
                    </v-col> -->

                    <v-col cols="2">
                      <span>TTL</span>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            color="grey "
                            dark
                            v-bind="attrs"
                            v-on="on"
                            class="ml-2"
                          >
                            mdi-information
                          </v-icon>
                        </template>
                        <span>Default value is 86400</span>
                      </v-tooltip>
                      <v-text-field
                        class="top-text"
                        solo
                        placeholder="Auto"
                        height="30px"
                        onkeypress="return (event.charCode >= 48 && event.charCode <= 57)"
                        v-model="recordTtl"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row class="justify-end ma-1">
                    <v-btn
                      color="#CDCDCD"
                      height="45"
                      width="100"
                      @click="
                        () => {
                          showMenu = false;
                          recordType = '';
                          recordName = '';
                          recordContent = '';
                          recordTtl = '';
                          ubah = false;
                        }
                      "
                      class="mr-2 fz14"
                      >Cancel</v-btn
                    >
                    <v-btn
                      color="primary"
                      height="45"
                      width="100"
                      class="fz14"
                      @click="onSubmit()"
                      >Save</v-btn
                    >
                  </v-row>
                </div>
                <v-data-table
                  :headers="headers"
                  :items="detailDns.records"
                  item-key="no"
                  :loading="isLoad"
                  class="elevation-0"
                  hide-default-footer
                  :search="search"
                >
                  <template #[`item.no`]="{ item }">
                    <div class="mb-5">{{ detailDns.records.indexOf(item) + 1 }}</div>
                  </template>
                  <template #[`item.type_id`]="{ item }">
                    <div class="mb-5">{{ item.type_id }}</div>
                  </template>

                  <template #[`item.name`]="{ item }">
                    <v-text-field
                      @input="updateName = $event"
                      :value="getName(item.name)"
                      outlined
                      height="40"
                      class="name-input"
                      :suffix="`.${item.zone}`"
                      :disabled="rawEdit == false && id_record != item.id"
                    ></v-text-field>
                  </template>

                  <template #[`item.content`]="{ item }">
                    <v-text-field
                      v-if="item.type_id == 'A'"
                      onkeypress="return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46 "
                      @input="(updateContent = $event), (ubah = true)"
                      :value="item.content"
                      outlined
                      height="40"
                      class="name-input"
                      :disabled="rawEdit == false && id_record != item.id"
                      :rules="[rules.required]"
                    ></v-text-field>
                    <v-text-field
                      v-else-if="item.type_id == 'AAAA'"
                      @input="(updateContent = $event), (ubah = true)"
                      :value="item.content"
                      outlined
                      height="40"
                      class="name-input"
                      :disabled="rawEdit == false && id_record != item.id"
                      :rules="[rules.required]"
                    ></v-text-field>
                    <v-text-field
                      v-else-if="item.type_id == 'SPF' || item.type_id == 'TXT'"
                      @input="(updateContent = $event), (ubah = true)"
                      :value="getContentPetik(item.content)"
                      outlined
                      height="40"
                      class="name-input"
                      :disabled="rawEdit == false && id_record != item.id"
                      :rules="[rules.required]"
                    ></v-text-field>
                    <v-text-field
                      v-else
                      @input="(updateContent = $event), (ubah = true)"
                      :value="getContent(item.content)"
                      outlined
                      height="40"
                      class="name-input"
                      :disabled="rawEdit == false && id_record != item.id"
                      :rules="[rules.required]"
                    ></v-text-field>
                  </template>

                  <template #[`item.ttl`]="{ item }">
                    <v-text-field
                      onkeypress="return (event.charCode >= 48 && event.charCode <= 57)"
                      @input="updateTTL = $event"
                      :value="item.ttl"
                      outlined
                      height="40"
                      class="name-input"
                      :disabled="rawEdit == false && id_record != item.id"
                    ></v-text-field>
                  </template>
                  <template #[`item.action`]="{ item }">
                    <v-row v-if="openAction == false" class="justify-center"
                      ><v-btn
                        color="primary"
                        @click="
                          () => {
                            openRawEdit(item);
                          }
                        "
                        class="mb-6"
                        height="40"
                        >Edit</v-btn
                      ></v-row
                    >
                    <v-row class="mb-5" v-else
                      ><div>
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              color="primary"
                              v-bind="attrs"
                              v-on="on"
                              dark
                              class="cursor-pointer"
                              @click="onUpdate(item, 'update')"
                              :disabled="
                                rawEdit == false && id_record != item.id
                              "
                              >mdi-square-edit-outline</v-icon
                            >
                          </template>
                          <span>Update</span>
                        </v-tooltip>
                      </div>
                      <div>
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              color="red"
                              v-bind="attrs"
                              v-on="on"
                              dark
                              class="cursor-pointer"
                              @click="onUpdate(item, 'delete')"
                              :disabled="
                                rawEdit == false && id_record != item.id
                              "
                              >mdi-trash-can</v-icon
                            >
                          </template>
                          <span>Delete</span>
                        </v-tooltip>
                      </div>
                      <div>
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              color="#CDCDCD"
                              dark
                              v-bind="attrs"
                              v-on="on"
                              class="cursor-pointer"
                              :disabled="
                                rawEdit == false && id_record != item.id
                              "
                              @click="
                                () => {
                                  openAction = false;
                                  id_record = '';
                                  refersh();
                                }
                              "
                              >mdi-close-box</v-icon
                            >
                          </template>
                          <span>Cancel</span>
                        </v-tooltip>
                      </div></v-row
                    ></template
                  >
                  <!-- <template #[`item.Status`]="{ item }">
                    <td>
                      <v-switch
                        inset
                        v-model="item.status"
                        class="mb-5"
                        value
                        readonly
                      ></v-switch>
                    </td>
                  </template>
                  <template #[`item.Cache`]="{ item }">
                    <td>
                      <v-switch
                        inset
                        v-model="item.cache"
                        class="mb-5"
                        value
                        readonly
                      ></v-switch>
                    </td>
                  </template> -->

                  <!-- <template v-slot:footer>
                    <div v-if="listRecords.length > 0">
                      <v-row class="d-flex justify-end">
                        <v-col cols="2">
                          <v-select
                            hide-details
                            dense
                            :items="itemsPage"
                            v-model="itemSelected"
                            item-text="text"
                            item-value="value"
                            outlined
                            class="rounded-lg flex-grow-0 selectFooter lis"
                            @change="onChange($event)"
                            :disabled="listRecordsTotal < 10"
                          >
                            <template v-slot:selection="{ item }">
                              1 - {{ item.text }} of
                              {{ listRecordsTotal }}</template
                            ></v-select
                          >
                        </v-col>
                        <v-col :cols="pagination === 1 ? 2 : 3">
                          <div>
                            <v-pagination
                              v-model="page"
                              class="page fz"
                              prev-icon="Prev"
                              next-icon="Next"
                              :length="pagination"
                              :total-visible="5"
                              circle
                              @input="onPageChange()"
                            ></v-pagination>
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                  </template> -->
                  
                  <template v-slot:footer="{ props }">
                    <custom-footer-datatable
                      @input="
                        (val) => {
                          options = val;
                          // onPageChange(val);
                        }
                      "
                      :props="props"
                    />
                  </template>
                </v-data-table>
              </v-col>
            </v-card>
            <table-nameservers></table-nameservers>
            <card-info></card-info>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog persistent v-model="updateDialog" max-width="500">
      <v-card class="pt-7 rounded-lg">
        <v-card-text>
          <div class="d-flex flex-row">
            <v-icon left>$vuetify.icons.alertcircleIcon</v-icon>
            <p class="fz-18 font-weight-bold mb-0">
              {{ action == "update" ? "Record Update" : "Delete Update" }}
            </p>
          </div>
        </v-card-text>
        <v-card-text>
          <p class="mb-0 text-h6">
            {{
              action == "update"
                ? "Do you want to update this Record ?"
                : "Do you want to delete this Record ?"
            }}
          </p>
          <v-row>
            <v-col cols="2"
              ><label>Type</label>
              <p>
                {{
                  action == "update" ? dataUpdate.type_id : dataDelete.type_id
                }}
              </p>
              <br />
            </v-col>
            <v-col
              ><label>Name</label>
              <br />
              <p>
                {{ action == "update" ? dataUpdate.name : dataDelete.name }}
              </p>
            </v-col>
            <v-col
              ><label>Content</label>
              <br />
              <p>
                {{
                  action == "update" ? dataUpdate.content : dataDelete.content
                }}
              </p>
            </v-col>
            <v-col
              ><label>TTL</label>
              <br />
              <p>{{ action == "update" ? dataUpdate.ttl : dataDelete.ttl }}</p>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text>
          <v-row class="d-flex justify-end">
            <v-col class="d-flex flex-row justify-center" cols="3">
              <v-btn
                color="#CDCDCD"
                depressed
                block
                height="35"
                @click="onCancel()"
              >
                Cancel
              </v-btn>
            </v-col>
            <v-col class="d-flex flex-row justify-center" cols="3">
              <v-btn
                v-if="action == 'update'"
                color="primary"
                depressed
                block
                height="35"
                @click="onConfirm(paramsUpdate)"
              >
                Confirm
              </v-btn>
              <v-btn
                v-else
                color="primary"
                depressed
                block
                height="35"
                :loading="deleteLoading"
                @click="onDelete(paramsUpdate)"
              >
                Confirm
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <div class="text-center ma-2">
      <v-snackbar v-model="snackbar" color="red">
        {{ errorText }}
        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>
<script>
import {
  ref,
  defineComponent,
  onMounted,
  // computed,
  watch,
} from "@vue/composition-api";
import tableNameservers from "../dns/table-nameservers.vue";
import cardInfo from "./card-info.vue";
import {
  useNamespacedGetters,
  useNamespacedActions,
} from "vuex-composition-helpers";
import { AccessControl } from "@/lib/middleware";
import { async } from "rxjs";

export default defineComponent({
  components: {
    cardInfo,
    tableNameservers,
  },
  created() {
    this.getListType();
  },
  setup(props, { emit, root }) {
    const access_control = new AccessControl(root.$store);
    const read_only = ref(access_control.is_read_mode('DNS'));
    // const pagination = computed(() => {
    //   let a = itemSelected.value;
    //   let b = listRecordsTotal.value;
    //   return Math.ceil(b / a);
    // });
    onMounted(() => {
      getDetailDns(localStorage.getItem("id_dns"));
    });

    const itemSelected = ref(10);

    const options = ref({ page: 1, itemsPerPage: 10, rowsPerPage: 10, search: "", sortBy: [], sortDesc: [], is_created: [] });

    const {
      listDataSite,
      detailDns,
      listRecords,
      isLoad,
      dataListType,
      listRecordsTotal,
      isLoadUpdate,
      deleteLoading,
    } = useNamespacedGetters("DNS", [
      "listDataSite",
      "detailDns",
      "listRecords",
      "isLoad",
      "isLoadUpdate",
      "dataListType",
      "listRecordsTotal",
      "deleteLoading",
    ]);
    const {
      getDetailDns,
      getListRecords,
      postCreateRecord,
      deleteRecords,
      updateRecords,
      fetchListDataRecords,
      getListType,
      refreshRecords,
    } = useNamespacedActions("DNS", [
      "getDetailDns",
      "getListRecords",
      "postCreateRecord",
      "deleteRecords",
      "updateRecords",
      "fetchListDataRecords",
      "getListType",
      "refreshRecords",
    ]);
    const listRecordsCount = ref(0);
    const recordType = ref("");
    const recordName = ref("");
    const recordContent = ref("");
    const recordProxy = ref(false);
    const recordCache = ref(false);
    const recordTtl = ref("");
    const updateTTL = ref(0);
    const updateName = ref("");
    const updateContent = ref("");
    const expanded = ref([]);
    const search = ref("");
    const headers = ref([
      { text: "No", value: "no", width: "8%" },
      { text: "Type", value: "type_id", width: "9%" },
      { text: "Name", value: "name" },
      { text: "Content", value: "content" },
      // { text: "Status", value: "Status", width: "10%", sortable: false },
      // { text: "Cache", value: "Cache", width: "10%", sortable: false },
      { text: "TTL", value: "ttl", width: "11%" },
      {
        text: "Action",
        sortable: false,
        align: "right",
        value: "action",
        width: "10%",
        align: "center",
      },
    ]);
    const snackbar = ref(false);
    const errorText = ref("");
    const selectName = ref("");
    const selectProxy = ref(false);
    const updateDialog = ref(false);
    const singleExpand = ref(true);
    const dataUpdate = ref({});
    const dataDelete = ref({});
    const paramsUpdate = ref({});
    const action = ref("");
    const page = ref(1);
    const rawEdit = ref(false);

    const footerProps = ref({ 'items-per-page-options': [10, 20, 30, 50, 100] })
    const loading = ref(false);
    onMounted( async() => {
      getDetailDns(localStorage.getItem("id_dns"));
      getListRecords(localStorage.getItem("name_dns"));
    });
    let zone = "";
    
    
    function onPageChange(val) {
      const count = page.value - 1;
      const params = new URLSearchParams();
      params.append("limit", val.itemsPerPage);
      params.append("page", val.page);
      params.append("sort", "created_at");
      params.append("zone.contains", detailDns.value.name);
      fetchListDataRecords(params);
    }

    function onChange() {
      const params = new URLSearchParams();
      params.append("limit", val.itemsPerPage);
      params.append("page",  val.page);
      params.append("sort", "created_at");
      params.append("zone.contains", detailDns.value.name);
      fetchListDataRecords(params);
    }

    const rules = ref({
      cekIP: (value) => {
        if (checkIfValidIP(value) == false) {
          return "Invalid IP Address";
        } else {
          return true;
        }
      },

      required: (value) => !!value || "Content couldn't be empty.",
    });

    const showMenu = ref(false);
    const inputTitik = ref([]);
    const ubah = ref(false);

    function checkIfValidIP(str) {
      const regexExp =
        /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
      return regexExp.test(str);
    }

    function show() {
      showMenu.value = true;
      search.value = "";
      openAction.value = false;
      rawEdit.value = false;
      id_record.value = "";
    }

    async function onSubmit() {
      if (!recordContent.value) {
        snackbar.value = true;
        if (recordType.value === "A") {
          return (errorText.value = "IPv4 shoudn't be empty");
        } else if (recordType.value === "AAAA") {
          return (errorText.value = "IPv6 shoudn't be empty");
        } else {
          return (errorText.value = "Content shoudn't be empty");
        }
      } else {
        const newName = recordName.value.replace(
          `.${detailDns.value.name}`,
          ""
        );

        if (recordType.value == "MX" || recordType.value == "SRV") {
          inputTitik.value = [`0 ${recordContent.value}.`];
        } else if (recordType.value == "PTR") {
          inputTitik.value = [`${recordContent.value}.`];
        } else {
          inputTitik.value = [recordContent.value];
        }

        const params = {
          zone: detailDns.value.name,
          zone_id: localStorage.getItem("id_dns"),
          type_id: recordType.value,
          name: newName
            ? `${newName}.${detailDns.value.name}`
            : detailDns.value.name,
          content: inputTitik.value,
          ttl: recordTtl.value ? parseInt(recordTtl.value) : 86400,
        };
        (recordType.value = ""),
          (recordName.value = ""),
          (recordContent.value = ""),
          (recordTtl.value = "");
        showMenu.value = false;
        await postCreateRecord(params);
        rawEdit.value = false;
        openAction.value = false;
        options.value.page = 1;
      }
    }

    async function onDelete(item) {
      if (!item) {
        return false;
      } else {
        await deleteRecords(item);
        options.value.page = 1;
      }
      updateDialog.value = false;
      rawEdit.value = false;
      openAction.value = false;
      id_record.value = "";
      dataDelete.value = {};
      ubah.value = false;
      updateName.value = "";
      updateContent.value = "";
      updateTTL.value = 0;
    }

    function onCancel() {
      updateDialog.value = false;
      updateName.value = "";
      updateContent.value = "";
      updateTTL.value = 0;
      dataDelete.value = {};
    }

    const nilaiBaru = ref("");

    function onUpdate(item, a) {
      if (updateContent.value == "" && ubah.value == true) {
        return false;
      } else {
        updateDialog.value = true;
      }

      action.value = a;
      let xxx = typeof updateTTL.value;

      if (xxx == "number") {
        nilaiBaru.value = item.ttl;
      } else if (xxx == "string" && updateTTL.value == "") {
        nilaiBaru.value = 86400;
      } else if (xxx == "string" && parseInt(updateTTL.value) >= 0) {
        nilaiBaru.value = updateTTL.value;
      }

      if (updateContent.value == "" && ubah.value == true) {
        updateContent.value = "";
      } else {
        if (item.type_id == "MX" || item.type_id == "SRV") {
          updateContent.value
            ? (updateContent.value = [`0 ${updateContent.value}.`])
            : (updateContent.value = item.content);
        } else if (item.type_id == "PTR") {
          updateContent.value
            ? (updateContent.value = [`${updateContent.value}.`])
            : (updateContent.value = item.content);
        } else {
          updateContent.value
            ? (updateContent.value = [updateContent.value])
            : (updateContent.value = item.content);
        }
      }

      dataUpdate.value = {
        id: item.id,
        zone_id: localStorage.getItem("id_dns"),
        zone: detailDns.value.name,
        type_id: item.type_id,
        name: updateName.value
          ? updateName.value + `.${detailDns.value.name}`
          : item.name,
        content:
          item.type_id == "MX" || item.type_id == "SRV"
            ? updateContent.value.toString().slice(2)
            : updateContent.value.toString(),
        ttl: parseInt(nilaiBaru.value),
      };

      dataDelete.value = {
        id: item.id,
        zone_id: localStorage.getItem("id_dns"),
        zone: detailDns.value.name,
        type_id: item.type_id,
        name: item.name,
        content: updateContent.value.toString(),
        ttl: item.ttl,
      };

      paramsUpdate.value = {
        id: item.id,
        zone_id: localStorage.getItem("id_dns"),
        zone: detailDns.value.name,
        type_id: item.type_id,
        name: updateName.value
          ? updateName.value + `.${detailDns.value.name}`
          : item.name,
        content: updateContent.value,
        ttl: parseInt(nilaiBaru.value),
      };
    }

    async function onConfirm(item) {
      if (updateContent.value == "") {
        updateDialog.value = false;
        snackbar.value = true;
        ubah.value = false;
        return (errorText.value = "Please check your content format record.");
      } else {
        await updateRecords({ id: item.id, params: item });
        options.value.page = 1;
      }
      updateName.value = "";
      updateContent.value = "";
      paramsUpdate.value = "";
      updateDialog.value = false;
      rawEdit.value = false;
      openAction.value = false;
      id_record.value = "";
      dataUpdate.value = {};
      ubah.value = false;
    }

    function getName(string) {
      const newString = `.${detailDns.value.name}`;
      if (string == `${detailDns.value.name}`) {
        return "";
      } else {
        return string.replace(newString, "");
      }
    }
    function getContent(string) {
      const newValue = string.toString();
      const xx = newValue.slice(-1);
      const yy = newValue.charAt(0);

      if (xx == "." && yy == "0") {
        const newString = newValue.lastIndexOf(".");
        const aa = newValue.substring(0, newString);
        const bb = aa.slice(2);
        return bb;
      } else if (xx == ".") {
        const newString = newValue.lastIndexOf(".");
        const aa = newValue.substring(0, newString);
        return aa;
      } else {
        return string;
      }
    }

    function getContentPetik(string) {
      const newString = string.toString();
      const newReplace = newString.replaceAll('"', "");
      const tanpaPetik = newReplace.replaceAll("'", "");
      return tanpaPetik;
    }

    const id_record = ref("");
    const openAction = ref(false);
    function openRawEdit(item) {
      id_record.value = item.id;
      rawEdit.value = false;
      openAction.value = true;
      showMenu.value = false;
    }
    function refersh() {
      options.value.page = 1;
      refreshRecords(localStorage.getItem("name_dns"));
    }

    if(read_only.value){
      headers.value.pop()
    }

    return {
      read_only,
      headers,
      showMenu,
      selectName,
      selectProxy,
      expanded,
      singleExpand,
      rules,
      search,
      listDataSite,
      recordType,
      recordName,
      recordContent,
      recordProxy,
      recordTtl,
      recordCache,
      detailDns,
      getDetailDns,
      getListRecords,
      postCreateRecord,
      listRecords,
      refreshRecords,
      deleteRecords,
      updateRecords,
      isLoad,
      isLoadUpdate,
      dataListType,
      listRecordsTotal,
      listRecordsCount,
      page,
      getListType,
      updateTTL,
      updateContent,
      updateName,
      // itemsPage,
      updateDialog,
      dataUpdate,
      dataDelete,
      action,
      paramsUpdate,
      show,
      checkIfValidIP,
      onSubmit,
      onDelete,
      onUpdate,
      onPageChange,
      onChange,
      onConfirm,
      onCancel,
      getName,
      openRawEdit,
      getContent,
      getContentPetik,
      refersh,
      itemSelected,
      // pagination,
      deleteLoading,
      rawEdit,
      errorText,
      snackbar,
      id_record,
      openAction,
      nilaiBaru,
      inputTitik,
      ubah,
      options,
    };
  },
});
</script>

<style lang="scss" scoped>
::v-deep .v-input__icon .v-input__icon--append {
  margin-top: 14px !important;
}
.fz16 {
  font-size: 16px;
  box-shadow: none;
}
.fz14 {
  font-size: 14px;
}
.btn-switch {
  text-align: center;
  display: grid;
  justify-content: center;
}
::v-deep .v-text-field__details {
  position: static;
}
.m-switch ::v-deep .v-input__slot {
  margin-bottom: 0;
}
.name-input ::v-deep .v-input__slot {
  min-height: 40px;
  margin-top: 5px;
}
::v-deep .v-data-table td.sw {
  display: flex;
  justify-content: center;
  align-content: center;
  margin-top: 5px;
  height: 105px;
}
.page {
  border: 2px solid #d1d9e5;
  border-radius: 10px;
  height: 45px;
}

::v-deep .v-pagination {
  align-items: center;
  display: inline-flex;
  list-style-type: none;
  justify-content: space-between;
  margin: 0;
  max-width: 100%;
  width: 100%;
}

::v-deep .v-pagination__navigation {
  box-shadow: none;
  height: 30px;
}

::v-deep .v-pagination__item {
  box-shadow: none;
  height: 30px;
  font-size: 10px;
  margin: 0;
}

.fz ::v-deep .v-icon.v-icon {
  font-size: 12px;
}

.lis {
  font-size: 12px;
  margin-left: 15px;
  font-weight: 500;
}

::v-deep .v-select__selections {
  margin-top: 5px !important;
}
::v-deep .v-pagination__more {
  display: none;
}

.top-text {
  margin-top: -3px;
}

::v-deep .theme--dark.v-icon.v-icon.v-icon--disabled {
  color: #afafaf !important;
}
</style>
