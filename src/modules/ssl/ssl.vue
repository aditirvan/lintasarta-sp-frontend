<template>
    <div>
        <v-row>
            <v-col cols="12">
                <v-card flat class="rounded-lg elevation-0">
                    <v-container class="px-7 py04" fluid>
                        <v-row class="d-flex align-center">
                            <v-col cols="8">
                                <div class="headline mb-2 font-weight-bold font--text">
                                    SSL
                                </div>
                                <p style="color: #a5b3bf;">
                                    SSL is a security protocol that
                                    provides privacy, authentication, and integrity to internet
                                    communications.
                                </p>
                            </v-col>

                            <v-col cols="4" class="d-flex justify-end align-center" v-if="listSsl.length > 0 && !read_only">
                                <v-btn depressed append to="import" class="secondary mr-5" width="150" height="45">
                                    Import SSL
                                </v-btn>
                                <v-btn depressed append to="create" class="secondary" width="150" height="45">
                                    Create SSL
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-row v-if="listSsl.length > 0">
                            <v-col col="12">
                                <v-data-table hide-default-footer :headers="headers" :items="listSsl"
                                    :items-per-page="itemSelected" class="elevation-0">
                                    <template v-slot:no-data>
                                        {{ isLoading ? "Loading.." : "No data available" }}
                                    </template>
                                    <template v-slot:item.fqdn="{ item }">
                                        <div class="d-flex">
                                            <v-icon color="primary" class="mr-3">mdi-circle</v-icon>
                                            <div>
                                                <router-link :to="'' + item.id" append>
                                                    <span class="primary--text">{{ item.fqdn }}</span>
                                                </router-link>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-slot:item.billing_type>
                                        Free
                                    </template>
                                    <template v-slot:item.isExpired="{ item }">
                                        <div>
                                            <v-chip :color="item.isExpired ? 'red' : 'green'" text-color="white">{{
                                                item.isExpired ?
                                                'Expired' : 'Active' }}</v-chip>
                                        </div>
                                    </template>
                                    <template v-slot:item.createdAt="{ item }">
                                        {{ $moment(item.createdAt).format("DD/MM/YYYY HH:mm") }}
                                    </template>
                                    <template v-slot:item.expiredAt="{ item }">
                                        <span v-if="item.expiredAt">
                                            {{ $moment(item.expiredAt).format("DD/MM/YYYY HH:mm") }}
                                        </span>
                                    </template>
                                    <template v-slot:item.action="{ item }">
                                        <popupquote v-model="item.open" :offsetTop="21" :documentid="'popup' + item.id"
                                            offset-y allow-overflow>
                                            <template v-slot:activator="{ on, attrs }">
                                                <label v-bind="attrs" class="primary--text linkpointer"
                                                    style="position: relative; white-space: nowrap" @click="
                                                        ($event) => {
                                                            on.click($event);
                                                        }
                                                    ">More
                                                    <v-icon :class="{
                                                        rotate: item.open,
                                                    }" :id="'popup' + item.id" color="primary">mdi-chevron-down
                                                    </v-icon>
                                                </label>
                                            </template>
                                            <v-list>
                                                <v-list-item @click="removeSSL(item)" v-if="!read_only">
                                                    <v-list-item-title class="error--text">Delete</v-list-item-title>
                                                </v-list-item>
                                            </v-list>
                                        </popupquote>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                        <v-row v-else>
                            <v-col md="12">
                                <v-card flat outlined class="d-flex rounded-lg flex-grow-1 flex-column text-center ma-auto">
                                    <v-card-text style="padding-top: 72px; padding-bottom: 78px">
                                        <p style="font-size: 16px; margin-bottom: 10px; text-transform: capitalize;"
                                            class="font-weight-bold">
                                            Looks like you don't have any SSL
                                        </p>
                                        <v-row>
                                            <v-col>
                                                <p style="font-size: 12px; color: #a5b3bf;margin-bottom: 20px;">
                                                    Create an SSL
                                                    to ensure that anyone who intercepts the data can only
                                                    see a scrambled mess of characters.
                                                </p>
                                            </v-col>
                                        </v-row>
                                        <v-row v-if="!read_only">
                                            <v-col class="flex justify-center">
                                                <v-btn width="50%" append max-width="300" height="50" depressed
                                                    class="secondary mr-5" exact to="create">
                                                    Create SSL
                                                </v-btn>
                                                <v-btn width="50%" append max-width="300" height="50" depressed
                                                    class="secondary" exact to="import">
                                                    Import SSL
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                        <div v-if="totalData > 10">
                            <v-row class="d-flex justify-end">
                                <v-col cols="2">
                                    <v-select hide-details dense :items="itemsPage" v-model="itemSelected" item-text="text"
                                        item-value="value" outlined class="rounded-lg flex-grow-0 selectFooter lis"
                                        @change="onChange($event)" :disabled="totalData <= 10">
                                        <template v-slot:selection="{ item }">
                                            1 - {{ item.text }} of {{ totalData }}</template>
                                    </v-select>
                                </v-col>
                                <v-col :cols="pagination === 1 ? 2 : 3">
                                    <div>
                                        <v-pagination v-model="page" class="page fz" prev-icon="Prev" next-icon="Next"
                                            :length="pagination" :total-visible="5" circle @input="onPageChange()">
                                        </v-pagination>
                                    </div>
                                </v-col>
                            </v-row>
                        </div>
                    </v-container>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>
