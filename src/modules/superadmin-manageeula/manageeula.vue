<template>
  <v-container fluid class="px-0 pt-3">
    <v-card flat class="rounded-lg pa-7">
      <v-row>
        <v-col class="d-flex flex-row align-center">
          <p class="fz-21 font-weight-bold mb-0">Manage EULA</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table
            :loading="loading"
            hide-default-footer
            :items="tblItems"
            :items-per-page="10"
            :headers="tblHeaders"
            :server-items-length="total"
            :options.sync="options"
            :customsort="customSort2"
          >
            <template v-slot:item.content="{ item }">
              <!-- <div
                v-if="
                  item.content !== null ||
                    item.content !== '' ||
                    typeof item.content !== undefined ||
                    typeof item.content !== null
                "
              >
                {{ item.content.slice(0, 20) }} ....
              </div>
              <div v-else>
                -
              </div> -->
              <div
                style="
 width: 200px;
 overflow: hidden;
 text-overflow: ellipsis;
 white-space: nowrap;
  display: inline-block;"
              >
                {{ item.content }}
              </div>
            </template>
            <template v-slot:item.action="{ item }">
              <v-btn text @click="
                if(read_only){
                  return
                }
                pindah(item.id, item.form_name)
              ">
                <span class="primary--text" :style="[read_only ? {'color': '#a9a9a9 !important'} : {}]">Edit</span>
              </v-btn>
            </template>
            <!-- pagination -->
            <template v-slot:footer="{ props }">
              <custom-footer-datatable
                @input="
                  val => {
                    options = { ...options, ...val };
                  }
                "
                :props="props"
              />
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import api from "@/lib/api";
import { ref } from "@vue/composition-api";
import { AccessControl } from "@/lib/middleware";

export default {
  components: {},
  setup(props, context){
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Manage EULA'));
    return {
      read_only
    }
  },
  data() {
    return {
      loading: false,
      tblHeaders: [
        { text: "Form Name", value: "form_name", sortable: true },
        { text: "Content", value: "content", sortable: false },
        { text: "Last Edit", value: "last_edit", sortable: true },
        { text: "Action", sortable: false, value: "action", align: "center" }
      ],
      tblItems: [],
      total: 0,
      // pagination: {
      //   count: 0,
      //   page: 1,
      //   totalpage: 1,
      //   itemsPerPage: 10,
      //   sortBy: [],
      //   sortDesc: []
      // },
      options: {}
    };
  },

  watch: {
    // pagination(newVal, oldVal) {
    //   this.getEula(newVal.page);
    // },
    options: {
      handler() {
        this.getEula();
      },
      deep: true
    }
  },
  methods: {
    customSort2(items, index, isDescending) {
      console.log(items, index, isDescending);
    },
    pindah(x, y) {
      this.$store.commit("MANAGEEULA/setIdEula", x);
      this.router.push({ path: "/eula-detail/" + y });
    },
    async getEula() {
      this.loading = true;
      try {
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;
        var res;
        var sort_Desc;
        if (sortBy.length === 0) {
          res = await api.POST("/superadmin/eula", {
            page: page,
            limit: itemsPerPage
          });
          this.tblItems = res.data;
          this.total = res.count;
          this.loading = false;
        } else {
          if (sortDesc[0] === false) {
            sort_Desc = "asc";
          } else {
            sort_Desc = "desc";
          }
          if (sortBy[0] === "form_name") {
            res = await api.POST("/superadmin/eula", {
              page: page,
              limit: itemsPerPage,
              is_name: "1",
              order_by: sort_Desc
            });
            this.tblItems = res.data;
            this.total = res.count;
            this.loading = false;
          }
          if (sortBy[0] === "last_edit") {
            res = await api.POST("/superadmin/eula", {
              page: page,
              limit: itemsPerPage,
              is_last_edit: "1",
              order_by: sort_Desc
            });
            this.tblItems = res.data;
            this.total = res.count;
            this.loading = false;
          }
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    }
  }
};
</script>
