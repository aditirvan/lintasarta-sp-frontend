// import moment from 'moment';
// import XLSX from 'xlsx';
// import {
//   useNamespacedActions,
// } from 'vuex-composition-helpers';
// import { required } from '@vuelidate/validators'
// import { AUDITLOG } from '@/modules/auditlog/namespace';
// import {reactive, ref, onMounted} from '@vue/composition-api'
// import localstorage from "@/lib/localstorage";
// import useVuelidate from '@vuelidate/core'

export const useNotif = () => {

  const converActionName = (name: string) => {
    let string = name.split(" ");
    let title=string[0];
    
    return title;

  }

  const converColorServiceName = (name: string) => {
    let string = name.split(" ");
    let title=string[0];

    let color='';
    if(title=='ERROR'){
      color="color:#db1313;";
    }else{
      color="color:#1f60a8;";
    }
    return color;

  }

  const converServiceName = (name: string) => {
    let nametrim = name.replaceAll(' ', '').toLowerCase();
    switch (nametrim) {
      case 'login':
        return 'mdi-login';
      case 'addmembertoorg':
      case 'deleteorgmember':
        return 'mdi-account-multiple';
      case 'vpc':
        return '$vuetify.icons.networkIconError';
      case 'manageorganization':
        return '$vuetify.icons.organizationIcon';
      case 'instance':
        return '$vuetify.icons.instance';
      case 'manageproject':
        return '$vuetify.icons.projectIcon';
      case 'images':
        return '$vuetify.icons.imagess';
      case 'storage':
        return '$vuetify.icons.storagess';
      case 'managerole':
        return `$vuetify.icons.manageroleIcon`;
      case 'auditlog':
      case 'billing':
        return `$vuetify.icons.billingsIcon`;
      case 'download':
        return `$vuetify.icons.billingsIcon`;
      case 'objectstorage':
        return `$vuetify.icons.objectstoragesIcons`;
      case 'security':
        return `$vuetify.icons.securitysIcon`;
      case 'alerting':
        return `$vuetify.icons.alertingsIcons`;
      case 'network':
        return `$vuetify.icons.networkIcon`;
      case 'managetiket':
        return `$vuetify.icons.ticketIcon`
      case 'manageinstance':
        return `$vuetify.icons.instance`
      default:
        return `$vuetify.icons.notFoundIcon`;
    }
  };


  const converServiceNameErorr = (name: string) => {
    let nametrim = name.replaceAll(' ', '').toLowerCase();
    switch (nametrim) {
      case 'login':
        return 'mdi-login';
      case 'addmembertoorg':
      case 'deleteorgmember':
        return 'mdi-account-multiple';
      case 'vpc':
        return '$vuetify.icons.networkIconError';
      case 'manageorganization':
        return '$vuetify.icons.organizationIconError';
      case 'instance':
        return '$vuetify.icons.instanceError';
      case 'manageproject':
        return '$vuetify.icons.projectIconError';
      case 'images':
        return '$vuetify.icons.imagessError';
      case 'storage':
        return '$vuetify.icons.storagessError';
      case 'managerole':
        return `$vuetify.icons.manageroleIconError`;
      case 'managemember':
          return `$vuetify.icons.managememberIconError`;
      case 'auditlog':
      case 'billing':
        return `$vuetify.icons.billingsIconError`;
      case 'download':
        return `$vuetify.icons.billingsIconError`;
      case 'objectstorage':
        return `$vuetify.icons.objectstoragesIconsError`;
      case 'security':
        return `$vuetify.icons.securitysIconError`;
      case 'alerting':
        return `$vuetify.icons.alertingsIconsError`;
      case 'network':
        return `$vuetify.icons.networkIconError`;
      case 'managetiket':
        return `$vuetify.icons.ticketIconError`;
      case 'manageinstance':
        return `$vuetify.icons.instanceError`
      default:
        return `$vuetify.icons.notFoundIconError`;
    }
  };


  const converLinkName = (type: string,name: string) => {
    let serviceType=type.replaceAll(' ', '').toLowerCase();
    let methodName = name.replaceAll(' ', '').toLowerCase();
    let link="";
    if(serviceType=='manageorganization'){
      link="/setting-organization";
    }else if(serviceType=='instance' || serviceType=='manageinstance'){
      link="/instance";
    }else if(serviceType=='project' || serviceType=='manageproject'){
      link="/project";
    }else if(serviceType=='images' || serviceType=='manageimages'){
      link="/image/snapshot";
      if(methodName=='importcustomimage'){
        link="/image/customimage";
      }  
    }else if(serviceType=='storage' || serviceType=='managestorage'){
      link="/storage";
    }else if(serviceType=='managerole'){
      link="/role-permission";
    }else if(serviceType=='objectstorage' || serviceType=='manageobjectstorage'){
      link="/object-storage";
    }else if(serviceType=='security' || serviceType=='managesecurity'){
      link="/security";
    }else if(serviceType=='network' || serviceType=='managenetwork'){
      link="/network/vpc";
      if(methodName=='/network/floatingip'){
        link='/network/floatingip';
      }
    }else{
      link="";
    }

    return link;

  };

  return {
    converServiceNameErorr,
    converColorServiceName,
    converActionName,
    converServiceName,
    converLinkName,

  }
}