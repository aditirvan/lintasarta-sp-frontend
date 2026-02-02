<template>
  <v-container class="pa-0" fluid>
    <v-row>
      <v-col v-if="objectStorage">
        <v-card flat class="rounded-lg elevation-0 pa-3">
          <v-card-title class="pb-0">
            <div class="d-flex flex-row">
              <div>
                <v-icon style="font-size: 50px;" color="primary"
                  >mdi-circle</v-icon
                >
              </div>
              <v-col class="py-0">
                <h4>{{ objectStorage.name }}</h4>
                <!-- <h5>{{ objectStorage.object_storage_region.name }}</h5> -->
                <p class="my-0" style="font-size: 0.8rem">
                  in
                  <span class="primary--text font-weight-bold" style="font-size: 1.3rem;"
                    >{{ objectStorage.project.name }}
                  </span>
                  |
                  {{
                    objectStorage &&
                    objectStorage.package_object_storage &&
                    objectStorage.package_object_storage.object_storage_size
                      ? `${objectStorage.package_object_storage.object_storage_size} GB`
                      : "N/A"
                  }}
                  
                </p>
              </v-col>
            </div>
          </v-card-title>
          <v-card-actions>
            <v-tabs v-model="tab">
              <v-tab to="overview" replace>Overview</v-tab>
              <v-tab to="access-keys" replace>Access Keys</v-tab>
              <v-tab to="settings" replace>Settings</v-tab>
            </v-tabs>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-tabs-items v-model="tablastpath">
          <v-tab-item value="overview">
            <v-card flat class="rounded-lg pa-3">
              <v-card-text>
                <div class="d-flex flex-row justify-space-between align-items-center">
                  <div class="headline font-weight-bold font--text">
                    Total Usage
                  </div>
                  <v-btn depressed @click="showDialogAddBucket" color="secondary">Add Bucket</v-btn>
                </div>
              </v-card-text>
              <v-card-text :class="{ animate: loading }" style="padding: 0px 16px 0px 16px;">
                <v-row :class="{ hidden: loading }">
                  <v-col cols="12" style="padding-top: 0px;">
                    <div
                      class="text-right font-weight-bold"
                      style="font-size: 1.2rem"
                    >
                      <br />{{ totalDataBytes }}/{{
                        objectStorage &&
                        objectStorage.package_object_storage &&
                        objectStorage.package_object_storage.object_storage_size
                          ? `${objectStorage.package_object_storage.object_storage_size} GB`
                          : "-"
                      }}
                    </div>
                    <v-progress-linear
                      color="light-blue"
                      height="20"
                      :value="
                        calculatePercentage(
                          totalDataBytes,
                          objectStorage &&
                            objectStorage.package_object_storage &&
                            objectStorage.package_object_storage
                              .object_storage_size
                            ? objectStorage.package_object_storage
                                .object_storage_size
                            : 0
                        )
                      "
                      striped
                    >
                      <template v-slot:default="{ value }">
                        <strong>{{ value }}</strong>
                      </template>
                    </v-progress-linear>
                    <div class="text-right">
                      *value will be updated frequently
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <v-row v-if="objectStorageUsage">
                      <v-col
                        cols="6"
                        v-for="bucket in objectStorageUsage.data.buckets"
                        :key="bucket.name"
                      >
                      <!-- <router-link
                          :to="'' + bucket.name" append
                          style="text-decoration: none; color: inherit;"
                        > -->
                    
