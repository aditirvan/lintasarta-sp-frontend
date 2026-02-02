<template>
  <div>
    <v-card class="rounded-lg elevation-0">
      <v-container class="px-7 py-4" fluid>
        <v-row>
          <v-col>
            <div class="headline font-weight-bold font--text">Create Service</div>
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
              <v-select outlined :items="listProduct" item-text="name" item-value="id" v-model="product" readonly></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text class="pb-0">
          <v-row>
            <v-col sm="12" md="6" class="pt-0 pb-0"
              ><p class="font-weight-bold">Status</p>
              <v-switch v-model="status" inset value="1"></v-switch>
            </v-col>
            <v-col sm="12" md="6" class="pt-0 pb-0"
              ><p class="font-weight-bold">Description</p>
              <v-text-field outlined v-model="description" placeholder="Description"></v-text-field>
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
        <v-card-text class="pb-0" v-if="tagsListService.length == 0">
          <v-row>
            <v-col class="pa-2 ma-2 d-flex justify-center"><p class="font-weight-bold">Data Tags Not Available</p> </v-col>
          </v-row>
        </v-card-text>

        <v-card-text class="pb-0" v-else>
          <v-row>
            <v-col sm="12" md="3" class="pt-0 pb-0"><p class="font-weight-bold">Tags</p> </v-col>
            <v-col sm="12" md="3" class="pt-0 pb-0"><p class="font-weight-bold">Price Per Month</p> </v-col>
            <v-col sm="12" md="3" class="pt-0 pb-0"><p class="font-weight-bold">Price Per Hour</p> </v-col>
            <v-col sm="12" md="3" class="pt-0 pb-0"><p class="font-weight-bold"></p> </v-col>
          </v-row>

          <v-row v-for="(row, index) in tagsListService" :key="index">
            <v-col sm="12" md="3" class="pt-0 pb-0">
              <v-select outlined :items="listTags" item-text="name" item-value="id" :value="row.tag_id" readonly></v-select>
            </v-col>
            <v-col sm="12" md="3" class="pt-0 pb-0">
              <v-text-field outlined :value="toIDRWithDotFormat(row.price_per_month)" readonly></v-text-field>
            </v-col>
            <v-col sm="12" md="3" class="pt-0 pb-0">
              <v-text-field outlined :value="toIDRWithDotFormat(row.price_per_hour)" readonly></v-text-field>
            </v-col>
            <v-col class="pt-0 pb-0">
              <v-btn color="error" height="55" depressed block class="fz-16" @click="onDelete(index)">Delete</v-btn>
              <!-- <v-icon class="mt-2 cursor-pointer" color="red" x-large>mdi-delete</v-icon> -->
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
                :to="`/manage-pricing/detail-product/${$route.params.name}/${$route.params.id}`"
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
    <addTagsService :dialog-closed.sync="dialogAddTags" v-if="dialogAddTags" @get-data="getDataTags($event)" :tags-list="tagsListService"></addTagsService>
  </div>
</template>

<script>
import { onMounted, ref, watch } from "@vue/composition-api";
import { minLength, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { toIDRWithDotFormat } from "@/lib/formatter";
import { SUPERADMINMANAGEPRICING } from "../namespace";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import addTagsService from "./add-tags-service.vue";

export default {
  components: {
    addTagsService,
  },
  setup(props, context) {
    const { getListTags, getListProduct, postCreateService } = useNamespacedActions(SUPERADMINMANAGEPRICING, [
      "getListTags",
      "getListProduct",
      "postCreateService",
    ]);
    const { listProduct, listTags, loadingCreateProduct } = useNamespacedGetters(SUPERADMINMANAGEPRICING, ["listProduct", "listTags", "loadingCreateProduct"]);

    onMounted(() => {
      const params = new URLSearchParams();
      params.append("limit", "20");
      params.append("page", "1");
      params.append("status", "1");
      getListTags(params);
      getListProduct(params);
    });
    const tagsListService = ref([]);
    const name = ref("");
    const status = ref("");
    const description = ref("");
    const product = ref(context.root.$route.params.id);
    const onSubmit = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const statusNew = status.value ? parseInt(status.value) : 0;
      const body = {
        product_id: product.value,
        name: name.value,
        status: statusNew,
        service_tag: tagsListService.value,
        description: description.value,
      };
      const payload = {
        id: context.root.$route.params.id,
        name: context.root.$route.params.name,
        body: body,
      };
      postCreateService(payload);
    };
    const onDelete = (index) => {
      tagsListService.value.splice(index, 1);
    };
    const dialogAddTags = ref(false);
    const getDataTags = (data) => {
      tagsListService.value.push(data);
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
      $v,
      onSubmit,
      listProduct,
      product,
      toIDRWithDotFormat,
      product,
      dialogAddTags,
      getDataTags,
      tagsListService,
      listTags,
      onDelete,
      loadingCreateProduct,
      description,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  position: static;
}
</style>
