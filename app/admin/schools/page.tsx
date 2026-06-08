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

interface School {
  schoolId: number;
  schoolName: string;
  location: string;
  tuitionFee: number;
  currency: string;
  admissionFee?: number;
  boardingFee?: number;
  uniformCost?: number;
  booksCost?: number;
  examFee?: number;
  effective_date?: string;
}

export default function SchoolsAdminPage() {
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<School>>({
    schoolName: "",
    location: "",
    tuitionFee: 0,
    currency: "USD",
    admissionFee: 0,
    boardingFee: 0,
    uniformCost: 0,
    booksCost: 0,
    examFee: 0,
  });

  // Fetch schools on load
  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/schools");
      if (!response.ok) throw new Error("Failed to fetch schools");
      const data = await response.json();
      setSchools(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load schools");
      console.error("Error fetching schools:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSchool = async () => {
    if (!formData.schoolName || !formData.location) {
      alert("Please fill in school name and location");
      return;
    }

    try {
      const response = await fetch("/api/schools", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { ...formData, schoolId: editingId } : formData),
      });

      if (!response.ok) throw new Error("Failed to save school");
      
      await fetchSchools();
      setFormData({
        schoolName: "",
        location: "",
        tuitionFee: 0,
        currency: "USD",
        admissionFee: 0,
        boardingFee: 0,
        uniformCost: 0,
        booksCost: 0,
        examFee: 0,
      });
      setEditingId(null);
      alert(editingId ? "School updated successfully" : "School added successfully");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save school");
    }
  };

  const handleDeleteSchool = async (schoolId: number) => {
    if (!confirm("Are you sure you want to delete this school?")) return;

    try {
      const response = await fetch(`/api/schools/${schoolId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete school");
      
      await fetchSchools();
      alert("School deleted successfully");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete school");
    }
  };

  const handleEditSchool = (school: School) => {
    setFormData(school);
    setEditingId(school.schoolId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <BuildingIcon className="h-8 w-8 text-amber-400" />
            <h1 className="text-2xl font-semibold">Schools Data Management</h1>
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
            <CardTitle>{editingId ? "Edit School" : "Add New School"}</CardTitle>
            <CardDescription>
              Enter school information to add or update in the database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">School Name *</label>
                <Input
                  placeholder="School name"
                  value={formData.schoolName || ""}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
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
                <label className="text-sm font-medium">Admission Fee</label>
                <Input
                  type="number"
                  placeholder="Admission fee"
                  value={formData.admissionFee || 0}
                  onChange={(e) => setFormData({ ...formData, admissionFee: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Boarding Fee</label>
                <Input
                  type="number"
                  placeholder="Boarding fee"
                  value={formData.boardingFee || 0}
                  onChange={(e) => setFormData({ ...formData, boardingFee: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Uniform Cost</label>
                <Input
                  type="number"
                  placeholder="Uniform cost"
                  value={formData.uniformCost || 0}
                  onChange={(e) => setFormData({ ...formData, uniformCost: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Books Cost</label>
                <Input
                  type="number"
                  placeholder="Books cost"
                  value={formData.booksCost || 0}
                  onChange={(e) => setFormData({ ...formData, booksCost: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Exam Fee</label>
                <Input
                  type="number"
                  placeholder="Exam fee"
                  value={formData.examFee || 0}
                  onChange={(e) => setFormData({ ...formData, examFee: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button onClick={handleAddSchool} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {editingId ? "Update School" : "Add School"}
              </Button>
              {editingId && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      schoolName: "",
                      location: "",
                      tuitionFee: 0,
                      currency: "USD",
                      admissionFee: 0,
                      boardingFee: 0,
                      uniformCost: 0,
                      booksCost: 0,
                      examFee: 0,
                    });
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Schools List */}
        <Card>
          <CardHeader>
            <CardTitle>Schools Database ({schools.length})</CardTitle>
            <CardDescription>All schools currently in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : schools.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No schools found. Add one to get started.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">School Name</th>
                      <th className="text-left p-2">Location</th>
                      <th className="text-right p-2">Tuition Fee</th>
                      <th className="text-right p-2">Admission</th>
                      <th className="text-right p-2">Boarding</th>
                      <th className="text-center p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schools.map((school) => (
                      <tr key={school.schoolId} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{school.schoolName}</td>
                        <td className="p-2">{school.location}</td>
                        <td className="text-right p-2">{school.tuitionFee} {school.currency}</td>
                        <td className="text-right p-2">{school.admissionFee || "-"}</td>
                        <td className="text-right p-2">{school.boardingFee || "-"}</td>
                        <td className="p-2 text-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditSchool(school)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSchool(school.schoolId)}
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