<v-card outlined>
  <v-card-text>
    <v-row>
      <v-col
        cols="12"
        class="py-1 primary--text font-weight-bold"
      >
        {{ bucket.name }}
      </v-col>

      <v-col
        md="4"
        class="py-1 font--text font-weight-bold"
      >
        Object Count
      </v-col>
      <v-col
        md="8"
        class="py-1 font--text "
      >
        {{ formatNumberObject(bucket.objectCount) }}
      </v-col>
      <v-col
        md="4"
        class="py-1 font--text font-weight-bold"
      >
        Usage
      </v-col>
      <v-col
        md="8"
        class="py-1 font--text "
      >
        {{ getGBUsage(bucket.dataBytes) + " GB" }}
      </v-col>

      <v-col
        md="4"
        class="py-1 font--text font-weight-bold"
      >
        Region
      </v-col>
      <v-col
        md="8"
        class="py-1 font--text "
      >
        {{ capitalize(bucket.region) }}
      </v-col>

      <v-col
        md="4"
        class="py-1 font--text font-weight-bold"

      >
        S3 URL
      </v-col>
      <v-col
        md="8"
        class="py-1 font--text "

      >
        {{ bucket.s3_url }}
      </v-col>

       <v-col
        md="4"
        class="py-1 font--text font-weight-bold"

      >
        Site
      </v-col>
      <v-col
        md="8"
        class="py-1 font--text "

      >
        {{ bucket.site }}
      </v-col>

      <!-- <v-col
        md="4"
        class="py-1 font--text font-weight-bold"

      >
        Object Version
      </v-col>

      <v-col
        md="8"
        class="py-1 font--text "

      >

            {{ bucket.object_version ? 'Active' : 'Inactive' }}

      </v-col>
      
       <v-col
        md="4"
        class="py-1 font--text font-weight-bold"

      >
        Object Lock
      </v-col>
      <v-col
        md="8"
        class="py-1 font--text "

      >
    {{ bucket.object_lock ? 'Active' : 'Inactive' }}
      </v-col>


       <v-col
        md="4"
        class="py-1 font--text font-weight-bold"

      >
       Retention Periode
      </v-col>
      <v-col
        md="8"
        class="py-1 font--text "

      >
    {{ retentionPeriodeShow(bucket) }}
      </v-col> -->


      

       

      <v-col class="mt-3" >
        <v-row>
          <v-col
            class="py-1 font--text font-weight-bold"
          >
            <router-link
              :to="`cors-settings/${bucket.name}`"
            >
              <v-btn  color="secondary" height="40" block>CORS Settings</v-btn>

            </router-link>
          </v-col>
          <v-col
            class="py-1 font--text font-weight-bold"
          >
          
              <v-btn  color="error" height="40" block @click="showDialogDeleteBucket(bucket.name)">Delete Bucket</v-btn>

          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card-text>
