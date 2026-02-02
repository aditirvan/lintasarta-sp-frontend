<template>
    <v-dialog max-width="600" v-model="dialog">
        <v-card class="pt-7">
        <v-card-text v-if="!selected_role">
            <div class="headline font-weight-bold font--text">Add Rule</div>
        </v-card-text>
        <v-card-text v-else>
            <div class="headline font-weight-bold font--text">Edit Rule</div>
        </v-card-text>

        <v-card-text>
            <v-row style="">
                <v-col cols="8">
                    <v-select
                        :items="protocolList"
                        v-model="protocolSelected"
                        outlined
                        :disabled="protocolDisabled"
                        single-line
                        append-icon="mdi-chevron-down"
                    />
                </v-col>
                <v-col cols="4">
                    <v-text-field
                        maxlength="50"
                        :value="actualProtocol"
                        disabled
                        outlined
                    ></v-text-field>
                </v-col>
            </v-row>
        </v-card-text>

        <v-card-text class="pt-0">
            <v-row style="">
                <v-col cols="4">
                    IP Version
                    <v-select
                        class="pt-1"
                        :items="etherTypeList"
                        v-model="etherTypeSelected"
                        :disabled="etherTypeDisabled"
                        outlined
                        single-line
                        append-icon="mdi-chevron-down"
                    />
                </v-col>
                <v-col cols="8">
                    IP Address
                    <v-text-field
                        class="pt-1"
                        maxlength="50"
                        v-model="ipAddress"
                        :disabled="ipAddressDisabled"
                        outlined
                        :error-messages="errorIp"
                    ></v-text-field>
                </v-col>
            </v-row>
        </v-card-text>

        <v-card-text>
            <v-row style="">
                <v-col cols="6">
                    Port Range Min
                    <v-text-field
                        class="pt-1"
                        maxlength="50"
                        v-model="portRangeMin"
                        :disabled="portRangeMinDisabled"
                        outlined
                    ></v-text-field>
                </v-col>
                <v-col cols="6">
                    Port Range Max
                    <v-text-field
                        class="pt-1"
                        maxlength="50"
                        v-model="portRangeMax"
                        :disabled="portRangeMaxDisabled"
                        outlined
                    ></v-text-field>
                </v-col>
            </v-row>
        </v-card-text>

        <v-card-text>
            <v-textarea label="Description" outlined v-model="description" :disabled="descriptionDisabled"></v-textarea>
        </v-card-text>

        <v-card-text>
            <v-row>
            <v-col>
                <v-btn
                depressed
                height="45"
                block
                class="accent"
                @click="dialog= false && resetValues()">
                Cancel
                </v-btn>
            </v-col>

            <v-col>
                <v-btn
                    :disabled="submitDisabled"
                    id="Add"
                    depressed
                    height="45"
                    block
                    :loading="submitLoading"
                    class="secondary"
                    @click="() => {submit()}">
                    <span v-if="selected_role">Edit</span>
                    <span v-else="selected_role">Create</span>
                </v-btn>
            </v-col>
            </v-row>
        </v-card-text>
        </v-card>
    </v-dialog>
</template>


<script>

import {useNamespacedActions} from "vuex-composition-helpers";
import { computed, ref, watch } from "@vue/composition-api";
import { isValidIPv4, isValidIPv6, detectChangedFieldsValue, extractData } from "@/lib/inputValidator";

import { DEKAROCK } from "../namespace";
import { pullAll } from "lodash";
  
