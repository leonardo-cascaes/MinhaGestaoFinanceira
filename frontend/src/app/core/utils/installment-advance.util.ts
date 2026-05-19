import {
  AdvancePaymentInfo,
  InstallmentInfo,
} from '@core/models/expense.model';

export function getAdvancePayments(
  inst: InstallmentInfo,
): AdvancePaymentInfo[] {
  if (inst.advancePayments?.length) {
    return inst.advancePayments;
  }
  if (inst.advancePayment) {
    return [inst.advancePayment];
  }
  return [];
}

export function totalInstallmentsAdvanced(inst: InstallmentInfo): number {
  return getAdvancePayments(inst).reduce(
    (sum, a) => sum + a.installmentsAdvanced,
    0,
  );
}

export function totalAdvanceDiscount(inst: InstallmentInfo): number {
  return getAdvancePayments(inst).reduce((sum, a) => sum + a.discount, 0);
}

export function effectiveInstallmentTotal(inst: InstallmentInfo): number {
  return inst.totalInstallments - totalInstallmentsAdvanced(inst);
}

export function currentInstallmentIndex(
  inst: InstallmentInfo,
  month: number,
  year: number,
): number {
  const target = year * 12 + month;
  const start = inst.startYear * 12 + inst.startMonth;
  return target - start + 1;
}

export function remainingAdvanceable(
  inst: InstallmentInfo,
  month: number,
  year: number,
): number {
  const currentIdx = currentInstallmentIndex(inst, month, year);
  const effective = effectiveInstallmentTotal(inst);
  return Math.max(0, effective - currentIdx);
}

export function canAdvanceInstallments(
  inst: InstallmentInfo,
  month: number,
  year: number,
): boolean {
  return remainingAdvanceable(inst, month, year) > 0;
}

export function advanceAmountForMonth(
  inst: InstallmentInfo,
  month: number,
  year: number,
): number {
  return getAdvancePayments(inst)
    .filter((a) => {
      const d = a.date instanceof Date ? a.date : new Date(a.date);
      return d.getMonth() + 1 === month && d.getFullYear() === year;
    })
    .reduce((sum, a) => sum + a.amountPaid, 0);
}
