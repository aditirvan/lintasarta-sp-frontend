<template>
    <v-dialog max-width="700" v-model="dialog">
        <v-card class="pt-7">
            <v-card-text>
                <div class="headline font-weight-bold font--text">{{ type == 'acl' ? 'Advanced ACL' : type == 'sbr' ? 'Switch Backend Rule' : 'Servers'  }}</div>
            </v-card-text>
            <v-card-text>
              <v-simple-table>
                <template v-slot:default>
                    <thead >
                        <tr v-if="type =='acl'">
                        <th class="text-left">
                            Backend Name
                        </th>
                        <th class="text-left">
                            Switch Rule
                        </th>
                        <th class="text-left">
                            Acl
                        </th>
                        <th class="text-left">
                            Criteria
                        </th>
                        <th class="text-left">
                            Value
                        </th>
                        </tr>
                        <!-- <tr v-if="type =='sbr'">
                        <th class="text-left">
                            Backend Name
                        </th>
                        <th class="text-left">
                            Switch Rule
                        </th>
                        <th class="text-left">
                            Acl
                        </th>
                        </tr> -->
                        <tr v-if="type =='servers'">
                        <th class="text-left">
                            Server Name
                        </th>
                        <th class="text-left">
                            HTTP Address
                        </th>
                        <th class="text-left">
                            HTTP Port
                        </th>
                        </tr>
                    </thead>
                    <tbody v-if="type == 'acl'">
                        <tr
                        v-for="(x, index) in item"
                        :key="index"
                        >
                        <td>{{ x.backend_name }}</td>
                        <td>{{ x.switch_rule }}</td>
                        <td>{{ x.acl_value }}</td>
                        <td>{{ x.criterion }}</td>
                        <td>{{ x.value }}</td>
                        </tr>
                    </tbody>
                    <!-- <tbody v-if="type == 'sbr'">
                        <tr
                        v-for="(x, index) in item"
                        :key="index"
                        >
                        <td>{{ x.backend_name }}</td>
                        <td>{{ x.switch_rule }}</td>
                        <td>{{ x.acl_value }}</td>
                        </tr>
                    </tbody> -->
                    <tbody v-if="type == 'servers'">
                        <tr
                        v-for="(x, index) in item"
                        :key="index"
                        >
                        <td>{{ x.server_name }}</td>
                        <td>{{ x.server_address }}</td>
                        <td>{{ x.server_port }}</td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
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
        })
        return{
            dialog,
        }
    },
}
</script>