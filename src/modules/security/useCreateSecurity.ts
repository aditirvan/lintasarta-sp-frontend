import { ref, Ref, watch } from '@vue/composition-api'
import { Rule } from './type'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'
import { SECURITY } from './namespace'
import { useNamespacedActions } from 'vuex-composition-helpers'
import { useCreatedInstance } from "@/modules/instance/compositionapi/usecreatedinstance";

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
            description: ''
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
        addsecurity,
        FETCH_SECURITY_EDIT, 
        UPDATE_SECURITY,
    } = useNamespacedActions(SECURITY, [
        'addsecurity',
        'FETCH_SECURITY_EDIT',
        'UPDATE_SECURITY',
    ])

    const Composable = {
        ...useCreatedInstance()
    }
    const { instancesselected } = Composable
    const CreateSecurity = async () => {
        $v.value.$touch()
        if($v.value.$errors.length){
            context.refs['ref'+$v.value.$errors[0].$property].focus()
            return
        }

        const Value = {
            name: name.value,
            description: description.value,
            inbound: inbound.value,
            outbound: outbound.value,
            instance: instancesselected.value
        }

        let rules_in = inbound.value.map(x => {
            return {
                type: x.type,
                protocol: x.protocol,
                port_range_min: x.port_range_min,
                port_range_max: x.port_range_max,
                ethertype: x.ethertype,
                sources: x.sources,
                direction: 'ingress',
                description: x.description
            }
        })

        let rules_out = outbound.value.map(x => {
            return {
                type: x.type,
                protocol: x.protocol,
                port_range_min: x.port_range_min,
                port_range_max: x.port_range_max,
                ethertype: x.ethertype,
                sources: x.sources,
                direction: 'egress',
                description: x.description
            }
        })

        const port_ids = instancesselected.value
        const projek_id = localStorage.getItem('projectid')

        const payload = {
            name: name.value,
            description: description.value,
            port_ids,
            rules: [...rules_in, ...rules_out]
        }
        
        return addsecurity(payload).then((response:any) => {
            if(response.data.code === 200) context.root.$router.replace('/security')
        })
    }
    const securityedit = ref();
    const setSecurityEdit = (payload: any) => {
      securityedit.value = payload;
    };
    const UpdateSecurity = async () => {
        $v.value.$touch()
        if($v.value.$errors.length){
            context.refs['ref'+$v.value.$errors[0].$property].focus()
            return
        }

        let rules_in = inbound.value.map(x => {
            return {
                type: x.type,
                protocol: x.protocol,
                port_range_min: x.port_range_min ? x.port_range_min : null,
                port_range_max: x.port_range_max ? x.port_range_max : null,
                ethertype: x.ethertype,
                sources: x.sources,
                direction: 'ingress',
                description: x.description
            }
        })

        let rules_out = outbound.value.map(x => {
            return {
                type: x.type,
                protocol: x.protocol,
                port_range_min: x.port_range_min ? x.port_range_min : null,
                port_range_max: x.port_range_max ? x.port_range_max : null,
                ethertype: x.ethertype,
                sources: x.sources,
                direction: 'egress',
                description: x.description
            }
        })

        const port_ids = instancesselected.value
        const projek_id = localStorage.getItem('projectid')
        const payload = {
            id: securityedit.value.id,
            name: name.value,
            description: description.value,
            port_ids,
            rules: [...rules_in, ...rules_out]
        }
        return UPDATE_SECURITY(payload).then((response:any) => {
            if(response.data.code === 200) context.root.$router.replace('/security')
        })
    }
    watch(securityedit, () => {
        (name.value = securityedit.value.name),
        (description.value = securityedit.value.description),
          (inbound.value = securityedit.value.inbound),
          (outbound.value = securityedit.value.outbound),
          (instancesselected.value = securityedit.value.instance);
      });
    return {
        inbound,
        selecttype,
        FETCH_SECURITY_EDIT,
        UPDATE_SECURITY,
        selectethertype,
        addInbound,
        deleteInbound,
        outbound,
        addOutbound,
        deleteOutbound,
        name,description, nameValidation,
        ...Composable,
        CreateSecurity,
        securityedit,
        setSecurityEdit,
        UpdateSecurity
    }
}