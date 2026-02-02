<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">
          Create Floating IP Flavor
        </div>
      </v-card-text>

      <!-- organization -->
      <v-card-text>
        <p class="titletext">Organization</p>

        <v-select
          placeholder="Select Organization"
          :items="organizations"
          v-model="organization"
          outlined
          single-line
          append-icon="mdi-chevron-down"
          :error-messages="organizationError"
        />
      </v-card-text>

      <!-- total -->
      <v-card-text>
        <p class="titletext">Total</p>

        <v-text-field
          id="total"
          maxlength="3"
          type="number"
          v-model.number="total"
          placeholder="1"
          flat
          outlined
          @keypress="isNumber($event)"
          :error-messages="totalError"
          disabled
          filled
        />
      </v-card-text>

      <!-- start date -->
      <v-card-text>
        <p class="titletext ma-0">Start Date</p>

        <v-menu
          ref="menu"
          v-model="dateInput"
          :close-on-content-click="false"
          :return-value.sync="startDate"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              id="startDate"
              class="hideinput2"
              v-model="startDate"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            >
              <template v-slot:prepend-inner>
                <span
                  class="font--text"
                  @click="dateInput = true"
                  style="cursor: pointer"
                >
                  {{ $moment(startDate).format("DD/MM/YYYY") }}
                </span>
              </template>
            </v-text-field>
          </template>

          <v-date-picker v-model="startDate" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="dateInput = false">
              Cancel
            </v-btn>
            <v-btn text color="primary" @click="$refs.menu.save(startDate)">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>

        <!-- <v-text-field
          id="startDate"
          maxlength="10"
          v-model="startDate"
          placeholder="0"
          type="date"
          flat
          outlined
          :error-messages="startDateError"
        /> -->
      </v-card-text>

      <!-- reserved price per month -->
      <v-card-text>
        <p class="titletext">Reserved Price per Month</p>

        <v-text-field
          id="reservedPrice"
          :class="{ hideinput: reservedPriceFocus === false }"
          maxlength="10"
          v-model.number="reservedPrice"
          placeholder="0"
          type="number"
          flat
          outlined
          @focus="reservedPriceFocus = true"
          @blur="
            (e) => {
              reservedPriceFocus = false;
              onChangeHandler(e);
            }
          "
          @keypress="isNumber($event)"
          :error-messages="reservedPriceError"
        >
          <template v-slot:prepend-inner>
            <span>
              <span class="font--text">IDR | </span>
              {{
                reservedPriceFocus ? "" : toThousandWithDotFormat(reservedPrice)
              }}
            </span>
          </template>
        </v-text-field>
      </v-card-text>

      <!-- non - reserved price per month -->
      <v-card-text>
        <p class="titletext">Non-Reserved Price per Month</p>

        <v-text-field
          id="nonReservedPrice"
          :class="{ hideinput: nonReservedPriceFocus === false }"
          maxlength="10"
          v-model.number="nonReservedPrice"
          placeholder="0"
          type="number"
          flat
          outlined
          @focus="nonReservedPriceFocus = true"
          @blur="
            (e) => {
              nonReservedPriceFocus = false;
              onChangeHandler(e);
            }
          "
          @keypress="isNumber($event)"
          :error-messages="nonReservedPriceError"
        >
          <template v-slot:prepend-inner>
            <span>
              <span class="font--text">IDR | </span>
              {{
                nonReservedPriceFocus
                  ? ""
                  : toThousandWithDotFormat(nonReservedPrice)
              }}
            </span>
          </template>
        </v-text-field>
      </v-card-text>

      <!-- btns -->
      <v-card-text>
        <v-row>
          <v-col>
            <v-btn
              @click="
                () => {
                  $emit('input', false);
                }
              "
              block
              height="50"
              depressed
              class="accent"
              :disabled="loading"
            >
              <beat-loader
                v-if="loading"
                :loading="loading"
                color="#2C94D2"
                size="10px"
                class="ml-2"
              />

              <span style="font-size: 14px">Cancel</span>
            </v-btn>
          </v-col>

          <v-col>
            <v-btn
              @click="submit"
              block
              height="50"
              depressed
              class="secondary"
              :disabled="loading"
            >
              <beat-loader
                v-if="loading"
                :loading="loading"
                color="#2C94D2"
                size="10px"
                class="ml-2"
              />

              <span style="font-size: 14px">Create</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { computed } from "@vue/composition-api";
