<template>
  <div class="bg">
    <v-container class="responsive-container shadow">
      <v-col class="justify-center">
        <h1
          style="
            font-size: 28px;
            font-style: normal;
            font-weight: 700;
            line-height: 39px;
            letter-spacing: 0em;
            text-align: center;
          "
        >
          OTP Verification
        </h1>

        <p
          style="
            font-size: 20px;
            font-style: normal;
            font-weight: 400;
            line-height: 27px;
            letter-spacing: 0em;
            text-align: center;
            color: #A5B3BF;
            margin-top: 20px;
            margin-bottom: 30px;
          "
        >
          Enter the verification code we just sent you on your email
        </p>

        <div class="otp-input-cloudeka-container d-flex justify-center">
          <bach-otp-input
            ref="otpInput"
            input-classes="otp-input-cloudeka"
            separator=""
            :num-inputs="4"
            :should-auto-focus="true"
            :is-input-num="true"
            @on-change="otpOnChange"
            @on-complete="otpOnComplete"
          />
        </div>

        <p class="error--text ma-2" :style="{ opacity: otpError ? 1 : 0 }">
          {{ otpError }}
        </p>

        <p v-if="interval2 && interval2 > 0" :style="{ marginTop: '20px' }" class="text-center">
          Code will expired in {{ $moment(interval2).format('mm:ss') }}
        </p>

        <p v-else class="error--text text-center">Code is expired, please resend the code.</p>

        <v-btn
          id="submit"
          block
          height="50"
          depressed
          color="secondary"
          class="mr-4 text-capitalize font-weight-bold"
          style="margin-top: 20px; margin-bottom: 20px"
          @click="verify"
          :disabled="loading || interval2 < 0"
        >
          <!-- loading indicator -->
          <beat-loader v-if="loading" :loading="loading" :color="'white'" :size="'10px'" class="ml-2" />

          {{ loading ? "Verify..." : "Verify" }}
        </v-btn>

        <!-- <div class="d-flex justify-end">
          <button
            class="error--text"
            @click="logout"
          >
            Logout
          </button>
        </div> -->

        <p class="text-center">
          Don’t receive the Code?

          <span v-if="loading">loading...</span>

          <template v-else>
            <span v-if="interval && interval > 0">
              {{ $moment(interval).format('mm:ss') }}
            </span>

            <button
              v-else
              @click="resendOTP"
              style="
                color: #2C94D2;
                cursor: pointer;
              "
            >
              <u>Resend</u>
            </button>
          </template>
        </p>
      </v-col>
    </v-container>
  </div>
</template>

<script>
import api from '@/lib/api'
import localstorage from '@/lib/localstorage'
import externalSubDomain from '@/lib/externalSubDomain'

// import { useNamespacedActions } from 'vuex-composition-helpers'
// import { HOMEPAGE } from '../homepage/namespace'
import Vue from "vue";

export default {
  data() {
    return {
      loading: false,
      otp: null,
      otpError: '',
      interval: 90000,
      interval2: 300000,
      intervalFunc: null,
      intervalFunc2: null,
    }
  },
  methods: {
    async verify() {
      this.otpError = ''

      if (!this.otp) {
        this.otpError = 'Value is required'
      } else {
        this.loading = true

        try {
          const res = await api.POST('/user/validate-device', { OTP: this.otp })
          const token = res.data.token
          localstorage.setItem("token", token);
          localstorage.removeItem('need_validate')
          localstorage.removeItem('timestamp')
          location.href = "/";
        } catch (err) {
          let errmsg = "Sorry, an error occurred while submitting OTP";

          if (err && err.response && err.response.data && err.response.data.data) {
            errmsg = err.response.data.data;
          }

          this.$store.dispatch("HOMEPAGE/showErrorToast", errmsg);

          if (errmsg === 'Too many OTP Code attempt' || errmsg === 'Active OTP request not found') {
            this.logout()
          }
        }

        this.loading = false
      }
    },
    otpOnChange(val) {
      this.otp = val
    },
    otpOnComplete(val) {
      this.otp = val
    },
    intervalOn() {
      // if (this.interval) {
        this.interval -= 1000
        this.interval2 -= 1000
      // } else {
      //   clearInterval(this.intervalFunc)
      // }
    },
    async resendOTP() {
      localstorage.setItem('timestamp', new Date())
      this.loading = true

      try {
        const externalSubdomain = externalSubDomain.getSubDomain();
        const external_subdomain = externalSubdomain
        await api.POST('/user/resend-validate', {external_subdomain})
        this.interval = 90000
        this.interval2 = 300000
        clearInterval(this.intervalFunc)
        this.intervalFunc = setInterval(this.intervalOn, 1000);
      } catch (err) {
        let errmsg = "Sorry, an error occurred while sending the OTP";

        if (err && err.response && err.response.data && err.response.data.data) {
          errmsg = err.response.data.data;
        }

        this.$store.dispatch("HOMEPAGE/showErrorToast", errmsg);

        if (errmsg === 'Too many OTP Code attempt' || errmsg === 'Active OTP request not found') {
          this.logout()
        }
      }

      this.loading = false
    },
    logout() {
      // console.log('logout clicked', this.$store)
      // this.$store.dispatch('HOMEPAGE/logout')
      const context = this.$store

      context.commit("ROLEPERMISSION/setuser", {}, { root: true });

      // Disconnects Websocket connections
      // const role = localStorage.getItem("role");
      // if (role == "Superadmin") {
      //   context.state.superAdminWebsocket.close(); // superadmin
      // }

      //context.state.superAdminWebsocket.close() // superadmin
      Vue.prototype.$disconnect(); // project
      const cid = localstorage.getItem('cid')
      localstorage.clear();

      if (cid) {
        localstorage.setItem('cid', cid)
      }

      context.commit("setToastWS", false);

      if (this.router.history.current.path != "/") {
        this.router.replace("/");
      }
    }
  },
  mounted() {
    window.addEventListener('beforeunload', (event) => {
      this.logout()
    });
    const timestamp = localstorage.getItem('timestamp')
    if (timestamp) {
      const then = Date.parse(timestamp)
      const now = Date.parse(new Date().toString())
      const difference = now - then

      if (difference < 90000) {
        this.interval = this.interval - difference
        this.interval2 = this.interval2 - difference
      }
    }

    this.intervalFunc = setInterval(this.intervalOn, 1000);
  },
  beforeDestroy() {
    clearInterval(this.intervalFunc)
  },
  // setup(props, context) {
  //   const { logout } = useNamespacedActions(HOMEPAGE, 'logout')
  //   const $router = context.root.$router

  //   function signout() {
  //     logout.then(() => {
  //       $router.replace('/')
  //     })
  //   }

  //   return {
  //     signout
  //   }
  // }
}
</script>

<style scoped>
.bg {
  background-image: url('~@/assets/g8429.png');
  background-position: right bottom;
  padding-bottom: 50px;
  background-size: contain;
}

.shadow {
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  background-color: white;
}

.responsive-container {
  margin-top: 100px;
  width: 612px;
  padding-left: 91px;
  padding-right: 91px;
}

@media only screen and (max-width: 612px) {
  .responsive-container {
    width: 100%;
    padding-left: 0;
    padding-right: 0;
  }
}

.otp-input-cloudeka-container div {
  display: flex;
  justify-content: space-between;
}
</style>
