<template>
    <v-dialog max-width="700" v-model="dialog">
        <v-card class="pt-7">
            <v-card-text>
                <div class="headline font-weight-bold font--text">Detail {{ type == 'default' ? 'Default' : type == 'onetime' ? 'Add Ons' : "Monthly"}} Package</div>
            </v-card-text>
            <v-card-text>
                <v-row>
                    <v-col>
                        <p>
                        <b>Package Name:</b><br />
                        {{ item.name }}
                        </p>
                    </v-col>
                    <v-col>
                        <p>
                            <b>Type:
                                </b><br />
                            <v-chip
                            outlined
                            class="mt-1 mr-1"
                            color="primary"
                            small
                                v-for="data in item.package_type" :key="data.id"
                            >
                            <span>{{ data.type.name }}</span>
                            </v-chip>
                        </p>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <p>
                        <b>Price:</b><br />
                        {{ item.price }}
                        </p>
                    </v-col>
                    <v-col>
                        <p>
                        <b>Quota:
                            </b><br />
                        {{ item.quota }}
                        </p>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <p>
                        <b>Description:</b><br />
                        <VueMarkdown :source="item.description" show html class="mt-1" />
                        </p>
                    </v-col>
                </v-row>
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
                    >Close</v-btn
                    ></v-col
                >
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import { computed, ref, watch, onMounted } from "@vue/composition-api";
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
        onMounted(() => {
            console.log(props)
        })
        return{
            dialog,
        }
    },
}
</script>