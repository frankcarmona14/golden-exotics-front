import { formatAmountForDisplay } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

export function PriceDetails({
  days,
  currency,
  subtotal,
  taxes,
  deposit,
}: {
  days: number
  currency: string
  subtotal: number
  taxes: number
  deposit?: number | null
}) {
  const hasDeposit = deposit != null && deposit > 0

  return (
    <>
      <h2 className="text-xl font-semibold">Your total</h2>
      <div className="pt-5">
        <div className="grid grid-cols-1 gap-3 tabular-nums">
          <div className="flex flex-row items-center justify-between text-[15px]">
            <span>
              {days} {days === 1 ? "day" : "days"}
            </span>
            <span>{formatAmountForDisplay(subtotal, currency)}</span>
          </div>
          {taxes > 0 && (
            <div className="flex flex-row items-center justify-between text-[15px]">
              <span>Taxes</span>
              <span>{formatAmountForDisplay(taxes, currency)}</span>
            </div>
          )}
          <Separator className="my-3" />
          <div className="flex flex-row items-center justify-between text-[15px]">
            <span>Rental total ({currency.toUpperCase()})</span>
            <span>
              {formatAmountForDisplay(subtotal + taxes, currency)}
            </span>
          </div>
          {hasDeposit && (
            <>
              <Separator className="my-3" />
              <div className="flex flex-row items-center justify-between">
                <strong>Deposit due now</strong>
                <strong>
                  {formatAmountForDisplay(deposit, currency)}
                </strong>
              </div>
              <p className="text-[13px] text-neutral-500 dark:text-neutral-400">
                The remaining balance will be charged at vehicle pickup.
              </p>
            </>
          )}
          {!hasDeposit && (
            <div className="flex flex-row items-center justify-between">
              <strong>Total ({currency.toUpperCase()})</strong>
              <strong>
                {formatAmountForDisplay(subtotal + taxes, currency)}
              </strong>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
