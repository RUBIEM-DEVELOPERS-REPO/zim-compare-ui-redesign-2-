"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface BankDetailsProps {
  bankDetails: {
    bankId: number;
    bankName: string;
    website: string;
    contactEmail: string;
    transactionFees: Array<{
      fee_id: number;
      transaction_type_name: string;
      currency_code: string;
      minimum_fee: number | null;
      maximum_fee: number | null;
      percentage_fee: number | null;
      flat_fee?: number | null;
      effective_date?: string;
    }>;
    loanRates: Array<{
      loan_rate_id: number;
      loan_type_name: string;
      currency_code: string;
      min_interest_rate: number;
      max_interest_rate: number;
      establishment_fee_min: number;
      establishment_fee_max: number;
      effective_date?: string;
    }>;
    cardFees: Array<{
      card_fee_id: number;
      card_type_name: string;
      currency_code: string;
      issuance_fee: number;
      replacement_fee: number;
      annual_maintenance_fee: number;
      effective_date?: string;
    }>;
  };
}

export function BankDetails({ bankDetails }: BankDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Bank Info */}
      <Card>
        <CardHeader>
          <CardTitle>{bankDetails.bankName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><span className="font-semibold">Website:</span> {bankDetails.website}</p>
          <p><span className="font-semibold">Contact:</span> {bankDetails.contactEmail}</p>
        </CardContent>
      </Card>

      {/* Transaction Fees */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Fees</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction Type</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Flat Fee</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Min Fee</TableHead>
                <TableHead>Max Fee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bankDetails.transactionFees.map((fee) => (
                <TableRow key={fee.fee_id}>
                  <TableCell>{fee.transaction_type_name}</TableCell>
                  <TableCell>{fee.currency_code}</TableCell>
                  <TableCell>{fee.flat_fee || '-'}</TableCell>
                  <TableCell>{fee.percentage_fee ? `${fee.percentage_fee}%` : '-'}</TableCell>
                  <TableCell>{fee.minimum_fee || '-'}</TableCell>
                  <TableCell>{fee.maximum_fee || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Loan Rates */}
      {bankDetails.loanRates && bankDetails.loanRates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Loan Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loan Type</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Min Rate</TableHead>
                  <TableHead>Max Rate</TableHead>
                  <TableHead>Establishment Fee (Min-Max)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bankDetails.loanRates.map((rate) => (
                  <TableRow key={rate.loan_rate_id}>
                    <TableCell>{rate.loan_type_name}</TableCell>
                    <TableCell>{rate.currency_code}</TableCell>
                    <TableCell>{rate.min_interest_rate}%</TableCell>
                    <TableCell>{rate.max_interest_rate}%</TableCell>
                    <TableCell>{rate.establishment_fee_min} - {rate.establishment_fee_max}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Card Fees */}
      {bankDetails.cardFees && bankDetails.cardFees.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Card Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Card Type</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Issuance Fee</TableHead>
                  <TableHead>Replacement Fee</TableHead>
                  <TableHead>Annual Maintenance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bankDetails.cardFees.map((fee) => (
                  <TableRow key={fee.card_fee_id}>
                    <TableCell>{fee.card_type_name}</TableCell>
                    <TableCell>{fee.currency_code}</TableCell>
                    <TableCell>{fee.issuance_fee}</TableCell>
                    <TableCell>{fee.replacement_fee}</TableCell>
                    <TableCell>{fee.annual_maintenance_fee}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