import api from "@/lib/api";
import { toThousandsWithDotFormat } from "@/lib/formatter";

export default {
  props: ["value"],
  data() {
    return {
      dateInput: false,
      loading: false,
      organizations: [],
      organization: "",
      organizationError: "",
      total: "",
      totalError: "",
      startDate: this.$moment().format("YYYY-MM-DD"),
      startDateError: "",
      reservedPrice: 0,
      reservedPriceError: "",
      reservedPriceFocus: false,
      nonReservedPrice: 0,
      nonReservedPriceError: "",
      nonReservedPriceFocus: false,
    };
  },
  setup(props, { emit }) {
    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        emit("input", val);
      },
    });

    return {
      dialog,
      toThousandsWithDotFormat,
    };
  },
  methods: {
    isNumber(e) {
      const charCode = e.which ? e.which : e.keyCode;

      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        e.preventDefault();
      } else {
        return true;
      }
    },
    onChangeHandler(e) {
      if (!this[e.target.id] && !this[e.target.id + "Error"]) {
        this[e.target.id + "Error"] = "Value is required";
      }

      if (this[e.target.id] && this[e.target.id + "Error"]) {
        this[e.target.id + "Error"] = "";
      }
    },
    async submit() {
      const fields = [
        "organization",
        "startDate",
        "reservedPrice",
        "nonReservedPrice",
      ];

      const areFieldsEmpty = fields.some((field) => !this[field]);

      if (areFieldsEmpty) {
        for (let i = 0; i < fields.length; i++) {
          if (!this[fields[i]]) this[fields[i] + "Error"] = "Value is required";
        }
      } else {
        this.loading = true;

        try {
          await api.POST("/flavor/floating-ip", {
            organization_id: this.organization,
            // total: this.total,
            start_date: this.startDate,
            reserved_price_per_month: this.reservedPrice,
            non_reserved_price_per_month: this.nonReservedPrice,
          });

          this.$emit("refreshData");

          this.$store.dispatch(
            "HOMEPAGE/showSuccessToast",
            "Floating IP has been successfully created"
          );

          this.$emit("input", false);
        } catch (err) {
          let errmsg =
            "Sorry, an error occurred while submitting floating IP data";

          if (
            err &&
            err.response &&
            err.response.data &&
            err.response.data.message
          ) {
            errmsg = err.response.data.message;
          }

          this.$store.dispatch("HOMEPAGE/showErrorToast", errmsg);
        }

        this.loading = false;
      }
    },
    async getOrganizations() {
      this.loading = true;

      try {
        const res = await api.GET(
          "/superadmin/list/manageorg?limit=-1&type=corporate"
        );

        if (res.data.organizations.length) {
          const newArr = res.data.organizations.map((org) => {
            const { name, id } = org;

            return {
              ...org,
              text: name,
              value: id,
            };
          });

          this.organizations = newArr;
        }
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while displaying organizations"
        );
      }

      this.loading = false;
    },
  },
  watch: {
    organization() {
      this.onChangeHandler({ target: { id: "organization" } });
    },
    total() {
      this.onChangeHandler({ target: { id: "total" } });
    },
    startDate() {
      this.onChangeHandler({ target: { id: "startDate" } });
    },
    reservedPrice() {
      this.onChangeHandler({ target: { id: "reservedPrice" } });
    },
    nonReservedPrice() {
      this.onChangeHandler({ target: { id: "nonReservedPrice" } });
    },
  },
  mounted() {
    this.getOrganizations();
  },
};
</script>

<style lang="scss" scoped>
.hideinput {
  ::v-deep input {
    position: relative;
    bottom: 50px;
    z-index: -2;
  }
}

.hideinput2 {
  ::v-deep input {
    opacity: 0;
  }
}
</style>
