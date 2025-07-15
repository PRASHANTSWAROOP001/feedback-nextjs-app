"use client"

import type React from "react"
import { addPricing, updatePricing,} from "@/app/action/price/pricingOps"
import { useState } from "react"
import { Plus, Edit, Trash2, Save, X, DollarSign, TrendingUp, Settings, Mail, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export interface PricingPlan {
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
  createdAt: Date
  updatedAt: Date |null
  updatedBy?: string | null
}




export default function AdminPage({initialData}:{initialData: PricingPlan[]}) {
  const [plans, setPlans] = useState<PricingPlan[]>(initialData)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string|null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; planId: string | null }>({
    open: false,
    planId: null,
  })

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "", // Will be converted to paise
    period: "",
    popular: false,
    savings: "",
    currency: "INR",
    validity: "",
    emailUsageLimit: "100",
    subscription: "" as "MONTHLY" | "QUARTERLY" | "HALF_YEARLY" | "YEARLY" | "",
    features: "",
  })

const resetForm = () => {
  setFormData({
    name: "",
    description: "",
    price: "",
    period: "",
    popular: false,
    savings: "",
    currency: "INR",
    validity: "",
    emailUsageLimit: "100",
    subscription: "",
    features: "",
  })
  setEditingId(null)
  setIsFormOpen(false)
}


  const handleEdit = (plan: PricingPlan) => {
    setEditingId(plan.id)
    setFormData({
      name: plan.name,
      description: plan.description,
      price: (plan.price / 100).toString(), // Convert paise to rupees for display
      period: plan.period,
      popular: plan.popular,
      savings: plan.savings || "",
      currency: plan.currency,
      validity: plan.validity.toString(),
      emailUsageLimit: plan.emailUsageLimit.toString(),
      subscription: plan.subscription,
      features: plan.features.join("\n"),
    })
    setIsFormOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      const updatePayload = {
        name: formData.name,
        description: formData.description,
        price: Math.round(Number.parseFloat(formData.price) * 100), // Convert to paise
        period: formData.period,
        popular: formData.popular,
        savings: formData.savings || undefined,
        currency: formData.currency,
        validity: Number.parseInt(formData.validity),
        emailUsageLimit: Number.parseInt(formData.emailUsageLimit),
        subscription: formData.subscription as "MONTHLY" | "QUARTERLY" | "HALF_YEARLY" | "YEARLY",
        features: formData.features.split("\n").filter((f) => f.trim())
      }

      const updateResponse = await updatePricing(updatePayload, editingId)

      if(updateResponse.success){
        toast("data updated successfully")
      }


    } else {
      const createPayload = {
        name: formData.name,
        description: formData.description,
        price: Math.round(Number.parseFloat(formData.price) * 100), // Convert to paise
        period: formData.period,
        popular: formData.popular,
        savings: formData.savings || undefined,
        currency: formData.currency,
        validity: Number.parseInt(formData.validity),
        emailUsageLimit: Number.parseInt(formData.emailUsageLimit),
        subscription: formData.subscription as "MONTHLY" | "QUARTERLY" | "HALF_YEARLY" | "YEARLY",
        features: formData.features.split("\n").filter((f) => f.trim()),
      }

      const addNewPrice = await addPricing(createPayload)
      if(addNewPrice.success){
        toast("data added successfully")
      }
     
    }

    resetForm()
  }

  const handleDelete = (planId: string) => {
    setPlans(plans.filter((p) => p.id !== planId))
    setDeleteDialog({ open: false, planId: null })
  }

  const formatPrice = (priceInPaise: number, currency: string) => {
    const price = priceInPaise / 100
    return currency === "INR" ? `₹${price}` : `$${price}`
  }

  const stats = {
    totalPlans: plans.length,
    activePlans: plans.filter((p) => p.popular).length,
    averagePrice: Math.round(plans.reduce((sum, p) => sum + p.price, 0) / plans.length / 100),
    totalEmailLimit: plans.reduce((sum, p) => sum + p.emailUsageLimit, 0),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pricing Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your SaaS pricing plans and email limits</p>
            </div>
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              Super Admin Access
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Plans</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalPlans}</p>
                </div>
                <Settings className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Popular Plans</p>
                  <p className="text-3xl font-bold text-green-600">{stats.activePlans}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Price</p>
                  <p className="text-3xl font-bold text-purple-600">₹{stats.averagePrice}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Email Limit</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.totalEmailLimit.toLocaleString()}</p>
                </div>
                <Mail className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Form */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {isFormOpen ? (editingId ? "Edit Pricing Plan" : "Add New Pricing Plan") : "Plan Management"}
                </CardTitle>
                <CardDescription>
                  {isFormOpen ? "Configure pricing, limits, and features" : "Create and manage your pricing plans"}
                </CardDescription>
              </div>
              <Button onClick={() => setIsFormOpen(!isFormOpen)} variant={isFormOpen ? "outline" : "default"}>
                {isFormOpen ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                {isFormOpen ? "Cancel" : "Add Plan"}
              </Button>
            </div>
          </CardHeader>

          {isFormOpen && (
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="name">Plan Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Monthly, Annual"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="subscription">Subscription Type</Label>
                    <Select
                      value={formData.subscription}
                      onValueChange={(value: "MONTHLY" | "QUARTERLY" | "HALF_YEARLY" | "YEARLY") =>
                        setFormData({ ...formData, subscription: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subscription" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                        <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                        <SelectItem value="HALF_YEARLY">Half Yearly</SelectItem>
                        <SelectItem value="YEARLY">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="29.00"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Will be stored in paise</p>
                  </div>

                  <div>
                    <Label htmlFor="period">Display Period</Label>
                    <Input
                      id="period"
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      placeholder="e.g., month, year"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="validity">Validity (Days)</Label>
                    <Input
                      id="validity"
                      type="number"
                      value={formData.validity}
                      onChange={(e) => setFormData({ ...formData, validity: e.target.value })}
                      placeholder="30"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="emailUsageLimit">Email Usage Limit</Label>
                    <Input
                      id="emailUsageLimit"
                      type="number"
                      value={formData.emailUsageLimit}
                      onChange={(e) => setFormData({ ...formData, emailUsageLimit: e.target.value })}
                      placeholder="1000"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => setFormData({ ...formData, currency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="savings">Savings Text</Label>
                    <Input
                      id="savings"
                      value={formData.savings}
                      onChange={(e) => setFormData({ ...formData, savings: e.target.value })}
                      placeholder="Save 25%"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="popular"
                      checked={formData.popular}
                      onCheckedChange={(checked) => setFormData({ ...formData, popular: checked })}
                    />
                    <Label htmlFor="popular">Mark as Popular</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the plan"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="features">Features (one per line)</Label>
                  <Textarea
                    id="features"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="Up to 1,000 emails&#10;Basic analytics&#10;Email support&#10;API access"
                    rows={5}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Each line will be saved as a separate feature</p>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {editingId ? "Update Plan" : "Create Plan"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          )}
        </Card>

        {/* Plans Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Pricing Plans</CardTitle>
            <CardDescription>Manage your existing pricing plans and email limits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan Details</TableHead>
                    <TableHead>Price & Savings</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Limits</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{plan.name}</span>
                            {plan.popular && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                Popular
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{plan.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-bold">{formatPrice(plan.price, plan.currency)}</div>
                          {plan.savings && (
                            <Badge variant="outline" className="text-green-600 border-green-200">
                              {plan.savings}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant="outline">{plan.subscription}</Badge>
                          <p className="text-sm text-gray-600">per {plan.period}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {plan.validity} days
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {plan.emailUsageLimit.toLocaleString()} emails
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{plan.features.length} features</span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        <div className="space-y-1">
                          <div>{plan.updatedAt== null?"None":plan.updatedAt.toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">
                            {plan.updatedBy ? `by ${plan.updatedBy}` : "No updates yet"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(plan)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteDialog({ open: true, planId: plan.id })}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, planId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Pricing Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this pricing plan? This action cannot be undone and will affect all
              associated subscriptions.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, planId: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => deleteDialog.planId && handleDelete(deleteDialog.planId)}>
              Delete Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
