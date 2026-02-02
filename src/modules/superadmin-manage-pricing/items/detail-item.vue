<template>
  <div>
    <v-dialog persistent v-model="dialogDetail" max-width="900">
      <v-card flat>
        <v-container fluid class="px-7 py-4">
          <v-card flat outlined>
            <v-row
              ><v-col cols="12">
                <v-card-text class="headline font-weight-bold font--text">Detail Item</v-card-text>
                <v-divider></v-divider>
                <v-card-text class="pb-0">
                  <v-row>
                    <v-col sm="12" md="6" class="pt-0 pb-0"
                      ><p class="mb-1">Name</p>
                      <span class="font-weight-bold font--text">{{ detailItem.name }}</span>
                    </v-col>
                    <v-col sm="12" md="6" class="pt-0 pb-0"
                      ><p class="mb-1">Product</p>
                      <span class="font-weight-bold font--text">{{ productName }}</span>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-text class="pb-0">
                  <v-row>
                    <v-col sm="12" md="6" class="pt-0 pb-0"
                      ><p class="mb-1">Status</p>
                      <span class="font-weight-bold font--text">{{ detailItem.status == 1 ? "Active" : "Shutoff" }}</span>
                    </v-col>
                    <v-col sm="12" md="6" class="pt-0 pb-0"
                      ><p class="mb-1">Service</p>
                      <span class="font-weight-bold font--text">{{ serviceName }}</span>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-text class="pb-0" v-if="detailItem.description">
                  <v-row>
                    <v-col sm="12" md="6" class="pt-0 pb-0"
                      ><p class="mb-1">Description</p>
                      <span class="font-weight-bold font--text">{{ detailItem.description }}</span>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-text class="pb-0" v-if="dataCountFlavor != 0">
                  <v-row>
                    <v-col class="pt-0 pb-0">
                      <p class="mb-3">List Flavor</p>
                      <v-data-table :headers="headers" :items="detailItem.item_flavor" item-key="id" single-line class="elevation-0" hide-default-footer>
                        <template #[`item.name`]="{ item }">
                          <span>{{ item.flavor.flavor_name || "-" }}</span>
                        </template>
                        <template #[`item.type`]="{ item }">
                          <span>{{ item.flavor.type.name || "-" }}</span>
                        </template>
                        <template #[`item.region`]="{ item }">
                          <span>{{ item.flavor.region || "-" }}</span>
                        </template>
                        <template #[`item.vcpu`]="{ item }">
                          <span>{{ item.flavor.vcpu || "-" }} vCPU</span>
                        </template>
                        <template #[`item.ram`]="{ item }">
                          <span>{{ item.flavor.ram || "-" }} GB</span>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                </v-card-text>
                <br />
                <br />
                <v-card-text class="headline font-weight-bold font--text">Detail</v-card-text>

                <v-divider></v-divider>
                <v-card-text class="pb-0">
                  <v-row>
                    <v-col
                      ><v-row v-if="detailItem">
                        <v-col class="pt-0 pb-0">
                          <v-data-table
                            :headers="headersDetail"
                            :items="detailItem.item_detail"
                            item-key="id"
                            single-line
                            class="elevation-0"
                            hide-default-footer
                          >
                            <template #[`item.size`]="{ item }">
                              <span>{{ `${item.size} ${item.service_tag.tag.name}` }}</span>
                            </template>
                            <template #[`item.parameter`]="{ item }">
                              <span>{{ item.service_tag.tag.unit || "-" }}</span>
                            </template>
                            <template #[`item.price`]="{ item }">
                              <p class="mb-0">{{ toIDRWithDotFormat(item.total_monthly_price) || "-" }}/Month</p>
                              <p class="mb-0">{{ toIDRWithDotFormat(item.total_hourly_price) || "-" }}/Hour</p>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row></v-col
                    >
                  </v-row>
                </v-card-text>
                <br />
                <br />
                <v-card-text class="pb-0">
                  <v-row>
                    <v-col cols="6">
                      <v-btn depressed color="#a5b3bf" class="white--text" block height="50" @click="onCancel()">
                        <span class="fz-16">Back</span>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-col>
            </v-row>
          </v-card>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { SUPERADMINMANAGEPRICING } from "../namespace";
import { toIDRWithDotFormat } from "@/lib/formatter";

export default {
  props: {
    dialogDetail: {
      type: Boolean,
      default: false,
    },
    dataItem: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, context) {
    const { getDetailItem, getListTags } = useNamespacedActions(SUPERADMINMANAGEPRICING, ["getDetailItem", "getListTags"]);
    const { detailItem, loadingDetail, listTags } = useNamespacedGetters(SUPERADMINMANAGEPRICING, ["detailItem", "loadingDetail", "listTags"]);
    onMounted(() => {
      const params = new URLSearchParams();
      params.append("limit", "20");
      params.append("page", "1");
      getDetailItem(props.dataItem.id);
      getListTags(params);
    });
    const productName = computed(() => {
      return detailItem.value.product?.name;
    });
    const serviceName = computed(() => {
      return detailItem.value.service?.name;
    });
    const dataCountFlavor = computed(() => {
      return detailItem.value.item_flavor?.length;
    });

    const filterTag = (row) => {
      const data = listTags.value.find((item) => {
        if (item.id == row) {
          return item;
        }
      });
      return data?.name;
    };

    const headers = ref([
      { text: "Flavor Name", value: "name", sortable: false },
      { text: "Type", value: "type", sortable: false },
      { text: "Region", value: "region", sortable: false },
      { text: "vCPU", value: "vcpu", sortable: false },
      { text: "RAM", value: "ram", sortable: false },
    ]);
    const headersDetail = ref([
      { text: "Size", value: "size", sortable: false },
      { text: "Parameter", value: "parameter", sortable: false },
      { text: "Price", value: "price", sortable: false },
    ]);

    const onCancel = () => {
      context.emit("update:dialog-detail", false);
    };

    return {
      detailItem,
      loadingDetail,
      productName,
      serviceName,
      filterTag,
      listTags,
      toIDRWithDotFormat,
      dataCountFlavor,
      onCancel,
      headers,
      headersDetail,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .theme--light.v-input--is-disabled input,
.theme--light.v-input--is-disabled textarea {
  color: black;
}
::v-deep .theme--light.v-select .v-select__selection--disabled {
  color: black;
}
</style>
