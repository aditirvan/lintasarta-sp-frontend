<template>
  <v-card
    flat
    tile
    class="blue-grey darken-2 white--text mt-5"
  >

    <div class="flex-items pa-5 pt-10">
      <div>
        <h3 class="white--text pb-3">HEADQUARTERS</h3>
        <p class="white--text">
          Central Jakarta<br>
          Menara Thamrin 12th Floor<br>
          Jl. M.H. Thamrin Kav.3 Jakarta 10250<br>
          T: 14052<br>
          F: +6221 230 3567<br>
          <i class="icon-email"></i> info@cloudeka.id <br>
          W: www.lintasarta.net
        </p>
      </div>
      <div>
        <ul class="white--text items">
          <h3 class="white--text pb-3">WHY US</h3>

          <li><a href="http://cloudeka.id/why-us" class="white--text">Who We Are</a></li>
          <!-- <li><a href="/why-us" class="white--text">Why Lintasarta</a></li>
          <li><a href="/career" class="white--text">Career</a></li> -->
          <li><a href="http://cloudeka.id/contact-us" class="white--text">Contact Us</a></li>
        </ul>
      </div>
      <div>
        <ul class="white--text items">
          <h3 class="white--text pb-3">PRODUCTS</h3>

          <li><a href="http://cloudeka.id/products/deka-prime-px1" class="white--text">Deka Prime (PX1)</a>
          </li>
          <li><a href="http://cloudeka.id/products/deka-flexi-fx2" class="white--text">Deka Flexi (FX2)</a>
          </li>
          <li><a href="http://cloudeka.id/products/deka-vault" class="white--text">Deka Vault</a></li>
          <li><a href="#" class="white--text">Cloud Priority</a></li>
          <li><a href="#" class="white--text">Cloud Bucket</a></li>
          <li><a href="http://cloudeka.id/products/deka-harbor" class="white--text">Deka Harbor</a></li>
          <li><a href="http://cloudeka.id/products/deka-sense" class="white--text">Deka Sense</a></li>
          <li><a href="http://cloudeka.id/products/intelligent-video-analytics" class="white--text">Intelligent
            Video Analytics</a></li>
          <li><a href="http://cloudeka.id/products/next-generation-firewall" class="white--text">Next Gen
            Firewall</a></li>
          <li><a href="http://cloudeka.id/products/load-balancer" class="white--text">Load Balancer</a></li>
          <li><a href="http://cloudeka.id/products/web-application-firewall" class="white--text">Web
            Application Firewall</a></li>
        </ul>
      </div>
      <div>
        <ul class="white--text items">
          <h3 class="white--text pb-3">SOLUTIONS</h3>

          <li><a href="http://cloudeka.id/solutions/banking" class="white--text">Banking</a></li>
          <li><a href="http://cloudeka.id/solutions/finance-non-bank" class="white--text">Finance
            Non-banking</a></li>
          <li><a href="http://cloudeka.id/solutions/government" class="white--text">Government</a></li>
          <li><a href="http://cloudeka.id/solutions/resources" class="white--text">Resources</a></li>
          <li><a href="http://cloudeka.id/solutions/agriculture" class="white--text">Plantation</a></li>
          <li><a href="http://cloudeka.id/solutions/manufacture" class="white--text">Manufacture</a></li>
          <li><a href="http://cloudeka.id/solutions/higher-education" class="white--text">Higher Education</a>
          </li>
          <li><a href="http://cloudeka.id/solutions/hospital" class="white--text">Hospital</a></li>
          <li><a href="http://cloudeka.id/solutions/telecommunication" class="white--text">Telco</a></li>
          <li><a href="http://cloudeka.id/solutions/digital-company" class="white--text">Digital Company</a>
          </li>
        </ul>
      </div>
      <div>
        <ul class="white--text items">
          <h3 class="white--text pb-3">PRICING</h3>
          <li><a href="http://cloudeka.id/calculator" class="white--text">Lintasarta Cloudeka provides <br>
            flexible purchasing options.<br> Select your products based on<br> your needs.</a></li>
        </ul>
      </div>
      <div>
        <ul class="white--text items">
          <h3 class="white--text pb-3">DOCUMENTATIONS</h3>

          <li><a href="https://docs.cloudeka.id/" class="white--text">Documentation</a></li>

        </ul>
      </div>
      <div>
        <ul class="white--text items">
          <h3 class="white--text pb-3">CONTACT</h3>

          <li><a href="https://www.lintasarta.net/blog/" class="white--text">Blog</a></li>
          <li><a href="https://cmd.cloudeka.id/" class="white--text">Portal</a></li>
          <li><a href="https://www.cloudeka.id/privacy-policy-english" class="white--text">Privacy Notice</a></li>
        </ul>
      </div>
    </div>

    <v-divider></v-divider>

    <v-card-text class="white black--text pt-3">
      @Lintasarta {{ year }}
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<style lang="scss" scoped>
.flex-items {
  display: flex;
  justify-content: space-between;

  .items {
    padding: 5px;
    list-style-type: none;

    li {
      margin-bottom: 3px;
      font-size: 13px;

      a {
        &:hover {
          color: #EEEEEE !important;
        }
      }
    }
  }
}

</style>