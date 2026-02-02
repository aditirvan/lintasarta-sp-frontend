<template>
  <v-dialog persistent max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div v-if="commitment" class="headline font-weight-bold font--text">
          Edit Commitment
        </div>
        <div v-else class="headline font-weight-bold font--text">
          Add New Commitment
        </div>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Organization</p>
        <v-autocomplete
          id="FilterOrg"
          :search-input.sync="searchorganization"
          v-model="organization"
          :items="organizations"
          outlined
          autocomplete="off"
          item-text="name"
          item-value="id"
          placeholder="Organization"
          attach="#FilterDialogOrgAttach"
          clearable
          hide-details
          @focus="
            () => {
              fetchorganizations({ search: searchorganization });
            }
          "
          @change="getDataProjects"
        >
          <template v-slot:append-outer>
            <div id="FilterDialogOrgAttach"></div>
          </template>
        </v-autocomplete>
      </v-card-text>
      <v-card-text>
        <p>Project</p>
        <v-select
          id="OperatingSystem"
          :items="optionsProject"
          item-text="name"
          return-object
          v-model="project"
          :error-messages="
            $v.project.$errors.length ? $v.project.$errors[0].$message : ''
          "
          hide-no-data
          outlined
          placeholder="Select Project"
        >
          <template v-slot:no-data>
            <div v-if="loadingSelectProject" class="d-flex flex-row">
              <v-progress-circular
                style="margin: auto"
                indeterminate
                color="primary"
              ></v-progress-circular>
            </div>
            <div v-else>
              <v-list-item>
                <v-list-item-title> No Data </v-list-item-title>
              </v-list-item>
            </div>
          </template>
        </v-select>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Commitment Fee</p>
        <v-text-field
          maxlength="50"
          v-model="commitmentFee"
          placeholder="0"
          :error-messages="
            $v.commitmentFee.$errors.length ? $v.commitmentFee.$errors[0].$message : ''
          "
          outlined
          @keyup="() => {
            const fee = toPlain(commitmentFee)
            commitmentFee = toThousands(fee)
          }"
        >
          <template v-slot:prepend-inner>
            <div style="margin-top:1px;">IDR</div>
          </template>
        </v-text-field>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Duration</p>
        <v-select
          id="Duration"
          :items="optionsDuration"
          item-text="text"
          item-value="value"
          v-model="duration"
          :error-messages="
            $v.duration.$errors.length ? $v.duration.$errors[0].$message : ''
          "
          hide-no-data
          @input="setCommitmentDate"
          outlined
          placeholder="Select Duration"
        >
        </v-select>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <p class="titletext">Start Date</p>
            <v-text-field
              maxlength="50"
              type="date"
              placeholder="Start Date"
              :error-messages="
                $v.startDate.$errors.length ? $v.startDate.$errors[0].$message : ''
              "
              flat
              outlined
              v-model="startDate"
              @change="setCommitmentDate"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <p class="titletext">End Date</p>
            <v-text-field
              maxlength="50"
              disabled
              type="date"
              :error-messages="
                $v.endDate.$errors.length ? $v.endDate.$errors[0].$message : ''
              "
              flat
              outlined
              v-model="endDate"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text>
        <p class="titletext">Discount (%)</p>
        <v-text-field
          type="number"
          min="0"
          max="100"
          placeholder="Enter Discount"
          :error-messages="
            $v.discount.$errors.length ? $v.discount.$errors[0].$message : ''
          "
          flat
          outlined
          v-model="discount"
        ></v-text-field>
      </v-card-text>
      <v-card-text>
        <v-checkbox
          v-model="renewal"
          label="Automatic Renewal"
          class="checkbox-renewal font-weight-bold f-12"
        ></v-checkbox>
        <p>*Cancel at any time in Commitment Project Menu at least 1 week before each renewal date. Plan automatically renews until cancelled</p>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col
            ><v-btn
              @click="
                () => {
                  resetForm()
                  dialog = false;
                }
              "
              depressed
              height="45"
              block
              class="accent"
              ><span class="fz-14">Cancel</span></v-btn
            ></v-col
          >
          <v-col>
            <v-btn
              id="Save"
              v-if="commitment"
              :disabled="isLoading"
              @click="
                () => {
                  save();
                }
              "
              depressed
              height="45"
              block
              class="secondary"
            >
              <beat-loader v-if="isLoading" :loading="isLoading" :color="'white'" :size="'10px'"></beat-loader>
              <span v-else class="fz-14">Create</span>
            </v-btn>
            <v-btn
              id="Create"
              v-else
              :disabled="isLoading"
              @click="
                () => {
                  submit();
                }
              "
              depressed
              height="45"
              block
              class="secondary"
              >
                <beat-loader v-if="isLoading" :loading="isLoading" :color="'white'" :size="'10px'"></beat-loader>
                <span v-else class="fz-14">Create</span>
              </v-btn>
            </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { useCommitment } from "./useCommitment";
