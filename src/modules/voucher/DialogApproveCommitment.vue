<template>
  <v-dialog persistent max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">
          Approve Commitment Fee
        </div>
        <br>
        <p>
          Are you sure you want to approve this project?
        </p>
        <v-row>
          <v-col sm="12" md="6" class="font--text">
            <div class="font-weight-bold mb-2">Organization</div>
            <div class="font-weight-500">{{ commitment.organization ? commitment.organization.name : '-' }}</div>
          </v-col>
          <v-col sm="12" md="6" class="font--text">
            <div class="font-weight-bold mb-2">Fee</div>
            <div class="font-weight-500">{{ commitment.fee ? `IDR ${toThousands(commitment.fee)}` : '-' }}</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col sm="12" md="6" class="font--text">
            <div class="font-weight-bold mb-2">Project Name</div>
            <div class="font-weight-500">{{ commitment.project ? commitment.project.name : '-' }}</div>
          </v-col>
          <v-col sm="12" md="6" class="font--text">
            <div class="font-weight-bold mb-2">Duration</div>
            <div class="font-weight-500" style="text-transform: capitalize;">{{ `${commitment.duration} ${commitment.type ? commitment.type.toLowerCase() : ''}` || '-' }}</div>
          </v-col>
        </v-row>
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
              @input="setCommitmentDate"
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
        <v-row>
          <v-col
            ><v-btn
              :disabled="isLoading"
              @click="
                () => {
                  decline()
                }
              "
              depressed
              height="45"
              block
              class="error"
              >
                <beat-loader v-if="isLoading" :loading="isLoading" :color="'white'" :size="'10px'"></beat-loader>
                <span v-else class="fz-14">Decline</span>
              </v-btn></v-col>
          <v-col>
            <v-btn
              id="Approve"
              :disabled="isLoading"
              @click="
                () => {
                  approve();
                }
              "
              depressed
              height="45"
              block
              class="secondary"
            >
              <beat-loader v-if="isLoading" :loading="isLoading" :color="'white'" :size="'10px'"></beat-loader>
              <span v-else class="fz-14">Approve</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { useVoucher } from "./useVoucher";
import { useProjects } from "@/modules/project/useprojects";
import { ref, watch, onMounted } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedMutations,
} from "vuex-composition-helpers";
import { SUPERADMIN } from "../superadmin/namespace";
import { useDialog } from "@/composable/usedialog";
import { required, email as Email } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { SUPERADMINMANAGEORG } from "./namespace";
import moment from 'moment'
import { toThousands, toPlain } from '@/lib/formatter'

export default {
  props: ['value'],
  setup(props, context) {
    const today = moment().format('YYYY-MM-DD')
    const startDate = ref(today);
    const duration = ref();
    const commitmentDuration = commitment ? commitment.duration : 0
    const endDate = ref(moment(today).add(commitmentDuration, 'year').format('YYYY-MM-DD'));
    const renewal = ref(false);
    const organization = ref();
    const project = ref();
    const commitmentFee = ref();
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

    const ComposableCommitment = { ...useVoucher() }
    const {
        isLoading,
        optionsProject,
        fetchorganizations,
        organizations,
        commitment,
        searchorganization,
        FETCH_PROJECTS,
        CREATE_COMMITMENT,
        APPROVE_COMMITMENT,
        DECLINE_COMMITMENT,
    } = ComposableCommitment

    const ComposableProject = { ...useProjects() }
    const {
        fetchprojects,
        projects,
        projectselected,
    } = ComposableProject

    watch(commitment, val => {
      setCommitmentDate()
    })

    const getDataProjects = async () => {
      try {
        loadingSelectProject.value = true;
        await FETCH_PROJECTS({ organization_id: organization.value })
      } finally {
        loadingSelectProject.value = false;
      }
    };

    const setCommitmentDate = async () => {
      if(commitment.value.duration) endDate.value = moment(startDate.value).add(commitment.value.duration, 'year').format('YYYY-MM-DD')
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
        startDate: { required },
        endDate: { required },
        discount: { required },
      },
      {
        startDate,
        endDate,
        discount,
      }
    );

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
      discount.value = 0
      startDate.value = today
      endDate.value = today
    }

    const decline = async () => {
      const payload = { id: commitment.value.id }
      const response = await DECLINE_COMMITMENT(payload)
      if(response.code === 200){
        resetForm()
        dialog.value = false
      }
    };
    const approve = async () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const payload = {
        id: commitment.value.id,
        start_date: moment(startDate.value).format(),
        end_date: moment(endDate.value).format(),
        discount: parseInt(discount.value),
      };
      const response = await APPROVE_COMMITMENT(payload)
      if(response.code === 200){
        resetForm()
        dialog.value = false
      }
    };

    return {
      feeFocus: ref(false),
      toThousands,
      resetForm,
      toPlain,
      renewal,
      commitment,
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
      approve,
      decline,
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