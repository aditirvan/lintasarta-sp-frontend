<template>
  <v-dialog max-width="500" v-model="value" persistent>
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">
          {{ title || "Edit Default Reserved Price" }}
        </div>
      </v-card-text>

      <!-- total field -->
      <v-card-text>
        <p class="titletext">Total</p>
        <v-text-field
          id="total"
          type="number"
          v-model.number="total"
          flat
          outlined
          filled
          disabled
        />
      </v-card-text>

      <!-- price field -->
      <v-card-text v-if="item.type !== 'reserved'">
        <p class="titletext">Price per Hour</p>
        <v-text-field
          id="pricePerHour"
          :class="{ hideinput: priceperhourfocus === false }"
          maxlength="10"
          v-model.number="pricePerHour"
          placeholder="0"
          type="number"
          flat
          outlined
          @focus="priceperhourfocus = true"
          @blur="
            (e) => {
              priceperhourfocus = false;
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
                priceperhourfocus ? "" : toThousandsWithDotFormat(pricePerHour)
              }}
            </span>
          </template>
        </v-text-field>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Price per Month</p>
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
                pricepermonthfocus
                  ? ""
                  : toThousandsWithDotFormat(pricePerMonth)
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

              <span style="font-size: 14px">Save</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { toThousandsWithDotFormat } from "@/lib/formatter";
import api from "@/lib/api";

export default {
  props: ["value", "item"],
  setup() {
    return {
      toThousandsWithDotFormat,
    };
  },
  data() {
    return {
      title: "",
      loading: false,
      total: 0,
      totalError: "",
      pricePerHour: 0,
      pricePerMonth: 0,
      pricePerHourError: "",
      pricePerMonthError: "",
      priceperhourfocus: false,
      pricepermonthfocus: false,
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
    submit() {
      // if fields are empty
      if (this.item.type !== "reserved") {
        if (!this.pricePerHour || !this.pricePerMonth) {
          if (!this.pricePerHour) this.pricePerHourError = "Value is required";
          if (!this.pricePerMonth)
            this.pricePerMonthError = "Value is required";
        } else {
          this.handleSubmit();
        }
      } else {
        if (!this.pricePerMonth) {
          this.pricePerMonthError = "Value is required";
        } else {
          this.handleSubmit();
        }
      }
    },
    async handleSubmit() {
      // PUT
      this.loading = true;

      let priceProp = {
        reserved_price_per_month: this.pricePerMonth,
      };

      if (this.item.type === "non-reserved") {
        priceProp = {
          non_reserved_price_per_hour: this.pricePerHour,
          non_reserved_price_per_month: this.pricePerMonth,
        };
      }

      try {
        await api.PUT("/flavor/floating-ip/default/" + this.item.type, {
          id: this.item.id,
          ...priceProp,
        });

        this.$emit("updateDefaultFloatingIP", {
          id: this.item.id,
          default: this.total,
          // price: this.pricePerMonth,
          price: {
            price_per_hour: this.pricePerHour,
            price_per_month: this.pricePerMonth,
          },
          type: this.item.type,
        });

        this.$store.dispatch(
          "HOMEPAGE/showSuccessToast",
          "Default Floating IP has been successfully updated"
        );
        this.$emit("close");
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while submitting default floating IP"
        );
      }
      this.loading = false;
    },
    onChangeHandler(e) {
      if (!this[e.target.id] && !this[e.target.id + "Error"]) {
        this[e.target.id + "Error"] = "Value is required";
      }

      if (this[e.target.id] && this[e.target.id + "Error"]) {
        this[e.target.id + "Error"] = "";
      }
    },
  },
  watch: {
    pricePerMonth() {
      this.onChangeHandler({ target: { id: "pricePerMonth" } });
    },
  },
  mounted() {
    this.total = this.item.default;

    if (this.item.type === "non-reserved") {
      this.title = "Edit Default Non-Reserved Price";
      this.pricePerHour = this.item.price.price_per_hour;
      this.pricePerMonth = this.item.price.price_per_month;
    } else {
      this.pricePerMonth = this.item.price.price_per_month;
    }
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
