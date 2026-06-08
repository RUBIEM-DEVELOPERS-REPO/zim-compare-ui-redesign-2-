"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
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
  TrendingUpIcon, 
  ScaleIcon,
  BarChart3Icon,
  CalculatorIcon,
  MailIcon,
  FileTextIcon,
  Gift as GiftIcon,
  LayersIcon,
  Clock,
  Target
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BankDetails } from "@/components/BankDetails";
import TransactionFeeStats from "@/components/transaction-fee-stats";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ErrorBoundary from "@/components/ErrorBoundary";
import CompetitiveAnalysisRecommendations from "@/components/CompetitiveAnalysisRecommendations";
import { PricingFlowStages } from "@/components/pricing-flow-stages";
import { EmailSender } from "@/components/email-sender";
import HierarchicalProductSegmentationDiscountSystem from "@/components/HierarchicalProductSegmentationDiscountSystem";
import ConsolidatedDiscountPricingView from "@/components/ConsolidatedDiscountPricingView";
import DiscountHistoryTracker from "@/components/DiscountHistoryTracker";
import ConsolidatedCompetitivePricingWorkflow from "@/components/ConsolidatedCompetitivePricingWorkflow";
import BankRevenueLineChart from "@/components/BankRevenueLineChart";
import MedianRevenueLineChart from "@/components/MedianRevenueLineChart";
import CompetitorCountUpdater from "@/components/CompetitorCountUpdater";
import MLPredictionPanel from "@/components/MLPredictionPanel";
import { useRouter } from "next/navigation";
import { RefreshButton } from "@/components/RefreshButton";

// Define types for the bank details response
interface Bank {
  bankId: number;
  bankName: string;
  website: string;
  contactEmail: string;
}

interface BankDetailsType extends Bank {
  transactionFees: TransactionFee[];
  loanRates: LoanRate[];
  cardFees: CardFee[];
  fixedDepositRates?: FixedDepositRate[];
}

interface TransactionFee {
  fee_id: number;
  transaction_type_name: string;
  currency_code: string;
  account_type_name?: string;
  minimum_fee: number | null;
  maximum_fee: number | null;
  percentage_fee: number | null;
  flat_fee?: number | null;
  effective_date?: string;
}

interface LoanRate {
  loan_rate_id: number;
  loan_type_name: string;
  currency_code: string;
  min_interest_rate: number;
  max_interest_rate: number;
  establishment_fee_min: number;
  establishment_fee_max: number;
  effective_date?: string;
}

interface CardFee {
  card_fee_id: number;
  card_type_name: string;
  currency_code: string;
  issuance_fee: number;
  replacement_fee: number;
  annual_maintenance_fee: number;
  effective_date?: string;
}

interface FixedDepositRate {
  deposit_rate_id: number;
  currency_code: string;
  tenure_days: number;
  interest_rate: number;
  minimum_deposit: number;
  effective_date?: string;
}

