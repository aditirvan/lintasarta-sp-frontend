<template>
  <div>
    <v-row>
      <v-col cols="12" class="py-0">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-7">
            <v-row class="d-flex align-center">
              <v-col cols="9">
                <div class="headline font-weight-bold font--text">
                  Deka Pop Usage Meter
                </div>
              </v-col>
              <v-col cols="3" class="text-right">
                <v-text-field
                  v-model="search"
                  label="Search"
                  outlined
                  dense
                  hide-details
                  clearable
                  @input="applySearch"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="12">
                <v-data-table
                  class="mb-5"
                  :items="filteredList"
                  :headers="headersPop"
                  item-key="id"
                  hide-default-footer
                  :server-items-length="totalRowsPop"
                >
                  <template #[`item.action`]="{ item }">
                    <popupquote
                      v-model="popo"
                      :offsetTop="20"
                      :coordinate="coordinate"
                      :documentid="'popup' + item.UsageMeterID"
                      offset-y
                      allow-overflow
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <label
                          v-bind="attrs"
                          class="primary--text linkpointer"
                          style="position: relative; white-space: nowrap"
                          @click="
                            ($event) => {
                              on.click($event);
                              show($event, item);
                            }
                          "
                          >More
                          <v-icon
                            :class="{
                              rotate:
                                item.UsageMeterID == activemenuinstance && popo,
                            }"
                            :id="'popup' + item.UsageMeterID"
                            color="primary"
                            >mdi-chevron-down</v-icon
                          >
                        </label>
                      </template>
                      <v-list class="cursor-pointer font-weight-bold">
                        <v-list-item>
                          <v-list-item-title>
                            <span class="primary--text">
                              <router-link
                                :to="`dekapop-list/detail/${item.UsageMeterID}`"
                                >Details</router-link
                              >
                            </span>
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </popupquote>
                  </template>
                  <template v-slot:footer="{ props }">
                    <custom-footer-datatable
                      @input="
                        (val) => {
                          changePage(val);
                        }
                      "
                      :props="props"
                    />
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { onMounted, ref, computed, reactive } from "@vue/composition-api";
import { POP } from "./namespace";
import {
  useNamespacedActions,
  useNamespacedGetters,
} from "vuex-composition-helpers";
import { AccessControl } from "@/lib/middleware";

export default {
  components: {},
  setup(props, context) {
    const { getListUsageMonthly } = useNamespacedActions(POP, [
      "getListUsageMonthly",
    ]);
    const { listMonthly, totalRowsPop } = useNamespacedGetters(POP, [
      "listMonthly",
      "totalRowsPop",
    ]);
    const currentProj = ref(JSON.parse(localStorage.getItem("currentProj")));
    const role = ref(localStorage.getItem("role"));
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode("Deka POP"));
    const search = ref("");

    const filteredList = computed(() => {
      return listMonthly.value.filter((item) =>
        item.UsageMeterName.toLowerCase().includes(search.value.toLowerCase())
      );
    });

    const applySearch = () => {
      console.log("Searching for:", search.value);
    };

    const expanded = ref([]);
    const singleExpand = ref(true);
    const popo = ref(false);
    const coordinate = reactive({ x: 0, y: 0 });
    const showMenu1 = ref(false);
    const activemenuinstance = ref({});
    const openDialog = ref(false);
    const dataItem = ref("");

    const show = (e, instance) => {
      e.preventDefault();
      activemenuinstance.value = instance.id;
      showMenu1.value = false;
      coordinate.x = e.clientX - 20;
      coordinate.y = e.clientY + 10;
      context.root.$nextTick(() => {
        showMenu1.value = true;
      });
    };

    const headersPop = ref([
      { text: "Usage Meter Name", value: "UsageMeterName", sortable: false },
      { text: "Last Synch", value: "CreatedAtFormatted", sortable: false },
      {
        text: "Action",
        sortable: false,
        align: "center",
        value: "action",
        width: "5%",
      },
    ]);

    onMounted(async () => {
      const params = new URLSearchParams();
      params.append("limit", "10");
      params.append("page", "1");
      params.append("sort", "created_at desc");
      await getListUsageMonthly(params);
    });

    const changePage = async (val) => {
      console.log("change page ", val);
      const params = new URLSearchParams();
      params.append("projectId", currentProj.value.id);
      params.append("limit", val.itemsPerPage);
      params.append("page", val.page);
      params.append("sort", "created_at desc");
      await getListUsageMonthly(params);
    };

    return {
      headersPop,
      listMonthly,
      filteredList,
      search,
      applySearch,
      expanded,
      singleExpand,
      changePage,
      popo,
      coordinate,
      show,
      showMenu1,
      activemenuinstance,
      role,
      openDialog,
      dataItem,
      totalRowsPop,
      read_only,
    };
  },
};
</script>
