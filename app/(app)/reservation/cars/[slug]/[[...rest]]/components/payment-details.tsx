import ElementsForm from "./elements-form"

export async function PaymentDetails({
  amount,
  currency,
}: {
  amount: number
  currency: string
}) {
  return (
    <>
      <h2 className="text-heading-sm">Pay with</h2>

      <div className="pt-5">
        <ElementsForm
          userEmail={undefined}
          amount={amount}
          currency={currency}
        />
      </div>
    </>
  )
}
