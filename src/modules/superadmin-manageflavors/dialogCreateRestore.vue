<template>
  <v-dialog max-width="500" v-model="value" persistent>
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">
          Create {{ title }}
        </div>
      </v-card-text>

      <!-- services type field -->
      <!-- <v-card-text>
        <p class="titletext">Services Type</p>
        <v-select
          placeholder="Select Services Type"
          :items="servicesTypes"
          v-model="servicesType"
          outlined
          single-line
          append-icon="mdi-chevron-down"
        />
      </v-card-text> -->

      <!-- organization_id field -->
      <v-card-text v-if="servicesType === 'customized'">
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

      <!-- total field -->
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
          :disabled="apiEndpoint && apiEndpoint === 'snapshot'"
          :filled="apiEndpoint && apiEndpoint === 'snapshot'"
        >
          <template v-slot:append>
            <span
              v-if="apiEndpoint && apiEndpoint === 'snapshot'"
              class="font--text"
            >
              GB
            </span>

            <span v-else class="font--text">x</span>
          </template>
        </v-text-field>
      </v-card-text>

      <!-- price per month field -->
      <v-card-text>
        <p v-if="apiEndpoint && apiEndpoint === 'snapshot'" class="titletext">
          Price
        </p>

        <p v-else class="titletext">Price per Month</p>

        <v-text-field
          id="pricePerMonth"
          :class="{ hideinput: pricepermonthfocus === false }"
          maxlength="10"
          v-model.number="pricePerMonth"
          placeholder="0"
          type="number"
          flat
          outlined
          @focus="pricepermonthfocus = true"
          @blur="
            (e) => {
              pricepermonthfocus = false;
              onChangeHandler(e);
            }
          "
          @keypress="isNumber($event)"
          :error-messages="pricePerMonthError"
        >
          <template v-slot:prepend-inner>
            <span>
              <span class="font--text">IDR | </span>
              {{
                pricepermonthfocus ? "" : pricePerMonth.toLocaleString("id-ID")
              }}
            </span>
          </template>
        </v-text-field>
      </v-card-text>

      <!-- start date field -->
      <v-card-text>
        <p class="titletext">Start Date</p>
        <v-text-field
          id="startDate"
          maxlength="10"
          v-model="startDate"
          placeholder="0"
          type="date"
          flat
          outlined
          :error-messages="startDateError"
          :min="minStartDate"
        />
      </v-card-text>

      <!-- additional price field -->
      <v-card-text v-if="!apiEndpoint || apiEndpoint !== 'snapshot'">
        <p class="titletext">Additional Price</p>
        <v-text-field
          id="additionalPrice"
          :class="{ hideinput: additionalpricefocus === false }"
          maxlength="10"
          v-model.number="additionalPrice"
          placeholder="0"
          type="number"
          flat
          outlined
          @focus="additionalpricefocus = true"
          @blur="
            (e) => {
              additionalpricefocus = false;
              onChangeHandler(e);
            }
          "
          @keypress="isNumber($event)"
          :error-messages="additionalPriceError"
        >
          <template v-slot:prepend-inner>
            <span>
              <span class="font--text">IDR | </span>
              {{
                additionalpricefocus
                  ? ""
                  : additionalPrice.toLocaleString("id-ID")
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
                  $emit('close');
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

              <span style="font-size: 14px">Cancel</span></v-btn
            >
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

              <span style="font-size: 14px">Save</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { Rpformat } from "@/lib/formatter";
import api from "@/lib/api";

export default {
  props: ["value", "apiEndpoint"],
  data() {
    return {
      loading: false,
      total: this.apiEndpoint && this.apiEndpoint === "snapshot" ? 1 : 0,
      totalError: "",
      pricePerMonth: 0,
      pricePerMonthError: "",
      pricepermonthfocus: false,
      startDate: this.$moment().format("YYYY-MM-DD"),
      startDateError: "",
      additionalPrice: 0,
      additionalPriceError: "",
      additionalpricefocus: false,
      servicesTypes: [
        { text: "Public", value: "public" },
        { text: "Customized", value: "customized" },
      ],
      servicesType: "customized",
      organizations: [],
      organization: null,
      organizationError: "",
    };
  },
  computed: {
    minStartDate() {
      return this.$moment().format("YYYY-MM-DD");
    },
    title() {
      return this.apiEndpoint ? "Snapshot" : "Restore";
    },
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
    Rpformat() {
      return Rpformat;
    },
    async submit() {
      // if fields are empty
      if (
        !this.startDate ||
        ((!this.apiEndpoint || this.apiEndpoint !== "snapshot") &&
          !this.additionalPrice) ||
        !this.pricePerMonth ||
        !this.total ||
        (this.servicesType === "customized" && !this.organization)
      ) {
        if (!this.startDate) this.startDateError = "Value is required";
        if (!this.pricePerMonth) this.pricePerMonthError = "Value is required";
        if (!this.total) this.totalError = "Value is required";
        if (this.servicesType === "customized" && !this.organization)
          this.organizationError = "Value is required";
        if (
          (!this.apiEndpoint || this.apiEndpoint !== "snapshot") &&
          !this.additionalPrice
        )
          this.additionalPriceError = "Value is required";
      } else {
        this.loading = true;

        try {
          const endpoint = this.apiEndpoint
            ? "/flavor/snapshot"
            : "/flavor/restore";

          await api.POST(
            endpoint,
            this.apiEndpoint
              ? {
                  organization_id: this.organization,
                  total: this.total,
                  price_per_month: this.pricePerMonth,
                  start_date: this.startDate,
                }
              : {
                  organization_id: this.organization,
                  total: this.total,
                  price_per_month: this.pricePerMonth,
                  additional_price: this.additionalPrice,
                  start_date: this.startDate,
                }
          );

          this.$emit("getRestore", this.servicesType);

          this.$store.dispatch(
            "HOMEPAGE/showSuccessToast",
            this.title + " has been successfully updated"
          );

          this.$emit("close");
        } catch {
          this.$store.dispatch(
            "HOMEPAGE/showErrorToast",
            `Sorry, an error occurred while submitting ${this.title} data`
          );
        }

        this.loading = false;
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
    async getOrganizations() {
      this.loading = true;

      try {
        const res = await api.GET(
          "/superadmin/list/manageorg?limit=-1&type=corporate"
        );

        if (res.data.organizations.length) {
          this.organizations = res.data.organizations.map((org) => {
            const { name, id } = org;

            return {
              ...org,
              text: name,
              value: id,
            };
          });
        }
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while displaying Organizations"
        );
      }

      this.loading = false;
    },
  },
  watch: {
    total() {
      this.onChangeHandler({ target: { id: "total" } });
    },
    pricePerMonth() {
      this.onChangeHandler({ target: { id: "pricePerMonth" } });
    },
    additionalPrice() {
      this.onChangeHandler({ target: { id: "additionalPrice" } });
    },
    startDate() {
      this.onChangeHandler({ target: { id: "startDate" } });
    },
    servicesType() {
      if (this.servicesType === "customized" && !this.organizations.length) {
        this.getOrganizations();
      }
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
</style>
