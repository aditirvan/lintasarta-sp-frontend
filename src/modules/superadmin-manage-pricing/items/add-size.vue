<template>
  <div>
    <v-dialog persistent v-model="dialogClosed" max-width="600">
      <v-card class="pt-5 rounded-lg">
        <v-card-text class="pb-3">
          <v-row>
            <v-col><p class="fz-18 font-weight-bold mb-0">Add Size</p></v-col>
            <!-- <v-col class="d-flex justify-end"
                ><span class="cursor-pointer" @click="onCancel()"><v-icon color="red">mdi-close-circle</v-icon></span></v-col
              > -->
          </v-row>
        </v-card-text>
        <v-card-text class="mb-3">
          <v-row>
            <v-col class="pt-0 pb-0"
              ><p class="font-weight-bold">Size</p>
              <v-text-field outlined placeholder="Size" v-model="size"></v-text-field>
              <p>Price :</p>
              <v-row>
                <v-col class="pb-0 pt-0">Month</v-col>
                <v-col class="pb-0 pt-0">{{ toIDRWithDotFormat(dataCreate.price_per_month) }}</v-col>
              </v-row>
              <v-row>
                <v-col class="pb-0 pt-0">Hour</v-col>
                <v-col class="pb-0 pt-0">{{ toIDRWithDotFormat(dataCreate.price_per_hour) }}</v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text>
          <v-row class="d-flex justify-start">
            <v-col class="d-flex flex-row justify-center" cols="6">
              <v-btn class="white--text fz-14" color="#a5b3bf" block height="45" @click="onCancel()"> Cancel </v-btn>
            </v-col>
            <v-col class="d-flex flex-row justify-center" cols="6">
              <v-btn class="fz-14" color="primary" block height="45" @click="onSubmit()"> Confirm </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, watch, computed } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { SUPERADMINMANAGEPRICING } from "../namespace";
import { toIDRWithDotFormat } from "@/lib/formatter";
import { helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

export default {
  props: {
    dialogClosed: {
      type: Boolean,
      default: false,
    },
    dataCreate: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, context) {
    const { deleteProduct } = useNamespacedActions(SUPERADMINMANAGEPRICING, ["deleteProduct"]);
    const { statusDelete, loadingCreateProduct, listTags, detailService } = useNamespacedGetters(SUPERADMINMANAGEPRICING, [
      "statusDelete",
      "loadingCreateProduct",
      "listTags",
      "detailService",
    ]);

    const inputPriceMonth = (val) => {
      const rp = val.replaceAll(".", "");
      pricePerMonth.value = formatUang(rp);
    };
    const inputPriceHour = (val) => {
      const rp = val.replaceAll(".", "");
      pricePerHour.value = formatUang(rp);
    };

    function formatUang(subject) {
      const rupiah = subject.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.");
      return rupiah;
    }

    const inputProduct = ref("");
    const pricePerMonth = ref("");
    const pricePerHour = ref("");
    const tags = ref("");
    const cek = ref("");
    const size = ref("");

    const $v = useVuelidate(
      {
        tags: {
          required: helpers.withMessage("Tags couldnt be empty.", (val) => {
            return val;
          }),
          existing: helpers.withMessage("Tags already exist.", (val) => {
            return val !== cek.value;
          }),
        },
        pricePerMonth: {
          required: helpers.withMessage("Price Per Month couldnt be empty.", (val) => {
            return val;
          }),
        },
        pricePerHour: {
          required: helpers.withMessage("Price Per Hour couldnt be empty.", (val) => {
            return val;
          }),
        },
      },
      {
        tags,
        pricePerMonth,
        pricePerHour,
      }
    );
    const onSubmit = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const data = {
        tag_id: tags.value,
        price_per_month: parseInt(pricePerMonth.value.replaceAll(".", "")),
        price_per_hour: parseInt(pricePerHour.value.replaceAll(".", "")),
      };
      context.emit("get-data", data);
      context.emit("update:dialog-closed", false);
    };
    const onCancel = () => {
      context.emit("update:dialog-closed", false);
    };

    watch(tags, () => {
      if (tags.value) {
        const ceking = detailService.value.service_tag.find((item) => {
          return item.tag_id === tags.value;
        });
        cek.value = ceking?.tag_id;
      }
    });
    return {
      onCancel,
      onSubmit,
      statusDelete,
      loadingCreateProduct,
      inputProduct,
      $v,
      tags,
      pricePerHour,
      pricePerMonth,
      toIDRWithDotFormat,
      inputPriceMonth,
      formatUang,
      inputPriceHour,
      listTags,
      detailService,
      cek,
      size,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  position: static;
}
</style>
