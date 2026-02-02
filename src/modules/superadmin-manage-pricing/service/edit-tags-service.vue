<template>
  <div>
    <v-dialog persistent v-model="dialogClosed" max-width="600">
      <v-card class="pt-5 rounded-lg">
        <v-card-text class="pb-3">
          <v-row>
            <v-col><p class="fz-18 font-weight-bold mb-0">Add Tags</p></v-col>
          </v-row>
        </v-card-text>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="pt-0 pb-0"
              ><p class="font-weight-bold">Tags</p>
              <v-select
                outlined
                placeholder="Tags"
                v-model="tags"
                :items="listTags"
                item-text="name"
                item-value="id"
                @blur="$v.tags.$touch()"
                :error-messages="$v.tags.$errors.length ? $v.tags.$errors[0].$message : ''"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="pt-0 pb-0"
              ><p class="font-weight-bold">Price Per Month</p>
              <v-text-field
                prefix="IDR | "
                outlined
                placeholder="Price Per Month"
                v-model="pricePerMonth"
                @input="inputPriceMonth($event)"
                @blur="$v.pricePerMonth.$touch()"
                :error-messages="$v.pricePerMonth.$errors.length ? $v.pricePerMonth.$errors[0].$message : ''"
                onkeypress="return (event.charCode >= 48 && event.charCode <= 57)"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text class="pb-0">
          <v-row>
            <v-col class="pt-0 pb-0"
              ><p class="font-weight-bold">Price Per Hour</p>
              <v-text-field
                prefix="IDR | "
                outlined
                placeholder="Price Per Hour"
                v-model="pricePerHour"
                @input="inputPriceHour($event)"
                @blur="$v.pricePerHour.$touch()"
                :error-messages="$v.pricePerHour.$errors.length ? $v.pricePerHour.$errors[0].$message : ''"
                onkeypress="return (event.charCode >= 48 && event.charCode <= 57)"
              ></v-text-field>
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
// import { toIDRWithDotFormat } from "@/lib/formatter";
import { helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

export default {
  props: {
    dialogClosed: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
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
        id: "",
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
      // toIDRWithDotFormat,
      inputPriceMonth,
      formatUang,
      inputPriceHour,
      listTags,
      detailService,
      cek,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  position: static;
}
</style>