import { useProjects } from "@/modules/project/useprojects";
import { ref, watch } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedMutations,
} from "vuex-composition-helpers";
import { useDialog } from "@/composable/usedialog";
import { required, email as Email } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { SUPERADMINMANAGEORG } from "../superadmin-manageorganization/namespace";
import moment from 'moment'
import { toThousands, toPlain } from '@/lib/formatter'

export default {
  props: ['value', 'commitment'],
  setup(props, context) {
    const today = moment().format('YYYY-MM-DD')
    const startDate = ref(today);
    const renewal = ref(false);
    const endDate = ref(today);
    const organization = ref();
    const project = ref();
    const commitmentFee = ref();
    const duration = ref();
    const discount = ref(0);
    const loadingSelectProject = ref(false);
    const { dialog } = useDialog(props, context);
    const optionsDuration = [
      {
        text: '1 Year',
        value: 1,
      },
      {
        text: '3 Years',
        value: 3,
      },
      {
        text: '5 Years',
        value: 5,
      },
    ]

    const ComposableCommitment = { ...useCommitment() }
    const {
        isLoading,
        optionsProject,
        fetchorganizations,
        organizations,
        searchorganization,
        FETCH_PROJECTS,
        CREATE_COMMITMENT,
    } = ComposableCommitment

    const ComposableProject = { ...useProjects() }
    const {
        fetchprojects,
        projects,
        projectselected,
    } = ComposableProject

    const getDataProjects = async () => {
      try {
        loadingSelectProject.value = true;
        await FETCH_PROJECTS({ organization_id: organization.value })
      } finally {
        loadingSelectProject.value = false;
      }
    };

    const setCommitmentDate = async () => {
      if(duration.value) endDate.value = moment(startDate.value).add(duration.value, 'year').format('YYYY-MM-DD')
      else endDate.value = today
    };

    if (props.commitment) {
      organization.value = props.commitment.project.organization.id;
      project.value = props.commitment.project_id;
      commitmentFee.value = props.commitment.fee;
      duration.value = props.commitment.duration;
      discount.value = props.commitment.discount;
    }
    
    let $v;
    $v = useVuelidate(
      {
        organization: { required },
        project: { required },
        commitmentFee: { required },
        duration: { required },
        startDate: { required },
        endDate: { required },
        discount: { required },
      },
      {
        organization,
        project,
        commitmentFee,
        duration,
        startDate,
        endDate,
        discount,
      }
    );
    
    const {
      addorganization,
      editorganization,
    } = useNamespacedActions(SUPERADMINMANAGEORG, [
      'addorganization',
      'editorganization',
    ]);

    const submit = async () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const payload = {
        project_id: project.value.id,
        fee: toPlain(commitmentFee.value),
        duration: duration.value,
        discount: parseInt(discount.value),
        start_date: moment(startDate.value).format(),
        end_date: moment(endDate.value).format(),
        is_automatic_renewal: renewal.value,
        type: 'YEAR'
      };
      const response = await CREATE_COMMITMENT(payload)
      if(response.code === 200){
        resetForm()
        dialog.value = false
      }
    };

    function resetForm() {
      project.value = null
      commitmentFee.value = null
      duration.value = 0
      discount.value = 0
      startDate.value = today
      endDate.value = today
      renewal.value = false
    }
 const { setopendialogcommonsuccess } = useNamespacedMutations("DASHBOARD", [
      "setopendialogcommonsuccess",
    ]);

    const save = async () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const payload = {
        project_id: project.value.id,
        fee: parseInt(commitmentFee.value.toString().replaceAll('.', '')),
        duration: duration.value,
        discount: parseInt(discount.value),
        start_date: moment(startDate.value).format(),
        end_date: moment(endDate.value).format(),
        is_automatic_renewal: renewal.value,
        type: 'YEAR'
      };
      const response = await CREATE_COMMITMENT(payload)
      if(response.code === 200){
        resetForm()
        dialog.value = false
        setopendialogcommonsuccess(true)
      }
    };

    return {
      feeFocus: ref(false),
      toThousands,
      resetForm,
      toPlain,
      renewal,
      isLoading,
      optionsProject,
      optionsDuration,
      CREATE_COMMITMENT,
      getDataProjects,
      setCommitmentDate,
      fetchprojects,
      loadingSelectProject,
      projects,
      projectselected,
      fetchorganizations,
      searchorganization,
      organizations,
      organization,
      project,
      commitmentFee,
      duration,
      startDate,
      submit,
      endDate,
      discount,
      dialog,
      $v,
      save,
    };
  },
};
</script>
<style lang="scss" scoped>
.titletext {
  font-size: 12px;
  margin-bottom: 12px;
  font-weight: 700;
}
.v-input--is-disabled {
  ::v-deep .v-input__slot {
    background: #f1f2f2;
  }
}
</style>