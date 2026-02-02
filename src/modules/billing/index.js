import beforeenterpermission from "../../lib/beforeenterpermission";
import billing from "./billing.vue";
import invoice from "./invoice.vue";
import invoice2 from "./invoice2.vue";
import summaryMonthly from "./summaryMonthly.vue";
import billingpersonal from "./billingpersonal.vue";
import payment from "./payment.vue";
import typedetail from "./typedetail.vue";
import history from "./history.vue";
import transactionhistory from "./transactionhistory.vue";
import summary from "./summary.vue";
import summaryCorporate from "./summaryCorporate.vue";
import billingCorporateDetail from "./billingCorporateDetail.vue";
import billingCorporateDetailBillingType from "./billingCorporateDetailBillingType.vue";
import billingCorporateDetailHistory from "./billingCorporateDetailHistory.vue";
import page from "./page.vue";
import { BILLING } from "./namespace";
import store from "./store";
import localstorage from "@/lib/localstorage";
import beforeselectfirst from "../../lib/beforeselectfirst";

const type = localstorage.getItem("type");
const currentOrg = JSON.parse(localStorage.getItem('currentOrg'))
const is_personal = currentOrg && currentOrg.is_personal ? true : false

export default {
  install(Vue, { VueEvent }) {
    Vue;
    Vue.addModules({ [BILLING]: store });
    Vue.addRoutetoDashboard({
      path: "billing",
      component: page,
      beforeEnter: (to, from, next) => {
        beforeenterpermission(Vue, next, 'Billing', 'disable', false)().then(()=>{
          return beforeselectfirst(Vue)()
        }).then(()=>{
          next()
        }).catch(()=>{
          if(from.path == '/'){
            next('/')
          }
        })
      },
      meta: {
        breadcrumb: {
          text: "Billing",
          to: "/billing",
        },
      },
      children: [
        {path: "", component: summaryCorporate},

        {
          path: "daily-cost-estimated",
          component: page,
          meta: {
            breadcrumb: {
              text: 'Daily Cost Estimated',
              to: '/billing/daily-cost-estimated',
            }
          },
          children: [{ path: '', component: summaryCorporate }],
        },

        {
          path: "monthly-cost",
          component: page,
          meta: {
            breadcrumb: {
              text: 'Monthly Cost',
              to: '/billing/monthly-cost',
            }
          },
          children: [
            { path: '', component: summaryCorporate },
            {
              path: ":id/history/:date",
              component: billingCorporateDetailHistory,
              meta: {
                breadcrumb: {
                  to: "/billing/monthly-cost/:id/history/:date",
                  text: "Detail Billing",
                },
              },
            },
            {
              path: ":id/:billing_type",
              component: billingCorporateDetailBillingType,
              meta: {
                breadcrumb: {
                  to: "/billing/monthly-cost/:id/:billing_type",
                  text: ":billing_type",
                },
              },
            },
          ],
        },

        {
          path: "invoice",
          component: page,
          meta: {
            breadcrumb: {
              text: 'Invoice',
              to: '/billing/invoice',
            }
          },
          children: [
            { path: '', component: summaryCorporate },
            // {
            //   path: ':id',
            //   component: invoice,
            //   meta: {
            //     breadcrumb: {
            //       text: 'Invoice Detail',
            //       to: '/billing/invoice/:id'
            //     },
            //   },
            // },
            {
              path: 'prepaid/:id',
              component: invoice,
              meta: {
                breadcrumb: {
                  text: 'Invoice Detail',
                  to: '/billing/invoice/prepaid/:id'
                },
              },
            },
            {
              path: 'postpaid/:id',
              component: invoice2,
              meta: {
                breadcrumb: {
                  text: 'Invoice Detail',
                  to: '/billing/invoice/postpaid/:id'
                },
              },
            },
          ],
        },
        
        {
          path: "summary-monthly",
          component: page,
          meta: {
            breadcrumb: {
              text: 'Summary Monthly',
              to: '/billing/summary-monthly',
            }
          },
          children:[
            { path: '', component: summaryCorporate },
            {
              path: ':id',
              component: summaryMonthly,
              meta: {
                breadcrumb: {
                  text: 'Summary Monthly Detail',
                  to: '/billing/summary-monthly/:id'
                },
              },
            },
          ]
        },
        
        {
          path: "/billing/personal/:projectname",
          component: billingpersonal,
          meta: {
            breadcumb: {
              to: "/billing/personal/:projectname",
              text: "Billing Personal",
            },
          },
        },
        
        {
          path: "type",
          component: page,
          meta: {
            breadcumb: {
              to: "/billing/type",
              text: "Billing Type",
            },
          },
          children: [
            {
              path: ":id",
              component: typedetail,
            },
          ],
        },
        {
          path: ":id",
          component: is_personal ? billing : billingCorporateDetail,
          meta: {
            breadcrumb: {
              to: "/billing/:id",
              text: "Detail",
            },
          },
        },
        
      ],
    }),
    Vue.addRoutetoDashboard({
      path: "balance",
      component: page,
      beforeEnter: (to, from, next) => {
        beforeenterpermission(Vue, next, 'Balance', 'disable', false)().then(()=>{
          return beforeselectfirst(Vue)()
        }).then(()=>{
          next()
        }).catch(()=>{
          if(from.path == '/'){
            next('/')
          }
        })
      },
      meta: {
        breadcrumb: {
          to: "/balance",
          text: "Balance",
        },
      },
      children: [
        {
          path: "payment",
          component: page,
          children: [
            {
              path: "/balance",
              component: payment,
            },
            {
              path: "/balance/history",
              component: history,
            },
            {
              path: "/balance/transaction-history",
              component: transactionhistory,
            },
          ],
        },
      ],
    }),
      VueEvent.listen("after-store-created", (store) => {
        store.commit("ROLEPERMISSION/addmenumodulepermission", {
          header: "BILLING",
          headerno: 10,
          name: "Billing",
          link: "billing",
          icon: "billingIcon",
          sort: 10,
          permission: ["billing-sidemenu"],
        });

        store.commit("ROLEPERMISSION/addmenumodulepermission", {
          header: "BILLING",
          headerno: 10,
          name: "Balance",
          link: "balance",
          icon: "billingPaymentIcon",
          sort: 10,
          permission: ["billing-sidemenu"],
        });
      })
  },
};
