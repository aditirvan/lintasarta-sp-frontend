<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <!-- popup title -->
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          {{
            rejectForm
              ? "Reason to Reject"
              : "Verification"
          }}
        </div>
      </v-card-title>

      <!-- body -->
      <template v-if="rejectForm">
        <!-- reject form -->
        <v-card-text class="pb-0">
          <p class="rejectform-textarea-label">
            Reason
          </p>

          <v-textarea
            flat
            outlined
            maxlength="255"
            placeholder="Enter the reason"
            v-model="reason"
            :error-messages="reasonError ? 'Value is required' : ''"
            @blur="reasonChange"
          />
        </v-card-text>

        <!-- submit button -->
        <v-card-actions>
          <v-row class="ma-0">
            <v-col cols="12">
              <v-btn
                :disabled="loading"
                color="primary"
                block
                height="50"
                depressed
                @click="submitRejectForm"
              >
                <!-- loading indicator -->
                <beat-loader
                  v-if="loading"
                  :loading="loading"
                  :color="'white'"
                  :size="'10px'"
                  class="ml-2"
                />

                Submit
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </template>

      <template v-else>
        <!-- ktp & npwp img -->
        <v-card-text class="pb-0">
          <p class="font-weight-bold">
            NPWP Number
          </p>

          <p>
            {{ memberselectedvalue.npwp_privacy }}
          </p>

          <p class="font-weight-bold" style="margin-top: 30px">
            Status
          </p>

          <p style="margin-bottom: 30px" :style="'color: ' + statusColor">
            {{
              memberselectedvalue.is_identity_verified === null
                ? "Waiting Confirmation"
                : memberselectedvalue.is_identity_verified === true
                ? "Verified"
                : "Not Verified"
            }}
          </p>

          <!-- error msg -->
          <!-- <p v-if="error" class="red--text">
            Sorry, there was an error while displaying the image,
            <br />
            please try again.
          </p>

          <p v-if="npwpimg" class="font-weight-bold">
            NPWP Image
          </p>

          <img
            v-if="npwpimg"
            :src="'data:image/jpg;base64,' + npwpimg"
            alt="npwp-img"
            width="100%"
          />

          <p v-if="ktpimg" class="font-weight-bold" style="margin-top: 30px">
            KTP Image
          </p>

          <img
            v-if="ktpimg"
            :src="'data:image/jpg;base64,' + ktpimg"
            alt="ktp-img"
            width="100%"
          /> -->
        </v-card-text>

        <!-- yes & no button -->
        <v-card-actions v-if="memberselectedvalue">
          <!-- buttons (if waiting confirmation) -->
          <v-row
            v-if="memberselectedvalue.is_identity_verified === null"
            class="ma-2"
          >
            <!-- reject -->
            <v-col cols="6">
              <v-btn
                :disabled="loading"
                color="error"
                block
                depressed
                height="50"
                @click="
                  () => {
                    rejectForm = true;
                  }
                "
              >
                <!-- loading indicator -->
                <beat-loader
                  v-if="loading"
                  :loading="loading"
                  :color="'white'"
                  :size="'10px'"
                  class="ml-2"
                />

                No, Reject
              </v-btn>
            </v-col>

            <!-- confirm -->
            <v-col cols="6">
              <v-btn
                :disabled="loading"
                color="primary"
                block
                height="50"
                depressed
                @click="
                  () => {
                    $emit('confirm');
                    $emit('input', false);
                  }
                "
              >
                <!-- loading indicator -->
                <beat-loader
                  v-if="loading"
                  :loading="loading"
                  :color="'white'"
                  :size="'10px'"
                  class="ml-2"
                />

                Yes, Confirm
              </v-btn>
            </v-col>
          </v-row>

          <!-- button (if verified or not verified) -->
          <v-row v-else class="ma-2">
            <v-col cols="12">
              <v-btn
                :disabled="loading"
                color="accent"
                block
                depressed
                height="50"
                @click="
                  () => {
                    $emit('input', false);
                  }
                "
              >
                <!-- loading indicator -->
                <beat-loader
                  v-if="loading"
                  :loading="loading"
                  :color="'white'"
                  :size="'10px'"
                  class="ml-2"
                />

                Close
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </template>
    </v-card>
  </v-dialog>
</template>
<script>
import api from "@/lib/api";

export default {
  props: ["value", "memberselectedvalue"],
  data() {
    return {
      npwpimg: "",
      ktpimg: "",
      loading: false,
      error: false,
      rejectForm: false,
      reason: "",
      reasonError: false,
    };
  },
  computed: {
    dialog: {
      get: function() {
        return this.value;
      },
      set: function(val) {
        this.$emit("input", val);
      },
    },
    statusColor() {
      return this.memberselectedvalue.is_identity_verified === null
        ? "#A5B3BF"
        : this.memberselectedvalue.is_identity_verified === true
        ? "#1F60A8"
        : "#EB5757";
    },
  },
  mounted() {
    this.$nextTick(async function() {
      this.loading = true;

      try {
        const res = await api.GET(
          "superadmin/manageuser/identity/" + this.memberselectedvalue.id
        );

        if (res) {
          const { npwp_file, ktp_file } = res.data;
          this.npwpimg = npwp_file;
          this.ktpimg = ktp_file;
        }
      } catch {
        this.error = true;
      }

      this.loading = false;
    });
  },
  methods: {
    reasonChange() {
      if (this.reason && this.reasonError) {
        this.reasonError = false;
      }

      if (!this.reason && !this.reasonError) {
        this.reasonError = true;
      }
    },
    submitRejectForm() {
      if (!this.reason) {
        this.reasonError = true;
      } else {
        this.reasonError = false;
        this.$emit("input", false);
        this.$emit("reject", this.reason);
      }
    },
  },
  watch: {
    reason() {
      this.reasonChange();
    },
  },
};
</script>

<style scoped>
.rejectform-textarea-label {
  font-style: normal;
  font-weight: 700;
  line-height: 17px;
  letter-spacing: 0em;
  text-align: left;
}
</style>