</v-card>

                    

                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item value="access-keys">
            <v-card flat class="rounded-lg pa-3">
              <v-card-text>
                <div class="d-flex flex-row" style="align-items: center">
                  <div class="headline font-weight-bold font--text">
                    Access Keys
                  </div>
                  <v-spacer />
                  <v-btn
                    v-if="!read_only"
                    depressed
                    width="150"
                    height="50"
                    class="secondary"
                    @click="
                      () => {
                        validateprivilages(['Object Storage', 'editor']).then(
                          () => {
                            openDialogCreateAccessKey = true;
                          }
                        );
                      }
                    "
                  >
                    Create Access Key
                  </v-btn>
                </div>
              </v-card-text>
              <v-card-text :class="{ animate: loading }">
                <v-data-table
                  :class="{ hidden: loading }"
                  :hide-default-footer="true"
                  :headers="headers"
                  :items="accessKeys"
                  :items-per-page="10"
                >
                  <template v-slot:item.user="{ item }">
                    {{ item.user.fullname }}
                    <v-badge
                      v-if="objectStorage.user_id == item.user.id"
                      class="ml-2"
                      content="Creator"
                      color="blue"
                    ></v-badge>
                  </template>
                  <template v-slot:item.keyID="{ item }">
                    {{ item.access_key }}
                  </template>
                  <template v-slot:item.secretKey="{ item }">
                    {{ item.secret_access_key }}
                    <span>********</span>
                    <v-icon
                      small
                      class="mb-2 ml-2 secondary white--text py-1 px-2 rounded"
                      style="cursor: pointer;"
                      @click="
                        () => {
                          validateprivilages(['Object Storage', 'editor']).then(
                            () => {
                              showDialogReveal(item);
                            }
                          );
                        }
                      "
                      >mdi-eye</v-icon
                    >
                  </template>
                  <template v-slot:item.created_at="{ item }">
                    {{ moment(item.created_date).format("DD/MM/YYYY") }}
                  </template>
                  <template v-slot:item.action="{ item }">
                    <a
                      v-if="item.name != 'Creator' && !read_only"
                      @click="
                        () => {
                          validateprivilages(['Object Storage', 'editor']).then(
                            () => {
                              accessKeyToDelete = item;
                              openDialogDeleteAccessKey = true;
                            }
                          );
                        }
                      "
                      class="error--text"
                      >Delete</a
                    >
                  </template>
                  <template v-slot:no-data> </template>
                  <template
                    v-if="accessKeys.length > 5"
                    v-slot:footer="{ props }"
                  >
                    <custom-footer-datatable :props="props" />
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item value="settings">
            <v-card flat class="rounded-lg">
              <v-card-text class="px-7">
              

                <v-row class="my-4" v-if="!read_only">
                  <v-col md="8">
                    <h3>Destroy</h3>
                    <br />
                    <p class="mb-0">
                      This will schedule your bucket to be delete. Your Deka Box and all associated objects will be permantelly
                      destroyed and irretievable after the deletion period.
                    </p>
                  </v-col>
                  <v-col class="text-right align-self-center">
                    <v-btn
                      depressed
                      outlined
                      @click="
                        () => {
                          validateprivilages(['Object Storage', 'editor']).then(
                            () => {
                              openDialogDestroy = true;
                            }
                          );
                        }
                      "
                      style="border: 2px solid #EB5757"
                      width="150"
                      height="45"
                      color="white"
                      class="error--text"
                    >
                      Destroy
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
    <!-- <dialogAdvanCorsOption
      :objectStorageID="objectStorage ? objectStorage.id : null"
      v-model="openDialogCors"
      @addRule="($event) => addCORSRule($event)"
      @close="
        ($event) => {
          openDialogCors = $event;
        }
      "
    /> -->
    <dialogDestroyObjectStorage
      v-model="openDialogDestroy"
      @close="
        ($event) => {
          openDialogDestroy = $event;
        }
      "
      @confirm="deleteS3"
    />
    <dialogDeleteAccessKey
      v-model="openDialogDeleteAccessKey"
      :accessKey="accessKeyToDelete"
      @close="
        ($event) => {
          openDialogDeleteAccessKey = $event;
        }
      "
      @confirm="deleteKey"
    />
    <dialogCreateAccessKey
      v-model="openDialogCreateAccessKey"
      :objectStorageID="objectStorageID"
      @close="
        ($event) => {
          openDialogCreateAccessKey = false;
        }
      "
      @show="showAccessKey($event)"
    />
    <dialogShowAccessKey
      v-model="openDialogShowAccessKey"
      :accessKey="accessKey"
      @close="
        ($event) => {
          openDialogShowAccessKey = false;
        }
      "
    />
    <dialogRevealAccessKey
      v-model="openDialogRevealAccessKey"
      :accessKey="accessKeyToReveal"
      @close="
        ($event) => {
          openDialogRevealAccessKey = false;
        }
      "
    />

    <dialogAddBucket
      v-model="openDialogAddBucket"
      :objectStorageID="objectStorageID"
      @close="
        ($event) => {
          openDialogAddBucket = false;
        }
      "
      @show="showDialogAddBucket($event)"
      @refresh="updateData()"

    />


     <dialogDeleteBucket
      v-model="openDialogDeleteBucket"
      :objectStorageID="objectStorageID"
      :bucketName="bucketToDelete"
      @close="
        ($event) => {
          openDialogDeleteBucket = false;
        }
      "
      @show="showDialogDeleteBucket($event)"
      @refresh="updateData()"

    />
    <dialogErrorDelete v-model="opendialogerror" :message="dialogerrormsg" />



  </v-container>
</template>
<script>
import { useNamespacedActions } from "vuex-composition-helpers";
import dialogShowAccessKey from "./dialogShowAccessKey";
import dialogRevealAccessKey from "./dialogRevealAccessKey";
import dialogCreateAccessKey from "./dialogCreateAccessKey";
import dialogDeleteAccessKey from "./dialogDeleteAccessKey";
import dialogAdvanCorsOption from "./dialogAdvanCorsOption";
import dialogDestroyObjectStorage from "./dialogDestroyObjectStorage";
import dialogAddBucket from "./dialogAddBucket";
import dialogDeleteBucket from "./dialogDeleteBucket";
import dialogErrorDelete from "./dialogErrorDelete";
import { ref, onMounted, computed, watch } from "@vue/composition-api";
import { useObjectStorage } from "./composableapi/useobjectstorage";
import moment from "moment";
import draggable from "vuedraggable";
const byteSize = require("byte-size");
var converter = require("byte-converter").converterBase2;

