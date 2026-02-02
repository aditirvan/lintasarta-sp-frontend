<template>
  <v-card class="rounded-lg elevation-0">
    <v-container class="px-7 py-4" fluid>
      <v-row>
        <v-col class="d-flex flex-row align-center">
          <p class="mb-0 font-weight-bold fz-21">Add Broadcast</p>
        </v-col>
      </v-row>

      <p class="-mb-18px"><b>Send Date</b></p>

      <v-row>
        <v-col>
          <v-datetime-picker
            v-model="send_date"
            :disabled="loading"
            :time-picker-props="{ useSeconds: true }"
            :text-field-props="{
              outlined: true,
              errorMessages: send_date ? '' : send_date_error,
            }"
          />
        </v-col>

        <v-col>
          <!-- empty div for spacing -->
        </v-col>
      </v-row>

      <p class="-mb-18px"><b>Title</b></p>

      <v-row>
        <v-col>
          <v-text-field
            flat
            outlined
            v-model="broadcast_name"
            placeholder="Enter Title"
            required
            :error-messages="!broadcast_name_error.length || broadcast_name.length > 5  ? '' : broadcast_name_error"
            :disabled="loading"
          />
        </v-col>

        <v-col>
          <!-- empty div for spacing -->
        </v-col>
      </v-row>

      <p class="-mb-18px"><b>Description</b></p>

      <v-row>
        <v-col>
          <v-textarea
            flat
            outlined
            v-model="description"
            placeholder="Enter Description"
            required
            :error-messages="
              description && description.split(' ').length > 50
                ? description_error
                : description
                ? ''
                : description_error
            "
            :disabled="loading"
            @input="max50Words($event)"
          />

          <p
            v-if="description_error && description_error === 'Max 50 words'"
            class="error--text"
          >
            Max 50 words
          </p>
        </v-col>

        <v-col>
          <!-- empty div for spacing -->
        </v-col>
      </v-row>

      <p class="-mb-18px"><b>Broadcast To</b></p>

      <v-row>
        <v-col>
          <v-radio-group v-model="send_to_all" row>
            <v-radio
              v-for="item in broadcastTos"
              :key="'send-to-all-' + item.value"
              :label="item.label"
              :value="item.value"
              :disabled="loading"
            />
          </v-radio-group>

          <v-select2
            v-if="!send_to_all"
            :options="organizations"
            v-model="broadcast_receiver"
            placeholder="Select Organization"
            multiple
            :disabled="loading"
          />

          <p
            v-if="
              !send_to_all &&
                !broadcast_receiver.length &&
                broadcast_receiver_error
            "
            class="error--text"
          >
            {{ broadcast_receiver_error }}
          </p>
        </v-col>

        <v-col>
          <!-- empty div for spacing -->
        </v-col>
      </v-row>

      <p class="-mb-18px">
        <b>Content</b>

        <br />

        <span>
          This content uses markdown code. See the

          <a
            href="https://www.markdownguide.org/basic-syntax/"
            target="_blank"
            rel="noopener noreferrer"
          >
            markdown guide
          </a>

          for more info.
        </span>
      </p>

      <span
        v-if="!content || content_error"
        class="error--text d-inline-block mt-4"
      >
        {{ content_error }}
      </span>

      <v-row>
        <v-col>
          <markdown-editor
            class="markdown-editor "
            :class="{ 'markdown-error': !content && content_error }"
            v-model="content"
          />

          <p class="mt-4"><b>Output</b></p>

          <VueMarkdown :source="content" show html />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-btn
            depressed
            style="background-color: #a5b3bf !important"
            block
            height="58"
            class="primary"
            to="/broadcast"
            exact
            :disabled="loading"
          >
            <span class="fz-16px">Cancel</span>

            <!-- loading indicator -->
            <beat-loader
              v-if="loading"
              :loading="loading"
              :color="'white'"
              :size="'10px'"
              class="ml-2"
            />
          </v-btn>
        </v-col>
        <v-col>
          <v-btn
            depressed
            block
            height="58"
            class="secondary"
            :disabled="loading"
            @click="submit"
          >
            <span class="fz-16px">Create</span>

            <!-- loading indicator -->
            <beat-loader
              v-if="loading"
              :loading="loading"
              :color="'white'"
              :size="'10px'"
              class="ml-2"
            />
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import api from "@/lib/api";

const requiredFields = [
  "send_date",
  "broadcast_name",
  "description",
  "content",
  "broadcast_receiver",
];

