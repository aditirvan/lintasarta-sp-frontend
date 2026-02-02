<template>
    <v-dialog max-width="500" v-model="dialog">
        <v-card class="pt-7">
            <v-card-text>
                <div class="headline font-weight-bold font--text">Create New Package {{ monthly ? 'Monthly' : 'One Time'}}</div>
            </v-card-text>
            <v-card-text>
                <p class="titletext">Name Package</p>
                <v-text-field
                maxlength="100"
                v-model="namePackage"
                placeholder="Name Package"
                flat
                outlined
                :error-messages="$v.namePackage.$errors.length ? $v.namePackage.$errors[0].$message : ''"
                ></v-text-field>
            </v-card-text>
            <v-card-text>
                <p class="titletext">Quota</p>
                <v-text-field
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
                <p class="titletext">Price</p>
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
                :error-messages="$v.description.$errors.length ? $v.description.$errors[0].$message : ''"
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
                @click="addPackage"
                >Add</v-btn
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
const { required, numeric, minLength } = require("@vuelidate/validators");
import {
  useNamespacedActions,
  useNamespacedGetters,
} from "vuex-composition-helpers";
import { Rpformat } from "@/lib/formatter";

export default {
    props: ["value", "monthly"],
    setup(props, { emit }) {
        const { addNewPackage } = useNamespacedActions(PACKAGE,["addNewPackage"])
        const dialog = computed({
            get: () => props.value,
            set: (val) => {
                emit("input", val);
            },
        });
        const namePackage = ref("")
        const description = ref("")
        const quota = ref("")
        const price = ref("")
        const $v = useVuelidate(
            {
                namePackage: {
                    required,
                    minLength: minLength(5),
                },
                description: { required },
                quota: { required, numeric },
                price: { required },
                
            },
            {
                namePackage,
                description,
                quota,
                price
            }
        )
        

        const addPackage = async () => {
            $v.value.$touch();
            // console.log($v.value.$errors)
            if ($v.value.$errors.length) return;
            let payload = {
                name: namePackage.value,
                description: markdown.value,
                quota: parseInt(quota.value),
                price: parseInt(price.value),
                monthly: props.monthly ? "true" : "false"
            }
            // console.log(dialog)
            // console.log(payload)
            let resp = await addNewPackage(payload)
            if(resp.data.status){
                dialog.value = false
                emit("refreshTable", props.monthly)
            }
        }

        onMounted(() => {
            console.log(props)
        })
        return{
            namePackage,
            description,
            quota,
            price,
            pricefocus:ref(false),
            dialog,
            $v,
            Rpformat,
            addPackage,
            addNewPackage,
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
</style>