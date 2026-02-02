import { ref, Ref, watch } from '@vue/composition-api'
import { Rule } from './type'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'
import { HARBOR } from '../namespace'
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers'
import { useCreatedInstance } from "@/modules/instance/compositionapi/usecreatedinstance";
import { forEach } from 'lodash'

export const useCreateSecurity = (props:any, context:any)=>{
    const inbound : Ref<Array<Rule>> = ref([])
    const selecttype = [
        {
            value: 'SSH', text: 'SSH'
        },
        {
            value: 'HTTP', text: 'HTTP'
        },
        {
            value: 'HTTPS', text: 'HTTPS'
        },
        {
            text: 'Custom TCP Rule', value: 'tcp'
        },
        {
            text: 'Custom UDP Rule', value: 'udp'
        },
        {
            text: 'All ICMP Rule', value: 'icmp'
        },
        {
            text: 'Any', value: ''
        },
    ]
    
    const selectethertype = [
        {
            value: 'IPv4', text: 'IPv4'
        },
        {
            value: 'IPv6', text: 'IPv6'
        },
    ]

    function addInbound(){
        inbound.value.push({
            type: 'SSH',
            ethertype: 'IPv4',
            protocol: 'TCP',
            port_range_min: '22',
            port_range_max: '22',
            sources: '',
            direction: 'ingress',
            description: 'for bind addr and bind port SLB'
        })
    }
    function deleteInbound(index:number){
        inbound.value.splice(index, 1)
    }
    const outbound : Ref<Array<Rule>> = ref([])
    
    function addOutbound(){
        outbound.value.push({
            direction: 'egress',
            type: 'SSH',
            ethertype: 'IPv4',
            protocol: 'TCP',
            port_range_min: '22',
            port_range_max: '22',
            sources: '',
            description: ''
        })
    }
    function deleteOutbound(index:number){
        outbound.value.splice(index, 1)
    }
    const description = ref('')
    const name = ref('')
    const $v = useVuelidate({
        name: {
            required,
            minLength: minLength(5),
        }

    },{ name })
    const {name: nameValidation} = $v.value

    const { 
        updateSGHarbor
    } = useNamespacedActions(HARBOR, [
        "updateSGHarbor"
    ])
    const { isLoadingBtn } = useNamespacedGetters(HARBOR, ["isLoadingBtn"])

    const Composable = {
        ...useCreatedInstance()
    }
    const { instancesselected } = Composable
    const securityedit = ref();
    const setSecurityEdit = (payload: any) => {
      securityedit.value = payload;
    };

    // check duplicate value in 1 array
    const isDuplicateData = (arr, head) => {
        let valueArr = arr.map(function(item){ return item[head] })
        let isDuplicate = valueArr.some(function(item, idx){ 
            return valueArr.indexOf(item) != idx 
        });
        return isDuplicate
    }

    const UpdateSecurity = async () => {
        $v.value.$touch()
        if($v.value.$errors.length){
            context.refs['ref'+$v.value.$errors[0].$property].focus()
            return
        }
        const harborid = context.root.$route.params.harborid
        const sg_id = context.root.$route.params.sg_id

        let rules_in = inbound.value.map(x => {
            return {
                type: x.type,
                protocol: x.type != '' ? x.protocol.toLowerCase() : '',
                port_range_min: x.port_range_min ? parseInt(x.port_range_min ): 0,
                port_range_max: x.port_range_max ? parseInt(x.port_range_max) : 0,
                ethertype: x.ethertype,
                remote_ip_prefix: x.sources,
                direction: 'ingress',
                description: x.description,
                security_group_id: sg_id
            }
        })
        // let isDuplicate = isDuplicateData(rules_in, "port_range_min")
        // console.log(isDuplicate)

        let rules_out = outbound.value.map(x => {
            return {
                type: x.type,
                protocol: x.type != '' ? x.protocol.toLowerCase() : '',
                port_range_min: x.port_range_min ? parseInt(x.port_range_min) : 0,
                port_range_max: x.port_range_max ? parseInt(x.port_range_max): 0,
                ethertype: x.ethertype,
                remote_ip_prefix: x.sources,
                direction: 'egress',
                description: x.description,
                security_group_id: sg_id
            }
        })
        
        const payload = {
            harborid: harborid,
            body: {
                harbor_id: harborid,
                security_group_id: sg_id,
                security_group_rules: [...rules_in, ...rules_out]
            }
        }
        // console.log(payload)
        return updateSGHarbor(payload).then((response:any) => {
            if(response.data.statusCode === 200) context.root.$router.replace(`/harbor/detail/${context.root.$route.params.harborid}/securitygroup`)
        })
    }
    watch(securityedit, () => {
        (name.value = securityedit.value.security_group_name),
        (description.value = securityedit.value.security_group_description);
        //   (inbound.value = securityedit.value.inbound),
        //   (outbound.value = securityedit.value.outbound)
        //   (instancesselected.value = securityedit.value.instance)
      });
    return {
        inbound,
        selecttype,
        selectethertype,
        addInbound,
        deleteInbound,
        outbound,
        addOutbound,
        deleteOutbound,
        name,description, nameValidation,
        ...Composable,
        securityedit,
        setSecurityEdit,
        UpdateSecurity,
        isLoadingBtn
    }
}