export default {
  data() {
    return {
      loading: false,
      send_date: null,
      broadcast_name: "",
      description: "",
      send_to_all: true,
      broadcastTos: [
        {
          label: "Select All",
          value: true,
        },
        {
          label: "Organization Selected",
          value: false,
        },
      ],
      content: "",
      organizations: [],
      broadcast_receiver: [],
      // fields errors
      send_date_error: "",
      broadcast_name_error: "",
      description_error: "",
      content_error: "",
      broadcast_receiver_error: "",
    };
  },
  methods: {
    async getOrganizations() {
      this.loading = true;

      try {
        const res = await api.GET(
          "/superadmin/list/manageorg?limit=-1&type=corporate"
        );

        const { organizations } = res.data;

        this.organizations = organizations.map((org) => {
          return {
            label: org.name,
            code: org.id,
          };
        });
      } catch (err) {
        let errmsg = "Sorry, an error occurred while displaying organizations";
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
    clearErrors() {
      this.send_date_error = "";
      this.broadcast_name_error = "";
      this.description_error = "";
      this.content_error = "";
      this.broadcast_receiver_error = "";
    },
    async submit() {
      this.clearErrors();
      const {
        send_date,
        broadcast_name,
        description,
        content,
        send_to_all,
        broadcast_receiver,
      } = this;

      const noEmptyField = requiredFields.every((field) => this[field]);

      if (noEmptyField) {
        if (!send_to_all && !broadcast_receiver.length) {
          this.$store.dispatch(
            "HOMEPAGE/showErrorToast",
            "There is an error field or empty field"
          );
          window.scrollTo({ top: 0, behavior: "smooth" });
          this.broadcast_receiver_error = "Value is required";
          return;
        } else if (content.length < 5) {
          this.$store.dispatch(
            "HOMEPAGE/showErrorToast",
            "There is an error field or empty field"
          );
          window.scrollTo({ top: 0, behavior: "smooth" });
          this.content_error = "This field should be at least 5 char";
        } else if (description.split(" ").length > 50) {
          this.$store.dispatch(
            "HOMEPAGE/showErrorToast",
            "There is an error field or empty field"
          );
          window.scrollTo({ top: 0, behavior: "smooth" });
          this.description_error = "Max 50 words";
        } else if (broadcast_name.length < 5) {
          this.$store.dispatch(
            "HOMEPAGE/showErrorToast",
            "There is an error field or empty field"
          );
          window.scrollTo({ top: 0, behavior: "smooth" });
          this.broadcast_name_error = "This field should be at least 5 long";
        } else {
          this.loading = true;

          try {
            const payload = {
              send_date,
              broadcast_name,
              description,
              content,
              send_to_all,
              broadcast_receiver: broadcast_receiver.map((b) => b.code),
            };

            await api.POST("/superadmin/broadcast", payload);

            this.$store.dispatch(
              "HOMEPAGE/showSuccessToast",
              "Broadcast has been succesfully created"
            );

            this.$router.push("/broadcast");
          } catch (err) {
            let errmsg = "Sorry, an error occurred while submitting broadcast";
            const thereIsErrorMessage =
              err && err.response && err.response.data;

            if (thereIsErrorMessage && err.response.data.data) {
              errmsg = err.response.data.data;
            }

            if (
              thereIsErrorMessage &&
              err.response.data.data !== "record not found"
            ) {
              this.$store.dispatch("HOMEPAGE/showErrorToast", errmsg);
            }
          }

          this.loading = false;
        }
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });

        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "There is an error field or empty field"
        );

        requiredFields.forEach((field) => {
          if (!this[field]) this[field + "_error"] = "Value is required";
        });
      }
    },
    max50Words(e) {
      const words = e.split(" ");

      if (words.length > 50) {
        this.description_error = "Max 50 words";
      } else {
        this.description_error = "";
      }
    },
  },
  mounted() {
    this.send_date = new Date();
  },
  watch: {
    send_to_all(newVal) {
      if (!newVal && !this.organizations.length) {
        this.getOrganizations();
      }
    },
  },
};
</script>

<style scoped>
.fz-16px {
  font-size: 16px;
}

.hideinput2 ::v-deep input {
  opacity: 0;
}

.-mb-18px {
  margin-bottom: -8px;
}

.markdown-error {
  border: 1px solid red;
}

@import "~vue-select/dist/vue-select.css";
</style>
