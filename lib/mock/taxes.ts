import { TaxLevy } from "../types"

export const taxesAndLevies: TaxLevy[] = [
  { id: "tax-imtt-usd", name: "IMTT (USD)", sector: "banking", rate: 2, type: "percentage", appliesTo: "Electronic Transfers" },
  { id: "tax-imtt-zig", name: "IMTT (ZiG)", sector: "banking", rate: 1.5, type: "percentage", appliesTo: "Electronic Transfers" },
  { id: "levy-potraz", name: "POTRAZ USF Levy", sector: "telecom", rate: 1.5, type: "percentage", appliesTo: "Gross Turnover" },
  { id: "tax-vat", name: "Value Added Tax (VAT)", sector: "general", rate: 15, type: "percentage", appliesTo: "Goods and Services" },
  { id: "levy-aids", name: "AIDS Levy", sector: "general", rate: 3, type: "percentage", appliesTo: "Income Tax" },
  { id: "lic-radio", name: "Radio License", sector: "media", rate: 23, type: "fixed", appliesTo: "per quarter" },
  { id: "lic-vehicle", name: "Vehicle License", sector: "mobility", rate: 20, type: "fixed", appliesTo: "per term" },
]
