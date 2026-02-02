<template>
  <div>
    <v-dialog v-model="value" persistent max-width="500">
      <form @submit.prevent="submit">
        <v-card>
          <v-card-title>
            <h3>Add public SSH key</h3>
          </v-card-title>
          <v-card-text class="pb-0">
            <p>
              Copy your public SSH key and paste it in the space below. For
              instructions on how, follow the steps on the right.
            </p>
          </v-card-text>
          <v-card-text>
            <p><b>Choose Project</b></p>
            <v-select
              id="SelectProject"
              v-model="selectedProject"
              outlined
              :items="selectProjectByUser"                  
              placeholder="Choose Project"
              :error="$v.selectedProject.$error"
              :error-messages="selectedProjectError()"              
            >
            </v-select>
          </v-card-text>
          <v-card-text>
            <p><b>SSH Key Content</b></p>
            <v-textarea
              id="enterSSHKEYContent"
              @change="onsshkeyChange"
              :error="$v.sshkey.$error"
              :error-messages="sshkeyError()"
              v-model.trim="sshkey"
              outlined
              placeholder="Enter SSH Key Content"
            ></v-textarea>
          </v-card-text>
          <v-card-text>
            <p><b>Name</b></p>
            <v-text-field
              maxlength="50"
              id="SSHKEYNAME"
              @change="$v.sshname.$touch()"
              v-model="sshname"
              :error="$v.sshname.$error"
              :error-messages="sshnameError()"
              outlined
              placeholder="Enter Name"
            ></v-text-field>
          </v-card-text>
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
                  id="SubmitSSHkey"
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
                  <b>Add SSH Key</b>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </form>
    </v-dialog>
    <v-dialog v-model="dialogError" persistent max-width="550">
      <v-card>
        <v-card-title class="headline font-weight-bold font--text pb-4">
          <v-icon class="mr-4">$vuetify.icons.trianglealertIcon</v-icon>
          Cannot Create SSH Key
        </v-card-title>
        <v-card-text class="pb-0 pt-4">
          <p class="font-weight-400">
            Please create project first before create SSH Key
          </p>
        </v-card-text>
        <v-card-actions>
          <v-row class="ma-2">
            <v-col class="px-0">
              <v-btn
                height="50"
                depressed
                color="secondary"
                block
                @click="closeDialogError"
              >
                Close
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { ref, onMounted } from "@vue/composition-api";
import {
  useNamespacedState,
  useNamespacedActions,
} from "vuex-composition-helpers";
import { required, minLength } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";
import { useRegion } from "../instance/compositionapi/useregion";

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    userid: {
      type: String,
      required: true,
    },
  },
  setup() {
    const { selectprojectbyuser: selectProjectByUser, fetchprojectbyuser, selectedProject } = useRegion()
    onMounted(() => {
      fetchprojectbyuser()
    });
    const dialogError = ref(false);
    const sshkey = ref("");
    const sshname = ref("");
    const warningssh = ref("");
    const { isLoading } = useNamespacedState("PROFILE", ["isLoading"]);
    const {
      showErrorToast,
      showSuccessToast,
    } = useNamespacedActions("HOMEPAGE", [
      "showErrorToast",
      "showSuccessToast",
    ]);
    return {
      dialogError,
      sshkey,
      sshname,
      isLoading,
      warningssh,
      showErrorToast,
      showSuccessToast,
      selectProjectByUser,
      selectedProject,
    };
  },
  methods: {
    resetFields() {
      this.sshname = "";
      this.sshkey = "";
      this.selectedProject = null
      this.$v.$reset();
    },
    onsshkeyChange() {
      this.$v.sshkey.$touch();
    },
    sshkeyError() {
      if (!this.$v.sshkey.$dirty) return "";
      switch (false) {
        case this.$v.sshkey.required:
          return "ssh key required";
        case this.$v.sshkey.sshkey:
          return "not valid ssh key, please check again";
      }
    },
    sshnameError() {
      if (!this.$v.sshname.$dirty) return "";
      switch (false) {
        case this.$v.sshname.required:
          return "name your ssh key";
        case this.$v.sshname.whitespaceStart:
          return "ssh key name cannot start with whitespace";
        case this.$v.sshname.whitespaceEnd:
          return "ssh key name cannot end with whitespace";
        case this.$v.sshname.specialChars:
          return "ssh key name cannot contains special characters";
        case this.$v.sshname.minLength:
          return "This field should be at least 5 long";
      }
    },
    selectedProjectError() {
      if (!this.$v.selectedProject.$dirty) return null;
      switch (false) {
        case this.$v.selectedProject.required:
          return "choose project";
      }
    },
    closeDialogError() {
      this.sshname = "";
      this.sshkey = "";
      this.selectedProject = null;
      this.$v.$reset();
      this.dialogError = false;
      this.$emit("close");
    },
    submit() {
      this.$v.$touch();
      if (!this.$v.$anyError) {
        this.createsshkey({
          name: this.sshname,
          sshkey: this.sshkey,
          project_id: this.selectedProject
        })
          .then((res) => {
            if (res.status === 200) {
              this.sshname = "";
              this.sshkey = "";
              this.selectedProject = null;
              this.$v.$reset();
              this.fetchsshkeys(this.userId);
              this.showSuccessToast("Keypair created successfully");
              this.$emit("close");
            }
          })
          .catch((error) => {
            if (error.response.data.code == 400) {
              const msgErr = error.response.data.data;
              if (msgErr.includes("create project first")) {
                this.dialogError = true;
              }
              if (msgErr.includes("already exists")) {
                this.showErrorToast("Keypair name already exists");
              }
            }
          });
      }
    },
    ...mapActions("PROFILE", ["createsshkey", "fetchsshkeys"]),
  },
  validations: {
    sshkey: {
      required,
      sshkey: (val) => {
        return !!val.match(
          /ssh-rsa AAAA[0-9A-Za-z+/]+[=]{0,3}( [^@]+@[^@]+)?/gi
        );
      },
    },
    sshname: {
      required,
      whitespaceStart: async (val) => {
        if (val[0] === " ") return false;
        return true;
      },
      specialChars: (val) => {
        return !val.match(/[^A-Za-z0-9-_]/g);
      },
      whitespaceEnd: async (val) => {
        let endChar = val.length - 1;
        if (val[endChar] === " ") return false;
        return true;
      },
      minLength: minLength(5),
    },
    selectedProject:{
      required,
    }
  },
  watch: {
    sshkey() {
      if (!this.$v.sshkey.$invalid) {
        const email = /ssh-rsa AAAA[0-9A-Za-z+/]+[=]{0,3}( [^@]+@[^@]+)?/gi.exec(
          this.sshkey
        );
        // this.sshname = email[1]
      }
    },
  },
};
</script>