export default {
    props: ['value', 'selected_role', 'selected_group', 'direction'],
    setup(props, { emit, root }) {
        const { getSecuritGroupRoles, addSecuritGroupRole, updateSecuritGroupRole } = useNamespacedActions(DEKAROCK, [
            "getSecuritGroupRoles", "addSecuritGroupRole", "updateSecuritGroupRole"
        ]);
        const etherTypeList = ["IPv4", "IPv6"]
        const defaultProtocol = {
            "SSH": {type:"TCP", port:"22"}, 
            "HTTP": {type:"TCP", port:"80"}, 
            "HTTPS": {type:"TCP", port:"443"}, 
            "MySQL": {type:"TCP", port:"3306"},
            "MongoDB": {type:"TCP", port:"27017"},
            "PostgreSQL": {type:"TCP", port:"5432"}
        }
        const customProtocol = {
            "Custom TCP Role": {type:"TCP"}, 
            "Custom UDP Role": {type:"UDP"}, 
            "Custom ESP Role": {type:"ESP"},
            "All ICMP Rule": {type:"ICMP"},
            ...defaultProtocol,
        }
        const regexPrefixAllowed = /^(?:[0-9]|[12]\d|32)$/;
        const protocolList = Object.keys(customProtocol);
        const etherTypeSelected = ref(etherTypeList[0])
        const protocolSelected = ref(protocolList[0])
        const actualProtocol = ref(customProtocol[protocolSelected.value].type);
        const ipAddress = ref("");
        const portRangeMax = ref("")
        const portRangeMin = ref("")
        const description = ref("")

        const etherTypeDisabled = ref(false)
        const protocolDisabled = ref(false)
        const ipAddressDisabled = ref(false)
        const portRangeMaxDisabled = ref(false)
        const portRangeMinDisabled = ref(false)
        const descriptionDisabled = ref(false)

        const errorIp = ref(null);
        const submitLoading = ref(false);
        const submitDisabled = computed({
            get: () => errorIp.value != null,
        });
        const dialog = computed({
            get: () => props.value,
            set: (val) => {
                emit("input", val);
            },
        });

        async function getIngress(){
            await getSecuritGroupRoles({params:{cluster_id:root.$route.params.id, security_group_id: props.selected_group.id, 'direction': 'ingress'}})
        }

        async function getEggress(){
            await getSecuritGroupRoles({params:{cluster_id:root.$route.params.id, security_group_id: props.selected_group.id, 'direction': 'egress'}})
        }

        function findProtocolByPort(portMin, portMax, protocol=null){
            portMin = String(portMin)
            portMax = String(portMax)
            if (portMin == portMax && (protocol == "TCP" || protocol == null)){
                for (const key in customProtocol) {
                    if (Object.hasOwnProperty.call(customProtocol, key)) {
                        const element = customProtocol[key];
                        if (portMin==element.port){
                            return key
                        }
                    }
                }
            }
            if (protocol){
                for (const key in customProtocol) {
                    if (Object.hasOwnProperty.call(customProtocol, key)) {
                        const element = customProtocol[key];
                        if (protocol==element.type && !element.port){
                            return key
                        }
                    }
                }
            }
        }

        function disableAll(){
            etherTypeDisabled.value = true
            protocolDisabled.value = true
            // ipAddressDisabled.value = true
            portRangeMaxDisabled.value = true
            portRangeMinDisabled.value = true
            // descriptionDisabled.value = true
        }

        function resetValues(){
            etherTypeSelected.value = etherTypeList[0]
            protocolSelected.value = protocolList[0]
            actualProtocol.value = customProtocol[protocolSelected.value].type
            ipAddress.value = ""
            portRangeMax.value = ""
            portRangeMin.value = ""
            description.value = ""

            etherTypeDisabled.value = false
            protocolDisabled.value = false
            ipAddressDisabled.value = false
            portRangeMaxDisabled.value = false
            portRangeMinDisabled.value = false
            descriptionDisabled.value = false

            errorIp.value = null
            submitLoading.value = false
        }

        async function submit(){
            let direction = props.direction;
            submitLoading.value = true
            let addMode = props.selected_role ? false : true
            let payload = {
                "direction": direction,
                "ethertype": etherTypeSelected.value,
                "protocol": actualProtocol.value.toLowerCase(),
                "remote_ip_prefix": ipAddress.value,
            }
            if (portRangeMin.value){
                payload.port_range_min = parseInt(portRangeMin.value)
            }
            if (portRangeMax.value){
                payload.port_range_max = parseInt(portRangeMax.value)
            }
            if (description.value) {
                payload.description = description.value
            }

            if (addMode){
                payload.security_group_id = props.selected_group.id
                await addSecuritGroupRole({payload: payload})
            }else{
                if (props.selected_role.remote_ip_prefix === "" && payload.remote_ip_prefix === "Any"){
                  payload.remote_ip_prefix = ""
                }
                if (props.selected_role.port_range_min === null && isNaN(payload.port_range_min)){
                  payload.port_range_min = null
                }
                if (props.selected_role.port_range_max === null && isNaN(payload.port_range_max)){
                  payload.port_range_max = null
                }
                let edited = detectChangedFieldsValue(props.selected_role, payload)
                let edited_payload = extractData(payload, edited)

                await updateSecuritGroupRole({id: props.selected_role.id, payload: edited_payload})
            }
            submitLoading.value = false
            if (direction == "ingress"){
                await getIngress()
            }else if (direction == "egress"){
                await getEggress()
            }
            dialog.value = false
        }

        watch(protocolSelected, (val) => {
            const defaultData = (props.selected_role && props.selected_role.default_data)
            const disabledPort = Object.keys(defaultProtocol);
            const cosProtocol = customProtocol[val]
            if (cosProtocol){
                actualProtocol.value = cosProtocol.type
                if (disabledPort.includes(val) || (disabledPort.includes(val) && defaultData)){
                    portRangeMinDisabled.value = true
                    portRangeMaxDisabled.value = true
                    if (!defaultData){
                        portRangeMin.value = defaultProtocol[val].port
                        portRangeMax.value = defaultProtocol[val].port
                    }
                }else if (!defaultData){
                    portRangeMinDisabled.value = false
                    portRangeMaxDisabled.value = false
                }
            }
        })

        watch(dialog, () => {
            if (props.selected_role){
                if (props.selected_role.protocol){
                    actualProtocol.value = props.selected_role.protocol.toUpperCase();
                    protocolSelected.value = findProtocolByPort(
                        props.selected_role.port_range_min, 
                        props.selected_role.port_range_max, 
                        actualProtocol.value
                    )
                }
                etherTypeSelected.value = props.selected_role.ethertype
                if (props.selected_role.port_range_max){
                    portRangeMax.value = props.selected_role.port_range_max
                }else{
                    portRangeMax.value = "Any"
                }
                if (props.selected_role.port_range_min){
                    portRangeMin.value = props.selected_role.port_range_min   
                }else{
                    portRangeMin.value = "Any"
                }
                description.value = props.selected_role.description
                if (props.selected_role.remote_ip_prefix){
                    ipAddress.value = props.selected_role.remote_ip_prefix
                }else{
                    ipAddress.value = "Any"
                }
                if (props.selected_role.default_data){
                    disableAll()
                }
            }else{
                resetValues()
            }
        })

        watch(ipAddress, (val) => {
            if (val == "" || val == null){
                errorIp.value = null
                ipAddress.value = null
                return
            }
            if (val == "Any"){
                errorIp.value = null
                return   
            }
            if (etherTypeSelected.value == "IPv4"){
                let splitIp = val.split("/")
                if (splitIp.length > 2){
                    errorIp.value = "Not valid IPv4"
                    return
                }else if (splitIp.length == 1){
                    if (!isValidIPv4(splitIp[0])){
                        errorIp.value = "Not valid IPv4"
                        return
                    }
                }else if (splitIp.length == 2){
                    if (!isValidIPv4(splitIp[0])){
                        errorIp.value = "Not valid IPv4"
                        return
                    }
                    if (!regexPrefixAllowed.test(splitIp[1])){
                        errorIp.value = "Not valid Prefix for IPv4"
                        return
                    }
                }
            }else if (etherTypeSelected.value == "IPv6" && !isValidIPv6(val)){
                errorIp.value = "Not valid IPv6"
                return
            }
            errorIp.value = null
        })

        watch(portRangeMin, (val) => {
            let protocol = findProtocolByPort(val, portRangeMax.value, "TCP")
            if (protocol){
                protocolSelected.value = protocol
            }
        })

        watch(portRangeMax, (val) => {
            let protocol = findProtocolByPort(portRangeMin.value, val, "TCP")
            if (protocol){
                protocolSelected.value = protocol
            }
        })

        watch(etherTypeSelected, () => {
            resetValues()
        })

        watch(dialog, (va) => {
            if (!va){
                resetValues()
            }
        })

        return {
            dialog,

            actualProtocol,
            ipAddress,
            etherTypeList,
            etherTypeSelected,
            protocolList,
            protocolSelected,
            portRangeMax,
            portRangeMin,
            description,

            etherTypeDisabled,
            protocolDisabled,
            ipAddressDisabled,
            portRangeMaxDisabled,
            portRangeMinDisabled,
            descriptionDisabled,
            submitLoading,
            submitDisabled,

            errorIp,

            resetValues,
            submit
        }
    }
}


</script>