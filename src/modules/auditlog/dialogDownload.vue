<template>
  <v-dialog v-model="dialog" max-width="500">
    <form id="form" @submit.prevent="submit"></form>
    <v-card>
      <v-card-title class="font--text justify-center headline font-weight-bold">
        <p>Filter Download Audit</p>
      </v-card-title>
        
        <v-card-text v-if="user_role=='Superadmin'">
        <p class="titletext">Select Organization</p>
        <v-autocomplete
            default="All"
            :search-input.sync="searchorganization"
            v-model="organiz"
            :items="orgz"
            outlined
            item-text="name"
            item-value="id"
            placeholder="All Organization"
            attach="#SelectOrgAttachs"
            clearable
          >
        
            <template v-slot:append-outer>
              <div id="SelectOrgAttachs"></div>
            </template>
             
          </v-autocomplete>
      </v-card-text>


    

      <v-card-text >
        <p class="titletext">Select Projects</p>
      
         <v-autocomplete
            default="All"
            v-model="projected"
            :items="projectss"
            outlined
            item-text="text"
            item-value="value"
            placeholder="Select Project"
            attach="#SelectProjectAttachs"
            clearable
          >
        
            <template v-slot:append-outer>
              <div id="SelectProjectAttachs"></div>
            </template>
             
          </v-autocomplete>
       
      </v-card-text>

       <v-card-text>
        <p class="titletext">Days</p>

           <v-select
          height="50"
          :items="selectdownload"
          v-model="duration"
          item-text="text"
          item-value="value"
          placeholder="Select Days"
          hide-details=""
          outlined
        ></v-select>
       
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
                  $emit('input', false);
                }
              "
              >Cancel</v-btn
            ></v-col
          >
          <v-col>
            <v-btn depressed @click="downloadauditlog" class="secondary" height="45" block>
              Download
            </v-btn>
          </v-col
          >
        </v-row>
      </v-card-text>
      
    
    </v-card>
  </v-dialog>
</template>
<script>
import { useUser } from "@/modules/superadmin-manageuser/useUser";
import { useDialog } from "@/composable/usedialog";
import { useAuditlog } from "@/modules/auditlog/useauditlog";
import { defineComponent,computed, onMounted, ref, watch } from "@vue/composition-api";
import {useNamespacedMutations} from 'vuex-composition-helpers'
import localstorage from "@/lib/localstorage";
import { useProjects } from "../project/useprojects";
import moment from 'moment'

export default defineComponent({
  props: ["value"],
  
  computed: {
    dateRangeText() {
      return this.dates.join(" - ");
    },
  },

  setup(props, context) {
    const user_role = localstorage.getItem("role");

    const selectedItem=ref();
    // const projected = ref();

     const Composable = {
      ...useUser(),
      ...useProjects(),
      ...useAuditlog(),
    };

    // const {  
    //   fetchorganizations,
    //   searchorganization,
    //   projectsselected,
    //   fetchprojects,
    //   org,
    // } = Composable;
    const {duration,selectprojectsDownloads,organiz,projected, searchorganization,organizations,fetchprojects,projectsDownload, projectsselected } = Composable;
    


    onMounted(() => {
      if(user_role!='Superadmin'){
        fetchprojects({id:'', itemsPerPage:-1, page:1});
      }      
    });

    const orgz = computed({
      get: () => {
        const array2 = [{
          name:'All',
          id:'',
        }];
       
        return array2.concat(organizations.value);
      },
    });


    const projectss = computed({
      get: () => {
        const array2 = [{
          text:'All',
          value:'',
        }];
        return array2.concat(selectprojectsDownloads.value);
      },
    });


    // const duration2=ref({
    //     text: "1 Day",
    //     value: 1,
    //   });
    
    watch(organiz,(val)=>{
       if(user_role=='Superadmin'){
         fetchprojects({id:val, itemsPerPage:-1, page:1});
       }
      
    })





    const { dialog } = useDialog(props, context);
    const selectdownload = ref([
      {
        text: "1 Day",
        value: 1,
      },
      {
        text: "7 Days",
        value: 7,
      },
      {
        text: "20 Days",
        value: 20,
      },
      {
        text: "30 Days",
        value: 30,
      },
    ]);
   

    return {
      orgz,
      projectss,
      selectedItem,
      searchorganization,
      ...Composable,
      dialog,
      user_role,
      selectdownload,
    };
  },
});
</script>