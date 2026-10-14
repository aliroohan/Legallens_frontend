/* ============================================================
   LegalLens Shared Types
   Mirrors backend constants.ts and model shapes
   ============================================================ */

// ── User / Auth ──────────────────────────────────────────────
export type UserRole = 'super_admin' | 'org_admin' | 'lawyer';
export type BarIdStatus = 'pending' | 'verified' | 'rejected';

export interface User {
  id: string;
  userId?: string;
  name: string;
  email: string;
  role: UserRole;
  barIdStatus: BarIdStatus;
  barId?: string;
  organizationId?: string;
  orgId?: string;
  firmId?: string;
  organizationName?: string;
  isIndependent?: boolean;
  createdAt?: string;
}

// ── Auth API Payloads ────────────────────────────────────────
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterIndependentPayload {
  name: string;
  email: string;
  password: string;
  barId: string;
}

export interface RegisterOrgAdminPayload {
  name: string;
  email: string;
  password: string;
  barId: string;
  organizationName: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}

// ── Cases ────────────────────────────────────────────────────
export type CaseStatus = 'Open' | 'Closed';
export type MatterType =
  | 'Litigation'
  | 'Insurance Claim'
  | 'Criminal Defense'
  | 'IP Dispute'
  | 'Other';

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  clientName: string;
  opposingParty?: string;
  matterType: MatterType;
  description?: string;
  status: CaseStatus;
  fileCount: number;
  lawyerId: string;
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCasePayload {
  title: string;
  clientName: string;
  opposingParty?: string;
  matterType: MatterType;
  description?: string;
}

export interface UpdateCasePayload extends Partial<CreateCasePayload> {
  status?: CaseStatus;
}

export interface CaseFilters {
  status?: CaseStatus;
  matterType?: MatterType;
  page?: number;
  limit?: number;
  sort?: string;
}

// ── Files / Evidence ─────────────────────────────────────────
export type FileProcessingStatus = 'Pending' | 'Processing' | 'Completed' | 'Failed' | 'N/A';
export type FileCategory = 'image' | 'document' | 'video' | 'audio';

export interface EvidenceFile {
  id: string;
  caseId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  fileCategory: FileCategory;
  size: number;
  sha256Hash: string;
  processingStatus: FileProcessingStatus;
  uploadedBy: string;
  createdAt: string;
  deletedAt?: string;
}

// ── Forensics ────────────────────────────────────────────────
export type AuthenticityLabel = 'Authentic' | 'Suspicious' | 'Highly Manipulated';

export interface ModuleResult {
  score: number | null;
  isApplicable: boolean;
  explanation: string;
  annotatedImageUrl?: string;
}

export interface ForensicResult {
  id: string;
  fileId: string;
  caseId: string;
  exif: ModuleResult;
  ela: ModuleResult;
  copyMove: ModuleResult;
  noise: ModuleResult;
  lighting: ModuleResult;
  deepfake: ModuleResult;
  fusionScore: number;
  authenticityLabel: AuthenticityLabel;
  analysisVersion: string;
  completedAt: string;
}

// ── Pagination ───────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  items?: T[];
  cases?: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── API Response Envelope ─────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ApiError {
  success: false;
  code: string;
  message: string;
}
