<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Edit Sales</div>

        <p class="mt-4">
          <b>Full Name</b>
        </p>

        <v-text-field
          v-model="fullname"
          :error-messages="fullnameErrors.length ? fullnameErrors[0].$message : ''"
          outlined
          placeholder="Enter Full Name"
        />

        <p class="mt-4">
          <b>Phone Number</b>
        </p>

        <v-text-field
          v-mask="[
            /[1-9]/,
            /[0-9]/,
            /[0-9]/,
            ' ',
            /[0-9]/,
            /[0-9]/,
            /[0-9]/,
            ' ',
            /[0-9]/,
            /[0-9]/,
            /[0-9]/,
            ' ',
            /[0-9]/,
            /[0-9]/,
            /[0-9]/,
          ]"
          prefix="+62"
          v-model="phone_number"
          :error-messages="phone_numberErrors.length ? phone_numberErrors[0].$message : ''"
          outlined
          placeholder="Enter Phone Number"
        />

        <p class="mt-4">
          <b>Email</b>
        </p>

        <v-text-field
          type="email"
          v-model="email"
          :error-messages="emailErrors.length ? emailErrors[0].$message : ''"
          outlined
          placeholder="Enter Email"
          @keyup="onEnter"
        />

        <p class="mt-4">
          <b>Description</b>
        </p>

        <v-text-field
          v-model="description"
          :error-messages="descriptionErrors.length ? descriptionErrors[0].$message : ''"
          outlined
          placeholder="Enter Description"
        />

        <v-row class="mt-8">
          <v-col>
            <v-btn
              depressed
              height="45"
              block
              class="accent"
              @click="$emit('input', false)"
              :disabled="loading"
            >
              Cancel

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
              height="45"
              block
              class="secondary"
              @click="submit"
              :disabled="loading"
            >
              Add

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
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { computed, ref } from "@vue/composition-api";
import api from "@/lib/api";
import useVuelidate from "@vuelidate/core"
import { useNamespacedMutations } from "vuex-composition-helpers"
const { required, email: vemail, numeric, minLength } = require("@vuelidate/validators");

export default {
  props: ["value", "item"],
  setup(props, { emit }) {
    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        emit("input", val);
      },
    });

    const fullname = ref('');
    const email = ref('');
    const phone_number = ref('')
    const description= ref('')
    const $v = useVuelidate(
      {
        fullname: {
          required,
          minLength: minLength(5),
        },
        email: {
          required,
          vemail,
        },
        phone_number: {
          required,
          custom:{
            $message: "value min 10 number",
            $validator: (val)=>val.replaceAll(' ','').length > 10
          }
        },
        description: {
          required,
        },
      },
      { fullname, email, phone_number, description }
    );

    function createErrors(obj) {
      const key = Object.keys(obj);
      const res = {};
      key.forEach((k) => {
        res[k + "Errors"] = computed(() => {
          return $v.value[k].$errors;
        });
      });
      return res;
    }
    const Errors = createErrors({ fullname, email, phone_number, description });
    const { setopendialogcommonsuccess } = useNamespacedMutations("DASHBOARD", [
      "setopendialogcommonsuccess",
    ]);

    return {
      dialog,
      ...Errors,
      fullname, email, phone_number, description,
      submit: async () => {

        $v.value.$touch();
        if ($v.value.$errors.length) return;

        const payload = {
          fullname: fullname.value,
          phone_number: phone_number.value,
          email: email.value,
          description: description.value,
        };

        return await api.PUT("/superadmin/sales/" + props.item.id, payload).then(() => {
          emit("input", false)
          emit("update");
          setopendialogcommonsuccess(true);
        });
      },
    };
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    onEnter(e) {
      this.email = this.email.toLowerCase();
    },
  },
  mounted() {
    const { fullname, phone_number, email, description } = this.item;

    this.fullname = fullname;
    this.phone_number = phone_number;
    this.email = email;
    this.description = description;
  },
};
</script>
