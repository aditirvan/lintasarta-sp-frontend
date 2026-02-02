import { ref } from "@vue/composition-api";
import {
  required,
  email,
  minLength,
  helpers,
  requiredIf,
} from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useNamespacedActions } from "vuex-composition-helpers";
import { SIGNUP } from "./namespace";
import localstorage from "@/lib/localstorage";

const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get("userType");

export const useSignup = () => {
  // const Keys = ['fullname', 'email', 'password', 'phone', 'npwp', 'npwp_file', 'ktp_file', 'agree', 'type']

  const Keys = [
    "fullname",
    "email",
    "password",
    "phone",
    // "npwp",
    // "npwp_file",
    // "ktp_file",
    "agree",
    // "selected_region",
    // "sales_id",
    "type",
  ];

  const Reference = Keys.map((x) => ref(""));
  const Validator = Keys.map((x) => ({ required }));

  const Validation = {};
  const Composable = {};
  Keys.forEach((key, index) => {
    Composable[key] = Reference[index];
  });

  Validator[1]["email"] = email;
  Validator[2] = {
    required,
    minLength: minLength(8),
    uppercase: {
      $message: "Must contains at least one uppercase character",
      $validator: (val) => {
        return /^(?=.*[A-Z])/g.test(val);
      },
    },
    lowercase: {
      $message: "Must contains at least one lowercase character",
      $validator: (val) => {
        return /^(?=.*[a-z])/g.test(val);
      },
    },
    numeric: {
      $message: "Must contains at least one numeric character",
      $validator: (val) => {
        return /^(?=.*[0-9])/g.test(val);
      },
    },
    symbol: {
      $message: "Must contains at least one symbol (!@#$%^&*)",
      $validator: (val) => {
        return /^(?=.*[!@#$%^&*])/g.test(val);
      },
    },
  };
  Validator[3] = { required };
  // Validator[4] = { required: false };

  // Validator[4] = {
  //   required: requiredIf((val) => {
  //     return Composable.type.value === "C";
  //   }),
  //   conditional: {
  //     $message: "NPWP is not valid",
  //     $validator: (val) => {
  //       // console.log("conditional", val);
  //       if (Composable.type.value === "C") {
  //         return /^[\d]{2}[.]([\d]{3})[.]([\d]{3})[.][\d][-]([\d]{3})[.]([\d]{3})$/g.test(
  //           val
  //         );
  //       } else {
  //         return true;
  //       }
  //     },
  //   },
  // };

  // Validator[5] = {required}
  // Validator[6] = {required}

  // Validator[7] = {
  //   required: helpers.withMessage("Must be filled", required),
  // };

  const $v = useVuelidate(Validator, Reference);
  // const selectedcountrycode = ref('+62')

  Keys.forEach((key, index) => {
    Composable[key] = Reference[index];
    Validation[key + "Validation"] = $v.value[index];
  });

  const { signup: Signup } = useNamespacedActions(SIGNUP, ["signup"]);
  return {
    $v,
    ...Composable,
    show1: ref(false),
    loading: ref(false),
    // selectedcountrycode,
    ...Validation,
    signup: async function () {
      $v.value.$touch();
      if ($v.value.$errors.length) return;

      const Value = {};

      Keys.forEach((key) => {
        Value[key] = Composable[key].value;
      });
      Value["phone"] = "+62" + Value["phone"].replaceAll(" ", "");
      // Value["phone"] = selectedcountrycode.value + Value["phone"].replaceAll(" ", "");
      // Value['prefix_personal_phone_number'] = selectedcountrycode.value
      // Value["type"] = myParam ? "P" : "C";

      if (!Value["type"]) {
        Value["type"] = "C";
      }

      if (myParam) {
        Value["type"] = "P";
      }

      // console.log(Value["type"]);

      // if (Value["type"] === "C" && !Value["npwp"]) {
      //   if (!Value["npwp"]) {
      //     // if corporate & there is no npwp
      //     Validation["npwpValidation"] = {
      //       $errors: [
      //         {
      //           $message: "NPWP is not valid",
      //         },
      //       ],
      //     };
      //   }
      // }

      // if (Value["type"] === "P" && !Value["npwp"]) {
      //   Value["npwp"] = "";
      // }
      
      return Signup(Value);
    },
  };
};
