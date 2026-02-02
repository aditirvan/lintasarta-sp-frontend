<template>
  <v-card flat class="rounded-lg pa-5 mt-3">
    
      <div class="headline font-weight-bold font--text mb-4">
        CORS CONFIGURATIONS - {{bucketname}}
      </div>
      <v-card flat class="rounded-lg">
              <v-card-text class="px-7">
    
                <v-row class="my-4">
                  <v-col md="8">
                    <h3>CORS CONFIGURATIONS</h3>
                    <br />
                    <p class="mb-0">
                      Rules are processed in order from top to bottom until
                      there is match - drag and drop rules to reorder
                    </p>
                  </v-col>
                  <v-col class="text-right align-self-center">
                    <v-btn
                      v-if="!read_only"
                      depressed
                      :disabled="isLoading"
                      @click="
                        () => {
                          validateprivilages(['Object Storage', 'editor']).then(
                            () => {
                              openDialogCors = true;
                            }
                          );
                        }
                      "
                      width="150"
                      height="45"
                      color="secondary"
                      >Add</v-btn
                    >
                  </v-col>
                </v-row>
                <div v-if="CORSRules.length" :class="{ animate: isLoading }">
                  <v-simple-table :class="{ hidden: isLoading }" class="elevation-0" >
                    <template>
                      <thead>
                        <tr>
                          <th class="text-left">
                            Allowed Header
                          </th>
                          <th class="text-left">
                            Allowed Method
                          </th>
                           <th class="text-left">
                            Bucket Name
                          </th>
                          <th class="text-left">
                            Allowed Origin
                          </th>
                          <th class="text-left">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <draggable
                        @change="orderChanges"
                        v-model="CORSRules"
                        tag="tbody"
                      >
                        <tr
                          v-for="(rule, i) in CORSRules"
                          :key="i"
                          :set="(rule.order = i)"
                        >
                          <td>{{ rule.AllowedHeader }}</td>
                          <td>
                            <span
                              v-for="(method, i) in rule.AllowedMethod"
                              :key="method"
                              >{{
                                i == rule.AllowedMethod.length - 1
                                  ? method
                                  : `${method}, `
                              }}</span
                            >
                          </td>
                           <td>{{bucketname}}</td>
                          <td>{{ rule.AllowedOrigin }}</td>
                          <td>
                            <a
                              :style="[read_only ? {'color': '#a9a9a9 !important'} : {}]"
                              class="error--text"
                              @click="
                              if(read_only){
                                return
                              }
                              deleteCORSRule(rule.order)
                              "
                              >Delete</a
                            >
                          </td>
                        </tr>
                      </draggable>
                    </template>
                  </v-simple-table>
                </div>
                <div v-else>
                  <v-simple-table>
                    <template>
                      <thead>
                        <tr>
                          <th class="text-left">
                            Headers
                          </th>
                          <th class="text-left">
                            Methods
                          </th>
                          <th class="text-left">
                            Bucket
                          </th>
                          <th class="text-left">
                            Origin
                          </th>
                          <th class="text-left">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colspan="4" align="center">
                            Your bucket CORS rule is empty
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </div>
                <v-col class="text-right align-self-center">
                  <v-btn
                    depressed
                    :disabled="isLoading || disableSaveChanges"
                    width="150"
                    height="45"
                    color="secondary"
                    @click="
                      () => {
                        validateprivilages(['Object Storage', 'editor']).then(
                          () => {
                            saveCORSRules();
                          }
                        );
                      }
                    "
                    >Apply Changes</v-btn
                  >
                </v-col>
                <v-divider />
              </v-card-text>
            </v-card>
     
 
    <dialogAdvanCorsOption
      :objectStorageID="objectsrtorageid"
      :bucketName="bucketname"
      v-model="openDialogCors"
      @addRule="($event) => addCORSRule($event)"
      @close="
        ($event) => {
          openDialogCors = $event;
        }
      "
    />
  </v-card>
</template>

<script>
import { ref, onMounted, computed, watch } from "@vue/composition-api";
import { AccessControl } from "@/lib/middleware";
import { useObjectStorage } from "./composableapi/useobjectstorage";
const XMLConverter = require("xml-js");
import draggable from "vuedraggable";
import { useNamespacedActions } from "vuex-composition-helpers";
import dialogAdvanCorsOption from "./dialogAdvanCorsOption";

