"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar, FileText, List, DollarSign, Clock, Settings } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export default function EarningsPage() {
  const { user, isLoggedIn } = useAuth()
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState("")
  const [billingDate, setBillingDate] = useState("Nov 1 - Nov 15, 2025")
  const [contracts, setContracts] = useState("All Contracts")
  const [type, setType] = useState("All Types")

  // Check if payment method is set up (mock - in real app, check from backend)
  useEffect(() => {
    // Mock: Check localStorage or backend
    const paymentMethodSet = localStorage.getItem('paymentMethodSet') === 'true'
    setHasPaymentMethod(paymentMethodSet)
    
    // Show modal if payment method not set up and user is contractor
    if (!paymentMethodSet && isLoggedIn && user?.user_type === 'contractor') {
      setShowPaymentModal(true)
    }
  }, [isLoggedIn, user])

  const handleCloseModal = () => {
    setShowPaymentModal(false)
  }

  const handleNext = () => {
    // In real app, this would continue to next step of payment setup
    // For now, just close modal
    setShowPaymentModal(false)
  }

  // Mock earnings data
  const earningsData = [
    { period: "Nov 1 - Nov 7, 2025", paid: 0, pending: 0 },
    { period: "Nov 8 - Nov 14, 2025", paid: 0, pending: 0 },
    { period: "Nov 15 - Nov 15, 2025", paid: 0, pending: 0 },
  ]

  const totalEarnings = 0.00

  return (
    <div className="min-h-screen bg-muted/30 pl-32">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Earnings
            </h1>
            <p className="text-base text-muted-foreground">
              Your total earnings to date are <strong>${totalEarnings.toFixed(2)}</strong>.{" "}
              <a href="/explore" className="text-primary hover:underline">
                Explore open roles →
              </a>
            </p>
          </div>

          {/* Payment Method Status */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {hasPaymentMethod ? "Payment method connected" : "No payment method connected"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPaymentModal(true)}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Connect provider
            </Button>
          </div>
        </div>

        {/* Earnings Over Time Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Earnings Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-4">
              <Select value={billingDate} onValueChange={setBillingDate}>
                <SelectTrigger className="w-[200px]">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nov 1 - Nov 15, 2025">Nov 1 - Nov 15, 2025</SelectItem>
                  <SelectItem value="Oct 1 - Oct 31, 2025">Oct 1 - Oct 31, 2025</SelectItem>
                  <SelectItem value="Sep 1 - Sep 30, 2025">Sep 1 - Sep 30, 2025</SelectItem>
                </SelectContent>
              </Select>

              <Select value={contracts} onValueChange={setContracts}>
                <SelectTrigger className="w-[180px]">
                  <FileText className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Contracts">All Contracts</SelectItem>
                  <SelectItem value="Contract 1">Contract 1</SelectItem>
                  <SelectItem value="Contract 2">Contract 2</SelectItem>
                </SelectContent>
              </Select>

              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-[150px]">
                  <List className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Types">All Types</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              {/* Earnings Total */}
              <div className="ml-auto flex items-center gap-2 rounded-lg border bg-card p-3">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Earnings total</p>
                  <p className="text-2xl font-bold">${totalEarnings.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Graph */}
            <div className="mb-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="paid"
                    stroke="#6366f1"
                    strokeWidth={2}
                    name="Paid Earnings"
                  />
                  <Line
                    type="monotone"
                    dataKey="pending"
                    stroke="#a5b4fc"
                    strokeWidth={2}
                    name="Pending Earnings"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="mb-4 flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-indigo-600"></div>
                <span>Paid Earnings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-indigo-300"></div>
                <span>Pending Earnings</span>
              </div>
            </div>

            {/* Data Refresh Note */}
            <p className="text-xs text-muted-foreground text-right">
              Data refreshes every hour.
            </p>
          </CardContent>
        </Card>

        {/* Payments Section */}
        <Card>
          <CardHeader>
            <CardTitle>Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Payout date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Hours
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Earned
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      No payments yet
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Setup Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Setup your Payment Method</DialogTitle>
            <DialogDescription>
              Select the country in which you live and work
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select your country</label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                  <SelectItem value="AU">Australia</SelectItem>
                  <SelectItem value="DE">Germany</SelectItem>
                  <SelectItem value="FR">France</SelectItem>
                  <SelectItem value="ES">Spain</SelectItem>
                  <SelectItem value="IT">Italy</SelectItem>
                  <SelectItem value="NL">Netherlands</SelectItem>
                  <SelectItem value="BE">Belgium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={handleNext} disabled={!selectedCountry}>
              Next
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

