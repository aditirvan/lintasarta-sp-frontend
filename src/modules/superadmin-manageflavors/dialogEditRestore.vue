<template>
  <v-dialog max-width="500" v-model="value" persistent>
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">
          Edit Default Restore
        </div>
      </v-card-text>

      <!-- total field -->
      <v-card-text>
        <p class="titletext">Total</p>
        <v-text-field
          id="total"
          maxlength="3"
          type="number"
          v-model.number="total"
          placeholder="0"
          flat
          outlined
          @keypress="isNumber($event)"
          :error-messages="totalError"
          @blur="onChangeHandler"
          filled
          disabled
        >
          <template v-slot:append>
            <span class="font--text">x</span>
          </template>
        </v-text-field>
      </v-card-text>

      <!-- price field -->
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
                  : pricePerMonth
                  ? toThousandsWithDotFormat(pricePerMonth)
                  : 0
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
      loading: false,
      total: 0,
      totalError: "",
      pricePerMonth: 0,
      pricePerMonthError: "",
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
    async submit() {
      // if fields are empty
      if (!this.pricePerMonth) {
        // if (!this.total) this.totalError = "Value is required";
        if (!this.pricePerMonth) this.pricePerMonthError = "Value is required";
      } else {
        // PUT
        this.loading = true;

        try {
          await api.PUT("/flavor/restore/default/" + this.item.id, {
            ...this.item,
            price_per_month: this.pricePerMonth,
          });

          this.$emit("updateDefaultRestore", this.pricePerMonth);
          this.$store.dispatch(
            "HOMEPAGE/showSuccessToast",
            "Default Restore has been successfully updated"
          );
          this.$emit("close");
        } catch {
          this.$store.dispatch(
            "HOMEPAGE/showErrorToast",
            "Sorry, an error occurred while submitting Default Restore"
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
  },
  watch: {
    total() {
      this.onChangeHandler({ target: { id: "total" } });
    },
    pricePerMonth() {
      this.onChangeHandler({ target: { id: "pricePerMonth" } });
    },
  },
  mounted() {
    this.total = this.item.total;
    this.pricePerMonth = this.item.price_per_month;
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
