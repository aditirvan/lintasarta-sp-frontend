<template>
    <v-dialog v-model="dialog" width="650">
       <v-card>
           <v-card-title class="font-weight-bold font--text">
               Server Group
           </v-card-title>    
           <v-card-text>
             <v-row class="mb-dr">
                 <v-col cols="6">
                     <p class="font-weight-bold font--text">Name</p>                       
                 </v-col>                   
                 <v-col cols="6">
                     <p>{{item.name}}</p>
                 </v-col>                   
             </v-row>
             <v-row class="mb-dr">
                 <v-col cols="6">
                     <p class="font-weight-bold font--text">Policy</p>                       
                 </v-col>                   
                 <v-col cols="6">
                     <p>{{item.policy_name}}</p>
                 </v-col>                   
             </v-row>
           </v-card-text>           
           <v-card-title class="font-weight-bold font--text">
               Instance
           </v-card-title>     
           <v-card-text>            
             <v-data-table
               class="elevation-0 mb-30px"
               :hide-default-footer="true"
               :headers="headers"
               :items="item.instances"
             >                                  
             </v-data-table>
           </v-card-text>
           <br/>
           <v-card-text>
               <v-btn @click="()=>{dialog=false}" block depressed class="accent">Close</v-btn>
           </v-card-text>
       </v-card>
   </v-dialog>
 </template>

 <style>
 .mb-dr {
   margin-bottom: -3% !important;
 }
 </style>

 <script>
 import { useDialog } from "@/composable/usedialog";
 import { defineComponent } from "@vue/composition-api";
 export default defineComponent({
   props: ["value", "item"],
   setup(props, context) {
     console.log("value ", props.value);
     console.log("item ", props.item);
       const {dialog} = useDialog(props, context)
       return {
           dialog
       }
   },
   data() {
     return {
       headers: [
         { text: "Name", value: "name", width:"15%" },   
         { text: "Region", value: "region",width:"15%"  },     
       ],
     };
   },
   computed: {
     headersWithWidth() {
       // Add width property to each header
       return this.headers.map((header) => ({
         ...header,
         style: { width: "1080px" },
       }));
     },
   },
 });
 </script>