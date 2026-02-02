<template>
  <v-dialog v-model="modal" persistent max-width="500">
    <v-form ref="form" lazy-validation @submit.prevent="submit">
      <v-card>
        <v-card-title>
          <h3>Edit E-Materai</h3>
        </v-card-title>
        <v-card-text>
          <p for="no-e-materai"><b>No e-materai</b></p>
          <v-text-field
            id="no-materai"
            v-model="no_materai"
            :error-messages="
              $v.no_materai.$errors.length
                ? $v.no_materai.$errors[0].$message
                : ''
            "
            outlined
            placeholder="No Materai"
          />
        </v-card-text>
        <v-card-text>
          <p for="expired-date"><b>Expire Date</b></p>
          <v-menu
            ref="menu1"
            v-model="toggleDatePicker"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                :value="formated_expire_date"
                id="formated_expire_date"
                placeholder="DD/MM/YYYY"
                :error-messages="
                  $v.formated_expire_date.$errors.length
                    ? $v.formated_expire_date.$errors[0].$message
                    : ''
                "
                persistent-hint
                v-bind="attrs"
                v-on="on"
                outlined
                readonly
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="expire_date"
              no-title
              @input="toggleDatePicker = false"
            ></v-date-picker>
          </v-menu>
        </v-card-text>
        <v-card-actions>
          <v-row class="ma-2">
            <v-col cols="6">
              <v-btn
                depressed
                height="50"
                color="accent"
                block
                @click="$emit('close', $event)"
              >
                <b>Cancel</b>
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                id="submitMaterai"
                depressed
                height="50"
                color="secondary"
                block
                type="submit"
              >
                <beat-loader
                  v-if="isLoading"
                  :loading="isLoading"
                  :color="'white'"
                  :size="'10px'"
                  style="transform: translateY(3px)"
                  class="mr-2"
                ></beat-loader>
                <b>Edit</b>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from "@vue/composition-api";
import { EMATERAI } from "./namespace";
import useVuelidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import moment from "moment";

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: true,
      default: () => {},
    },
  },

  setup(props, { emit }) {
    const { editStamp, fetchStamps } = useNamespacedActions(EMATERAI, [
      "editStamp",
      "fetchStamps",
    ]);
    const { isLoading } = useNamespacedState(EMATERAI, ["isLoading"]);
    const no_materai = ref(props.item.stamp_code);
    const expire_date = ref(
      moment(props.item.expired_at, "DD/MM/YYYY").format("YYYY-MM-DD")
    );
    const formated_expire_date = computed(() => {
      if (expire_date.value) {
        return moment(expire_date.value, "YYYY-MM-DD").format("DD/MM/YYYY");
      } else {
        return "";
      }
    });
    const $v = useVuelidate(
      {
        no_materai: {
          required,
          minLength: minLength(5),
        },
        formated_expire_date: { required },
      },
      { no_materai, formated_expire_date }
    );
    const modal = ref(true);
    const toggleDatePicker = ref(false);
    const { showErrorToast, showSuccessToast } = useNamespacedActions(
      "HOMEPAGE",
      ["showErrorToast", "showSuccessToast"]
    );
    const submit = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) {
        return;
      }
      const data = {
        id: props.item.id,
        stamp_code: no_materai.value,
        expired_at:
          expire_date.value == props.item.expired_at
            ? expire_date.value
            : moment(expire_date.value, "YYYY-MM-DD").format(),
      };
      editStamp(data)
        .then(() => {
          emit("success");
        })
        .catch((err: any) => {
          console.log("error-code", err.response.data.code);
          if (err.response.data.code == 400) {
            showErrorToast(err.response.data.data);
          }
        });
    };
    return {
      $v,
      no_materai,
      formated_expire_date,
      expire_date,
      toggleDatePicker,
      modal,
      submit,
      isLoading,
    };
  },
});
</script>
