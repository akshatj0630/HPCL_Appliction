export type LeadStatus = 'new' | 'in_review' | 'accepted' | 'rejected' | 'converted';

export interface Lead {
  _id: string;
  lead_id?: string;
  Captured_At?: string;
  Closing_Date?: string;
  Combined_Text?: string;
  Company_Canonical?: string;
  Company_Name?: string;
  Contact_Email?: string;
  Contact_Phone?: string;
  Corrigendum?: string;
  Duplicate_Sources?: unknown;
  Full_Reference?: string;
  HPCL_Keyword_Match?: unknown;
  HPCL_Products?: string;
  Location_Clues?: string;
  Opening_Date?: string;
  Organization_Chain?: string;
  Organization_Name?: string;
  Post_Date?: string;
  Provenance?: string;
  Serial_Number?: number;
  Signal_Type?: string;
  Source?: string;
  Source_Governance?: string;
  Source_Trust?: unknown;
  Summary?: string;
  Title?: string;
  URL?: string;
  e_Published_Date?: string;
  status?: LeadStatus;
  assigned_officer?: string;
  confidence_score?: number;
  urgency?: 'high' | 'medium' | 'low';
}

export interface Company {
  _id: string;
  canonical_name?: string;
  first_seen?: string;
  last_seen?: string;
  hpcl_products?: string[];
  is_government?: boolean;
  total_signals?: number;
  variants?: string[];
  emails?: string[];
  phones?: string[];
  locations?: string[];
  sources?: Record<string, number>;
}
