<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4">
            <v-row>
              <v-col cols="9">
                <div class="firewall-title">Deka DNS Management</div>
              </v-col>
            </v-row>
            <v-card
              v-if="listData.length > 0"
              flat
              class="d-flex rounded-lg flex-grow-1 flex-column ma-auto"
            >
              <v-row>
                <v-col md="8">
                  <v-text-field
                    outlined
                    append-icon="mdi-magnify"
                    label="Search"
                    v-model="searchQuery"
                    @click="
                      {
                        showMenu = false;
                        inputSite = '';
                      }
                    "
                  ></v-text-field>
                </v-col>
                <v-col md="2"> </v-col>
                <v-col md="2" class="add-btn" v-if="!read_only"
                  ><v-btn
                    color="primary"
                    height="55"
                    class="fz16"
                    @click="show()"
                    ><v-icon left dark> mdi-plus </v-icon>Add a Site
                  </v-btn></v-col
                >
              </v-row>
              <div class="mt-4">
                <v-row v-if="showMenu">
                  <v-col md="8">
                    <v-text-field
                      outlined
                      label="Add a Site"
                      v-model="inputSite"
                      :error-messages="errorInputSite"
                      @input="searchQuery = ''"
                      :rules="[rule.required]"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    md="2"
                    class="add-btn"
                    @click="
                      () => {
                        showMenu = false;
                        inputSite = '';
                      }
                    "
                    ><v-btn height="55" class="fz16" color="#CDCDCD"
                      ><v-icon left>mdi-cancel</v-icon>Cancel</v-btn
                    ></v-col
                  >
                  <v-col md="2" class="add-btn" @click="onSubmit()"
                    ><v-btn color="success" height="55" class="fz16"
                      ><v-icon left>mdi-content-save-outline </v-icon>Save
                    </v-btn></v-col
                  >
                </v-row>
              </div>
            </v-card>
            <br />

            <div v-if="isLoad" class="d-flex justify-center">
              <v-progress-circular
                :size="50"
                color="primary"
                indeterminate
              ></v-progress-circular>
            </div>

            <div v-else>
              <v-row v-if="listData.length > 0">
                <v-col
                  v-if="filterItems(listData) == false"
                  class="text-center mt-6 text-h5 mb-4"
                  ><strong>No Matching Site Found</strong></v-col
                >
                <v-col
                  else
                  cols="3"
                  v-for="(row, index) in filterItems(listData)"
                  :key="index"
                >
                  <v-card
                    elevation="1"
                    class="mx-auto"
                    max-width="300"
                    @click="getDetail(row.status, row.id, row.name)"
                  >
                    <v-list-item three-line>
                      <v-list-item-content :title="row.name">
                        <v-list-item-title
                          class="text-sm-h5 mb-1 d-flex justify-center"
                        >
                          {{ row.name }}
                        </v-list-item-title>
                        <v-list-item-title
                          class="text-sm-h6 d-flex justify-center mr-6"
                          v-if="row.status == 'active'"
                        >
                          <v-icon color="green" right class="mr-2"
                            >mdi-check-bold</v-icon
                          >
                          Active
                        </v-list-item-title>
                        <v-list-item-title
                          class="text-sm-h6 d-flex justify-center mr-6"
                          v-else
                        >
                          <v-icon color="yellow" right class="mr-2"
                            >mdi-alert-outline</v-icon
                          >
                          Inactive
                        </v-list-item-title>
                      </v-list-item-content>
                      <div class="btn-menu"  v-if="!read_only">
                        <v-menu bottom left>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn dark icon v-bind="attrs" v-on="on">
                              <v-icon color="black">mdi-dots-vertical</v-icon>
                            </v-btn>
                          </template>

                          <v-list>
                            <!-- <v-list-item>
                              <v-list-item-title @click="onUpdate(row)" class="cursor-pointer"> Update <v-icon color="yellow" dark class="ml-2">mdi-pencil</v-icon></v-list-item-title>
                            </v-list-item> -->
                            <v-list-item>
                              <v-list-item-title
                                @click="onDelete(row)"
                                class="cursor-pointer"
                              >
                                Delete
                                <v-icon color="red" dark class="ml-2"
                                  >mdi-delete</v-icon
                                ></v-list-item-title
                              >
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </div>
                    </v-list-item></v-card
                  >
                </v-col></v-row
              >
              <v-card v-else flat outlined class="rounded-lg">
                <v-col md="12">
                  <v-card
                    flat
                    class="
                      d-flex
                      rounded-lg
                      flex-grow-1 flex-column
                      text-center
                      ma-auto
                    "
                  >
                    <v-card-text>
                      <p
                        style="font-size: 16px; text-transform: capitalize"
                        class="font-weight-bold"
                      >
                        Accelerate and protect your site with Cloudeka
                      </p>
                      <v-row style="justify-content: center" v-if="!read_only">
                        <v-col md="6">
                          <span class="mb-2"
                            >Enter your site (example.com)</span
                          >
                          <v-text-field
                            label="example.com"
                            single-line
                            outlined
                            class="mt-2"
                            v-model="inputSite"
                            :rules="[rule.required]"
                            :error-messages="errorInputSite"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" v-if="role.toLowerCase() !== 'superadmin' && !statusCheckEula" class="pt-0 d-flex justify-center">
                          <div class="d-flex align-center">
                            <v-checkbox v-model="agree" label="By Creating Deka DNS You Agree To The"> </v-checkbox>
                            <span class="text-decoration-underline primary--text ml-2 fz-16 mb-1 font-weight-bold cursor-pointer" @click="getEula()"
                              >Terms of Service</span
                            >
                          </div>
                        </v-col>
                      </v-row>
                      <v-row v-if="!read_only">
                        <v-col>
                          <v-btn
                            v-if="role.toLowerCase() == 'superadmin'"
                            width="100%"
                            append
                            max-width="300"
                            height="50"
                            depressed
                            class="secondary"
                            exact
                            @click="onSubmit()"
                          >
                            Add Site
                          </v-btn>
                          <v-btn
                            v-else-if="statusCheckEula"
                            width="100%"
                            append
                            max-width="300"
                            height="50"
                            depressed
                            class="secondary"
                            exact
                            @click="onSubmit()"
                          >
                            Add Site
                          </v-btn>
                          <v-btn
                            v-else
                            width="100%"
                            append
                            max-width="300"
                            height="50"
                            depressed
                            class="secondary"
                            exact
                            :disabled="!agree"
                            @click="onSubmit()"
                          >
                            Add Site
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-card>
            </div>
            <div v-if="listData.length > 0">
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
                    :disabled="listDataTotal < 10"
                  >
                    <template v-slot:selection="{ item }">
                      1 - {{ item.text }} of {{ listDataTotal }}</template
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
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <dialogDns :show.sync="closeDialog" :detail-dns="dataDns"></dialogDns>
    <dialogDelete
      :close.sync="closeDialogDelete"
      :id-dns="dataDns"
    ></dialogDelete>
  </div>
