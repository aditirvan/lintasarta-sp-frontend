<template>
  <div>
    <v-card class="rounded-lg elevation-0">
      <v-container class="px-7 py-4" fluid>
        <v-row>
          <v-col>
            <div class="headline font-weight-bold font--text">Edit Item</div>
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
              <v-select outlined :items="listProduct" item-text="name" item-value="id" :value="detailItem.project_id" placeholder="Product" disabled></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text class="pb-0">
          <v-row>
            <v-col sm="12" md="6" class="pt-0 pb-0"
              ><p class="font-weight-bold">Status</p>
              <v-switch v-model="status" inset :true-value="1" :false-value="0"></v-switch>
            </v-col>

            <v-col sm="12" md="6" class="pt-0 pb-0"
              ><p class="font-weight-bold">Service</p>
              <v-select outlined :items="listService" item-text="name" item-value="id" :value="detailItem.service_id" placeholder="Service" disabled></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text class="pb-0">
          <v-row>
            <v-col sm="12" md="6" class="pt-0 pb-0" v-if="listServiceUseFlavor.includes(serviceSlug)">
              <p class="font-weight-bold">Regions</p>
              <v-select
                :items="selectRegions.filter((region) => !detailItem.item_flavor.map((f) => f.flavor.region).includes(region.text))"
                v-model="selected_region"
                item-text="text"
                item-value="text"
                placeholder="Region"
                outlined
                @change="changeFlavor($event)"
                :disabled="!listServiceUseFlavor.includes(serviceSlug)"
              ></v-select>
            </v-col>
            <v-col sm="12" md="6" class="pt-0 pb-0" v-if="listServiceUseFlavor.includes(serviceSlug)"
              ><v-row class="mt-row">
                <v-col md="9"
                  ><p class="font-weight-bold">Flavor</p>
                  <v-select
                    outlined
                    :items="listManageFlavor"
                    item-value="id"
                    v-model="selectFlavor"
                    placeholder="Flavor"
                    return-object
                    :disabled="!selected_region"
                    :error-messages="selectFlavorError() ? 'Flavor spec couldn`t be different.' : ''"
                  >
                    <template v-slot:selection="{ item }"> {{ item.flavor_name }} ({{ item.vcpu }} vCPU, {{ item.ram }} GB RAM) </template>
                    <template v-slot:item="{ item }"> {{ item.flavor_name }} ({{ item.vcpu }} vCPU, {{ item.ram }} GB RAM) </template>
                  </v-select>
                </v-col>
                <v-col md="3"
                  ><p class="font-weight-bold mb-9"></p>
                  <v-btn depressed block height="50" class="secondary" @click="addList()" :disabled="!selectFlavor || selectFlavorError()">Add</v-btn></v-col
                >
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text class="pb-0 pt-0" v-if="dataCountFlavor != 0"
          ><p class="font-weight-bold">List Flavor</p>
          <v-card class="rounded-lg elevation-0" outlined>
            <v-card-text class="pb-0">
              <v-row>
                <v-col sm="12" md="3" class="pt-0 pb-0"><p class="font-weight-bold">Region</p> </v-col>
                <v-col sm="12" md="3" class="pt-0 pb-0"><p class="font-weight-bold">Flavor</p> </v-col>
                <v-col sm="12" md="3" class="pt-0 pb-0"><p class="font-weight-bold"></p> </v-col>
              </v-row>

              <v-row v-for="(row, index) in detailItem.item_flavor" :key="index">
                <v-col sm="12" md="3" class="pt-0 pb-0">
                  <v-text-field outlined :value="row.flavor.region" readonly></v-text-field>
                </v-col>
                <v-col sm="12" md="3" class="pt-0 pb-0">
                  <v-text-field outlined :value="`${row.flavor.flavor_name} (${row.flavor.vcpu} vCPU, ${row.flavor.ram} GB RAM)`" readonly></v-text-field>
                </v-col>
                <v-col sm="12" md="3" class="pt-0 pb-0">
                  <v-btn color="error" height="55" depressed block class="fz-16" @click="onDelete(index)">Delete</v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-card-text>
        <br />
        <br />
        <v-card-text class="headline font-weight-bold font--text">Detail</v-card-text>

        <v-divider></v-divider>
        <v-card-text class="pb-0">
          <v-row>
            <v-col
              ><v-row>
                <v-col sm="12" md="6" v-for="(row, index) in detailItem.item_detail" :key="index"
                  ><p class="font-weight-bold">{{ filterTag(row.service_tag.tag_id) }}</p>
                  <v-text-field outlined placeholder="Size" :value="row.size || ''" disabled></v-text-field>
                  <p>Price :</p>
                  <v-row class="d-flex align-center">
                    <v-col class="pb-0 pt-0" xs="12">
                      <v-text-field 
                        outlined 
                        label="Month" 
                        placeholder="Price Per Month" 
                        type="number"
                        v-model.number="row.total_monthly_price"
                        @input="changePrice(row.id, row.total_monthly_price, 'total_monthly_price')"
                      >
                        {{ row.total_monthly_price }}
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row class="d-flex align-center">
                    <v-col class="pb-0 pt-0" xs="12">
                      <v-text-field 
                        outlined 
                        label="Hour" 
                        placeholder="Price Per Hour" 
                        type="number"
                        v-model.number="row.total_hourly_price"
                        @input="changePrice(row.id, row.total_hourly_price, 'total_hourly_price')"
                      >
                        {{ row.total_hourly_price }}
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row></v-col
            >
          </v-row>
        </v-card-text>

        <br />
        <v-card-text class="pb-0">
          <v-row>
            <v-col>
              <v-btn depressed color="#a5b3bf" class="white--text" block height="50" to="/manage-pricing/items">
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
  </div>