export default {
  components: {
    draggable,
    dialogAdvanCorsOption,
  },
  setup(props, context) {
    
  const access_control = new AccessControl(context.root.$store);
  const read_only = ref(access_control.is_read_mode('Project Object Storage'));
  const objectsrtorageid = context.root.$route.params.objectsrtorageid;
  const bucketname = context.root.$route.params.bucketname;
  const CORSRules = ref([]);
  const disableSaveChanges = ref(true);
  const openDialogCors = ref(false);

  const Composable = {
      ...useObjectStorage(),
  };
  const {
    fetchCorsObjectStorage,
    objectStorageCors,
    updateCORS,
  } = Composable;

  const orderChanges = (ev) => {
    disableSaveChanges.value = false;
  };

  const disabledField = ref(false);
  const {
    validateprivilages,
    validateprivilagesync,
    validateprivilagesyncnew,
  } = useNamespacedActions("HOMEPAGE", [
    "validateprivilages",
    "validateprivilagesync",
    "validateprivilagesyncnew",
  ]);

  validateprivilagesyncnew(["Object Storage", "editor"]).then((res) => {
    disabledField.value = res;
  });

  const addCORSRule = (rule) => {
    CORSRules.value = [...CORSRules.value, rule];
    openDialogCors.value = false;
    disableSaveChanges.value = false;
  };
  const deleteCORSRule = (order) => {
    CORSRules.value = CORSRules.value.filter((rule, i) => i != order);
    disableSaveChanges.value = false;
  };

  const saveCORSRules = async () => {
      const rules = CORSRules.value.map((rule) => {
        
        delete rule.order;
        if (!rule.hasOwnProperty('BucketName')) {
        rule.BucketName = bucketname;
        }
        return rule;
      });
      const payload = {
        id: objectsrtorageid,
        rules,
        bucketName:bucketname
      };
      console.log("save ", payload);
      const response = await updateCORS(payload);
      if (response.status == 200) disableSaveChanges.value = true;
  };

  onMounted(async() => {

      await fetchCorsObjectStorage({id:objectsrtorageid, bucketname:bucketname});
      const xml = objectStorageCors.value;
      if (xml.length > 0) {
      // xml.forEach(element => {
        // console.log("element ", element);
        
        xml.map((dataCors) => {
         
          const cors = JSON.parse(
            XMLConverter.xml2json(dataCors.cors_xml, {
              compact: true,
              spaces: 0,
            })
          )
          

          let finalCors = cors.CORSConfiguration.CORSRule
          console.log("finalCors ", finalCors);
           if (Array.isArray(finalCors)) {
              let order=1
              CORSRules.value = finalCors.map((final)=>{
              let allowedMethod = [];
              if (final.AllowedMethod) {
                if (Array.isArray(final.AllowedMethod))
                  allowedMethod = final.AllowedMethod.map((method) => method._text);
                else allowedMethod = [final.AllowedMethod._text];
              } else allowedMethod = [];

              console.log("final.AllowedHeader ", final.AllowedHeader);
              return {
                order: ++order,
                AllowedHeader: final.AllowedHeader ? final.AllowedHeader._text : null,
                AllowedMethod: allowedMethod,
                AllowedOrigin: final.AllowedOrigin ? final.AllowedOrigin._text : null,
                BucketName: dataCors.bucket_name,
              };
            });
           }else{
            
              let rule = finalCors;
              let allowedMethod = [];
              if (rule.AllowedMethod) {
                if (Array.isArray(rule.AllowedMethod))
                  allowedMethod = rule.AllowedMethod.map((method) => method._text);
                else allowedMethod = [rule.AllowedMethod._text];
              } else allowedMethod = [];
      
              CORSRules.value = [
                {
                  order: 1,
                  AllowedHeader: rule.AllowedHeader ? rule.AllowedHeader._text : null,
                  AllowedMethod: allowedMethod,
                  AllowedOrigin: rule.AllowedOrigin ? rule.AllowedOrigin._text : null,
                },
              ];
           }
          

          
          
          })

          
        console.log("CORSRules", CORSRules.value);
      }

    });
 
  return {
    switchValue: 0,
    isLoading: false,
    objectsrtorageid,
    bucketname, 
    read_only,
    CORSRules,
    disableSaveChanges,
    orderChanges,
    validateprivilages,
    validateprivilagesync,
    validateprivilagesyncnew,
    disabledField,
    openDialogCors,
    addCORSRule,
    deleteCORSRule,
    saveCORSRules,
    
  };
  }
}

  
  

</script>

<style scoped>
.dl {
   vertical-align: middle;
}
</style>
