<template>
  <v-dialog persistent max-width="500" v-model="dialog">
    <v-card>
      <v-card-title class="font--text fz-21 font-weight-bold">
        {{ versionedit ? "Edit Version" : "Create New Version" }}
      </v-card-title>
      <v-card-text>
        <p>Choose Region</p>
        <v-select
          id="SelectRegion"
          v-model="selected_region"
          outlined
          :items="selectRegions"
          placeholder="Choose Region"         
          :error-messages="selected_region ? '' : selected_region_error"   
        >
        </v-select>          
      </v-card-text>
      <v-card-text>
        <p>Select Operating System</p>
        <v-select
          @click="Fetchos"
          id="OperatingSystem"
          :items="selectos"
          item-text="name"
          return-object
          v-model="os_id"
          :error-messages="
            $v.os_id.$errors.length ? $v.os_id.$errors[0].$message : ''
          "
          hide-no-data
          outlined
          placeholder="Select Operating System"
        >
          <template v-slot:no-data>
            <div v-if="loadingselectos" class="d-flex flex-row">
              <v-progress-circular
                style="margin: auto"
                indeterminate
                color="primary"
              ></v-progress-circular>
            </div>
            <div v-else>
              <v-list-item>
                <v-list-item-title>No Data</v-list-item-title>
              </v-list-item>
            </div>
          </template>
        </v-select>
      </v-card-text>
      <v-card-text>
        <p>Version Number</p>
        <v-text-field
          maxlength="10"
          id="VersionNumber"
          v-model="version_number"
          :error-messages="
            $v.version_number.$errors.length
              ? $v.version_number.$errors[0].$message
              : ''
          "
          outlined
          placeholder="Enter Version Number"
        />
      </v-card-text>

      <v-card-text>
        <p>Select Bit Version</p>
        <v-select
          @click="Fetchbit"
          :items="selectbit"
          return-object
          item-text="version_name"
          v-model="versions_id"
          :error-messages="
            $v.versions_id.$errors.length
              ? $v.versions_id.$errors[0].$message
              : ''
          "
          outlined
          placeholder="Select Bit Version"
        >
          <template v-slot:no-data>
            <div v-if="loadingselectbit" class="d-flex flex-row">
              <v-progress-circular
                style="margin: auto"
                indeterminate
                color="primary"
              ></v-progress-circular>
            </div>
            <div v-else>
              <v-list-item>
                <v-list-item-title>No Data</v-list-item-title>
              </v-list-item>
            </div>
          </template>
        </v-select
        >
      </v-card-text>
      <v-card-text>
        <p>Import via URL</p>
        <v-text-field
          maxlength="255"
          placeholder="Type URL Image"
          v-model="image"
          :error-messages="
            $v.image.$errors.length ? $v.image.$errors[0].$message : ''
          "
          outlined
        >
        </v-text-field>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col>
            <v-btn
              @click="
                () => {
                  dialog = false;
                }
              "
              block
              height="50"
              depressed
              class="accent"
            >Cancel
            </v-btn
            >
          </v-col>
          <v-col>
            <v-btn
              v-if="versionedit"
              @click="Save"
              block
              height="50"
              depressed
              class="secondary"
            >Save
            </v-btn
            >
            <v-btn
              id="AddNewVersion"
              v-else
              @click="CreateVersion"
              block
              height="50"
              depressed
              class="secondary"
            >Add
            </v-btn
            >
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { useDialog } from "@/composable/usedialog";
import { defineComponent, onMounted, ref, watch } from "@vue/composition-api";
import useVuelidate from "@vuelidate/core";
import { useNamespacedMutations } from "vuex-composition-helpers";
import { required, url, minLength } from "@vuelidate/validators";
import { version } from "moment";
import { useRegion } from "@/modules/instance/compositionapi/useregion";
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";

import { SUPERADMINMANAGEOS } from "./namespace";
import { SelectOs, BitVersion } from "./type";

