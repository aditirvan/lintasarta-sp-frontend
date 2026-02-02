<template>
    <v-dialog v-model="dialog" persistent max-width="400">

        <v-card>
            <v-card-title class="headline">
                <v-icon class="mr-4">$vuetify.icons.trianglealertIcon</v-icon>Renewal Failed 
            </v-card-title>
            <v-card-text class="pb-0 text-center">
                <p class="font-weight-bold mb-0">{{message}}</p>
            </v-card-text>
            <v-card-actions>
                <v-row class="ma-2">

                    <v-col>
                        <v-btn height="50" depressed color="secondary" block @click="  () => {
                            $emit('close', false);
                        }">
                            Close
                        </v-btn>
                    </v-col>
                </v-row>


            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    props: ["value", "message"],
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
}
</script>