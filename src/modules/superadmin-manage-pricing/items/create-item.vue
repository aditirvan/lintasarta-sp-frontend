<template>
  <div>
    <v-card class="rounded-lg elevation-0">
      <v-container class="px-7 py-4" fluid>
        <v-row>
          <v-col>
            <div class="headline font-weight-bold font--text">Create Item {{ serviceName }}</div>
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
              <v-combobox
                outlined
                :items="listProduct"
                item-text="name"
                item-value="id"
                v-model="product"
                placeholder="Product"
                @change="dataProduct($event)"
                return-object
                @blur="$v.product.$touch()"
                :error-messages="$v.product.$errors.length ? $v.product.$errors[0].$message : ''"
                :search-input.sync="searchProduct"
                clearable
              ></v-combobox>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text class="pb-0">
          <v-row>
            <v-col sm="12" md="6" class="pt-0 pb-0"
              ><p class="font-weight-bold">Status</p>
              <v-switch v-model="status" inset :true-value="1" :false-value="0"></v-switch>
            </v-col>

            <v-col sm="12" md="6" class="pt-0 pb-0" v-if="productName"
              ><p class="font-weight-bold">Service</p>
              <v-combobox
                outlined
                :items="listServiceProduct"
                item-text="name"
                item-value="item"
                v-model="service"
                @change="dataDetail($event)"
                placeholder="Service"
                return-object
                @blur="$v.service.$touch()"
                :error-messages="$v.service.$errors.length ? $v.service.$errors[0].$message : ''"
                :search-input.sync="searchService"
              ></v-combobox>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text class="pb-0">
          <v-row>
            <v-col sm="12" md="6" class="pt-0 pb-0">
              <v-row class="mt-row">
                <v-col md="3" v-if="listServiceUseFlavor.includes(service.slug)">
                  <p class="font-weight-bold">Link to Flavor</p>
                  <v-checkbox v-model="linkFlavor"></v-checkbox
                ></v-col>
                <v-col
                  :md="listServiceUseFlavor.includes(service.slug) ? '9' : '12'"
                  v-if="listServiceUseFlavor.includes(service.slug) || linkFlavor"
                >
                  <p class="font-weight-bold">Regions</p>
                  <v-select
                    :items="selectRegions.filter((region) => !dataListFlavor.map((f) => f.region).includes(region.text))"
                    v-model="selected_region"
                    placeholder="Region"
                    outlined
                    @change="changeFlavor($event)"
                  />
                </v-col>
              </v-row>
            </v-col>

            <v-col sm="12" md="6" class="pt-0 pb-0" v-if="listServiceUseFlavor.includes(service.slug) && selected_region && linkFlavor"
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
            <v-col sm="12" md="6" class="pt-0 pb-0" v-if="productName == 'deka-storage'"
              ><p class="font-weight-bold">Description</p>
              <v-text-field outlined v-model="description" placeholder="Description"></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text class="pb-0" v-if="dataListFlavor.length != 0 && linkFlavor"
          ><p class="font-weight-bold">List Flavor</p>
          <v-card flat outlined class="rounded-lg elevation-0">
            <v-card-text class="pb-0">
              <v-row>
                <v-col sm="12" md="3" class="pt-0 pb-0"><p class="font-weight-bold">Region</p> </v-col>
                <v-col sm="12" md="3" class="pt-0 pb-0"><p class="font-weight-bold">Flavor</p> </v-col>
                <v-col sm="12" md="3" class="pt-0 pb-0"><p class="font-weight-bold"></p> </v-col>
              </v-row>

              <v-row v-for="(row, index) in dataListFlavor" :key="index">
                <v-col sm="12" md="3" class="pt-0 pb-0">
                  <v-text-field outlined :value="row.region" readonly></v-text-field>
                </v-col>
                <v-col sm="12" md="3" class="pt-0 pb-0">
                  <v-text-field outlined :value="`${row.flavor_name} (${row.vcpu} vCPU, ${row.ram} GB RAM)`" readonly></v-text-field>
                </v-col>
                <v-col sm="12" md="3" class="pt-0 pb-0">
                  <v-btn color="error" height="55" depressed block class="fz-16" @click="onDelete(index)">Delete</v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-card-text>

        <br />

        <v-card-text class="headline font-weight-bold font--text" v-if="service">Detail</v-card-text>

        <v-divider v-if="service"></v-divider>
        <v-card-text class="pb-0" v-if="service">
          <v-row>
            <v-col
              ><v-row v-if="detailServiceTag">
                <v-col sm="12" md="6" v-for="(row, index) in detailServiceTag" :key="index"
                  ><p class="font-weight-bold">{{ filterTag(row.tag_id) }}</p>
                  <v-text-field
                    outlined
                    placeholder="Size"
                    @input="inputSize($event, row.tag_id)"
                    onkeypress="return (event.charCode >= 48 && event.charCode <= 57)"
                  ></v-text-field>
                  <p>Price :</p>
                  <v-row class="d-flex align-center">
                    <v-col class="pb-0 pt-0" xs="12">
                      <v-text-field 
                        outlined 
                        label="Month" 
                        placeholder="Price Per Month" 
                        type="number"
                        v-model.number="detailServiceTag[index].price_per_month"
                        @input="changePrice(detailServiceTag[index].id, detailServiceTag[index].price_per_month, 'total_monthly_price')"
                      >
                        {{ row.price_per_month }}
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
                        v-model.number="detailServiceTag[index].price_per_hour"
                        @input="changePrice(detailServiceTag[index].id, detailServiceTag[index].price_per_hour, 'total_hourly_price')"
                      >
                        {{ row.price_per_hour }}
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row></v-col
            >
          </v-row>
        </v-card-text>

        <v-card-text class="pb-0">
          <v-row>
            <v-col sm="12" md="6">
              <v-btn depressed color="#a5b3bf" class="white--text" block height="50" to="/manage-pricing/items">
                <span class="fz-16">Cancel</span>
              </v-btn>
            </v-col>

            <v-col sm="12" md="6">
              <v-btn depressed block height="50" class="secondary" @click="onSubmit()" :loading="loadingCreateTags"><span class="fz-16">Submit</span></v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-container>
    </v-card>
    <AddSize :dialog-closed.sync="dialogAddSize" v-if="dialogAddSize" :data-create="dataCreate"></AddSize>
    <DialogError :dialog-error.sync="errorTags" v-if="errorTags"></DialogError>
  </div>