export default defineComponent({
  props: ["value", "versionedit"],
  setup(props, context) {
    const { dialog } = useDialog(props, context);
    const loadingselectos = ref(false);
    const loadingselectbit = ref(false);
    const {
      fetchos,
      fetchbitversion,
      editVersion,
    } = useNamespacedActions(SUPERADMINMANAGEOS, [
      "fetchos",
      "fetchbitversion",
      "editVersion",
    ]);

    const { selectregions: selectRegions, fetchregions } = useRegion()        

    onMounted(() => {
      fetchos();
      fetchbitversion();
      fetchregions()
    });

    const Fetchos = async () => {
      try {
        loadingselectos.value = true;
        await fetchos();
      } finally {
        loadingselectos.value = false;
      }
    };

    const Fetchbit = async () => {
      try {
        loadingselectbit.value = true;
        await fetchbitversion();
      } finally {
        loadingselectbit.value = false;
      }
    };

    const { selectos, selectbit } = useNamespacedState(SUPERADMINMANAGEOS, [
      "selectos",
      "selectbit",
    ]);
    const os_id = ref();
    const version_number = ref();
    const filesystem = ref();
    const versions_id = ref();
    const image = ref();
    const selected_region = ref();

    if (props.versionedit) {
      const versionedit = props.versionedit as any;
      os_id.value = versionedit.os;
      version_number.value = versionedit.version_number;
      versions_id.value = versionedit.versions_id;
      image.value = versionedit.image;
      selected_region.value = versionedit.selected_region;
    }
    const imageosalreadyexist = ref("");

    const $v = useVuelidate(
      {
        os_id: {
          required,
          conditional: {
            $message: "image os already exist",
            $validator: (val: any): boolean => {
              return imageosalreadyexist.value == ""
            },
          },
        },
        version_number: {
          required,
          minLength: minLength(5),
          conditional: {
            $message: "image os already exist",
            $validator: (val: any): boolean => {
              return imageosalreadyexist.value == ""
            },
          },
        },
        versions_id: {
          required,
          conditional: {
            $message: "image os already exist",
            $validator: (val: any): boolean => {
              return imageosalreadyexist.value == ""
            },
          },
        },
        image: { required, url },
        selected_region: { required },
      },
      {
        os_id,
        version_number,
        filesystem,
        versions_id,
        image,
        selected_region,
      }
    );
    watch(os_id, (val: string) => {
      imageosalreadyexist.value = ""
      $v.value.$reset();
    });
    watch(version_number, (val: string) => {
      imageosalreadyexist.value = ""
      $v.value.$reset();
    });
    watch(versions_id, (val: string) => {
      imageosalreadyexist.value = ""
      $v.value.$reset();
    });
    const clickuploadimage = () => {
      document?.getElementById("uploadimage")?.click();
    };

    const { addNewVersion } = useNamespacedActions(SUPERADMINMANAGEOS, [
      "addNewVersion",
    ]);

    const resetform = async () => {
      os_id.value = "";
      version_number.value = "";
      versions_id.value = "";
      image.value = "";
      $v.value.$reset();
      dialog.value = false;
      selected_region.value = "";
    };

    const { setopendialogcommonsuccess } = useNamespacedMutations("DASHBOARD", [
      "setopendialogcommonsuccess",
    ]);

    const CreateVersion = () => {
      $v.value.$touch();
      console.log($v.value.$errors)
      if ($v.value.$errors.length) return;
      const Value = {
        os_id: os_id.value.id,
        version_number: version_number.value,
        versions_id: versions_id.value.id,
        image: image.value,
        name: os_id.value.name,
        region: selected_region.value['name'],
        tags: [
          os_id.value.name,
          version_number.value,
          versions_id.value.version_name,
        ],
      };
      addNewVersion(Value)
        .then(() =>
          resetform().then(() => {
            context.emit("added");
            setopendialogcommonsuccess(true);
          })
        )
        .catch((e: any) => {
          if (e.response.data.data == "image os already exist") {
            imageosalreadyexist.value = e.response.data.data;
          }
        });
    };

    const Save = async () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const versionedit = props.versionedit as any;
      const Value = {
        id: versionedit.id,
        os: os_id.value.id,
        version_number: version_number.value,
        versions_id: versions_id.value.id,
        image: image.value,
        name: os_id.value.name,
        region: selected_region.value['name'],
        tags: [
          os_id.value.name,
          version_number.value,
          versions_id.value.version_name,
        ],
      };
      await editVersion(Value).then((e: any) => {
        context.emit("updated");
        dialog.value = false;
      });
    };

    return {
      imageosalreadyexist,
      Fetchos,
      Fetchbit,
      loadingselectbit,
      loadingselectos,
      Save,
      clickuploadimage,
      dialog,
      selectos,
      selectbit,
      os_id,
      version_number,
      filesystem,
      versions_id,
      image,
      $v,
      CreateVersion,
      selectRegions,
      selected_region,
    };
  },
});
</script>
<style lang="scss" scoped>
.v-card__text p {
  font-size: 12px;
  font-weight: 700;
}
</style>