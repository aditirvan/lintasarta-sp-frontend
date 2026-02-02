<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Create New Type</div>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Type Name</p>
        <v-text-field
          maxlength="100"
          v-model="name"
          placeholder="Type Name"
          flat
          outlined
          :error-messages="nameErrors.length ? nameErrors[0].$message : ''"
        ></v-text-field>
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
          :error-messages="
            descriptionErrors.length ? descriptionErrors[0].$message : ''
          "
        ></v-textarea>
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
              >Cancel</v-btn
            ></v-col
          >
          <v-col
            ><v-btn
              id="Add"
              depressed
              height="45"
              block
              class="secondary"
              @click="addType"
              >Add</v-btn
            ></v-col
          >
        </v-row>
      </v-card-text>
    </v-card>
    <dialogfailcreate
      :message="messagefailcreate"
      v-model="opendialogfailcreate"
    />
  </v-dialog>
</template>
<script>
import { useType } from "./useType";
import { computed, onMounted, ref, watch } from "@vue/composition-api";
import dialogfailcreate from "./dialogFailCreate";
import { useNamespacedMutations } from "vuex-composition-helpers";
const { required, minLength } = require("@vuelidate/validators");
//const { required, email: vemail, numeric } = require("@vuelidate/validators");
// import { useProjects } from "../project/useprojects";

const useVuelidate = require("@vuelidate/core").default;
export default {
  props: ["value"],
  components: { dialogfailcreate },
  setup(props, { emit }) {
    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        emit("input", val);
      },
    });
    const Composable = {
      ...useType(),
    };

    const name = ref("");
    const description = ref("");

    const { addFlavortype } = Composable;

    onMounted(() => {});
    const $v = useVuelidate(
      {
        name: {
          required,
          minLength: minLength(5),
          conditional: {
            $message: () => namealreadyexist.value,
            $validator: () => {
              return !namealreadyexist.value;
            },
          },
        },
        description: { required },
      },

      { name, description }
    );
    watch(name, (val) => {
      namealreadyexist.value = "";
      $v.value.name.$reset();
    });
    // watch(org,(val)=>{
    //   fetchRoles({currentOrg:{id:val}, page:1,itemsPerPage:-1})
    // })
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
    const opendialogfailcreate = ref(false);
    const messagefailcreate = ref("");
    const namealreadyexist = ref("");

    const Errors = createErrors({ name, description });
    const { setopendialogcommonsuccess } = useNamespacedMutations("DASHBOARD", [
      "setopendialogcommonsuccess",
    ]);
    return {
      ...Composable,
      ...Errors,
      name,
      description,
      dialog,
      messagefailcreate,
      opendialogfailcreate,
      addType: () => {
        $v.value.$touch();
        if ($v.value.$errors.length) return;
        const data = {
          name: name.value,
          description: description.value,
        };
        addFlavortype(data)
          .then(() => {
            dialog.value = false;
            emit("added");
            setopendialogcommonsuccess(true);
          })
          .catch((e) => {
            const data = e.response.data.data;
            if (data == "Type name already exist") {
              namealreadyexist.value = "Name already exist";
            }
            // messagefailcreate.value = data;
            // opendialogfailcreate.value = true;
            // name.value="";
            // description.value="";
          });
      },
    };
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.titletext {
  font-weight: 700;
  font-size: 12px;
}
.v-input--is-disabled {
  ::v-deep .v-input__slot {
    background: #f1f2f2;
  }
}
</style>
