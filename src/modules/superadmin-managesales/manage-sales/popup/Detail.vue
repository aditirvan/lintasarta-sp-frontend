<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Detail Sales</div>

        <v-row>
          <v-col>
            <p>
              <b>Name</b>
            </p>

            <p>{{ item.fullname }}</p>
          </v-col>

          <v-col>
            <p>
              <b>Phone Number</b>
            </p>

            <p>{{ item.phone_number }}</p>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <p>
              <b>Email</b>
            </p>

            <p>{{ item.email || "-" }}</p>
          </v-col>

          <v-col>
            <p>
              <b>Description</b>
            </p>

            <p>{{ item.description }}</p>
          </v-col>
        </v-row>

        <!-- <v-row>
          <v-col>
            <p>
              <b>Email</b>
            </p>

            <p>{{ item.email || "-" }}</p>
          </v-col>

          <v-col>
            <p>
              <b>Description</b>
            </p>

            <p>{{ item.description }}</p>
          </v-col>
        </v-row> -->

        <v-row>
          <v-col>
            <p>
              <b>Status</b>
            </p>

            <!-- <p>{{ item.status }}</p> -->

            <v-switch
              class="mt-0 mb-2"
              hide-details
              flat
              readonly
              @click="$emit('changeStatus')"
              v-model="status"
              true-value="active"
              false-value="deactive"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-btn
              depressed
              height="45"
              block
              class="accent"
              @click="$emit('input', false)"
            >
              Cancel
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

export default {
  props: ["value", "item"],
  setup(props, { emit }) {
    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        emit("input", val);
      },
    });

    return {
      dialog,
    };
  },
  data() {
    return {
      loading: false,
      status: "",
    };
  },
  methods: {
    async getSales() {
      this.loading = true;

      try {
        const res = await api.GET("/user/sales/" + this.item.id);
        console.log("getSales res.data", res.data);
      } catch (err) {
        let errmsg = "Sorry, an error occurred while displaying data";
        const thereIsErrorMessage = err && err.response && err.response.data;

        if (thereIsErrorMessage && err.response.data.message) {
          errmsg = err.response.data.message;
        }

        if (
          thereIsErrorMessage &&
          err.response.data.data !== "record not found"
        ) {
          this.$store.dispatch("HOMEPAGE/showErrorToast", errmsg);
        }
      }

      this.loading = false;
    },
  },
  mounted() {
    // this.getSales()
    this.status = this.item.status;
  },
  watch: {
    "item.status"(newVal) {
      this.status = this.item.status;
    },
  },
};
</script>

<style lang="scss" scoped>
.v-input--is-label-active {
  ::v-deep .v-input--switch__track {
    background-color: #27ae60;
    opacity: 1 !important;
  }
  ::v-deep .v-input--switch__thumb {
    background-color: white;
  }
}
.v-input--switch {
  ::v-deep .v-input--switch__track {
    height: 20px;
    width: 42px;
    border-radius: 10px;
  }
  ::v-deep .v-input--selection-controls__ripple {
    display: none;
  }
  ::v-deep .v-input--switch__thumb {
    left: 8px;
    top: 8.5px;
    height: 12px;
    width: 12px;
  }
}
</style>
