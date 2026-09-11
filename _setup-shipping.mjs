const BASE = "http://localhost:9000"
const LOCATION_ID = "sloc_01KHSBB9Z709VS4RH5CTVC82BC"

async function main() {
  // Auth
  const auth = await (await fetch(`${BASE}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "goldenexotics@admin.com", password: "admin123" }),
  })).json()
  const h = { Authorization: `Bearer ${auth.token}`, "Content-Type": "application/json" }
  console.log("Auth OK")

  // 1. Create fulfillment set on the stock location
  console.log("\n1. Creating fulfillment set...")
  const fsRes = await fetch(`${BASE}/admin/stock-locations/${LOCATION_ID}/fulfillment-sets`, {
    method: "POST",
    headers: h,
    body: JSON.stringify({
      name: "Miami Rental Delivery",
      type: "shipping",
    }),
  })
  const fsData = await fsRes.json()
  if (!fsRes.ok) {
    console.log("  Error:", JSON.stringify(fsData))
    return
  }
  // Find the fulfillment set we just created
  const fulfillmentSet = fsData.stock_location?.fulfillment_sets?.find(
    fs => fs.name === "Miami Rental Delivery"
  )
  if (!fulfillmentSet) {
    console.log("  Could not find created fulfillment set. Response:", JSON.stringify(fsData, null, 2))
    return
  }
  console.log("  Fulfillment set:", fulfillmentSet.id)

  // 2. Create service zone with US geo zone
  console.log("\n2. Creating service zone...")
  const szRes = await fetch(`${BASE}/admin/fulfillment-sets/${fulfillmentSet.id}/service-zones`, {
    method: "POST",
    headers: h,
    body: JSON.stringify({
      name: "United States",
      geo_zones: [{ country_code: "us", type: "country" }],
    }),
  })
  const szData = await szRes.json()
  if (!szRes.ok) {
    console.log("  Error:", JSON.stringify(szData))
    return
  }
  const serviceZone = szData.fulfillment_set?.service_zones?.find(
    sz => sz.name === "United States"
  )
  console.log("  Service zone:", serviceZone?.id)

  // 3. Create shipping option (free, using manual provider)
  console.log("\n3. Creating shipping option...")
  const soRes = await fetch(`${BASE}/admin/shipping-options`, {
    method: "POST",
    headers: h,
    body: JSON.stringify({
      name: "Car Rental Pickup",
      service_zone_id: serviceZone.id,
      shipping_profile_id: "sp_01KHH1V75YR3G9132KMJF81A96",
      provider_id: "manual_manual",
      price_type: "flat",
      type: { label: "Pickup", description: "Vehicle pickup at location", code: "pickup" },
      prices: [
        { currency_code: "usd", amount: 0 },
      ],
      rules: [],
    }),
  })
  const soData = await soRes.json()
  if (!soRes.ok) {
    console.log("  Error:", JSON.stringify(soData, null, 2))
    return
  }
  console.log("  Shipping option:", soData.shipping_option?.id, "-", soData.shipping_option?.name)

  // 4. Verify from store API
  console.log("\n4. Verifying from Store API...")
  const PK = "pk_8c58f695b1941c05f56624d8b80aecad123b8c8e1bf893a0393547901038d572"
  // Create a temp cart to test
  const cartRes = await fetch(`${BASE}/store/carts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-publishable-api-key": PK },
    body: JSON.stringify({ region_id: "reg_01KHSASJ1Y5FR9Q3DD3Q3QXD79" }),
  })
  const cartData = await cartRes.json()
  const cartId = cartData.cart?.id
  if (cartId) {
    const smRes = await fetch(`${BASE}/store/shipping-options?cart_id=${cartId}`, {
      headers: { "x-publishable-api-key": PK },
    })
    const smData = await smRes.json()
    console.log("  Available shipping options for cart:", smData.shipping_options?.length || 0)
    for (const so of smData.shipping_options || []) {
      console.log(`    ${so.id} - ${so.name} ($${(so.amount || 0) / 100})`)
    }
  }

  console.log("\n=== Done ===")
}

main().catch(console.error)
