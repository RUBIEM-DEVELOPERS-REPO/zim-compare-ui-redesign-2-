"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  HomeIcon, 
  BuildingIcon, 
  AlertCircleIcon, 
  RefreshCwIcon,
  Plus,
  Trash2,
  Edit2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useRouter } from "next/navigation";
import { RefreshButton } from "@/components/RefreshButton";

interface Insurance {
  insuranceId: number;
  providerName: string;
  insuranceType: string;
  basePremium: number;
  currency: string;
  maxCoverage?: number;
  deductible?: number;
  coinsurance?: number;
  copay?: number;
  effective_date?: string;
}

export default function InsuranceAdminPage() {
  const router = useRouter();
  const [insurance, setInsurance] = useState<Insurance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Insurance>>({
    providerName: "",
    insuranceType: "health",
    basePremium: 0,
    currency: "USD",
    maxCoverage: 0,
    deductible: 0,
    coinsurance: 0,
    copay: 0,
  });

  // Fetch insurance on load
  useEffect(() => {
    fetchInsurance();
  }, []);

  const fetchInsurance = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/insurance");
      if (!response.ok) throw new Error("Failed to fetch insurance");
      const data = await response.json();
      setInsurance(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load insurance");
      console.error("Error fetching insurance:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddInsurance = async () => {
    if (!formData.providerName || !formData.insuranceType) {
      alert("Please fill in provider name and insurance type");
      return;
    }

    try {
      const response = await fetch("/api/insurance", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { ...formData, insuranceId: editingId } : formData),
      });

      if (!response.ok) throw new Error("Failed to save insurance");
      
      await fetchInsurance();
      setFormData({
        providerName: "",
        insuranceType: "health",
        basePremium: 0,
        currency: "USD",
        maxCoverage: 0,
        deductible: 0,
        coinsurance: 0,
        copay: 0,
      });
      setEditingId(null);
      alert(editingId ? "Insurance updated successfully" : "Insurance added successfully");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save insurance");
    }
  };

  const handleDeleteInsurance = async (insuranceId: number) => {
    if (!confirm("Are you sure you want to delete this insurance?")) return;

    try {
      const response = await fetch(`/api/insurance/${insuranceId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete insurance");
      
      await fetchInsurance();
      alert("Insurance deleted successfully");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete insurance");
    }
  };

  const handleEditInsurance = (item: Insurance) => {
    setFormData(item);
    setEditingId(item.insuranceId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <BuildingIcon className="h-8 w-8 text-purple-400" />
            <h1 className="text-2xl font-semibold">Insurance Data Management</h1>
          </div>
          <div className="flex items-center gap-2">
            <RefreshButton />
            <Button
              variant="outline"
              onClick={() => router.push("/admin")}
              className="flex items-center gap-2"
            >
              <HomeIcon className="h-4 w-4" />
              Back to Admin
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Input Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Insurance" : "Add New Insurance"}</CardTitle>
            <CardDescription>
              Enter insurance information to add or update in the database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Provider Name *</label>
                <Input
                  placeholder="Insurance provider name"
                  value={formData.providerName || ""}
                  onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Insurance Type *</label>
                <Select value={formData.insuranceType || "health"} onValueChange={(value) => setFormData({ ...formData, insuranceType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="motor">Motor</SelectItem>
                    <SelectItem value="property">Property</SelectItem>
                    <SelectItem value="life">Life</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Currency</label>
                <Select value={formData.currency || "USD"} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="ZWL">ZWL</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Base Premium</label>
                <Input
                  type="number"
                  placeholder="Base premium"
                  value={formData.basePremium || 0}
                  onChange={(e) => setFormData({ ...formData, basePremium: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Coverage</label>
                <Input
                  type="number"
                  placeholder="Maximum coverage"
                  value={formData.maxCoverage || 0}
                  onChange={(e) => setFormData({ ...formData, maxCoverage: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Deductible</label>
                <Input
                  type="number"
                  placeholder="Deductible amount"
                  value={formData.deductible || 0}
                  onChange={(e) => setFormData({ ...formData, deductible: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Coinsurance (%)</label>
                <Input
                  type="number"
                  placeholder="Coinsurance percentage"
                  value={formData.coinsurance || 0}
                  onChange={(e) => setFormData({ ...formData, coinsurance: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Copay</label>
                <Input
                  type="number"
                  placeholder="Copay amount"
                  value={formData.copay || 0}
                  onChange={(e) => setFormData({ ...formData, copay: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button onClick={handleAddInsurance} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {editingId ? "Update Insurance" : "Add Insurance"}
              </Button>
              {editingId && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      providerName: "",
                      insuranceType: "health",
                      basePremium: 0,
                      currency: "USD",
                      maxCoverage: 0,
                      deductible: 0,
                      coinsurance: 0,
                      copay: 0,
                    });
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Insurance List */}
        <Card>
          <CardHeader>
            <CardTitle>Insurance Database ({insurance.length})</CardTitle>
            <CardDescription>All insurance providers currently in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : insurance.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No insurance found. Add one to get started.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Provider Name</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-right p-2">Base Premium</th>
                      <th className="text-right p-2">Max Coverage</th>
                      <th className="text-right p-2">Deductible</th>
                      <th className="text-center p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {insurance.map((item) => (
                      <tr key={item.insuranceId} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{item.providerName}</td>
                        <td className="p-2 capitalize">{item.insuranceType}</td>
                        <td className="text-right p-2">{item.basePremium} {item.currency}</td>
                        <td className="text-right p-2">{item.maxCoverage || "-"}</td>
                        <td className="text-right p-2">{item.deductible || "-"}</td>
                        <td className="p-2 text-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditInsurance(item)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteInsurance(item.insuranceId)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
