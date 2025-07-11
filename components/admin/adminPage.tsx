"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Edit, Trash2, Save, X, DollarSign, Users, TrendingUp, Settings } from "lucide-react"
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

interface PricingPlan {
  id: string
  name: string
  price: number
  originalPrice?: number
  period: string
  description: string
  features: string[]
  popular: boolean
  active: boolean
  createdAt: string
  updatedAt: string
}

const initialPlans: PricingPlan[] = [
  {
    id: "1",
    name: "Monthly",
    price: 29,
    period: "month",
    description: "Perfect for getting started",
    features: ["Up to 10,000 requests", "Basic analytics", "Email support"],
    popular: false,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Quarterly",
    price: 79,
    originalPrice: 87,
    period: "3 months",
    description: "Great for growing teams",
    features: ["Up to 50,000 requests", "Advanced analytics", "Priority support"],
    popular: false,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "3",
    name: "Annual",
    price: 299,
    originalPrice: 348,
    period: "year",
    description: "Best value for serious users",
    features: ["Unlimited requests", "Real-time analytics", "24/7 support"],
    popular: true,
    active: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
]

export default function AdminPage() {
  const [plans, setPlans] = useState<PricingPlan[]>(initialPlans)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; planId: string | null }>({
    open: false,
    planId: null,
  })

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    period: "",
    description: "",
    features: "",
    popular: false,
    active: true,
  })

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      originalPrice: "",
      period: "",
      description: "",
      features: "",
      popular: false,
      active: true,
    })
    setEditingPlan(null)
    setIsFormOpen(false)
  }

  const handleEdit = (plan: PricingPlan) => {
    setEditingPlan(plan)
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      originalPrice: plan.originalPrice?.toString() || "",
      period: plan.period,
      description: plan.description,
      features: plan.features.join("\n"),
      popular: plan.popular,
      active: plan.active,
    })
    setIsFormOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newPlan: PricingPlan = {
      id: editingPlan?.id || Date.now().toString(),
      name: formData.name,
      price: Number.parseFloat(formData.price),
      originalPrice: formData.originalPrice ? Number.parseFloat(formData.originalPrice) : undefined,
      period: formData.period,
      description: formData.description,
      features: formData.features.split("\n").filter((f) => f.trim()),
      popular: formData.popular,
      active: formData.active,
      createdAt: editingPlan?.createdAt || new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }

    if (editingPlan) {
      setPlans(plans.map((p) => (p.id === editingPlan.id ? newPlan : p)))
    } else {
      setPlans([...plans, newPlan])
    }

    resetForm()
  }

  const handleDelete = (planId: string) => {
    setPlans(plans.filter((p) => p.id !== planId))
    setDeleteDialog({ open: false, planId: null })
  }

  const stats = {
    totalPlans: plans.length,
    activePlans: plans.filter((p) => p.active).length,
    averagePrice: Math.round(plans.reduce((sum, p) => sum + p.price, 0) / plans.length),
    popularPlans: plans.filter((p) => p.popular).length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your SaaS pricing plans</p>
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
                  <p className="text-sm font-medium text-gray-600">Active Plans</p>
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
                  <p className="text-3xl font-bold text-purple-600">${stats.averagePrice}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Popular Plans</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.popularPlans}</p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Form */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{isFormOpen ? (editingPlan ? "Edit Plan" : "Add New Plan") : "Plan Management"}</CardTitle>
                <CardDescription>
                  {isFormOpen ? "Fill in the details below" : "Create and manage your pricing plans"}
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
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="29.99"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="originalPrice">Original Price ($)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      placeholder="39.99 (optional)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="period">Billing Period</Label>
                    <Select
                      value={formData.period}
                      onValueChange={(value) => setFormData({ ...formData, period: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Month</SelectItem>
                        <SelectItem value="3 months">3 Months</SelectItem>
                        <SelectItem value="6 months">6 Months</SelectItem>
                        <SelectItem value="year">Year</SelectItem>
                        <SelectItem value="one-time">One-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="popular"
                        checked={formData.popular}
                        onCheckedChange={(checked) => setFormData({ ...formData, popular: checked })}
                      />
                      <Label htmlFor="popular">Popular Plan</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="active"
                        checked={formData.active}
                        onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                      />
                      <Label htmlFor="active">Active</Label>
                    </div>
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
                    placeholder="Up to 10,000 requests&#10;Basic analytics&#10;Email support"
                    rows={4}
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {editingPlan ? "Update Plan" : "Create Plan"}
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
            <CardDescription>Manage your existing pricing plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{plan.name}</span>
                          {plan.popular && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              Popular
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">${plan.price}</span>
                          {plan.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">${plan.originalPrice}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{plan.period}</TableCell>
                      <TableCell>
                        <Badge variant={plan.active ? "default" : "secondary"}>
                          {plan.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{plan.features.length} features</span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{plan.updatedAt}</TableCell>
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
            <DialogTitle>Delete Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this pricing plan? This action cannot be undone.
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
