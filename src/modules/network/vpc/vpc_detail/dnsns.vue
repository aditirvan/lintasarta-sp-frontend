<template>
<v-row>
    <v-col cols="11" class="py-0">
        <v-text-field maxlength="50" :placeholder="$v.rule.dns_ip.$errors.length ? '' : 'DNS Name Servers'" single-line outlined v-model="rule.dns_ip" @change="() => {
          $v.rule.dns_ip.$touch()
        }" :error-messages="$v.rule.dns_ip.$errors.length?$v.rule.dns_ip.$errors[0].$message:''"></v-text-field>
    </v-col>
    <v-col cols="1" class="py-0">
        <div class="pt-3">
            <v-btn @click="()=>{$emit('deleteDnsIP')}" fab color="error">
                <v-icon style="font-size: 17px;">
                    mdi-minus
                </v-icon>
            </v-btn>
        </div>
    </v-col>
</v-row>
</template>

<script>
import useVuelidate from '@vuelidate/core';
import {
    required,
    minLength,
} from '@vuelidate/validators'
import {
    onMounted
} from '@vue/composition-api';

export default {
    props: ['rule', 'index'],
    setup(props, {
        emit
    }) {
        const $v = useVuelidate({
            rule: {
                dns_ip: {
                    required,
                    minValue: minLength(7),
                    $autoDirty: true,
                    regex: {
                        $message: "Invalid ip value",
                        $validator: (val) => {
                            return /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(
                                val
                            );
                        },
                    },
                },
            }
        }, {
            rule: props.rule
        })
        onMounted(() => {})

        return {
            $v,
        }
    },
}
</script>

<style scoped>
.v-btn {
    width: 25px;
    height: 25px;
}
</style>
