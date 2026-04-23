"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ArrowRight, ClipboardList } from "lucide-react"

const houseSchema = z.object({
  propertyType: z.string(),
  location: z.string().min(3, "Location is required"),
  rooms: z.string(),
  materials: z.string(),
  estimatedValue: z.string(),
  occupancy: z.string(),
  residential: z.boolean().default(true),
  security: z.array(z.string()).default([])
})

const carSchema = z.object({
  make: z.string().min(2, "Make is required"),
  model: z.string().min(2, "Model is required"),
  year: z.string(),
  estimatedValue: z.string(),
  usage: z.string(),
  condition: z.string(),
  location: z.string(),
  ownership: z.string()
})

interface AssetDetailFormProps {
  assetType: "house" | "car"
  onSubmit: (data: any) => void
  onBack: () => void
}

export function AssetDetailForm({ assetType, onSubmit, onBack }: AssetDetailFormProps) {
  const form = useForm<any>({
    resolver: zodResolver(assetType === "house" ? houseSchema : carSchema),
    defaultValues: assetType === "house" ? {
      propertyType: "Detached House",
      location: "",
      rooms: "3",
      materials: "Brick & Mortar",
      estimatedValue: "",
      occupancy: "Owner-Occupied",
      residential: true,
      security: []
    } : {
      make: "",
      model: "",
      year: "2024",
      estimatedValue: "",
      usage: "Private",
      condition: "Excellent",
      location: "Locked Garage",
      ownership: "Single Owner"
    }
  })

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <ClipboardList size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-display font-medium">Verify Asset Details</h2>
          <p className="text-muted-foreground text-sm">Review and refine the extracted details for higher precision.</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-card/10 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assetType === "house" ? (
              <>
                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/5 border-white/10">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#1c1c1c] border-white/10">
                          <SelectItem value="Detached House">Detached House</SelectItem>
                          <SelectItem value="Semi-Detached">Semi-Detached</SelectItem>
                          <SelectItem value="Apartment">Apartment / Flat</SelectItem>
                          <SelectItem value="Townhouse">Townhouse</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Physical Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Borrowdale, Harare" className="bg-white/5 border-white/10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Rooms</FormLabel>
                      <FormControl>
                        <Input type="number" className="bg-white/5 border-white/10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="materials"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Building Materials</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/5 border-white/10">
                            <SelectValue placeholder="Select material" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#1c1c1c] border-white/10">
                          <SelectItem value="Brick & Mortar">Brick & Mortar</SelectItem>
                          <SelectItem value="Timber Frame">Timber Frame</SelectItem>
                          <SelectItem value="Concrete">Concrete Slab</SelectItem>
                          <SelectItem value="Asbestos/Other">Asbestos / Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimatedValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Market Value (USD)</FormLabel>
                      <FormControl>
                        <Input placeholder="$250,000" className="bg-white/5 border-white/10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="occupancy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupancy Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/5 border-white/10">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#1c1c1c] border-white/10">
                          <SelectItem value="Owner-Occupied">Owner-Occupied</SelectItem>
                          <SelectItem value="Rented Out">Rented Out</SelectItem>
                          <SelectItem value="Vacant">Unoccupied / Vacant</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="make"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Make</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Toyota" className="bg-white/5 border-white/10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Hilux" className="bg-white/5 border-white/10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manufacture Year</FormLabel>
                      <FormControl>
                        <Input type="number" className="bg-white/5 border-white/10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="usage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usage Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/5 border-white/10">
                            <SelectValue placeholder="Select usage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#1c1c1c] border-white/10">
                          <SelectItem value="Private">Private / Personal</SelectItem>
                          <SelectItem value="Business">Business Travel</SelectItem>
                          <SelectItem value="Commercial">Commercial / Logistics</SelectItem>
                          <SelectItem value="E-Hailing">Ride-Hailing (Taxi)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimatedValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Market Value (USD)</FormLabel>
                      <FormControl>
                        <Input placeholder="$15,000" className="bg-white/5 border-white/10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Overnight Security</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/5 border-white/10">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#1c1c1c] border-white/10">
                          <SelectItem value="Locked Garage">Locked Garage</SelectItem>
                          <SelectItem value="Fenced Yard">Fenced Yard</SelectItem>
                          <SelectItem value="Driveway">Open Driveway</SelectItem>
                          <SelectItem value="Street">Street Parking</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-white/5">
             <Button type="button" variant="ghost" onClick={onBack} className="gap-2 text-muted-foreground">
                <ArrowLeft size={16} /> Update Images
             </Button>
             <Button type="submit" className="gap-2 px-8 py-6 rounded-2xl bg-primary text-primary-foreground font-bold uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                Run Simulation <ArrowRight size={16} />
             </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
