<template>
  <div>
    <v-toolbar
      flat
      class="white mt-5"
      style="margin-right:5vw;">
      <div class="">
        
        <v-img
          @click="backtohome"
          alt="Lintasarta Logo"
          class="shrink"
          style="margin-left:5vw;"
          contain
          :src="imgLogo"
          transition="scale-transition"
          
        />
      </div>

      <v-spacer></v-spacer>

      <v-toolbar-items v-if="isShowComponentCloudeka">
        <v-toolbar-title class="mt-8 ml-5 font-weight-bold blue-grey--text">
          <a class="link" href="http://cloudeka.id/why-us">
            Why Us
          </a>
        </v-toolbar-title>
        <v-flex>
          <v-toolbar-title class="mt-8 ml-5 font-weight-bold blue-grey--text">
            <a class="link" href="http://cloudeka.id/products">
            Products
            </a>
          </v-toolbar-title>
        </v-flex>
        <v-toolbar-title class="mt-8 ml-5 font-weight-bold blue-grey--text">
          <a class="link" href="http://cloudeka.id/solutions">
          Solutions
          </a>
          <v-icon>mdi-chevron-down</v-icon>
        </v-toolbar-title>
        <v-toolbar-title class="mt-8 ml-5 font-weight-bold blue-grey--text">
          <a class="link" href="http://cloudeka.id/calculator">
            Price Calculators
          </a>
          </v-toolbar-title>
        <v-toolbar-title class="mt-8 ml-5 font-weight-bold blue-grey--text">
          <a class="link" href="https://docs.cloudeka.id">
          Documentations
          </a>
        </v-toolbar-title>
        <v-toolbar-title class="mt-8 ml-5 font-weight-bold blue-grey--text">
          <a class="link" href="http://cloudeka.id/faq">
          FAQ
          </a>
        </v-toolbar-title>
        <v-toolbar-title class="mt-8 ml-5 font-weight-bold blue-grey--text">
          <a class="link" href="http://cloudeka.id/contact-us">
          Contact Us
          </a>
        </v-toolbar-title>
      </v-toolbar-items>

      <v-spacer></v-spacer>

      <!-- <div class="float-right">
        <v-toolbar-items>
        <v-icon class="mt-7 ml-5 font-weight-bold blue-grey--text">mdi-account-circle-outline</v-icon>
        <v-toolbar-title class="mt-8 ml-2 font-weight-bold blue-grey--text">Sign In /</v-toolbar-title>
        <v-toolbar-title class="mt-8 ml-5 font-weight-bold blue-grey--text">Register</v-toolbar-title>
        <v-icon class="mt-7 ml-5 font-weight-bold blue-grey--text">mdi-magnify</v-icon>
      </v-toolbar-items>
      </div> -->

      <div class="pt-2" v-show="$vuetify.breakpoint.mdAndUp" id="menuPages">
          
      </div>
      
      <component v-for="item in components" :key="item" :is="item"></component>  
    </v-toolbar>
    <!-- <v-card
     flat
     tile
    >

    <v-row>
      <v-col md="2">
        <div class="pl-5 pt-5">
          <ul class="white--text items">
            <li class="mb-2 text-h6"><a href="/why-us" >Infrastructure</a></li>
            <li class="mb-2 text-h6"><a href="/why-us" class="">Platform</a></li>
            <li class="mb-2 text-h6"><a href="/career" class="">Software</a></li>
            <li class="mb-5 text-h6"><a href="/contact-us" class="">Security</a></li>
            <li>
              <v-btn
                outlined
                rounded
                text
              >
                See All
              </v-btn>
            </li>
          </ul>
        </div>
      </v-col>
      <v-col md="9">
        <v-label class="text-h6">Infrastructure</v-label>
        <div class="flex-items pa-5">
            <div>
                <ul class="white--text items">
                    <h3 class="">PRICING</h3>
                    <li><a href="#" class="">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</a></li>
                </ul>
            </div>
            <div>
                <ul class="white--text items">
                    <h3 class="">PRICING</h3>
                    <li><a href="#" class="">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</a></li>
                </ul>
            </div>
            <div>
                <ul class="white--text items">
                    <h3 class="">PRICING</h3>
                    <li><a href="#" class="">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</a></li>
                </ul>
            </div>
            <div>
                <ul class="white--text items">
                    <h3 class="">PRICING</h3>
                    <li><a href="#" class="">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</a></li>
                </ul>
            </div>
            <div>
                <ul class="white--text items">
                    <h3 class="">DOCUMENTATIONS</h3>

                    <li><a href="#" class="">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</a></li>
                    
                </ul>
            </div>
        </div>
      </v-col>
    </v-row>
    </v-card> -->
  </div>
</template>

<script>
import {computed, reactive, ref, onMounted} from '@vue/composition-api'
import api from "@/lib/api";
import externalSubDomain from '@/lib/externalSubDomain'


export default {
  setup(props) {
    const count = ref(0)
    const host = window.location.host;
    const parts = host.split('.');
    const subDomain = parts[0];
    const subDomainCloudeka = externalSubDomain.subDomainCloudekaArray;
    const imgLogo = ref('');

    const isShowComponentCloudeka = ref(true);
    onMounted(() => {
      if (subDomainCloudeka.includes(subDomain)) {
        isShowComponentCloudeka.value = true;
        // imgLogo.value = 'logo1.svg'
        imgLogo.value = require('../assets/logo1.svg')
      } else {
        isShowComponentCloudeka.value = false;
        getNameImage(subDomain)
        // imgLogo.value = 'logo-bank-sumut.png'
      }
    });

    async function getNameImage(subDomain) {

      var elementsIcon = document.getElementsByClassName("favicon")
      try {
        const res = await api.GET(
          "/label/get-image/" + subDomain
        );
        imgLogo.value = res.data.logo_name
        document.title = res.data.title;
        // document.getElementById("favicon").href=res.data.logo_name; 
        const favicon = '/weblabel/' + res.data.favicon;
        for (let i = 0; i < elementsIcon.length; i++) {
          if (elementsIcon.setAttribute !== 'function') {
            elementsIcon[i].href = favicon
          } else {
            elementsIcon[i].setAttribute('href', favicon)
          }
          
        }
      } catch (err) {
        imgLogo.value = require('../assets/logo1.svg')
      }
    }

    
    const items = reactive([
     'button-counter'
    ])

    function backtohome() {
      this.$router.push({name:'main'})
    }

    const pagesMenuSorted = computed(()=>{
      
      return props.pagesMenu ?  props.pagesMenu.slice().sort((a,b)=>{
        return a.sort - b.sort
      }) : []
    })

    return {
      isShowComponentCloudeka,
      imgLogo,
      count,
      pagesMenuSorted,
      items,
      backtohome
    }
  },
  methods: {
    getImgUrl(pic) {
      return require('../assets/'+ pic)
    },
  },
  props:['pagesMenu',"components"]
}
</script>

<style lang="scss" scoped>

a {
  text-decoration: none;
  color: #556272 !important;
  font-weight: 600;
  font-family: Mont;
  &:hover {
    color: blue;
  }
}

a.link {
  &:hover {
    color: #2595D3 !important;
  }
}


.flex-items {
    display: flex;
    justify-content: space-between;

    .items {
        list-style-type: none;
    }
}

</style>