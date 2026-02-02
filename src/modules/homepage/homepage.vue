<template>
  <v-main style="margin-top: 65px">
    <v-container
        fluid
        :style="{
        'background-image': 'url(' + require('@/assets/g8429.png') + ')',
        'background-position': 'bottom right',
        'padding-bottom': '50px',
        'background-size':'contain'
      }"
    >
      <v-row style="height: 100%">
        <v-col
            class="d-flex flex-column justify-center"
            :class="{ 'order-2': $vuetify.breakpoint.xsOnly }"
            v-if="isShowComponentCloudeka"
        >
          <div style="max-width: 580px; line-height: 1.7em; 
          margin-top: 5vw;
          margin-right: 0;
          margin-bottom: 5vw;
          "
               :style="{
            'margin-left':$vuetify.breakpoint.xsOnly?'20px':'min(20%,300px)'
          }"
          >
            <h1
                class="display-2"
                style="
                font-family: Fira sans !important;
                font-weight: 700;
                color: #556272;
              "
            >
              Welcome to Lintasarta
            </h1>
            <h1
                class="display-2"
                style="
                font-family: Fira sans !important;
                font-weight: 700;
                color: #2388C9;
              "
            >
              Cloudeka
            </h1>
            <br/>
            <p
                style="
                font-family: Fira sans ;
                font-style: normal;
                font-weight: 500;
                font-size: 24px;
                line-height: 31px;
              "
            >
              The more a company’s business develops, the more complex its IT
              infrastructure required eventually becomes.
            </p>
            
          </div>
        </v-col>

        <v-col
            cols="12"
            md="6"
            v-show="visibilityloginorsignup"
            style="flex-grow: 2; margin-top: 5vw; margin: auto"
            :class="{
            'order-1': $vuetify.breakpoint.xsOnly,
            }"
        >
          <v-card
              class="rounded-lg"
              style="box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05) !important;
border-radius: 20px; !important; max-width:460px;margin:auto"


              elevation="0"
          >
            <loginform v-show="loginorsignup == 'login'"/>
            <!-- <signupform v-show="loginorsignup == 'signup'" /> -->
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <Footer v-if="isShowComponentCloudeka"/>

    <Dialog
        :title="title"
        :message="message"
        v-model="dialog"
        @close="
          () => {
            dialog = false;
          }
        "
    />
  </v-main>
</template>
<script>
import loginform from "./login-form";
import {useGetters, useMutations} from "vuex-composition-helpers";
import api from '../../lib/api'
import Dialog from './Dialog'
import Footer from "../../components/LandingPageFooter.vue";
import {ref} from '@vue/composition-api'
import externalSubDomain from '@/lib/externalSubDomain'

export default {
  setup(props, context) {
    const breakpoint = context.root.$vuetify.breakpoint;

    const {loginorsignup, visibilityloginorsignup} = useGetters({
      loginorsignup: "HOMEPAGE/loginorsignup",
      visibilityloginorsignup: "HOMEPAGE/visibilityloginorsignup",
    });

    const {setvisibilityloginorsignup} = useMutations({
      setvisibilityloginorsignup: "HOMEPAGE/setvisibilityloginorsignup",
    });

    if (breakpoint.xsOnly) {
      setvisibilityloginorsignup(false);
    }

    const host = window.location.host;
    const parts = host.split('.');
    const subDomain = parts[0];
    const subDomainCloudeka = externalSubDomain.subDomainCloudekaArray;
    const isShowComponentCloudeka = ref(true);
    if (subDomainCloudeka.includes(subDomain)) {
      isShowComponentCloudeka.value = true;
    } else {
      isShowComponentCloudeka.value = false;
    }

    return {
      loginorsignup,
      visibilityloginorsignup,
      setvisibilityloginorsignup,
      isShowComponentCloudeka,
    };
  },
  data() {
    return {
      dialog: false,
      title: undefined,
      message: undefined
    }
  },
  async mounted() {
    // Check Token Registration
    try {
      let token = this.$route.query.token;
      if (token) {
        let result = await api.GET('user/verify?token=' + token)
        if (result) {
          if (result.code == 200) {
            this.dialog = true
            this.title = 'Verification Successful!'
            this.message = 'You have successfully email verification, <br/> now you can login to Lintasarta'
            this.router.push({path: '/', query: {}})
          }
        }
      }
    } catch (e) {
      this.title = 'Verification Failed!'
      this.message = 'Invalid Verification Link. Please try again!'
      this.dialog = true
      this.router.push({path: '/', query: {}})
    }
  },
  watch: {
    "$vuetify.breakpoint.xsOnly": {
      handler(val) {
        if (val == true) {
          this.setvisibilityloginorsignup(false);
        } else {
          this.setvisibilityloginorsignup(true);
        }
      },
    },
  },
  components: {
    loginform,
    Dialog,
    Footer,
  },
};
</script>


<style lang="scss" scoped>
.v-application {
  font-family: "Fira Sans", sans-serif !important;

  & .display-1,
  & .display-2,
  & .display-3,
  & .display-4,
  & * {
    font-family: "Fira Sans", sans-serif !important;
  }
}

#contactus {
  p {
    font-size: 0.7em;
    font-weight: 600;
  }

  ::v-deep input,
  ::v-deep .v-btn__content {
    font-size: 0.8em;
    font-weight: 600;
  }
}

#copyright {
  .container {
    max-width: 1300px;
  }

  p {
    margin-bottom: 0px;
    font-size: 0.8em;
  }
}

.v-btn {
  ::v-deep .v-btn__content {
    font-family: Fira sans;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px;
    letter-spacing: 0.02em;
  }
}
</style>