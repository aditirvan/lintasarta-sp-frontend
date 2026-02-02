<template>
  <div>
    <v-card class="rounded-lg elevation-0">
      <v-container class="px-7 py-4" fluid>
        <v-row>
          <v-col>
            <div class="headline font-weight-bold font--text">Edit Service</div>
          </v-col>
        </v-row>
        <v-card-text class="pb-0">
          <v-row>
            <v-col sm="12" md="6" class="pt-0 pb-0"
              ><p class="font-weight-bold">Name</p>
              <v-text-field
                outlined
                v-model="name"
                placeholder="Name"
                @blur="$v.name.$touch()"
                :error-messages="$v.name.$errors.length ? $v.name.$errors[0].$message : ''"
              ></v-text-field>
            </v-col>
            <v-col sm="12" md="6" class="pt-0 pb-0"
              ><p class="font-weight-bold">Product</p>
              <v-select outlined :items="listProduct" item-text="name" item-value="id" :value="detailService.product_id" disabled></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text class="pb-0">
          <v-row>
            <v-col sm="12" md="6" class="pt-0 pb-0"
              ><p class="font-weight-bold">Status</p>
              <v-switch v-model="status" inset></v-switch>
            </v-col>
            <v-col sm="12" md="6" class="pt-0 pb-0"
              ><p class="font-weight-bold">Description</p>
              <v-text-field 
                outlined 
                v-model="description" 
                placeholder="Description"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <br />
        <v-row>
          <v-col class="pb-0"><v-card-text class="headline font-weight-bold font--text">Tags</v-card-text></v-col>
          <v-col class="pb-0" md="1"
            ><v-card-text class="headline font-weight-bold font--text d-flex justify-end">
              <v-btn
                class="secondary white--text"
                block
                @click="
                  () => {
                    dialogAddTags = true;
                  }
                "
                ><v-icon color="white">mdi-plus</v-icon></v-btn
              >
            </v-card-text>
          </v-col>
        </v-row>

        <v-divider></v-divider>
        <v-card-text class="pb-0" v-if="serviceLength == 0">
          <v-row>
            <v-col class="pa-2 ma-2 d-flex justify-center"><p class="font-weight-bold">Data Tags Not Available</p> </v-col>
          </v-row>
        </v-card-text>

        <v-card-text class="pb-0" v-else>
          <!-- <v-row>
            <v-col sm="12" md="3" class="pt-0 pb-0"><p class="font-weight-bold">Tags</p> </v-col>
            <v-col sm="12" md="3" class="pt-0 pb-0"><p class="font-weight-bold">Price Per Month</p> </v-col>
            <v-col sm="12" md="3" class="pt-0 pb-0"><p class="font-weight-bold">Price Per Hour</p> </v-col>
            <v-col sm="12" md="3" class="pt-0 pb-0"><p class="font-weight-bold"></p> </v-col>
          </v-row> -->

          <v-row v-for="(row, index) in detailService.service_tag" :key="index">
            <v-col sm="12" md="3" class="pt-0 pb-0">
              <p class="font-weight-bold mb-1">Tags</p>
              <v-select outlined :items="listTags" item-text="name" item-value="id" :value="row.tag_id" readonly></v-select>
            </v-col>
            <v-col sm="12" md="3" class="pt-0 pb-0">
              <p class="font-weight-bold mb-1">Price Per Month</p>
              <v-text-field outlined :value="toIDRWithDotFormat(row.price_per_month)" readonly></v-text-field>
            </v-col>
            <v-col sm="12" md="3" class="pt-0 pb-0" v-if="row.price_per_hour != 0">
              <p class="font-weight-bold mb-1">Price Per Hour</p>
              <v-text-field outlined :value="toIDRWithDotFormat(row.price_per_hour)" readonly></v-text-field>
            </v-col>
            <v-col sm="12" md="3" class="pt-0 pb-0" v-else>
              <!-- <p class="font-weight-bold">Price Per Hour</p>
              <v-text-field outlined :value="toIDRWithDotFormat(row.price_per_hour)" readonly></v-text-field> -->
            </v-col>
            <v-col sm="12" md="3" class="pt-0 pb-0 d-flex align-items-center">
              <!-- <p class="font-weight-bold"></p> -->
              <v-btn color="error" height="55" depressed block class="fz-16 mb-2" @click="onDelete(index)">Delete</v-btn>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text class="pb-0">
          <v-row>
            <v-col>
              <v-btn
                depressed
                color="#a5b3bf"
                class="white--text"
                block
                height="50"
                :to="`/manage-pricing/detail-product/${$route.params.nameProduct}/${$route.params.idProduct}`"
              >
                <span class="fz-16">Cancel</span>
              </v-btn>
            </v-col>

            <v-col cols="6">
              <v-btn depressed block height="50" class="secondary" @click="onSubmit()" :loading="loadingCreateProduct"><span class="fz-16">Submit</span></v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-container>
    </v-card>
    <editTagsService :dialog-closed.sync="dialogAddTags" v-if="dialogAddTags" @get-data="getDataTags($event)"></editTagsService>
  </div>