</template>

<script>
import { onMounted, ref, watch } from "@vue/composition-api";
import { minLength, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { toIDRWithDotFormat } from "@/lib/formatter";
import { useRegion } from "@/modules/instance/compositionapi/useregion";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { SUPERADMINMANAGEPRICING } from "../namespace";
import AddSize from "./add-size.vue";
import DialogError from "./dialog-error.vue";
import { SUPERADMINMANAGEFLAVOR } from "@/modules/superadmin-manage-flavor/namespace";
export default {
  components: {
    AddSize,
    DialogError,
  },
  setup(props, context) {
    const {
      getListProduct,
      getListService,
      postCreateItem,
      getDetaiServiceTag,
      getListTags,
      getDefaultServiceTag,
      getDetailProduct,
      getListServiceProduct,
      getListFlavor,
      getServiceUseFlavor,
    } = useNamespacedActions(SUPERADMINMANAGEPRICING, [
      "getListProduct",
      "getListService",
      "postCreateItem",
      "getDetaiServiceTag",
      "getListTags",
      "getDefaultServiceTag",
      "getDetailProduct",
      "getListServiceProduct",
      "getListFlavor",
      "getServiceUseFlavor",
    ]);
    const {
      listProduct,
      listService,
      loadingCreateTags,
      detailServiceTag,
      listTags,
      defaultServiceTag,
      detailProduct,
      listServiceProduct,
      listFlavor,
      listServiceUseFlavor,
    } = useNamespacedGetters(SUPERADMINMANAGEPRICING, [
      "listProduct",
      "listService",
      "loadingCreateTags",
      "detailServiceTag",
      "listTags",
      "defaultServiceTag",
      "detailProduct",
      "listServiceProduct",
      "listFlavor",
      "listServiceUseFlavor",
    ]);
    const { selectregionsbystatus: selectRegions, fetchregionbystatus } = useRegion();
    const { fetchManageInstanceFlavors } = useNamespacedActions(SUPERADMINMANAGEFLAVOR, ["fetchManageInstanceFlavors"]);
    const { listManageFlavor } = useNamespacedGetters(SUPERADMINMANAGEFLAVOR, ["listManageFlavor"]);
    onMounted(() => {
      const params = new URLSearchParams();
      params.append("limit", "10");
      params.append("page", "1");
      params.append("status", "1");
      params.append("allow_item", true);
      fetchregionbystatus();
      getListProduct(params);
      getListService(params);
      getListTags(params);
      getListFlavor(params);
      getServiceUseFlavor();
    });

    const linkFlavor = ref(false);
    const searchFlavor = ref("");
    const searchProduct = ref("");
    const searchService = ref("");
    const errorRegion = ref("");
    const errorFlavor = ref("");
    const tagsDetail = ref("");
    const errorTags = ref(false);
    const dataCreate = ref({});
    const dialogAddSize = ref(false);
    const errorSize = ref("");
    const new_tag = ref([]);
    const newTags = ref([]);
    const idService = ref("");
    const name = ref("");
    const totalPrice = ref("");
    const selected_region = ref("");
    const status = ref(0);
    const product = ref("");
    const service = ref("");
    const flavorType = ref("");
    const selectFlavor = ref("");
    const productName = ref("");
    const serviceName = ref("");
    const ram = ref("");
    const root_disk = ref("");
    const gpu = ref("");
    const vcpu = ref("");
    const description = ref("");
    const dataListFlavor = ref([]);
    const newList = ref([]);

    const onSubmit = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;

      if (newTags.value.length == 0) {
        errorTags.value = true;
      } else {
        const newMeta = newTags.value.every((item) => item.size);
        if (newMeta == true) {
          if (dataListFlavor.value.length != 0) {
            newList.value = dataListFlavor.value.map((item) => {
              return { flavor_id: item.id, type_id: item.type_id };
            });
          }
          const params = {
            product_id: product.value.id,
            service_id: service.value.id,
            service_name: service.value.name,
            name: name.value,
            region: selected_region.value.name ? selected_region.value.name : "",
            status: status.value,
            item_detail: newTags.value,
            ram: ram.value ? ram.value.size : null,
            root_disk: root_disk.value ? root_disk.value.size : null,
            vcpu: vcpu.value ? vcpu.value.size : null,
            gpu: gpu.value ? gpu.value.size : null,
            description: description.value,
          };
          if (dataListFlavor.value.length != 0) params.flavors = newList.value;
          if (dataListFlavor.value.length != 0) params.is_flavor = linkFlavor.value;
          postCreateItem(params);
        } else {
          errorTags.value = true;
        }
      }
    };

    const $v = useVuelidate(
      {
        name: {
          required: helpers.withMessage("Name couldnt be empty.", (val) => {
            return val;
          }),
          minLength: minLength(3),
        },
        product: {
          required: helpers.withMessage("Product couldnt be empty.", (val) => {
            return val;
          }),
        },
        service: {
          required: helpers.withMessage("Service couldnt be empty.", (val) => {
            return val;
          }),
        },
      },
      {
        name,
        product,
        service,
      }
    );

    const dataDetail = (item) => {
      if (item.id) {
        idService.value = item.id;
        serviceName.value = item.slug;
        getDetaiServiceTag({ id: item.id, status: true });
        getDefaultServiceTag(item.id);
      }
    };
    const dataProduct = (item) => {
      const tipe = typeof item;
      if (tipe == "object" && item) {
        productName.value = item.slug;
        const params = new URLSearchParams();
        params.append("limit", "10");
        params.append("page", "1");
        params.append("status", "1");
        const payload = { id: item.id, params: params };
        getDetailProduct(item.id);
        getListServiceProduct(payload);
      } else {
        return;
      }
    };
    const filterTag = (row) => {
      const data = listTags.value.find((item) => {
        if (item.id == row) {
          return item;
        }
      });
      return data?.name;
    };

    const inputSize = (event, i) => {
      const event1 = parseInt(event);
      const harga = defaultServiceTag.value.find((item) => item.tag_id == i);

      detailServiceTag.value.find((item) => {
        if (item.tag_id == i) {
          return (
            (item.price_per_month = event ? harga.price_per_month * event1 : harga.price_per_month),
            (item.price_per_hour = event ? harga.price_per_hour * event1 : harga.price_per_hour),
            (item.size = event1)
          );
        }
      });

      newTags.value = detailServiceTag.value.map((item) => {
        return {
          service_tag_id: item.id,
          total_monthly_price: item.price_per_month,
          total_hourly_price: item.price_per_hour,
          size: item.size,
          service_tag_name_id: item.tag_id,
        };
      });
      if (newTags.value) {
        const newData = newTags.value.map((item) => {
          return {
            service_tag_id: item.service_tag_id,
            total_monthly_price: item.total_monthly_price,
            total_hourly_price: item.total_hourly_price,
            size: item.size,
            service_tag_name: filterTag(item.service_tag_name_id),
          };
        });
        if (newData) {
          ram.value = newData.find((item) => item.service_tag_name.toLowerCase() == "ram");
          root_disk.value = newData.find((item) => item.service_tag_name.toLowerCase().replace(" ", "") == "rootdisk");
          gpu.value = newData.find((item) => item.service_tag_name.toLowerCase() == "gpu");
          vcpu.value = newData.find((item) => item.service_tag_name.toLowerCase() == "vcpu");
        }
      }
    };

    const changePrice = (id, value, key) => {
      newTags.value.map((item) => {
        if (item.service_tag_id === id) {
          item[key] = value
        }

        return item
      })
    }

    const changeFlavor = () => {
      if (listServiceUseFlavor.value.includes(serviceName.value)) {
        const params = new URLSearchParams();
        params.append("limit", "99");
        params.append("page", "1");
        params.append("region", selected_region.value.name);
        fetchManageInstanceFlavors(params);
      } else {
        return;
      }
    };

    const addList = () => {
      dataListFlavor.value.push(selectFlavor.value);
      selectFlavor.value = "";
    };

    const onDelete = (index) => {
      dataListFlavor.value.splice(index, 1);
    };

    watch(searchProduct, () => {
      const params = new URLSearchParams();
      params.append("limit", "10");
      params.append("page", "1");
      params.append("status", "1");
      params.append("allow_item", true);
      params.append("search", searchProduct.value ? searchProduct.value : "");
      getListProduct(params);
    });

    watch(searchService, () => {
      const params = new URLSearchParams();
      params.append("limit", "10");
      params.append("page", "1");
      params.append("status", "1");
      params.append("search", searchService.value ? searchService.value : "");
      if (product.value) {
        const payload = { id: product.value.id, params: params };
        getListServiceProduct(payload);
      }
    });

    watch(linkFlavor, () => {
      if (!linkFlavor.value) {
        dataListFlavor.value = [];
      }
    });

    watch(product, () => {
      if (!product.value) {
        service.value = "";
      }
    });

    const selectFlavorError = () => {
      if (selectFlavor.value && dataListFlavor.value.length > 0) {
        const dif = dataListFlavor.value.filter((f) => f.vcpu !== selectFlavor.value.vcpu || f.gpu !== selectFlavor.value.gpu);
        if (dif.length > 0) return true;
      }
      return false;
    };

    return {
      name,
      status,
      onSubmit,
      listProduct,
      product,
      toIDRWithDotFormat,
      listService,
      service,
      selectRegions,
      selected_region,
      loadingCreateTags,
      detailServiceTag,
      dataDetail,
      totalPrice,
      listTags,
      filterTag,
      inputSize,
      changePrice,
      newTags,
      idService,
      new_tag,
      errorSize,
      dialogAddSize,
      dataCreate,
      defaultServiceTag,
      detailProduct,
      dataProduct,
      listServiceProduct,
      flavorType,
      selectFlavor,
      errorTags,
      tagsDetail,
      listFlavor,
      productName,
      serviceName,
      errorRegion,
      errorFlavor,
      $v,
      ram,
      root_disk,
      gpu,
      vcpu,
      searchProduct,
      searchService,
      searchFlavor,
      description,
      listServiceUseFlavor,
      listManageFlavor,
      changeFlavor,
      addList,
      dataListFlavor,
      onDelete,
      newList,
      linkFlavor,
      selectFlavorError,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  position: static;
}

.bd-tags {
  border: solid 1px #00000040;
  border-radius: 10px;
}

.col-6 {
  flex: 0 0 47%;
  max-width: 47%;
}

.mt-row {
  margin-top: -12px !important;
}
</style>