<script>
import {
    ref,
    computed,
    onMounted,
} from "@vue/composition-api";
import {
    useNamespacedActions,
    useNamespacedGetters,
} from "vuex-composition-helpers";

import { AccessControl } from "@/lib/middleware";

export default {
    components: {},
    setup(props, context) {
        const access_control = new AccessControl(context.root.$store);
        const read_only = ref(access_control.is_read_mode('Deka SSL'));
        console.log("Deka SSl ", read_only);
        const headers = [
            { text: "Name", value: "fqdn" },
            { text: "Billing Type", value: "billing_type" },
            { text: "Status", value: "isExpired" },
            { text: "Created At", value: "createdAt" },
            { text: "Expired At", value: "expiredAt" },
            { text: "Action", sortable: false, value: "action" },
        ];
        const itemSelected = ref(10);
        const page = ref(1)
        const itemsPage = ref([
            { text: "10", value: 10 },
            { text: "20", value: 20 },
            { text: "50", value: 50 },
            { text: "100", value: 100 },
        ]);
        const pagination = computed(() => {
            let a = itemSelected.value;
            let b = totalData.value;
            return Math.ceil(b / a);
        });
        let params = {
            page: "1",
            limit: "10",
        }
        onMounted(async () => {
            await getListSSL(params);
        });
        const { listSsl, isLoading, totalData } = useNamespacedGetters("SSL", [
            "listSsl",
            "totalData",
            "isLoading",
        ]);
        const { getListSSL, deleteSSL } = useNamespacedActions("SSL", [
            "getListSSL",
            "deleteSSL",
        ]);
        function onPageChange() {
            const count = page.value;
            params.page = count.toString()
            params.limit = itemSelected.value.toString()
            getListSSL(params);
        }
        function onChange(event) {
            params.limit = itemSelected.value.toString()
            getListSSL(params);
        }
        async function removeSSL(item) {
            await deleteSSL({ id: item.id, isExternalSSL: item.isExternalSSL, fqdn: item.fqdn })
        }

        if(read_only.value){
            headers.pop()
        }

        return {
            read_only,

            isLoading,
            headers,
            listSsl,
            totalData,
            itemsPage,
            itemSelected,
            pagination,
            page,
            onPageChange,
            onChange,
            removeSSL,
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep .v-pagination.v-pagination {
    margin-bottom: 10px;
}

.page {
    border: 2px solid #d1d9e5;
    border-radius: 10px;
    height: 45px;
}

::v-deep .v-pagination {
    align-items: center;
    display: inline-flex;
    list-style-type: none;
    justify-content: space-between;
    margin: 0;
    max-width: 100%;
    width: 100%;
}

::v-deep .v-pagination__navigation {
    box-shadow: none;
    height: 30px;
}

::v-deep .v-pagination__item {
    box-shadow: none;
    height: 30px;
    font-size: 10px;
    margin: 0;
}

.fz ::v-deep .v-icon.v-icon {
    font-size: 12px;
}

.fz16 {
    font-size: 16px;
}

.lis {
    font-size: 12px;
    margin-left: 15px;
    font-weight: 500;
}

::v-deep .v-select__selections {
    margin-top: 5px !important;
}

::v-deep .v-pagination__more {
    display: none;
}
</style>