export const dynamic = "force-dynamic"

import { getPricingFeatures } from "../action/price/pricingOps"
import { Pricing, Feature } from "@prisma/client"

function mapPricingToClient(plan: PricingRawData): PricingUiData {
  return {
    id: plan.id,
    name: plan.name,
    description: plan.description,
    price: plan.price,
    period: plan.period,
    popular: plan.popular,
    savings: plan.savings ?? undefined,
    currency: plan.currency,
    validity: plan.validity,
    emailUsageLimit: plan.emailUsageLimit,
    subscription: plan.subscription as "MONTHLY" | "QUARTERLY" | "HALF_YEARLY" | "YEARLY",
    features: plan.features.map((f) => f.text),
  };
}

  interface PricingRawData extends Pricing{
    features:Feature[]
  }

 export interface PricingUiData{
  id: string
  name: string
  description: string
  price: number // Amount in paise
  period: string
  popular: boolean
  savings?: string
  currency: string
  validity: number // Duration in days
  emailUsageLimit: number
  subscription: "MONTHLY" | "QUARTERLY" | "HALF_YEARLY" | "YEARLY"
  features: string[] // Array of feature strings
  }

import PaymentDisplay from "@/components/payment/CardsPage";

export default async function MainPaymentPage(){

  const data = await getPricingFeatures()

  const pricingRawData:PricingRawData[]|undefined = data.pricing;

  const PricingUiData = (pricingRawData ?? []).map(mapPricingToClient)


  return <main className="w-full h-screen">
    <PaymentDisplay pricingPlans={PricingUiData}></PaymentDisplay>
  </main>
} 