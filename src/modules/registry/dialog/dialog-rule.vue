<template>
  <div>
    <v-dialog  v-model="dialog" max-width="800">
      <v-card class="pt-7 rounded-lg">
        <v-card-text>
          <div class="d-flex flex-row">
            <p class="fz-18 font-weight-bold mb-0">
              {{
                  type == "add"
                    ? "Add Tag Immutability Rule"
                    : "Edit Tag Immutability Rule"
                }}
            </p>
          </div>
        </v-card-text>
        <v-card-text>
          <div class="mt-2">
            <p class="mb-0">
              Specify a tag immutability rule for this project. Note: all tag
              immutability rules are first independently calculated and then
              unioned to capture the final set of immutable tags.
            </p>
          </div>
        </v-card-text>
        <v-card-text>
          <v-row>
            <v-col>For the repositories</v-col>
            <v-col
              >
              <v-select
                :items="itemsRepo"
                solo
                height="40"
                v-model="repoSelect"
              ></v-select
            ></v-col>
            <v-col>
              <v-text-field
                label="**"
                solo
                height="40"
                v-model="repoValue"
                :error-messages="$v.repoValue.$errors.length ? $v.repoValue.$errors[0].$message : ''"
              ></v-text-field
            ></v-col>
          </v-row>
          <v-row>
            <v-col cols="4"></v-col
            ><v-col cols="8" class="m-t-1"
              ><p>Enter multiple comma separated repos,repo*,or **</p></v-col
            ></v-row
          >
        </v-card-text>
        <v-card-text>
          <v-row>
            <v-col>Tags</v-col>
            <v-col
              >
              <v-select
                :items="itemsTag"
                solo
                height="40"
                v-model="tagsSelect"
              ></v-select
            ></v-col>
            <v-col
              >
              <v-text-field
                label="**"
                solo
                height="40"
                v-model="tagsValue"
                :error-messages="$v.tagsValue.$errors.length ? $v.tagsValue.$errors[0].$message : ''"
              ></v-text-field
            ></v-col>
          </v-row>
          <v-row>
            <v-col cols="4"></v-col
            ><v-col cols="8" class="m-t-1"
              ><p>Enter multiple comma separated tags,tag*,or **</p></v-col
            ></v-row
          >
        </v-card-text>
        <v-card-text>
          <v-row class="d-flex justify-end">
            <v-col class="d-flex flex-row justify-center" cols="3">
              <v-btn color="#CDCDCD" depressed block @click="
                        () => {
                            dialog = false
                            $emit('input', false);
                        }
                    ">
                Cancel
              </v-btn>
            </v-col>
            <v-col class="d-flex flex-row justify-center" cols="3">
              <v-btn  color="primary" depressed block  @click="onConfirm" :disabled="disable">
                ADD
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  useNamespacedActions,
  useNamespacedGetters,
} from "vuex-composition-helpers";
import { ref,computed,onMounted,watch } from "@vue/composition-api";
import useVuelidate from "@vuelidate/core";
import { required,not,sameAs } from "@vuelidate/validators";
import { REGISTRY } from "../namespace";
// import dialogConfirmDelete from "./dialog-confirm-delete.vue";
export default {
  props: ["value", "type", "item"],
  setup(props, { emit }) {
    
    const dialog = computed({
        get: () => props.value,
        set: (val) => {
            if(!val){
                emit('clearItem', {})
            }
            emit("input", val);
            
        },
    });
    
    const itemsRepo = ref([
      { text: "matching", value: "repoMatches" },
      { text: "excluding", value: "repoExcludes" },
    ]);
    const itemsTag = ref([
      { text: "matching", value: "matches" },
      { text: "excluding", value: "excludes" },
    ]);
// console.log(itemsRepo)
    const repoSelect = ref("repoMatches");
    const repoValue = ref("");
    const tagsSelect = ref("matches");
    const tagsValue = ref("");
    const content_error = ref("")
    const disable = ref(true)

    watch(repoValue, (val) => {
      // console.log(val)
      if(tagsValue.value!="" && val !=""){
        disable.value=false
      }
      else{
        disable.value=true
      }
    });
    watch(tagsValue, (val) => {
      // console.log(val)
      if(repoValue.value!="" && val !=""){
        disable.value=false
      }
      else{
        disable.value=true
      }
    });
    const $v = useVuelidate(
            {
                repoValue: { required,notSames:not(sameAs("**")),notSame:not(sameAs("*")),},
                tagsValue: { required,notSames:not(sameAs("**")),notSame:not(sameAs("*")),}
            },
            {
                repoValue,
                tagsValue,
            }
        )
    const {updateTagImmutable,createTagImmutable} = useNamespacedActions(
      REGISTRY,
      ["updateTagImmutable","createTagImmutable"]
    );
    
    const onConfirm = async () => {
      $v.value.$touch();
      // console.log("error",$v.value.$errors)
      content_error.value = $v.value.$errors.length ? "value is required" : ""
      if ($v.value.$errors.length) return;
      // console.log("onConfirm",props)
      if(props.type== 'add'){
        const param={
            "disabled":false,
            "action":"immutable",
            "scope_selectors":{
              "repository":[
                {
                  "kind":"doublestar",
                  "decoration":repoSelect.value,
                  "pattern":repoValue.value
                }
              ]
            },
            "tag_selectors":[
              {
                "kind":"doublestar",
                "decoration":tagsSelect.value,
                "pattern":tagsValue.value
              }
            ],
            "priority":0,
            "template":"immutable_template"
          }
        // console.log("param================",param)
        createTagImmutable(param)
      }else{
          const dataRules=props.item
          dataRules.scope_selectors.repository[0].pattern=repoValue.value
          dataRules.tag_selectors[0].pattern=tagsValue.value
          dataRules.tag_selectors[0].decoration=tagsSelect.value
          dataRules.scope_selectors.repository[0].decoration=repoSelect.value
        // console.log("update================",dataRules)
        updateTagImmutable(dataRules)
      }
      dialog.value = false
    }
    
    onMounted(() => {
            // console.log("onMounted",props)
            if(props.type=="edit"){
              repoSelect.value =props.item.scope_selectors.repository[0].decoration;
              repoValue.value = props.item.scope_selectors.repository[0].pattern;
              tagsSelect.value = props.item.tag_selectors[0].decoration;
              tagsValue.value =props.item.tag_selectors[0].pattern;
              disable.value=false
            }
    })
    return {
      dialog,
      onConfirm,
      itemsRepo,  
      itemsTag,
      repoSelect,
      repoValue,
      tagsSelect,
      tagsValue,
      updateTagImmutable,
      createTagImmutable,
      $v,
      content_error,
      disable,
    };
  },
};
</script>

<style lang="scss" scoped>
.m-t-1 {
  margin-top: -25px;
}
::v-deep .v-text-field__details {
  position: static;
}
.markdown-error {
  border: 1px solid red;
}
</style>