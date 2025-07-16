export const dynamic = "force-dynamic"
import { getPricingFeatures } from "@/app/action/price/pricingOps"
import { Pricing, Feature } from "@prisma/client"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
interface PricingWithFeature extends Pricing{
  features:Feature[]
}

import { PricingPlan} from "@/components/admin/adminPage"

import AdminPage from "@/components/admin/adminPage"


function mapPricingToClient(plan: PricingWithFeature): PricingPlan {
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
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt
  };
}



export default async function HiddenAdminPage(){
    
    const allPricingData = await getPricingFeatures()
    const priceDataWithFeatureArray:PricingWithFeature[]|undefined = allPricingData.pricing
    const pricingPlanArrayData: PricingPlan[] = (priceDataWithFeatureArray ?? []).map(mapPricingToClient)
    const {userId} = await auth()
    if(!userId){
        redirect(
            "/signin"
        )
    }
    else if(userId != process.env.ADMIN_ID){
        redirect("/")
    }
    return <main className="w-full h-screen">
        <AdminPage initialData={pricingPlanArrayData}></AdminPage>
    </main>
}