</template>

<script>
import { onMounted, ref, computed } from "@vue/composition-api";
import { minLength, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { toIDRWithDotFormat } from "@/lib/formatter";
import { useRegion } from "@/modules/instance/compositionapi/useregion";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { SUPERADMINMANAGEPRICING } from "../namespace";
import { SUPERADMINMANAGEFLAVOR } from "@/modules/superadmin-manage-flavor/namespace";
export default {
  setup(props, context) {
    const { getListProduct, getListService, updateItem, getDetailItem, getListTags, getListFlavor, getServiceUseFlavor } = useNamespacedActions(
      SUPERADMINMANAGEPRICING,
      ["getListProduct", "getListService", "updateItem", "getDetailItem", "getListTags", "getListFlavor", "getServiceUseFlavor"]
    );
    const { listProduct, listService, setLoadingCreateTags, detailItem, loadingCreateProduct, listTags, listFlavor, listServiceUseFlavor } =
      useNamespacedGetters(SUPERADMINMANAGEPRICING, [
        "listProduct",
        "listService",
        "setLoadingCreateTags",
        "detailItem",
        "loadingCreateProduct",
        "listTags",
        "listFlavor",
        "listServiceUseFlavor",
      ]);
    const { listManageFlavor } = useNamespacedGetters(SUPERADMINMANAGEFLAVOR, ["listManageFlavor"]);
    const { fetchManageInstanceFlavors } = useNamespacedActions(SUPERADMINMANAGEFLAVOR, ["fetchManageInstanceFlavors"]);
    const { selectregions: selectRegions, fetchregions } = useRegion();
    onMounted(async () => {
      const params = new URLSearchParams();
      params.append("limit", "20");
      params.append("page", "1");
      await getDetailItem(context.root.$route.params.id);
      fetchregions();
      getListProduct(params);
      getListService(params);
      getListTags(params);
      getListFlavor(params);
      getServiceUseFlavor();
    });

    const newTags = ref([]);
    const newListFlavors = ref([]);
    const selectFlavor = ref("");
    const dataCountFlavor = computed(() => {
      return detailItem.value.item_flavor?.length;
    });

    const serviceSlug = computed(() => {
      return detailItem.value.service?.slug;
    });

    const name = computed({
      get: () => detailItem.value.name,
      set: (val) => {
        detailItem.value.name = val;
      },
    });

    const status = computed({
      get: () => parseInt(detailItem.value.status),
      set: (val) => {
        detailItem.value.status = val;
      },
    });

    const selected_region = computed({
      get: () => detailItem.value.region,
      set: (val) => {
        detailItem.value.region = val;
      },
    });

    const onSubmit = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      if (detailItem.value.item_flavor.length > 0) {
        newListFlavors.value = detailItem.value.item_flavor.map((item) => {
          return { flavor_id: item.flavor.id, type_id: item.flavor.type_id };
        });
      }

      const params = {
        product_id: detailItem.value.project_id,
        service_id: detailItem.value.service_id,
        name: name.value,
        region: detailItem.value.region,
        status: status.value,
        item_detail: detailItem.value.item_detail,
        flavors: newListFlavors.value,
        gpu: detailItem.value.gpu,
        vcpu: detailItem.value.vcpu,
        ram: detailItem.value.ram,
        root_disk: detailItem.value.root_disk,
      };
      const body = { id: context.root.$route.params.id, body: params };
      updateItem(body);
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

    const filterTag = (row) => {
      const data = listTags.value.find((item) => {
        if (item.id == row) {
          return item;
        }
      });
      return data?.name;
    };

    const onDelete = (index) => {
      detailItem.value.item_flavor.splice(index, 1);
    };

    const changeFlavor = () => {
      const params = new URLSearchParams();
      params.append("limit", "99");
      params.append("page", "1");
      params.append("region", selected_region.value);
      fetchManageInstanceFlavors(params);
    };

    const selectFlavorError = () => {
      if (selectFlavor.value && detailItem.value.item_flavor.length > 0) {
        const data = detailItem.value.item_flavor.filter((f) => f.flavor.vcpu !== selectFlavor.value.vcpu || f.flavor.gpu !== selectFlavor.value.gpu);
        if (data.length > 0) return true;
      }
      return false;
    };

    const addList = () => {
      const dataFlavor = {
        id: "",
        item_id: "",
        flavor_id: "",
        created_at: "",
        updated_at: "",
        deleted_at: null,
        flavor: selectFlavor.value,
      };
      detailItem.value.item_flavor.push(dataFlavor);
      selectFlavor.value = "";
    };

    const changePrice = (id, value, key) => {
      detailItem.item_detail.value.map((item) => {
        if (item.id === id) {
          item[key] = value
        }

        return item
      })
    }

    return {
      name,
      status,
      $v,
      onSubmit,
      listProduct,
      toIDRWithDotFormat,
      listService,
      selectRegions,
      setLoadingCreateTags,
      detailItem,
      loadingCreateProduct,
      filterTag,
      listTags,
      changePrice,
      newTags,
      listFlavor,
      dataCountFlavor,
      selected_region,
      onDelete,
      listManageFlavor,
      changeFlavor,
      selectFlavorError,
      addList,
      selectFlavor,
      listServiceUseFlavor,
      serviceSlug,
      newListFlavors,
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
::v-deep .theme--light.v-input--is-disabled input {
  color: black;
}
.mt-row {
  margin-top: -12px !important;
}
</style>