</template>

<script lang="ts">
import {
  ref,
  computed,
  defineComponent,
  onMounted,
} from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedState,
  useNamespacedGetters,
} from "vuex-composition-helpers";
import dialogDns from "../dns/dialog/dialogDns.vue";
import dialogDelete from "../dns/dialog/dialogDelete.vue";
import customFooterDatatable from "@/modules/customsharedcomponents/custom-footer-datatable.vue";
import { number, string } from "yup/lib/locale";
import { AccessControl } from "@/lib/middleware";
import INSTANCE from "../instance/namespace";
import { suspendValidator } from '../../lib/suspend';
export default defineComponent({
  components: {
    dialogDns,
    dialogDelete,
    customFooterDatatable,
  },
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('DNS'));
    const { validateEula, checkEula } = useNamespacedActions(INSTANCE, ["validateEula", "checkEula"]);
    const { statusCheckEula } = useNamespacedState(INSTANCE, ["statusCheckEula"]);
    const pagination = computed(() => {
      let a = itemSelected.value;
      let b = listDataTotal.value;
      return Math.ceil(b / a);
    });
    onMounted(() => {
      const params = new URLSearchParams();
      params.append("project_id", localStorage.getItem("projectid"));
      params.append("form_name", "Form Create DNS");
      checkEula(params);
      getListData();
    });
    const openDialog = ref(false);
    const page = ref(1);
    const { listData, isLoad, listDataTotal } = useNamespacedGetters("DNS", [
      "listData",
      "isLoad",
      "listDataTotal",
    ]);
    const {
      getListData,
      postCreateDns,
      postAuth,
      postRegister,
      fetchListData,
    } = useNamespacedActions("DNS", [
      "getListData",
      "postCreateDns",
      "postAuth",
      "postRegister",
      "fetchListData",
    ]);
    const {
      validateprivilages,
      validateprivilagesync,
      validateprivilagesyncnew,
    } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
      "validateprivilagesync",
      "validateprivilagesyncnew",
    ]);
    
    const headers = ref([
      { text: "No", value: "id" },
      { text: "Name", value: "type" },
      // { text: "Name", value: "name" },
    ]);
    const showMenu = ref(false);
    const searchQuery = ref("");
    const inputSite = ref("");
    const dataDns = ref({});
    const closeDialog = ref(false);
    const closeDialogDelete = ref(false);
    const role = ref(localStorage.getItem("role"));
    const agree = ref(false);

    const itemsPage = ref([
      { text: "10", value: 10 },
      { text: "20", value: 20 },
      { text: "50", value: 50 },
      { text: "100", value: 100 },
    ]);

    const itemSelected = ref(10);
    const errorInputSite = ref("");

    const rule = ref({
      required: (value: any) => !!value || "Required.",
    });
    function onSubmit() {
      if(inputSite.value && inputSite.value.length < 5) {
        return (errorInputSite.value = "This field should be at least 5 long");
      } else
      if (!inputSite.value) {
        return (errorInputSite.value = "Required.");
      } else {
        errorInputSite.value = ""

        if (!suspendValidator("DNS", "editor", true)) {
          inputSite.value = "";
          showMenu.value = false;

          return;
        }

        const dnsProject = JSON.parse(localStorage.getItem("loginDns") || "{}");
        const formData = {
          name: inputSite.value,
          organization_id: dnsProject.organization_id,
          project_id: dnsProject.project_id,
        };

        postCreateDns(formData);
        if (!statusCheckEula.value && role.value.toLowerCase() !== 'superadmin') {
          const payload = {
            form_name: "Form Create DNS",
            project_id: localStorage.getItem("projectid"),
          };
          validateEula(payload)
        }
        inputSite.value = "";
        showMenu.value = false;
      }
    }
    function show() {
     if (!suspendValidator("DNS", "editor", true)) {
        showMenu.value = false;

        return;
      }

      showMenu.value = true;
    }
    function filterItems(listData: any) {
      return listData.filter(function (listData: any) {
        let regex = new RegExp("(" + searchQuery.value + ")", "i");
        if (listData.name.match(regex) == null) {
          return false;
        } else {
          return listData?.name.match(regex);
        }
      });
    }
    function getDetail(this: any, status: string, id: string, name: string) {
      localStorage.setItem("id_dns", id);
      localStorage.setItem("name_dns", name);
      if (status == "active") {
        this.router.push(`/dns/new-record/${id}/${name}`);
      } else {
        this.router.push(`/dns/create-overview/${id}/${name}`);
      }
    }
    function onPageChange() {
      const count = page.value - 1;
      const params = new URLSearchParams();
      params.append("limit", itemSelected.value.toString());
      params.append("page", count.toString());
      params.append("sort", "created_at");
      fetchListData(params);
    }
    function onUpdate(item: any) {
      closeDialog.value = true;
      dataDns.value = item;
    }

    function onDelete(item: any) {
      dataDns.value = item;
      closeDialogDelete.value = true;
    }
    function onChange(event: any) {
      const params = new URLSearchParams();
      params.append("limit", itemSelected.value.toString());
      params.append("page", "0");
      params.append("sort", "created_at");
      fetchListData(params);
    }
    const getEula = () => {
      const routeData = context.root.$router.resolve({
        name: "eulaContent",
        query: { form_name: "Form Create DNS" },
        path: "/eula-content",
      });
      window.open(routeData.href, "_blank");
    };
    return {
      read_only,
      validateprivilages,
      validateprivilagesync,
      validateprivilagesyncnew,
      inputSite,
      listData,
      headers,
      showMenu,
      show,
      filterItems,
      searchQuery,
      onSubmit,
      getListData,
      postCreateDns,
      postAuth,
      postRegister,
      rule,
      openDialog,
      getDetail,
      isLoad,
      listDataTotal,
      page,
      onPageChange,
      onUpdate,
      onDelete,
      fetchListData,
      closeDialog,
      closeDialogDelete,
      dataDns,
      itemSelected,
      itemsPage,
      onChange,
      pagination,
      errorInputSite,
      role,
      getEula,
      agree,
      statusCheckEula,
      
    };
  },
});
</script>

<style lang="scss" scoped>
.add-btn {
  display: grid;
  justify-content: normal;
}

::v-deep .v-text-field--enclosed .v-input__append-inner {
  margin-top: 15px !important;
}

::v-deep .v-pagination.v-pagination {
  margin-bottom: 10px;
}

.btn-menu {
  margin-bottom: 30px;
  margin-right: -12px;
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

.fz16 {
  font-size: 16px;
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
.v-btn--is-elevated {
  box-shadow: none;
}
</style>