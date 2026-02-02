<template>
    <v-dialog v-model="dialog" max-width="500">
        <v-card>
            <v-card-title>
                <div class="headline font-weight-bold font--text pb-4">
                    Save Editor
                </div>
            </v-card-title>
            <v-card-text class="pb-0">
                <p>By clicking save you agree to update the configuration. You can update it again if there is something missed or
                    incorrect with the syntax.
                </p>
                <p><b>Do you wish to proceed?</b></p>
            </v-card-text>
            <v-card-actions>
                <v-row class="ma-2">
                    <v-col cols="6">
                        <v-btn color="accent" block depressed height="50" @click="
                            () => {
                                $emit('close', false);
                            }
                        ">
                            Cancel
                        </v-btn>
                    </v-col>
                    <v-col cols="6">
                        <v-btn color="error" block height="50" depressed @click="
    () => {
        $emit('close', true);
    }
                        ">
                            Yes
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    props: ["value"],
    computed: {
        dialog: {
            get: function () {
                return this.value;
            },
            set: function (val) {
                this.$emit("close", val);
            },
        },
    },
};
</script>