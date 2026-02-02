import api from "../../lib/api";
import externalSubDomain from "../../lib/externalSubDomain"

// const toBase64 = (file) =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });

export default {
  namespaced: true,
  actions: {
    signup: async (context, payload) => {
      //   let formData = new FormData();
      
      // formData.append('type', payload.type)
      // formData.append('fullname', payload.fullname)
      // formData.append('email', payload.email)
      // formData.append('password', payload.password)
      // formData.append('phone_number', payload.phone)
      // formData.append('npwp', payload.npwp)
      // formData.append('ktp_file', payload.ktp_file.files[0])
      // formData.append('region', payload.selected_region.name)
      // if (payload.npwp_file.files[0]) {
      //     formData.append('npwp_file', payload.npwp_file.files[0])
      // }

      // const result = await api.POSTFORMDATA('user/register', formData)

      const {
        type,
        fullname,
        email,
        password,
        phone,
        // prefix_personal_phone_number,
        // npwp,
        // ktp_file,
        // npwp_file,
        // selected_region,
      } = payload;

      const externalSubdomain = externalSubDomain.getSubDomain();
      const host = window.location.host;
      const json = {
        type,
        fullname,
        email,
        password,
        phone_number: phone,
        // prefix_personal_phone_number,
        // npwp,
        // region: selected_region.name,
        // ktp_file: getBase64(ktp_file.files[0]),
        // npwp_file: getBase64(npwp_file.files[0]),
        // ktp_file: await toBase64(ktp_file.files[0]),
        // npwp_file: npwp_file.files[0]
        //   ? await toBase64(npwp_file.files[0])
        //   : undefined,
        external_subdomain: externalSubdomain,
        host,
      };
      
      const result = await api.POST("user/register", json);

      return result;
    },
  },
};
