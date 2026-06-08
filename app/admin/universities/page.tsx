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

interface University {
  universityId: number;
  universityName: string;
  location: string;
  tuitionFee: number;
  currency: string;
  accommodationFee?: number;
  applicationFee?: number;
  labFee?: number;
  libraryFee?: number;
  studentUnionFee?: number;
  effective_date?: string;
}

export default function UniversitiesAdminPage() {
  const router = useRouter();
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<University>>({
    universityName: "",
    location: "",
    tuitionFee: 0,
    currency: "USD",
    accommodationFee: 0,
    applicationFee: 0,
    labFee: 0,
    libraryFee: 0,
    studentUnionFee: 0,
  });

  // Fetch universities on load
  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/universities");
      if (!response.ok) throw new Error("Failed to fetch universities");
      const data = await response.json();
      setUniversities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load universities");
      console.error("Error fetching universities:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUniversity = async () => {
    if (!formData.universityName || !formData.location) {
      alert("Please fill in university name and location");
      return;
    }

    try {
      const response = await fetch("/api/universities", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { ...formData, universityId: editingId } : formData),
      });

      if (!response.ok) throw new Error("Failed to save university");
      
      await fetchUniversities();
      setFormData({
        universityName: "",
        location: "",
        tuitionFee: 0,
        currency: "USD",
        accommodationFee: 0,
        applicationFee: 0,
        labFee: 0,
        libraryFee: 0,
        studentUnionFee: 0,
      });
      setEditingId(null);
      alert(editingId ? "University updated successfully" : "University added successfully");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save university");
    }
  };

  const handleDeleteUniversity = async (universityId: number) => {
    if (!confirm("Are you sure you want to delete this university?")) return;

    try {
      const response = await fetch(`/api/universities/${universityId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete university");
      
      await fetchUniversities();
      alert("University deleted successfully");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete university");
    }
  };

  const handleEditUniversity = (university: University) => {
    setFormData(university);
    setEditingId(university.universityId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <BuildingIcon className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-semibold">Universities Data Management</h1>
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
            <CardTitle>{editingId ? "Edit University" : "Add New University"}</CardTitle>
            <CardDescription>
              Enter university information to add or update in the database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">University Name *</label>
                <Input
                  placeholder="University name"
                  value={formData.universityName || ""}
                  onChange={(e) => setFormData({ ...formData, universityName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location *</label>
                <Input
                  placeholder="Location"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
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
                <label className="text-sm font-medium">Tuition Fee</label>
                <Input
                  type="number"
                  placeholder="Tuition fee"
                  value={formData.tuitionFee || 0}
                  onChange={(e) => setFormData({ ...formData, tuitionFee: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Accommodation Fee</label>
                <Input
                  type="number"
                  placeholder="Accommodation fee"
                  value={formData.accommodationFee || 0}
                  onChange={(e) => setFormData({ ...formData, accommodationFee: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Application Fee</label>
                <Input
                  type="number"
                  placeholder="Application fee"
                  value={formData.applicationFee || 0}
                  onChange={(e) => setFormData({ ...formData, applicationFee: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Lab Fee</label>
                <Input
                  type="number"
                  placeholder="Lab fee"
                  value={formData.labFee || 0}
                  onChange={(e) => setFormData({ ...formData, labFee: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Library Fee</label>
                <Input
                  type="number"
                  placeholder="Library fee"
                  value={formData.libraryFee || 0}
                  onChange={(e) => setFormData({ ...formData, libraryFee: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Student Union Fee</label>
                <Input
                  type="number"
                  placeholder="Student union fee"
                  value={formData.studentUnionFee || 0}
                  onChange={(e) => setFormData({ ...formData, studentUnionFee: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button onClick={handleAddUniversity} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {editingId ? "Update University" : "Add University"}
              </Button>
              {editingId && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      universityName: "",
                      location: "",
                      tuitionFee: 0,
                      currency: "USD",
                      accommodationFee: 0,
                      applicationFee: 0,
                      labFee: 0,
                      libraryFee: 0,
                      studentUnionFee: 0,
                    });
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Universities List */}
        <Card>
          <CardHeader>
            <CardTitle>Universities Database ({universities.length})</CardTitle>
            <CardDescription>All universities currently in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : universities.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No universities found. Add one to get started.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">University Name</th>
                      <th className="text-left p-2">Location</th>
                      <th className="text-right p-2">Tuition Fee</th>
                      <th className="text-right p-2">Accommodation</th>
                      <th className="text-right p-2">Application</th>
                      <th className="text-center p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {universities.map((university) => (
                      <tr key={university.universityId} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{university.universityName}</td>
                        <td className="p-2">{university.location}</td>
                        <td className="text-right p-2">{university.tuitionFee} {university.currency}</td>
                        <td className="text-right p-2">{university.accommodationFee || "-"}</td>
                        <td className="text-right p-2">{university.applicationFee || "-"}</td>
                        <td className="p-2 text-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUniversity(university)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUniversity(university.universityId)}
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
