"use client"

import { useState } from "react"
import { Check, Zap, Crown, Infinity } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

import { PricingUiData } from "@/app/payment/page"

// 🔁 Mapping subscription type to icon
const planIcons: Record<PricingUiData["subscription"], React.ElementType> = {
  MONTHLY: Zap,
  QUARTERLY: Check,
  HALF_YEARLY: Crown,
  YEARLY: Infinity,
}

export default function PaymentDisplay({
  pricingPlans,
}: {
  pricingPlans: PricingUiData[]
}) {
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>(
    pricingPlans[0]?.id
  )

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
  }

  const selectedPlanDetails = pricingPlans.find(
    (plan) => plan.id === selectedPlan
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your needs. Upgrade or downgrade at any
            time.
          </p>
        </div>

        {/* Pricing Cards */}
        <RadioGroup
          value={selectedPlan}
          onValueChange={handlePlanSelect}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {pricingPlans.map((plan) => {
            const Icon = planIcons[plan.subscription] || Zap
            const isSelected = selectedPlan === plan.id

            return (
              <div key={plan.id} className="relative">
                <RadioGroupItem
                  value={plan.id}
                  id={plan.id}
                  className="sr-only peer"
                />
                <Label htmlFor={plan.id} className="cursor-pointer block">
                  <Card
                    className={`relative h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                      isSelected
                        ? "ring-2 ring-blue-500 shadow-lg"
                        : "hover:shadow-md"
                    } ${plan.popular ? "border-blue-500" : ""}`}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 hover:bg-blue-600">
                        Most Popular
                      </Badge>
                    )}
                    {plan.savings && !plan.popular && (
                      <Badge
                        variant="secondary"
                        className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                      >
                        {plan.savings}
                      </Badge>
                    )}

                    <CardHeader className="text-center pb-4">
                      <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl font-bold">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {plan.description}
                      </CardDescription>

                      <div className="mt-4">
                        <div className="flex items-baseline justify-center gap-2">
                          <span className="text-3xl font-bold text-gray-900">
                            ₹{plan.price/100}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          per {plan.period}
                        </p>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <ul className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3"
                          >
                            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </Label>
              </div>
            )
          })}
        </RadioGroup>

        {/* Selected Plan Summary & CTA */}
        {selectedPlanDetails && (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  Ready to get started?
                </CardTitle>
                <CardDescription>
                  You&apos;ve selected the{" "}
                  <strong>{selectedPlanDetails.name}</strong> plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-medium">
                      {selectedPlanDetails.name} Plan
                    </span>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        ₹{selectedPlanDetails.price/100}
                      </div>
                      <div className="text-sm text-gray-600">
                        per {selectedPlanDetails.period}
                      </div>
                    </div>
                  </div>

                  {selectedPlanDetails.savings && (
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <Check className="h-4 w-4" />
                      <span>{selectedPlanDetails.savings}</span>
                    </div>
                  )}
                </div>

                <Button
                  size="lg"
                  className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700"
                >
                  Continue to Payment
                </Button>

                <p className="text-center text-sm text-gray-500">
                  30-day money-back guarantee • Cancel anytime • Secure payment
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
