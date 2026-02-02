import Vue from 'vue';
import moment from 'moment';

declare module 'vue/types/vue' {
  // 3. Declare augmentation for Vue
  interface Vue {
    $IDRformat(locales?: string | string[], options?: Intl.NumberFormatOptions): Intl.NumberFormat
    $Rpformat(locales?: string | string[], options?: Intl.NumberFormatOptions): Intl.NumberFormat
    $Fformat(locales?: string | string[], options?: Intl.NumberFormatOptions): Intl.NumberFormat
    $FormatDate(date: Date): string
    $moment: moment
  }
}