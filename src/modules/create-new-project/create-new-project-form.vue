<template>
  <v-card-text>
    <v-container>
      <v-col class="justify-center">
        <h1
          style="
            text-align: center;
            font-weight: 800;
            font-size: 28px;
            line-height: 36px;
            letter-spacing: 0.04em;
            font-family: Mont;
            font-style: normal;
          "
        >
          {{ isNeedCreateProject ? "1" : "2" }}. CREATE NEW PROJECT
        </h1>
        <p
          style="font-size: 20px; color: #a5b3bf; line-height: 27.24px"
          class="text-center mt-5"
        >
          You have to create project <br />for using the app
        </p>
        <v-form
          ref="form"
          style="margin-top: 40px"
          :class="{ 'pb-8': errorMessage }"
          lazy-validation
        >
          <v-text-field
            id="projectName"
            flat
            outlined
            maxlength="30"
            v-model="projectName"
            placeholder="Project Name"
            required
            
            style="margin-bottom: 22px"
          ></v-text-field>

          <v-select
            id="selected_region"
            v-model="selected_region"
            outlined
            :items="selectRegions"
            placeholder="Choose Region"   
            required      
            
            style="margin-bottom: 22px"
          >
          </v-select>

          <v-textarea
            rows="5"
            id="description"
            flat
            outlined
            maxlength="255"
            v-model="description"
            placeholder="Description Project"
            required
            style="margin-bottom: 22px"
            
          ></v-textarea>

          <v-text-field
            maxlength="20"
            @keydown="vatidKeydown($event)"
            flat
            outlined
            v-model="vatid"
            placeholder="Business VAT ID"
            required
          />

          <v-radio-group
            v-model="payment_method"
            row
            :disabled="loading"
            :filled="loading"
            
          >
            <v-row>
              <v-col v-if="!hidePrepaid">
                <v-radio label="Prepaid" value="prepaid">
                  <template v-slot:label>
                    <span class="fs-14">Prepaid</span>
                  </template>
                </v-radio>
              </v-col>

              <v-col v-if="!hidePostpaid">
                <v-radio label="Postpaid" value="postpaid">
                  <template v-slot:label>
                    <span class="fs-14">Postpaid</span>
                  </template>
                </v-radio>
              </v-col>
            </v-row>
          </v-radio-group>

          <p
            v-if="payment_method === 'postpaid'"
            :style="{ color: 'red', backgroundColor: 'pink', padding: '10px' }"
          >
            Please contact our Team to activate your Postpaid account.
          </p>

          <v-text-field
            id="voucher_discount_code"
            flat
            outlined
            maxlength="30"
            v-model="voucher_discount_code"
            placeholder="Voucher Discount Code"
            required
            
            style="margin-bottom: 22px"
          ></v-text-field>

          <v-btn
            id="submit"
            :disabled="isLoading"
            block
            height="50"
            depressed
            color="secondary"
            class="mr-4 mt-7 text-capitalize font-weight-bold"
            @click="save"
          >
            <beat-loader
              v-if="isLoading"
              :loading="isLoading"
              :color="'white'"
              :size="'10px'"
              class="ml-2"
            ></beat-loader>
            <span v-else>Create</span>
          </v-btn>
          <br />
          <v-alert
            v-if="errorMessage"
            color="red"
            class="alert-message"
            type="error"
            >{{ errorMessage }}
          </v-alert>
        </v-form>
      </v-col>
    </v-container>
  </v-card-text>
</template>
<script>
import { useAction } from "./useAction";
import { mapGetters } from "vuex";
import localstorage from "@/lib/localstorage";
import api from "@/lib/api";
import { useRegion } from "@/modules/instance/compositionapi/useregion";
import { onMounted, watch, } from "@vue/composition-api";

// const hidePrepaid = process.env.VUE_APP_DEV_MODE !== 'fase-1.3'

// const hidePrepaid = process.env.VUE_APP_DEV_MODE !== 'fase-1.3'
const hidePrepaid = false;