</template>

<script>
import { onMounted, ref, watch, computed } from "@vue/composition-api";
import { minLength, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { toIDRWithDotFormat } from "@/lib/formatter";
import { SUPERADMINMANAGEPRICING } from "../namespace";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import editTagsService from "./edit-tags-service.vue";

export default {
  components: {
    editTagsService,
  },
  setup(props, context) {
    const { getListTags, getListProduct, updateService, getDetailService } = useNamespacedActions(SUPERADMINMANAGEPRICING, [
      "getListTags",
      "getListProduct",
      "updateService",
      "getDetailService",
    ]);
    const { listProduct, listTags, loadingCreateProduct, detailService } = useNamespacedGetters(SUPERADMINMANAGEPRICING, [
      "listProduct",
      "listTags",
      "loadingCreateProduct",
      "detailService",
    ]);

    onMounted(() => {
      const params = new URLSearchParams();
      params.append("limit", "20");
      params.append("page", "1");
      getDetailService(context.root.$route.params.idService);
      getListTags(params);
      getListProduct(params);
    });

    const name = computed({
      get: () => detailService.value.name,
      set: (val) => {
        detailService.value.name = val;
      },
    });

    const status = computed({
      get: () => detailService.value.status,
      set: (val) => {
        const newStatus = val == true ? 1 : 0;
        detailService.value.status = newStatus;
      },
    });

    const description = computed({
      get: () => detailService.value.description,
      set: (val) => {
        detailService.value.description = val;
      },
    });

    const serviceLength = computed(() => {
      return detailService.value.service_tag?.length;
    });
    const tagsListService = ref([]);
    //     {
    //     "product_id": "c11e6cd9-032d-44c4-a3e8-6c6482234e40",
    //     "service_id": "33430e67-eea1-4a95-bbc4-8f40c9f95a90",
    //     "name": "Item Prod 3",
    //     "region": "Item Prod 3 Region",
    //     "status": 1,
    //     "item_detail": [
    //         {"service_tag_id": "40cfacaa-a6fe-44e7-83c6-78bfa7e91003", "size": 1, "total_monthly_price": 200000, "total_hourly_price": 2000},
    //         {"service_tag_id": "35651c78-d86e-4ae0-8c8f-7a570dbcc1e3", "size": 1, "total_monthly_price": 800000, "total_hourly_price": 8000}
    //     ]
    // }
    const onSubmit = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const newData = detailService.value.service_tag.map((item) => {
        return {
          tag_id: item.tag_id,
          price_per_month: item.price_per_month,
          price_per_hour: item.price_per_hour,
          id: item.id,
        };
      });
      const body = {
        name: name.value,
        status: status.value,
        description: description.value,
        service_tag: newData,
      };
      const params = {
        idProduct: context.root.$route.params.idProduct,
        nameProduct: context.root.$route.params.nameProduct,
        service_id: detailService.value.id,
      };
      const payload = {
        body: body,
        params: params,
      };
      updateService(payload);
    };
    const onDelete = (index) => {
      detailService.value.service_tag.splice(index, 1);
    };
    const dialogAddTags = ref(false);
    const getDataTags = (data) => {
      detailService.value.service_tag.push(data);
    };

    const $v = useVuelidate(
      {
        name: {
          required: helpers.withMessage("Name couldnt be empty.", (val) => {
            return val;
          }),
          minLength: minLength(3),
        },
      },
      {
        name,
      }
    );
    return {
      name,
      status,
      description,
      $v,
      onSubmit,
      listProduct,
      toIDRWithDotFormat,
      dialogAddTags,
      getDataTags,
      tagsListService,
      listTags,
      onDelete,
      loadingCreateProduct,
      detailService,
      serviceLength,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  position: static;
}
::v-deep .theme--light.v-select .v-select__selection--disabled {
  color: black;
}
</style>
