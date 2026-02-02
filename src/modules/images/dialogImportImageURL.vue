<template>
  <v-dialog v-model="value" persistent max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Import an Image via URL
        </div>
      </v-card-title>
      <!-- <v-card-text>
        <p class="font-weight-bold">Choose Region</p>
        <v-select
          id="SelectRegion"
          v-model="selectedRegion"
          outlined
          :items="selectRegions"
          placeholder="Choose Region"         
          :error-messages="
            $v.selectedRegion.$errors.length
              ? $v.selectedRegion.$errors[0].$message
              : ''
          "
        >
        </v-select>
        <small class="red--text">{{
          $v.selectedRegion.$errors.length ? $v.selectedRegion.$errors[0].$message : ""
        }}</small>          
      </v-card-text> -->
      <v-card-text>
        <p class="font-weight-bold">Image Name</p>
        <v-text-field
          hide-details
          outlined
          placeholder="Enter your Custom Image name"
          v-model="imageName"
          :error-messages="
            $v.imageName.$errors.length
              ? $v.versionNumber.$errors[0].$message
              : ''
          "
        ></v-text-field>
        <small class="red--text">{{
          $v.imageName.$errors.length ? $v.imageName.$errors[0].$message : ""
        }}</small>
      </v-card-text>
      <v-card-text>
        <p class="font-weight-bold">Version Number</p>
        <v-text-field
          hide-details
          outlined
          placeholder="Enter your Custom Image version number"
          v-model="versionNumber"
          :error-messages="
            $v.versionNumber.$errors.length
              ? $v.versionNumber.$errors[0].$message
              : ''
          "
        ></v-text-field>
        <small class="red--text">{{
          $v.versionNumber.$errors.length
            ? $v.versionNumber.$errors[0].$message
            : ""
        }}</small>
      </v-card-text>
      <v-card-text>
        <p class="font-weight-bold">Image URL</p>
        <v-text-field
          hide-details
          outlined
          placeholder="Enter your Custom Image URL"
          v-model="imageURL"
          :error-messages="
            $v.imageURL.$errors.length ? $v.imageURL.$errors[0].$message : ''
          "
        ></v-text-field>
        <small class="red--text">{{
          $v.imageURL.$errors.length ? $v.imageURL.$errors[0].$message : ""
        }}</small>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6">
            <v-btn
              color="accent"
              block
              depressed
              height="50"
              @click="
                () => {
                  $emit('close');
                }
              "
            >
              Cancel
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              v-if="user.role.toLowerCase() !== 'superadmin'"
              color="secondary"
              block
              height="50"
              depressed
              @click="doImport()"
            >
              <beat-loader
                v-if="isLoading"
                :loading="isLoading"
                color="white"
                size="10px"
                class="ml-2"
              ></beat-loader>
              <span v-else>Import</span>
            </v-btn>
            <v-btn
              v-else
              color="secondary"
              block
              height="50"
              depressed
              @click="doImport()"
            >
              <beat-loader
                v-if="isLoading"
                :loading="isLoading"
                color="white"
                size="10px"
                class="ml-2"
              ></beat-loader>
              <span v-else>Import</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import {
  useNamespacedActions,
  useNamespacedState
} from "vuex-composition-helpers";
import { defineComponent, onMounted, ref } from "@vue/composition-api";
const useVuelidate = require("@vuelidate/core").default;
const { required, minLength } = require("@vuelidate/validators");
import api from "@/lib/api";
import { mapGetters } from "vuex";
import { useRegion } from "@/modules/instance/compositionapi/useregion";

export default {
  props: ["value"],
  components: {
  },
  setup(props, context) {
    const imageName = ref("");
    const versionNumber = ref("");
    const imageURL = ref("");
    // const selectedRegion = ref("");
    const { isLoading } = useNamespacedState("IMAGES", ["isLoading"]);
    const { importImageViaURL } = useNamespacedActions("IMAGES", [
      "importImageViaURL"
    ]);

    const $v = useVuelidate(
      {
        imageName: {
          required,
          minLength: minLength(5),
        },
        versionNumber: { required },
        imageURL: { required },
        // selectedRegion: { required }
      },
      {
        imageName,
        versionNumber,
        imageURL,
        // selectedRegion
      }
    );

    const { selectregions: selectRegions, fetchregions } = useRegion()

    onMounted(() => {
      fetchregions()
    });

    // const doImport = async () => {
    async function doImport() {
      console.log(this.user);
      $v.value.$touch();
      if ($v.value.$invalid) return;

      const payload = {
        name: imageName.value,
        version: versionNumber.value,
        url: imageURL.value,
        // region: selectedRegion.value['name']
      };
      const response = await importImageViaURL(payload);
      if (response.status === 200) {
          imageName.value = "";
          versionNumber.value = "";
          imageURL.value = "";
          // selectedRegion.value = "";
          $v.value.$reset();
          context.emit("close");
          this.$router.push("/image/customimage");
          this.$forceUpdate();
      }
    }
    return {
      $v,
      isLoading,
      imageName,
      versionNumber,
      imageURL,
      doImport,
      selectRegions,
      // selectedRegion,
    };
  },
  data() {
    return {
      tnc: false,
      dataTnc: {}
    };
  },
  computed: {
    ...mapGetters({
      projectId: "PROJECT/getprojectid",
      user: "ROLEPERMISSION/getuser"
    })
  },
  methods: {
  }
};
</script>
