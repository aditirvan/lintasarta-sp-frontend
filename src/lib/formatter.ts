export const IDRformat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const Rpformat = new Intl.NumberFormat('locale', {});
export const Indoformat = new Intl.NumberFormat('id-ID', {});
export const Fformat = new Intl.NumberFormat('en-US', {});

export const addGBText = (ev: any, value: any) => {
  let code = ev.code;
  if (!code.includes("Digit") && !code.includes("Backspace")) {
    ev.preventDefault();
    return;
  }

  let val = value
    ? value.replaceAll(",", "").replace(" GB", "") + ev.key
    : ev.key;
  if (code.includes("Digit")) {
    value = val + " GB";
    ev.preventDefault();
  }
  return value;
};

export const removeGBText = (value: any) =>
  parseInt(value.replaceAll(" ", "").replaceAll("G", "").replaceAll("B", ""));

// Thousand Separator
export const toThousands = (x: any) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const toThousandsWithDotFormat = (x: any) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const toPlain = (str: string) => {
  let res = parseInt(str.split(",").join(""));
  return isNaN(res) ? 0 : res;
};

export const toIDRWithDotFormat = (number?: number) => {
  if (!number) {
    number = 0
  }
  
  return `IDR ${number.toLocaleString("id-ID")}`;
};

const STATUS_INACTIVE = 0;
const STATUS_ACTIVE = 1;
const STATUS_PENDING = 2;
const STATUS_SUSPENDED = 3;
const STATUS_TERMINATED = 4;
const STATUS_DELETED = 5;

export const projectStatus = (status: number) => {

  switch(status) {
    case STATUS_INACTIVE: return "Inactive";
    case STATUS_ACTIVE: return "Active";
    case STATUS_PENDING: return "Pending";
    case STATUS_SUSPENDED: return "Suspended";
    case STATUS_TERMINATED: return "Terminated";
    case STATUS_DELETED: return "Deleted";
    default: return "Inactive";
  }

}

export const organizationStatus = (status: number) => {
  switch(status) {
    case STATUS_INACTIVE: return "Inactive";
    case STATUS_ACTIVE: return "Active";
    case STATUS_PENDING: return "Pending";
    case STATUS_SUSPENDED: return "Suspended";
    case STATUS_TERMINATED: return "Terminated";
    case STATUS_DELETED: return "Deleted";
    default: return "Inactive";
  }
}