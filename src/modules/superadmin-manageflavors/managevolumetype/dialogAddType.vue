<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Create New Type</div>
      </v-card-text>

      <v-card-text>
        <p class="titletext">Name</p>
        <v-text-field
          maxlength="100"
          v-model="name"
          placeholder="Name"
          flat
          outlined
          :error-messages="nameError"
        />
      </v-card-text>

      <v-card-text>
        <p class="titletext">Description</p>
        <v-textarea
          rows="5"
          id="description"
          flat
          outlined
          maxlength="255"
          v-model="description"
          placeholder="Description"
          style="margin-bottom: 22px"
          required
          :error-messages="descriptionError"
        />
      </v-card-text>

      <v-card-text>
        <v-row>
          <v-col
            ><v-btn
              depressed
              height="45"
              block
              class="accent"
              @click="
                () => {
                  $emit('input', false);
                }
              "
            >
              Cancel
            </v-btn>
          </v-col>

          <v-col>
            <v-btn
              id="Add"
              depressed
              height="45"
              block
              class="secondary"
              @click="submit"
            >
              Add
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { computed } from "@vue/composition-api";

export default {
  props: ["value"],
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
      name: "",
      nameError: "",
      description: "",
      descriptionError: "",
    };
  },
  methods: {
    async submit() {
      //
    },
  },
};
</script>
