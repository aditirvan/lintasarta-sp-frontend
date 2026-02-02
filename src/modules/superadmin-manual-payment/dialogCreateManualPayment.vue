<template>
  <v-dialog v-model="modal" persistent max-width="500">
    <v-form ref="form" lazy-validation @submit.prevent="submit">
      <v-card>
        <v-card-title>
          <h3 class="my-4">Manual Payment</h3>
        </v-card-title>
        <v-card-text>
          <p for="organizaiton"><b>Select Organization</b></p>
          <v-autocomplete
            autocomplete="off"
            id="organization"
            :items="organizations"
            v-model="organization_id"
            item-value="id"
            item-text="name"
            placeholder="Select Organization"
            :error-messages="
              $v.organization_id.$errors.length
                ? $v.organization_id.$errors[0].$message
                : ''
            "
            outlined
          />
        </v-card-text>
        <v-card-text class="pt-0">
          <p for="project"><b>Select Project</b></p>
          <v-autocomplete
            autocomplete="off"
            no-filter
            id="project"
            :items="projects"
            v-model="project_id"
            item-value="id"
            item-text="name"
            placeholder="Select Project"
            @input="$v.project_id.$touch()"
            @blur="$v.project_id.$touch()"
            :error-messages="
              $v.project_id.$errors.length
                ? $v.project_id.$errors[0].$message
                : ''
            "
            outlined
          >
            <template v-slot:item="data">
              <v-list-item-content>
                <v-list-item-title v-text="data.item.name"></v-list-item-title>
                <v-list-item-subtitle>
                  {{ data.item.type_description }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action
                v-if="
                  data.item.outstanding !== null &&
                  data.item.outstanding !== undefined
                "
              >
                <v-list-item-action-text>Outstanding:</v-list-item-action-text>
                IDR{{ toThousandsWithDotFormat(data.item.outstanding) }}
              </v-list-item-action>
            </template>
          </v-autocomplete>
        </v-card-text>

        <v-card-text class="pt-0">
          <p><b>Outstanding Information</b></p>
          <v-card
            v-if="project_id && selectedProject"
            id="selected-invoice-card"
            outlined
          >
            <v-card-text class="py-2">
              <v-row>
                <v-col cols="8">
                  <p class="font-weight-light mb-0">Billed</p>
                </v-col>
                <v-col cols="4">
                  <p class="mb-0" style="font-size: 1.1rem">
                    <b
                      >IDR{{
                        toThousandsWithDotFormat(selectedProject.billed)
                      }}</b
                    >
                  </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="8">
                  <p class="font-weight-light mb-0">Manually Paid</p>
                </v-col>
                <v-col cols="4">
                  <p class="mb-0" style="font-size: 1.1rem">
                    <b
                      >IDR{{
                        toThousandsWithDotFormat(selectedProject.manually_paid)
                      }}</b
                    >
                  </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="8">
                  <p class="font-weight-light mb-0">Total Outstanding</p>
                </v-col>
                <v-col cols="4">
                  <p class="mb-0" style="font-size: 1.1rem">
                    <b
                      >IDR{{
                        toThousandsWithDotFormat(selectedProject.outstanding)
                      }}</b
                    >
                  </p>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <p v-else class="grey--text">Select a project first.</p>
        </v-card-text>

        <v-card-text class="pt-0">
          <p for="total-amount"><b>Total Amount</b></p>
          <v-text-field
            :class="{ hideinput: totalamountfocus === false }"
            id="total-amount"
            v-model="total_amount"
            type="number"
            placeholder="0"
            flat
            outlined
            @focus="totalamountfocus = true"
            @blur="totalamountfocus = false"
            :error-messages="
              $v.total_amount.$errors.length
                ? $v.total_amount.$errors[0].$message
                : ''
            "
          >
            <template v-slot:prepend-inner>
              <span>
                <span class="font--text">IDR </span>
                {{
                  totalamountfocus ? "" : toThousandsWithDotFormat(total_amount)
                }}
              </span>
            </template>
          </v-text-field>
        </v-card-text>
        <v-card-text class="pt-0">
          <p for="expired-date"><b>Date</b></p>
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
                :value="formated_created_date"
                id="formated_created_date"
                placeholder="DD/MM/YYYY"
                :error-messages="
                  $v.created_date.$errors.length
                    ? $v.created_date.$errors[0].$message
                    : ''
                "
                persistent-hint
                v-bind="attrs"
                v-on="on"
                outlined
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="created_date"
              no-title
              @input="toggleDatePicker = false"
              color="primary"
              :max="currentDate"
            ></v-date-picker>
          </v-menu>
        </v-card-text>
        <v-card-text class="pt-0">
          <p for="description"><b>Description</b></p>
          <v-textarea
            id="description"
            outlined
            v-model="description"
            name="input-7-4"
            placeholder="Description"
            :error-messages="
              $v.description.$errors.length
                ? $v.description.$errors[0].$message
                : ''
            "
          ></v-textarea>
        </v-card-text>
        <!-- <v-card-text class="pt-0">
          <p for="payment-type"><b>Payment Type</b></p>
          <v-autocomplete
            id="payment-type"
            :items="payments"
            v-model="payment_type"
            item-value="id"
            item-text="name"
            placeholder="Select Payment Type"
            :error-messages="
              $v.payment_type.$errors.length
                ? $v.payment_type.$errors[0].$message
                : ''
            "
            outlined
          />
        </v-card-text> -->
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
                <b>Add</b>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import {
  defineComponent,
  ref,
  reactive,
  computed,
  onMounted,
  watch,
} from "@vue/composition-api";
import {
  capitalizeFirstLetter,
  toThousandsWithDotFormat,
} from "@/lib/formatter";
import { MANUALPAYMENT } from "./namespace";
import useVuelidate from "@vuelidate/core";
import { helpers, required, minLength } from "@vuelidate/validators";
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import moment from "moment";

export default defineComponent({
  setup(props, { emit }) {
    const { createManualPayment, fetchManualPayment } = useNamespacedActions(
      MANUALPAYMENT,
      ["createManualPayment", "fetchManualPayment"]
    );

    const { fetchorganizations } = useNamespacedActions("SUPERADMIN", [
      "fetchorganizations",
    ]);
    const { organizations } = useNamespacedState("SUPERADMIN", [
      "organizations",
    ]);
    const { isLoading } = useNamespacedState(MANUALPAYMENT, ["isLoading"]);
    // const payments = [
    //   {
    //     id: 1,
    //     name: "Positive",
    //   },
    //   {
    //     id: 2,
    //     name: "Negative",
    //   },
    // ];

    const currentDate = ref(moment(new Date()).format("YYYY-MM-DD"));
    const organization_id = ref();
    const projects = ref([]);
    const projectMap = computed(
      () => new Map(projects.value.map((p) => [p.id, p]))
    );
    const project_id = ref();

    const selectedProject = computed(() =>
      projectMap.value.get(project_id.value)
    );

    const total_amount = ref("");
    const description = ref("");
    // const payment_type = ref();
    const created_date = ref("");
    const formatToDate = (date) =>
      moment(date, "YYYY-MM-DD").format("DD/MM/YYYY");
    const formated_created_date = computed(() => {
      if (created_date.value) {
        return formatToDate(created_date.value);
      } else {
        return "";
      }
    });

    watch(organization_id, (val) => {
      if (val) {
        project_id.value = null;
        projects.value = organizations.value
          .find((org) => org.id === val)
          .projects.filter((f) => f.payment_method === "postpaid")
          .map((p) => {
            let billingType = "Usage Based";
            if (
              p.payment_method === "postpaid" &&
              p.postpaid_type === "fixed"
            ) {
              if (p.postpaid_fixed_type === "prorate") {
                billingType = "Prorate";
              } else if (p.postpaid_fixed_type === "full_cycle") {
                billingType = "Full Cycle";
              }
            }

            p.type_description = `${capitalizeFirstLetter(
              p.payment_method
            )} - ${billingType}`;
            p.disabled = !p.is_manually_payable;
            return p;
          });
      }
    });

    const isProjectManuallyPayable = helpers.withMessage(
      ({ $model: projectID }) => {
        if (!projectID) {
          return "";
        }

        const isPostpaid =
          projectMap.value.get(projectID).payment_method === "postpaid";
        return `This project ${
          isPostpaid
            ? "does not have any unpaid invoices"
            : "is not a postpaid project"
        }.`;
      },
      (projectID) =>
        projectID ? projectMap.value.get(projectID).is_manually_payable : null
    );

    const $v = useVuelidate(
      {
        organization_id: { required },
        project_id: {
          required,
          isProjectManuallyPayable,
        },
        total_amount: { required },
        description: {
          required,
          minLength: minLength(5),
        },
        created_date: { required },
        // payment_type: { required },
      },
      {
        organization_id,
        project_id,
        description,
        total_amount,
        // payment_type,
        created_date,
      }
    );
    const modal = ref(true);
    const toggleDatePicker = ref(false);
    const isValid = ref(false);
    const { showErrorToast, showSuccessToast } = useNamespacedActions(
      "HOMEPAGE",
      ["showErrorToast", "showSuccessToast"]
    );
    const submit = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const payload = {
        organization_id: organization_id.value,
        project_id: project_id.value,
        description: description.value,
        amount: parseFloat(total_amount.value),
        date: created_date.value,
        // payment_type: payment_type.value,
      };
      createManualPayment(payload)
        .then(() => {
          fetchManualPayment().then(() => {
            showSuccessToast("Manual Payment Created!");
            emit("close");
          });
        })
        .catch((err) => {
          if (err.response.data.code == 400) {
            showErrorToast(err.response.data.data);
          } else {
            showErrorToast("Error Creating Manual Payment!");
          }
        });
    };

    onMounted(() => {
      fetchorganizations({ isManuallyPayable: true });
    });

    return {
      $v,
      organization_id,
      project_id,
      // payment_type,
      description,
      total_amount,
      formated_created_date,
      created_date,
      toggleDatePicker,
      modal,
      isValid,
      submit,
      isLoading,
      organizations,
      projects,
      toThousandsWithDotFormat,
      totalamountfocus: ref(false),
      projectMap,
      selectedProject,
      formatToDate,
      currentDate,
      // payments,
    };
  },
});
</script>
<style lang="scss" scoped>
.titletext {
  font-weight: 700;
  font-size: 12px;
}

.hideinput {
  ::v-deep input {
    position: relative;
    bottom: 50px;
    z-index: -2;
  }
}

.v-input--is-disabled {
  ::v-deep .v-input__slot {
    background: #f2f2f2;
  }
}

#selected-invoice-card {
  background-color: #e1efff;
}
</style>
