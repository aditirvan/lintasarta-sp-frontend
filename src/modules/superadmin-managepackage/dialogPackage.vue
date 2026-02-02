<template>
    <v-dialog max-width="600" v-model="dialog">
        <v-card class="pt-7">
            <v-card-text>
                <div class="headline font-weight-bold font--text">{{ item.id ? 'Edit ' :  'Create New ' }} {{ type == 'default' ? 'Default' : type == 'onetime' ? 'Add Ons' : "Monthly"}} Package</div>
            </v-card-text>
            <v-card-text>
                <p class="font-weight-bold">Package Name</p>
                <v-text-field
                maxlength="100"
                v-model="namePackage"
                placeholder="Package Name"
                flat
                outlined
                :error-messages="$v.namePackage.$errors.length ? $v.namePackage.$errors[0].$message : ''"
                ></v-text-field>
            </v-card-text>
            <v-card-text v-if="(!item.id && type != 'onetime') || (item.id && type != 'onetime') || (item.id && type == 'onetime')">
                <p class="font-weight-bold">Quota</p>
                <v-text-field
                :readonly="readOnly"
                maxlength="100"
                v-model="quota"
                placeholder="Quota"
                flat
                outlined
                type="number"
                :error-messages="$v.quota.$errors.length ? $v.quota.$errors[0].$message : ''"
                ></v-text-field>
            </v-card-text>
            <v-card-text>
                <p class="font-weight-bold">Price</p>
                <v-text-field
                :class="{hideinput:pricefocus==false}"
                maxlength="100"
                v-model="price"
                type="number"
                flat
                outlined
                @focus="pricefocus = true"
                @blur="pricefocus = false"
                :error-messages="$v.price.$errors.length ? $v.price.$errors[0].$message : ''"
                >
                <template v-slot:prepend-inner>
                    <span><span class="font--text">Rp | </span>{{pricefocus?'':Rpformat.format(price)}}</span>
                </template>
                </v-text-field>
            </v-card-text>
            <v-card-text v-if="type != 'default'">
                <p class="font-weight-bold">Type</p>
                <v-select
                v-model="selectType"
                :items="getListType"
                item-text="name"
                item-value="id"
                placeholder="Type"
                multiple
                outlined
                flat
                :error-messages="$v.selectType.$errors.length ? $v.selectType.$errors[0].$message : ''"
                >
                </v-select>
            </v-card-text>
        
            <v-card-text>
                <p class="titletext">
                    <b>Description</b>
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
                v-if="!description && content_error"
                class="error--text d-inline-block mt-4"
                >
                    {{ content_error }}
                </span>
                <markdown-editor
                class="markdown-editor "
                :class="{ 'markdown-error': !description && content_error}"
                v-model="description"
                />

                <p class="mt-4"><b>Output</b></p>

                <VueMarkdown :source="description" show html />
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
                            dialog = false
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
                    @click="addPackage"
                    >{{ item.name ? 'Update' : 'Add' }}</v-btn
                    ></v-col
                >
                </v-row>
            </v-card-text>
        </v-card>
  </v-dialog>
</template>

<script>
import { computed, ref, watch, onMounted } from "@vue/composition-api";
import useVuelidate from "@vuelidate/core";
import { PACKAGE } from "./namespace";
const { required, numeric, minValue, minLength } = require("@vuelidate/validators");
import {
  useNamespacedActions,
  useNamespacedGetters,
} from "vuex-composition-helpers";
import { Rpformat } from "@/lib/formatter";

export default {
    props: ["value", "type", "item"],
    setup(props, { emit }) {
        const { addNewPackage, updatePackage, listType } = useNamespacedActions(PACKAGE,["addNewPackage", "updatePackage", "listType"])
        const { getListType } = useNamespacedGetters(PACKAGE,["getListType"])

        const dialog = computed({
            get: () => props.value,
            set: (val) => {
                if(!val){
                    emit('clearItem', {})
                }
                emit("input", val);
                
            },
        });
        const namePackage = ref("")
        const description = ref("")
        const quota = ref("")
        const price = ref("")
        const selectType = ref([])
        const content_error = ref("")
        const readOnly = ref(false)
        const $v = useVuelidate(
            {
                namePackage: {
                    required,
                    minLength: minLength(5),

                },
                description: { required },
                quota: { required, numeric, $autoDirty: true, minValue: minValue(1) },
                price: { required, $autoDirty: true, minValue: minValue(1) },
                selectType: { required }
                
            },
            {
                namePackage,
                description,
                quota,
                price,
                selectType
            }
        )
        

        const addPackage = async () => {
            $v.value.$touch();
            if(!props.item.id && props.type == 'onetime'){
                quota.value = 1
            }
            // console.log($v.value.$errors)
            content_error.value = $v.value.$errors.length ? "value is required" : ""
            if ($v.value.$errors.length) return;
            let payload = {}
            payload = {
                name: namePackage.value,
                description: description.value,
                quota: parseInt(quota.value),
                price: parseInt(price.value),
                monthly: props.type == "monthly" ? "true" : "false",
                type_id: selectType.value,
                is_default: props.type == "default" ? "true" : "false"
            }
            console.log(payload)
            let resp = null
            if(props.item.name){
                payload.id = props.item.id
                resp = await updatePackage(payload)

            }else{
                resp = await addNewPackage(payload)
            }
            // console.log(payload)
            if(resp.data.status){
                dialog.value = false
                emit("refreshTable", props.type)
            }
        }
        onMounted(() => {
            listType()
            console.log(props)
            if((props.type == 'onetime' || props.type == 'default') && props.item.id){
                readOnly.value = true
            }
            if(props.item.name){
                let type = props.item.package_type.map(data => data.type.id)
                namePackage.value = props.item.name
                quota.value = props.item.quota
                price.value = props.item.price ? props.item.price : "" 
                selectType.value = type
                description.value = props.item.description
                // console.log(type)
            }
        })
        return{
            namePackage,
            description,
            quota,
            price,
            selectType,
            readOnly,
            content_error,
            pricefocus:ref(false),
            dialog,
            $v,
            Rpformat,
            addPackage,
            addNewPackage,
            updatePackage,
            getListType
        }
    },
}
</script>
<style lang="scss" scoped>
.hideinput{
  ::v-deep input{
    position: relative;
    bottom:50px;
    z-index: -2;
  }
}
.markdown-error {
  border: 1px solid red;
}
</style>