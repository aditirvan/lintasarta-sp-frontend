export enum VoucherCreditType {
  ONE_TIME = 'one-time',
  RECURRING = 'recurring'
}

export enum VoucherCreditDetailStatus {
  CREATED = 'created',
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
  REDEEM = 'redeem',
  REVOKED = 'revoked'
}

export enum VoucherDiscountType {
  INTERNAL = 'internal',
  RESELLER = 'reseller'
}

export enum VoucherDiscountDetailType {
  INSTANCE_BASED = 'instance-based',
  INSTANCE_FLAVOR = 'instance-flavor'
}

export type Sales = {
  id: string
  fullname: string
}

export type InstanceFlavor = {
  id: string
  flavor_name: string
}