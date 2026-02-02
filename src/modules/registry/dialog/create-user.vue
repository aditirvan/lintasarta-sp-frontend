<template>
  <div class="text-center">
    <v-dialog persistent v-model="dialog" width="500">
      <v-card>
        <v-card-title class="pb-7">
          <div class="headline font-weight-bold font--text">
            Create New User
          </div>
        </v-card-title>
        <!-- <v-card-text>
          <p class="font-weight-bold">Username</p>
          <v-text-field
            v-model="name"
            outlined
            placeholder="Username"
            @blur="$v.name.$touch()"
            :error-messages="
              $v.name.$errors.length ? 'Username couldnt be empty.' : ''
            "
          />
        </v-card-text> -->
        <v-card-text>
          <p class="font-weight-bold">Username</p>
          <v-autocomplete
            v-model="name"
            :items="listusers"
            outlined
            item-text="name"
            item-value="value"
            autocomplete="off"
            placeholder="Select Username"
            @blur="$v.name.$touch()"
            :error-messages="
              $v.name.$errors.length ? 'Username couldnt be empty.' : ''
            "
          >
            <template v-slot:append-outer>
              <div id="filterUser"></div>
            </template>
          </v-autocomplete>
        </v-card-text>
        <v-card-text>
          <p class="font-weight-bold">Role</p>
          <v-autocomplete
            v-model="role"
            :items="RoleMembers"
            outlined
            autocomplete="off"
            item-text="text"
            item-value="id"
            placeholder="Select Role"
            @blur="$v.role.$touch()"
            :error-messages="
              $v.role.$errors.length ? 'Role couldnt be empty.' : ''
            "
          >
            <template v-slot:append-outer>
              <div id="filterUser"></div>
            </template>
          </v-autocomplete>
        </v-card-text>
        <v-card-actions>
          <v-row class="ma-2">
            <v-col cols="6">
              <v-btn
                depressed
                height="50"
                color="accent"
                block
                 @click="() => {
                            dialog = false
                            $emit('input', false);
                        }"
              >
                Cancel
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                depressed
                height="50"
                color="secondary"
                block
                :disabled="disable"
                @click="create()"
              >
                Confirm
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  ref,
  computed,
  defineComponent,
  onMounted,
  watch,
} from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedMutations,
  useNamespacedGetters,
} from "vuex-composition-helpers";
import { REGISTRY } from "../namespace";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
export default {
  data: () => ({
      RoleMembers: [
      { id: 1, text: "Project Admin", value: "project_admin" },
      { id: 2, text: "Developer", value: "developer" },
      { id: 3, text: "Guest", value: "guest" },
      { id: 4, text: "Maintainer", value: "maintainer" },
      ],
    }),
  
  props: ["value"],
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
    onMounted(async () => {
      await getUserOrg();
      // console.log("============listusersOrg===========",listusersOrg.value);
      // console.log("============listmembersOrg===========",listmembersOrg.value);
      var j=0
      var k=0
      for(var i=0;i<listusersOrg.value.length;i++ ){
        listmembersOrg.value.forEach(function (value, index) {
          if(listusersOrg.value[i].Email==value.entity_name){
            j++
          }
        })
        if(j==0){
          if(k==0){
          listusers.value[k].name=listusersOrg.value[i].Email
          listusers.value[k].value=listusersOrg.value[i].UserID
          // console.log("============listusers===========",listusers.value);
          }
          else{
            listusers.value.push({name: listusersOrg.value[i].Email, value:listusersOrg.value[i].UserID});
          }
          k++
        }
        else{
          j=0;
        }
          // console.log("i=",i)
          // console.log("============k===========",k);
      }
      // return listusers
      if(!listusers.value[0].name){
      // console.log("============ok===========");
        listusers.value=[]
      }
      // console.log("============listusers===========",listusers);
    });
    const { listusersOrg,listmembersOrg } =useNamespacedGetters(REGISTRY, ["listusersOrg","listmembersOrg"]);
    const { createMembers,getUserOrg } = useNamespacedActions(REGISTRY, ["createMembers","getUserOrg"]);
    const name = ref("");
    const role = ref("");
    const disable = ref(true);
    const listusers=ref([{}]);
    
    const $v = useVuelidate(
      {
        name: { required },
        role: { required },
      },
      {
        name,
        role,
      }
    );
     watch(name, (val) => {
        if(val==""||role.value==""){
          disable.value=true
        }else{
          disable.value=false
        }
    });
     watch(role, (val) => {
        if(val==""||name.value==""){
          disable.value=true
        }else{
          disable.value=false
        }
    });
    function create() {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const params = {
        role_id: role.value,
        member_user:{
          username: name.value,
        }
      };
      // console.log("create user data", params);
      createMembers(params);
      dialog.value=false
    }
    return {
      create,
      getUserOrg,
      name,
      role,
      $v,
      createMembers,
      listusersOrg,
      listmembersOrg,
      dialog,
      listusers,
      disable,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field__details {
  position: static;
}
</style>