// Fetch function for banks with enhanced retry logic
const fetchBanks = async (): Promise<Bank[]> => {
  const maxRetries = 5;
  let retries = 0;
  
  // First check database health
  try {
    const healthResponse = await fetch("/api/health");
    if (!healthResponse.ok) {
      console.warn("Database health check failed, but still attempting to fetch data");
    } else {
      const healthData = await healthResponse.json();
      console.log("Database health status:", healthData.status);
    }
  } catch (healthError) {
    console.warn("Could not check database health:", healthError);
  }
  
  while (retries < maxRetries) {
    try {
      const response = await fetch("/api/banks");
      if (!response.ok) {
        if (response.status === 503) {
          throw new Error("Database connection is currently unavailable. Please try again later.");
        }
        throw new Error(`Failed to fetch banks: ${response.status}`);
      }
      const data = await response.json();
      console.log(`Fetched Banks (${data.length} banks):`, data);
      return data;
    } catch (error) {
      retries++;
      console.error(`Error fetching banks (attempt ${retries}/${maxRetries}):`, error);
      
      if (retries >= maxRetries) throw error;
      const delay = Math.min(2000 * Math.pow(2, retries), 30000);
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error("Failed to fetch banks after multiple attempts");
};

// Fetch function for bank details with enhanced retry logic
const fetchBankDetails = async (bankId: string | undefined): Promise<BankDetailsType> => {
  if (!bankId) throw new Error("Bank ID is required");
  
  const maxRetries = 5;
  let retries = 0;
  
  // First check database health
  try {
    const healthResponse = await fetch("/api/health");
    if (!healthResponse.ok) {
      console.warn("Database health check failed before fetching bank details");
    }
  } catch (healthError) {
    console.warn("Could not check database health:", healthError);
  }
  
  while (retries < maxRetries) {
    try {
      const response = await fetch(`/api/banks/${bankId}/details`);
      if (!response.ok) {
        if (response.status === 503) {
          throw new Error("Database connection is currently unavailable. Please try again later.");
        }
        throw new Error(`Failed to fetch bank details: ${response.status}`);
      }
      const data = await response.json();
      console.log(`Successfully fetched details for bank ID ${bankId}:`, data);
      return data;
    } catch (error) {
      retries++;
      console.error(`Error fetching bank details (attempt ${retries}/${maxRetries}):`, error);
      
      if (retries >= maxRetries) throw error;
      const delay = Math.min(2000 * Math.pow(2, retries), 30000);
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error("Failed to fetch bank details after multiple attempts");
};

// Define available view types
type ViewType = 'statistics' | 'recommendations' | 'selectBank' | 'hierarchicalDiscounts' | 'consolidatedDiscounts' | 'discountHistory' | 'consolidatedWorkflow' | 'bankTrends' | 'medianTrends' | 'mlPredictions';

export default function BankingAdminPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // All hooks must be declared before any conditional returns
  const [selectedBankId, setSelectedBankId] = useState<string | undefined>(undefined);
  const [retryCount, setRetryCount] = useState(0);
  const [activeView, setActiveView] = useState<ViewType>('statistics');
  const [feeStatistics, setFeeStatistics] = useState<any[]>([]);
  const [hasCalculatedRecommendations, setHasCalculatedRecommendations] = useState<boolean>(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [priceRecommendations, setPriceRecommendations] = useState<any[]>([]);

  // Fetch list of banks with improved retry and caching
  const {
    data: banks,
    isLoading: loadingBanks,
    error: banksError,
    refetch: refetchBanks
  } = useQuery<Bank[]>({
    queryKey: ["banks", retryCount],
    queryFn: fetchBanks,
    retry: 5,
    retryDelay: (attemptIndex) => Math.min(2000 * Math.pow(2, attemptIndex), 30000),
    staleTime: 60000,
    gcTime: 300000
  });

  // Fetch bank details with improved retry and caching
  const {
    data: bankDetails,
    isLoading: loadingDetails,
    error: detailsError,
    refetch: refetchDetails
  } = useQuery<BankDetailsType>({
    queryKey: ["bankDetails", selectedBankId, retryCount],
    queryFn: () => fetchBankDetails(selectedBankId),
    enabled: !!selectedBankId,
    retry: 5,
    retryDelay: (attemptIndex) => Math.min(2000 * Math.pow(2, attemptIndex), 30000),
    staleTime: 120000,
    gcTime: 300000
  });

  // Define the statistics type
  interface StatisticItem {
    transaction_type_id: number;
    transaction_type_name: string;
    currency_code: string;
    minimum_fee: {
      mean: number | null;
      median: number | null;
      count: number;
    };
    maximum_fee: {
      mean: number | null;
      median: number | null;
      count: number;
    };
    percentage_fee: {
      mean: number | null;
      median: number | null;
      count: number;
    };
    flat_fee: {
      mean: number | null;
      median: number | null;
      count: number;
    };
    banks_count: number;
  }

  // Fetch transaction fee statistics for recommendations
  const { data: statistics, refetch: refetchStatistics } = useQuery<StatisticItem[]>({
    queryKey: ["transactionFeeStatistics"],
    queryFn: async () => {
      const response = await fetch("/api/transaction-fees/statistics");
      if (!response.ok) throw new Error("Failed to fetch transaction fee statistics");
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  });
  
  // Transform statistics data for price recommendations component when data is available
  useEffect(() => {
    if (statistics) {
      const transformedStats = statistics.map(stat => ({
        transaction_type_id: stat.transaction_type_id,
        transaction_type_name: stat.transaction_type_name,
        currency_code: stat.currency_code,
        min_min_fee: null,
        max_min_fee: null,
        avg_min_fee: stat.minimum_fee.mean,
        median_min_fee: stat.minimum_fee.median,
        min_max_fee: null,
        max_max_fee: null,
        avg_max_fee: stat.maximum_fee.mean,
        median_max_fee: stat.maximum_fee.median,
        min_percentage_fee: null,
        max_percentage_fee: null,
        avg_percentage_fee: stat.percentage_fee.mean,
        median_percentage_fee: stat.percentage_fee.median,
        min_flat_fee: null,
        max_flat_fee: null,
        avg_flat_fee: stat.flat_fee.mean,
        median_flat_fee: stat.flat_fee.median,
        banks_count: stat.banks_count
      }));
      setFeeStatistics(transformedStats);
    }
  }, [statistics]);

  // Function to handle email button click
  const generateCompetitivePDF = () => {
    // Simple PDF generation for competitive analysis
    const jsPDF = require('jspdf');
    const doc = new jsPDF();
    
    // Add POSB logo at the top right (inline base64 approach for simplicity)
    try {
      const logoPath = '../assets/posb-logo.png';
      // Logo will be loaded separately if needed
    } catch (error) {
      console.warn('Could not add logo:', error);
    }
    
    doc.setFontSize(16);
    doc.setTextColor(239, 125, 0); // POSB orange
    doc.text("Competitive Analysis Report", 20, 20);
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    if (bankDetails) {
      doc.text(`Bank: ${bankDetails.bankName}`, 20, 40);
      
      let yPosition = 50;
      doc.setFontSize(12);
      doc.text("Revenue Lines:", 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(8);
      bankDetails.transactionFees.forEach((fee, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.text(`${fee.transaction_type_name}`, 20, yPosition);
        doc.text(`Flat: ${fee.flat_fee || '-'}`, 80, yPosition);
        doc.text(`%: ${fee.percentage_fee != null ? Number(fee.percentage_fee).toFixed(2) + '%' : '-'}`, 120, yPosition);
        doc.text(`Min: ${fee.minimum_fee || '-'}`, 150, yPosition);
        doc.text(`Max: ${fee.maximum_fee || '-'}`, 180, yPosition);
        yPosition += 5;
      });
    }
    
    return doc;
  };

  // Enhanced error handling - Show if there are issues loading initial data
  if (!banks) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Render content based on active view and loading states
  const renderContent = () => {
    switch (activeView) {
      case 'recommendations':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalculatorIcon className="h-5 w-5" />
                Price Recommendations
                <div className="ml-auto flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => setEmailDialogOpen(true)}
                    disabled={!bankDetails}
                  >
                    <MailIcon className="h-4 w-4 mr-2" />
                    Email Report
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Competitive pricing analysis based on market data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorBoundary
                fallback={
                  <div className="text-center py-8">
                    <AlertCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 mb-4">Failed to load price recommendations</p>
                    <Button
                      onClick={() => window.location.reload()}
                      variant="outline"
                    >
                      <RefreshCwIcon className="h-4 w-4" />
                      Reload Page
                    </Button>
                  </div>
                }>
                <CompetitiveAnalysisRecommendations 
                  onRecommendationsGenerated={(recommendations) => {
                    setHasCalculatedRecommendations(true);
                    setPriceRecommendations(recommendations || []);
                  }}
                />

              </ErrorBoundary>
            </CardContent>
          </Card>
        );
      case 'hierarchicalDiscounts':
        return (
          <ErrorBoundary
            fallback={
              <div className="text-center py-8">
                <AlertCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-4">Failed to load hierarchical discount system</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  <RefreshCwIcon className="h-4 w-4" />
                  Reload Page
                </Button>
              </div>
            }>
            <HierarchicalProductSegmentationDiscountSystem 
              recommendations={priceRecommendations}
              onDiscountedRecommendations={(discounted) => {
                console.log('Discounted recommendations received:', discounted);
                // Handle discounted recommendations if needed
              }}
            />
          </ErrorBoundary>
        );
      case 'consolidatedDiscounts':
        return (
          <ErrorBoundary
            fallback={
              <div className="text-center py-8">
                <AlertCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-4">Failed to load consolidated discount pricing view</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  <RefreshCwIcon className="h-4 w-4" />
                  Reload Page
                </Button>
              </div>
            }>
            <ConsolidatedDiscountPricingView />
          </ErrorBoundary>
        );
      case 'discountHistory':
        return (
          <ErrorBoundary
            fallback={
              <div className="text-center py-8">
                <AlertCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-4">Failed to load discount history tracker</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  <RefreshCwIcon className="h-4 w-4" />
                  Reload Page
                </Button>
              </div>
            }>
            <DiscountHistoryTracker />
          </ErrorBoundary>
        );
      case 'consolidatedWorkflow':
        return (
          <ErrorBoundary
            fallback={
              <div className="text-center py-8">
                <AlertCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-4">Failed to load consolidated workflow</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  <RefreshCwIcon className="h-4 w-4" />
                  Reload Page
                </Button>
              </div>
            }>
            <ConsolidatedCompetitivePricingWorkflow />
          </ErrorBoundary>
        );
      case 'bankTrends':
        return (
          <ErrorBoundary
            fallback={
              <div className="text-center py-8">
                <AlertCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-4">Failed to load bank trends chart</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  <RefreshCwIcon className="h-4 w-4" />
                  Reload Page
                </Button>
              </div>
            }>
            <BankRevenueLineChart />
          </ErrorBoundary>
        );
      case 'medianTrends':
        return (
          <ErrorBoundary
            fallback={
              <div className="text-center py-8">
                <AlertCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-4">Failed to load market median trends chart</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  <RefreshCwIcon className="h-4 w-4" />
                  Reload Page
                </Button>
              </div>
            }>
            <MedianRevenueLineChart />
          </ErrorBoundary>
        );
      case 'selectBank':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BuildingIcon className="h-5 w-5" />
                Bank Selection 
              </CardTitle>
              <CardDescription>
                Select a bank to view detailed fee structure and competitive positioning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={selectedBankId} onValueChange={(value) => setSelectedBankId(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks?.map((bank) => (
                        <SelectItem key={bank.bankId} value={bank.bankId.toString()}>
                          {bank.bankName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedBankId && (
                    <Button
                      onClick={async () => {
                        // Invalidate all related queries with exact:false to match partial keys
                        await Promise.all([
                          queryClient.invalidateQueries({ 
                            queryKey: ["bankDetails"], 
                            exact: false, 
                            refetchType: 'all' 
                          }),
                          queryClient.invalidateQueries({ 
                            queryKey: ["transactionFeeStatistics"], 
                            refetchType: 'all' 
                          }),
                          queryClient.invalidateQueries({ 
                            queryKey: ["transactionFeeRates"], 
                            exact: false, 
                            refetchType: 'all' 
                          })
                        ]);
                        // Force refetch after invalidation
                        refetchDetails();
                        refetchStatistics();
                      }}
                      disabled={loadingDetails}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <RefreshCwIcon className={`h-4 w-4 ${loadingDetails ? 'animate-spin' : ''}`} />
                      {loadingDetails ? 'Loading...' : 'Refresh Data'}
                    </Button>
                  )}
                </div>
                
                {detailsError && (
                  <Alert variant="destructive">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>Error Loading Bank Details</AlertTitle>
                    <AlertDescription>
                      {detailsError instanceof Error ? detailsError.message : "Failed to load bank details"}
                    </AlertDescription>
                  </Alert>
                )}
                
                {selectedBankId && (
                  loadingDetails ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="ml-2">Loading bank details...</span>
                    </div>
                  ) : bankDetails ? (
                    <ErrorBoundary
                      fallback={
                        <div className="text-center py-8">
                          <AlertCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                          <p className="text-red-600 mb-4">Failed to display bank details</p>
                          <Button
                            onClick={() => window.location.reload()}
                            variant="outline"
                          >
                            <RefreshCwIcon className="h-4 w-4" />
                            Reload Page
                          </Button>
                        </div>
                      }>
                      <BankDetails bankDetails={bankDetails} />
                    </ErrorBoundary>
                  ) : null
                )}
              </div>
            </CardContent>
          </Card>
        );
      case 'mlPredictions':
        return (
          <MLPredictionPanel className="w-full" />
        );
      default:
        return <TransactionFeeStats />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto py-8 px-4">
        {/* Pricing Flow Stages */}
        <PricingFlowStages 
          currentStage="competitive"
          competitiveCompleted={hasCalculatedRecommendations}
          economicCompleted={false}
        />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <BuildingIcon className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-semibold">Banking Information Management</h1>
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

        {/* Database Error Alert - Show if there are issues with either bank list or details */}
        {(banksError || detailsError) && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Database Connection Issue</AlertTitle>
            <AlertDescription>
              {banksError ? `Banks: ${banksError instanceof Error ? banksError.message : "Unknown error"}` : ""}
              {banksError && detailsError ? " | " : ""}
              {detailsError ? `Details: ${detailsError instanceof Error ? detailsError.message : "Unknown error"}` : ""}
              <br />
              <Button
                onClick={() => {
                  setRetryCount(prev => prev + 1);
                  refetchBanks();
                  if (selectedBankId) refetchDetails();
                }}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                <RefreshCwIcon className="h-4 w-4 mr-2" />
                Retry Connection
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8 bg-gradient-to-r from-gray-50 via-slate-50 to-zinc-50 p-4 rounded-lg border border-gray-200 shadow-sm">
          <Button
            onClick={() => setActiveView('selectBank')}
            variant={activeView === 'selectBank' ? 'default' : 'outline'}
            className={`flex items-center gap-2 ${
              activeView === 'selectBank' 
                ? 'bg-slate-700 hover:bg-slate-800 text-white' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            disabled={loadingBanks || !banks || banks.length === 0}
          >
            <ScaleIcon className="h-4 w-4" />
            Bank Selection
          </Button>
          <Button
            onClick={() => setActiveView('statistics')}
            variant={activeView === 'statistics' ? 'default' : 'outline'}
            className={`flex items-center gap-2 ${
              activeView === 'statistics' 
                ? 'bg-slate-700 hover:bg-slate-800 text-white' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <BarChart3Icon className="h-4 w-4" />
            Market Prices
          </Button>
          <Button
            onClick={() => setActiveView('recommendations')}
            variant={activeView === 'recommendations' ? 'default' : 'outline'}
            className={`flex items-center gap-2 ${
              activeView === 'recommendations' 
                ? 'bg-slate-700 hover:bg-slate-800 text-white' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            disabled={!statistics || statistics.length === 0}
          >
            <CalculatorIcon className="h-4 w-4" />
            Price Recommendations
          </Button>
          <Button
            onClick={() => setActiveView('mlPredictions')}
            variant={activeView === 'mlPredictions' ? 'default' : 'outline'}
            className={`flex items-center gap-2 ${
              activeView === 'mlPredictions' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Target className="h-4 w-4" />
            AI Predictions
          </Button>
          <Button
            onClick={() => setActiveView('bankTrends')}
            variant={activeView === 'bankTrends' ? 'default' : 'outline'}
            className={`flex items-center gap-2 ${
              activeView === 'bankTrends' 
                ? 'bg-slate-700 hover:bg-slate-800 text-white' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <TrendingUpIcon className="h-4 w-4" />
            Bank Trends
          </Button>
          <Button
            onClick={() => setActiveView('medianTrends')}
            variant={activeView === 'medianTrends' ? 'default' : 'outline'}
            className={`flex items-center gap-2 ${
              activeView === 'medianTrends' 
                ? 'bg-slate-700 hover:bg-slate-800 text-white' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <BarChart3Icon className="h-4 w-4" />
            Market Trends
          </Button>
        </div>

        {/* Competitor Count Updater */}
        <div className="mb-6">
          <CompetitorCountUpdater
            onCountUpdate={(newCount) => {
              console.log("Competitor count updated:", newCount);
              // Refresh statistics when competitor counts change
              if (statistics) {
                refetchStatistics();
              }
            }}
          />
        </div>

        {/* Main content area */}
        {renderContent()}

        {/* Email Sender Dialog */}
        <EmailSender
          isOpen={emailDialogOpen}
          onOpenChange={setEmailDialogOpen}
          moduleType="Banking Information"
          reportTitle="Banking Analysis Report"
          generatePDF={generateCompetitivePDF}
        />
      </div>
    </div>
  );
}