const XMLConverter = require("xml-js");
import { AccessControl } from "@/lib/middleware";
import { forEach } from 'lodash';

export default {
  components: {
    dialogShowAccessKey,
    dialogCreateAccessKey,
    dialogAdvanCorsOption,
    dialogDestroyObjectStorage,
    dialogDeleteAccessKey,
    dialogRevealAccessKey,
    dialogAddBucket,
    dialogDeleteBucket,
    draggable,
    dialogErrorDelete,
  },
  watch: {
    $route() {},
  },
  setup(props, context) {
    const Composable = {
      ...useObjectStorage(),
    };
    const {
      updateCORS,
      deleteObjectStorage,
      deleteAccessKey,
      objectStorageUsage,
      objectStorage,
      fetchObjectStorage,
      fetchAccessKeys,
      fetchUsage,
      fetchCorsObjectStorage,
    } = Composable;

    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Project Object Storage'));
    const objectStorageID = context.root.$route.params.objectsrtorageid;

    const openDialogShowAccessKey = ref(false);
    const openDialogCreateAccessKey = ref(false);
    const openDialogDestroy = ref(false);
    const openDialogCors = ref(false);
    const editCDN = ref(false);
    const editFileListing = ref(false);
    const disableSaveChanges = ref(true);
    const accessKey = ref({});


    const radios = ref("");
    const tab = ref(null);
    const headers = [
      { text: "Access Key Name", value: "name" },
      { text: "User", value: "user" },
      { text: "Key ID", value: "keyID" },
      { text: "Secret Key", value: "secretKey" },
      { text: "Created At", value: "created_at" },
      { text: "Action", value: "action" },
    ];
    const tablastpath = computed(() => {
      return tab.value ? tab.value.split("/").pop() : "";
    });

    const copyText = () => {
      var copyText = document.getElementById("endpointURI");

      /* Select the text field */
      copyText.select();
      copyText.setSelectionRange(0, 99999); /* For mobile devices */

      /* Copy the text inside the text field */
      document.execCommand("copy");
      context.root.$store.dispatch(
        "HOMEPAGE/showSuccessToast",
        "Copied to clipboard",
        { root: true }
      );
    };

    const CORSRules = ref([]);
    const addCORSRule = (rule) => {
      CORSRules.value = [...CORSRules.value, rule];
      openDialogCors.value = false;
      disableSaveChanges.value = false;
    };

    const deleteCORSRule = (order) => {
      CORSRules.value = CORSRules.value.filter((rule, i) => i != order);
      disableSaveChanges.value = false;
    };

    const resetCORSRules = () => {
      CORSRules.value = [];
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

    const saveCORSRules = async () => {
      const rules = CORSRules.value.map((rule) => {
        delete rule.order;
        return rule;
      });
      const payload = {
        id: objectStorageID,
        rules,
      };
      const response = await updateCORS(payload);
      if (response.status == 200) disableSaveChanges.value = true;
    };

    const deleteS3 = async () => {
      openDialogDestroy.value = false;
      const response = await deleteObjectStorage({
        id: objectStorageID,
        name: objectStorage.name,
      });
      if (response.status == 200) {
        context.root.$router.replace("/object-storage");
      }
    };

    const accessKeyToDelete = ref(null);
    const openDialogDeleteAccessKey = ref(false);

    const deleteKey = async (id) => {
      const response = await deleteAccessKey({
        id,
        object_storage_id: objectStorageID,
      });
      if (response.status == 200) openDialogDeleteAccessKey.value = false;
    };

    const accessKeyToReveal = ref(null);
    const openDialogRevealAccessKey = ref(false);
    const showDialogReveal = (key) => {
      openDialogRevealAccessKey.value = true;
      accessKeyToReveal.value = key;
    };

    const calculatePercentage = (usageInGB, limitInGB) => {
      if (limitInGB == 0) return "N/A";
      const percentage = (usageInGB / limitInGB) * 100;
      return `${percentage.toFixed(5)}%`;
    };

    const totalDataBytes = ref(0);

    // const getGBUsage = (bytes) => {
    //   return converter(bytes, "B", "GB").toFixed(5);
    // };

    const getGBUsage = (bytes) => {
      if (typeof bytes !== 'number' || bytes < 0) {
        throw new Error('Input must be a non-negative number');
      }
      const gigabytes = bytes / (1000 ** 3);
      return gigabytes.toFixed(2);
    }

    const formatNumberObject = (obj) => {
      if (typeof obj !== 'number') {
        throw new Error('Input must be a number');
      }
      return obj.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }


    const capitalize=(value) =>{
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }


    const loading = ref(false);
    const orderChanges = (ev) => {
      disableSaveChanges.value = false;
    };


    const opendialogerror = ref(false)
    const dialogerrormsg = ref(null);
    const openDialogAddBucket = ref(false);
    const accessKeyDialogBucket = ref(null)
    const showDialogAddBucket = (key) => {
      openDialogAddBucket.value = true;
      accessKeyDialogBucket.value = key;
    };

    const openDialogDeleteBucket = ref(false)
    const bucketToDelete = ref(null);

    const showDialogDeleteBucket = (key) => {
      console.log("key ", key);
     

      if(key ==objectStorage.value.name){
       opendialogerror.value=true
       dialogerrormsg.value="Can't delete this bucket"
      }else{
         bucketToDelete.value=key
        openDialogDeleteBucket.value = true;
      }
      

    };

    const retentionPeriodeShow= (data) => {
      if (data.object_lock && data.s3ObjectLock) {
          let defaultRetentionSetting = data.s3ObjectLock.defaultRetentionSetting;
          let output="";
          if (defaultRetentionSetting) {
              if (defaultRetentionSetting.days !== "") {
                  output = defaultRetentionSetting.days + " Days";
              } else if (defaultRetentionSetting.years !== "") {
                  output = defaultRetentionSetting.years + " Years";
              }
          }

          return output
      }
    }


    

    


    const updateData= async()=>{
      console.log("update data");
      loading.value = true;
      await fetchObjectStorage({ id: objectStorageID });
      await fetchAccessKeys({ id: objectStorageID });
      await fetchUsage({ id: objectStorageID });
      loading.value = false;


      totalDataBytes.value = objectStorageUsage
        ? getGBUsage(objectStorageUsage.value.data.dataBytes)
        : 0;


      console.log("objectStorageUsage.value ", objectStorageUsage.value);
  
    

      console.log( 'total',totalDataBytes.value);

      const xml =
        objectStorage && objectStorage.cors_xml
          ? JSON.parse(
              XMLConverter.xml2json(objectStorage.cors_xml, {
                compact: true,
                spaces: 0,
              })
            )
          : null;
      if (xml) {
        if (Array.isArray(xml.CORSConfiguration.CORSRule)) {
          CORSRules.value = xml.CORSConfiguration.CORSRule.map((rule, order) => {
            let allowedMethod = [];
            if (rule.AllowedMethod) {
              if (Array.isArray(rule.AllowedMethod))
                allowedMethod = rule.AllowedMethod.map((method) => method._text);
              else allowedMethod = [rule.AllowedMethod._text];
            } else allowedMethod = [];
  
            return {
              order: ++order,
              AllowedHeader: rule.AllowedHeader ? rule.AllowedHeader._text : null,
              AllowedMethod: allowedMethod,
              AllowedOrigin: rule.AllowedOrigin ? rule.AllowedOrigin._text : null,
            };
          });
        } else {
          let rule = xml.CORSConfiguration.CORSRule;
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
      }
    }

    return {
      read_only,

      validateprivilages,
      disabledField,
      validateprivilagesync,
      validateprivilagesyncnew,
      ...Composable,
      orderChanges,
      totalDataBytes,
      disableSaveChanges,
      accessKeyToDelete,
      accessKeyToReveal,
      openDialogDeleteAccessKey,
      openDialogRevealAccessKey,
      getGBUsage,
      formatNumberObject,
      calculatePercentage,
      deleteKey,
      showDialogReveal,
      copyText,
      saveCORSRules,
      deleteS3,
      deleteCORSRule,
      resetCORSRules,
      CORSRules,
      objectStorageID,
      tablastpath,
      openDialogShowAccessKey,
      openDialogCreateAccessKey,
      openDialogDestroy,
      openDialogCors,
      radios,
      editFileListing,
      editCDN,
      tab,
      headers,
      moment,
      accessKey,
      loading,
      addCORSRule,
      log: (msg) => console.log(msg),
      showAccessKey: (val) => {
        accessKey.value = val;
        openDialogCreateAccessKey.value = false;
        openDialogShowAccessKey.value = true;
      },
      openDialogAddBucket,
      showDialogAddBucket,
      accessKeyDialogBucket,
      updateData,
      openDialogDeleteBucket,
      showDialogDeleteBucket,
      bucketToDelete,
      opendialogerror,
      dialogerrormsg,
      capitalize,
      retentionPeriodeShow,
    };
  },
  async created() {
    this.loading = true;
    await this.fetchObjectStorage({ id: this.objectStorageID });
    await this.fetchAccessKeys({ id: this.objectStorageID });
    await this.fetchUsage({ id: this.objectStorageID });
    // await this.fetchCorsObjectStorage({id:this.objectStorageID})
    this.loading = false;
    this.totalDataBytes = this.objectStorageUsage
      ? this.getGBUsage(this.objectStorageUsage.data.dataBytes)
      : 0;
    const xml = this.objectStorageCors;
    console.log("usage ", this.objectStorageUsage.data.buckets);
    // if (xml.length > 0) {
    //   // xml.forEach(element => {
    //     // console.log("element ", element);
    //     let order =1;
    //     this.CORSRules = xml.map((dataCors) => {
    //       console.log("rule ", dataCors);
         
    //       const cors = JSON.parse(
    //         XMLConverter.xml2json(dataCors.cors_xml, {
    //           compact: true,
    //           spaces: 0,
    //         })
    //       )



    //       let finalCors = cors.CORSConfiguration.CORSRule
    //       let allowedMethod = [];
    //       if (finalCors.AllowedMethod) {
    //         if (Array.isArray(finalCors.AllowedMethod))
    //           allowedMethod = finalCors.AllowedMethod.map((method) => method._text);
    //         else allowedMethod = [finalCors.AllowedMethod._text];
    //       } else allowedMethod = [];

    //       console.log("finalCors.AllowedHeader ", finalCors.AllowedHeader);
    //       return {
    //         order: ++order,
    //         AllowedHeader: finalCors.AllowedHeader ? finalCors.AllowedHeader._text : null,
    //         AllowedMethod: allowedMethod,
    //         AllowedOrigin: finalCors.AllowedOrigin ? finalCors.AllowedOrigin._text : null,
    //         BucketName: dataCors.bucket_name,
    //       };
    //     });
    //     console.log("CORSRules", this.CORSRules);
        
    //   // });
    //   // xml.map()
    //   // if (Array.isArray(xml.CORSConfiguration.CORSRule)) {
    //   //   this.CORSRules = xml.CORSConfiguration.CORSRule.map((rule, order) => {
    //   //     let allowedMethod = [];
    //   //     if (rule.AllowedMethod) {
    //   //       if (Array.isArray(rule.AllowedMethod))
    //   //         allowedMethod = rule.AllowedMethod.map((method) => method._text);
    //   //       else allowedMethod = [rule.AllowedMethod._text];
    //   //     } else allowedMethod = [];

    //   //     return {
    //   //       order: ++order,
    //   //       AllowedHeader: rule.AllowedHeader ? rule.AllowedHeader._text : null,
    //   //       AllowedMethod: allowedMethod,
    //   //       AllowedOrigin: rule.AllowedOrigin ? rule.AllowedOrigin._text : null,
    //   //     };
    //   //   });
    //   // } else {
    //   //   let rule = xml.CORSConfiguration.CORSRule;
    //   //   let allowedMethod = [];
    //   //   if (rule.AllowedMethod) {
    //   //     if (Array.isArray(rule.AllowedMethod))
    //   //       allowedMethod = rule.AllowedMethod.map((method) => method._text);
    //   //     else allowedMethod = [rule.AllowedMethod._text];
    //   //   } else allowedMethod = [];

    //   //   this.CORSRules = [
    //   //     {
    //   //       order: 1,
    //   //       AllowedHeader: rule.AllowedHeader ? rule.AllowedHeader._text : null,
    //   //       AllowedMethod: allowedMethod,
    //   //       AllowedOrigin: rule.AllowedOrigin ? rule.AllowedOrigin._text : null,
    //   //     },
    //   //   ];
    //   // }
    // }
  },
};
</script>


<style lang="scss" scoped>
.v-window.v-item-group {
  background-color: transparent;
}
.v-input-append {
  ::v-deep .v-input__slot {
    background: #eee !important;
  }
}
</style>