export default {
  computed: {
    ...mapGetters({
      loggedUser: "CREATEORGANIZATION/getProfile",
      isLoading: "CREATENEWPROJECT/isLoading",
    }),
    isNeedCreateProject() {
      return localstorage.getItem("need_create_project");
    },
    hidePrepaid() {
      return !this.isPersonal;
    },
    hidePostpaid() {
      return this.isPersonal;
    },
    isPersonal() {
      return localstorage.getItem("type") === "P" && this.personalStatus;
    },
  },
  data() {
    return {
      errorMessage: undefined,
      success: false,
      personalStatus: false,
      loading: false,
    };
  },
  async mounted() {
    // Gak tau kenapa, after create organization,
    // terus gak bisa nge call API create project (error 400)
    // harus relogin dlu (refresh token) baru bisa :D
    this.$store.dispatch("HOMEPAGE/relogin");
    const token = localstorage.getItem("token");
    if (!token) {
      this.$router.push("/");
    }

    await this.getPersonalStatus();

    this.$nextTick(() => {
      this.payment_method = this.hidePostpaid ? "prepaid" : "postpaid";
    });
  },
  methods: {
    async getPersonalStatus() {
      this.loading = true;

      try {
        const res = await api.GET("/user/personal-status");
        this.personalStatus = res.data.personal_active;

        const isUserPersonal = localstorage.getItem("type") === "P";
        const isPersonalActive = res.data.personal_active;
        if (isUserPersonal && isPersonalActive) {
          this.payment_method = "prepaid";
        } else {
          this.payment_method = "postpaid";
        }
      } catch (err) {
        let errmsg = "Sorry, an error occurred while displaying data";
        const thereIsErrorMessage = err && err.response && err.response.data;

        if (thereIsErrorMessage && err.response.data.message) {
          errmsg = err.response.data.message;
        }

        if (
          thereIsErrorMessage &&
          err.response.data.data !== "record not found"
        ) {
          this.$store.dispatch("HOMEPAGE/showErrorToast", errmsg);
        }
      }

      this.loading = false;
    },
  },
  setup(props, context) {
    const Composable = useAction();
    const { save: Save, vatid } = Composable;
    const $auth = context.root.$auth;
    const { selectregionsbystatus: selectRegions, fetchregionbystatus } = useRegion()
    onMounted(() => {
      fetchregionbystatus()
    });

    watch(vatid, (newVal) => {
      vatid.value = newVal.replace(/[^a-zA-Z0-9]/g, '');
    })

    const vatidKeydown = (e) => {
      if (/[^a-zA-Z0-9]/g.test(e.key)) {
        e.preventDefault();
      }
    }

    return {
      ...Composable,
      selectRegions,
      async save() {
        try {
          const result = await Save();
          console.log('result:', result)
          if (result.code == '' || result.code == null){            
            window.location.href = "/";
          }
          if (result.code === 200) {
            localstorage.removeItem("need_create_project");
            location.href = "/";
          } else {
            let error = result.data;
            if (error.includes("already exist"))
              this.errorMessage = "Project name is already exists! Please create new project with another name";
            else if (error.includes("Voucher discount code is not valid"))
              this.errorMessage = "Voucher discount code is not valid";
            else if (error.includes("Business VAT ID can`t be empty"))
              this.errorMessage = "Business VAT ID can`t be empty"
            else
              this.errorMessage =
                "Internal server error. Please contact administrator.";
          }
        } catch (err) {
          let response_data = err.response.data.response_data;
          if (!response_data)
            response_data =
              "Internal server error. Please contact administrator for more help.";
          this.errorMessage = response_data;
        }        
      },
      vatidKeydown,
    };
  },
};
</script>
<style lang="scss" scoped>
.v-card__text {
  ::v-deep .v-btn__content {
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px;
    letter-spacing: 0.02em;
  }
}

.v-input {
  ::v-deep .v-input__slot {
    margin-bottom: 0;
  }
}
.alert-message {
  width: calc(100% - 72px);
  margin-right: 36px;
  margin-left: 36px;
}
</style>
