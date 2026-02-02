<template>
    <v-app-bar app color="white" :clipped-left="$vuetify.breakpoint.lgAndUp">
        <v-app-bar-nav-icon>
          <v-icon>mdi-menu</v-icon>
      </v-app-bar-nav-icon>

      <v-toolbar-title
        style="width: 195px"
        class="ml-0 pl-4"
      >
        <v-img width="150px" src="@/assets/logo1.svg" />
      </v-toolbar-title>

       <v-toolbar-items>
        <v-btn text class="primary">
          Select Project
          <v-icon right>mdi-chevron-down</v-icon>
        </v-btn>
       </v-toolbar-items>
       
      <v-spacer />
      <v-toolbar-items>
      <v-btn text>
          <v-icon left>$vuetify.icons.docsIcon</v-icon>
          Docs
          <v-icon right>mdi-chevron-down</v-icon>
      </v-btn>

       <v-btn text>
          <v-icon left>$vuetify.icons.ticketIcon</v-icon>
          Ticket
           <v-icon right>mdi-chevron-down</v-icon>
      </v-btn>  

       <v-btn text>
          <v-icon left>$vuetify.icons.organizationIcon</v-icon>
          Oragnization
           <v-icon right>mdi-chevron-down</v-icon>
      </v-btn>

      <v-btn text>
        <div style="text-align : right; margin-right:10px;">
            John Doe<br/> 
            <span style="font-size: 11px;line-height: 15px;">john@doe.com</span>
        </div>
       <v-icon>mdi-chevron-down</v-icon>
      </v-btn>
       </v-toolbar-items>     
    </v-app-bar>
</template>

<script>

export default {
    data : () => (
        {
            drawer : null
        }
    )
}
</script>