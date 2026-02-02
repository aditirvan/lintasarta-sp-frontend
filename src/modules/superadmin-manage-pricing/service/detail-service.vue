<template>
  <div>
    <v-dialog persistent v-model="dialogDetail" max-width="900">
      <v-card class="rounded-lg" flat>
        <v-container fluid class="px-7 py-4">
          <v-card flat outlined class="rounded-lg">
            <v-row
              ><v-col cols="12">
                <v-card-text class="headline font-weight-bold font--text">Detail Service</v-card-text>
                <v-divider></v-divider>
                <v-card-text class="pb-0">
                  <v-row>
                    <v-col sm="12" md="6" class="pt-0 pb-0"
                      ><p class="mb-1">Name</p>
                      <span class="font-weight-bold font--text">{{ dataService.name }}</span>
                    </v-col>
                    <v-col sm="12" md="6" class="pt-0 pb-0"
                      ><p class="mb-1">Product</p>
                      <span class="font-weight-bold font--text">{{ getNameProduct(dataService.id) }}</span>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-text class="pb-0">
                  <v-row>
                    <v-col sm="12" md="6" class="pt-0 pb-0"
                      ><p class="mb-1">Status</p>
                      <span class="font-weight-bold font--text">{{ dataService.status == 1 ? "Active" : "Shutoff" }}</span>
                    </v-col>
                    <v-col sm="12" md="6" class="pt-0 pb-0"
                      ><p class="mb-1">Slug</p>
                      <span class="font-weight-bold font--text">{{ dataService.slug }}</span>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-text class="pb-0">
                  <v-row>
                    <v-col sm="12" md="6" class="pt-0 pb-0"
                      ><p class="mb-1">Description</p>
                      <span class="font-weight-bold font--text">{{ dataService.description ? dataService.description : '-' }}</span>
                    </v-col>
                  </v-row>
                </v-card-text>


                <br />
                <br />
                <v-divider></v-divider>
                <v-card-text class="pb-0" v-if="lengthService == 0">
                  <v-row>
                    <v-col class="pa-2 ma-2 d-flex justify-center"><p class="font-weight-bold">Data Tags Not Available</p> </v-col>
                  </v-row>
                </v-card-text>

                <v-card-text class="pb-0" v-else>
                  <v-row v-for="(row, index) in dataService.service_tag" :key="index">
                    <v-col sm="12" md="4" class="pb-0">
                      <p class="font-weight-bold mb-1">Tags</p>
                      <v-select outlined :items="listTags" item-text="name" item-value="id" :value="row.tag_id" readonly></v-select>
                    </v-col>
                    <v-col sm="12" md="4" class="pb-0">
                      <p class="font-weight-bold mb-1">Price Per Month</p>
                      <v-text-field outlined :value="toIDRWithDotFormat(row.price_per_month)" readonly></v-text-field>
                    </v-col>
                    <v-col sm="12" md="4" class="pb-0" v-if="row.price_per_hour != 0">
                      <p class="font-weight-bold mb-1">Price Per Hour</p>
                      <v-text-field outlined :value="toIDRWithDotFormat(row.price_per_hour)" readonly></v-text-field>
                    </v-col>
                    <v-col class="pb-0">
                      <!-- <v-btn color="error" height="55" depressed block class="fz-16" @click="onDelete(index)">Delete</v-btn> -->
                    </v-col>
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
    dataService: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, context) {
    const { getListTags, getListProduct } = useNamespacedActions(SUPERADMINMANAGEPRICING, ["getListTags", "getListProduct"]);
    const { detailService, loadingDetail, listTags, listProduct } = useNamespacedGetters(SUPERADMINMANAGEPRICING, [
      "detailService",
      "loadingDetail",
      "listTags",
      "listProduct",
    ]);
    onMounted(() => {
      const params = new URLSearchParams();
      params.append("limit", "20");
      params.append("page", "1");
      const params2 = new URLSearchParams();
      params2.append("limit", "999");
      params2.append("page", "1");
      getListTags(params);
      getListProduct(params2);
    });
    const nameProduct = computed(() => {
      return detailService.value.product?.name;
    });
    const lengthService = computed(() => {
      return props.dataService.service_tag?.length;
    });

    const getNameProduct = () => {
      const data = listProduct.value.find((ele) => ele.id == props.dataService.product_id);
      return data.name;
    };

    const onCancel = () => {
      context.emit("update:dialog-detail", false);
    };
    return {
      detailService,
      loadingDetail,
      nameProduct,
      listTags,
      toIDRWithDotFormat,
      lengthService,
      onCancel,
      listProduct,
      getNameProduct,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-select > .v-input__control > .v-input__slot {
  cursor: auto;
}
</style>
