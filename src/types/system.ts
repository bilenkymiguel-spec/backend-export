// backend/src/types/system.ts

export type AdminRole = "super_admin" | "admin" | "editor" | "auditor";

export type AdminPermission =
  | "products.read"
  | "products.write"
  | "products.delete"
  | "orders.read"
  | "orders.write"
  | "users.read"
  | "users.write"
  | "pages.read"
  | "pages.write"
  | "governance.read"
  | "governance.write"
  | "audit.read"
  | "settings.read"
  | "settings.write";

export type AdminUserStatus = "active" | "inactive" | "suspended";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: AdminRole;
  permissions: AdminPermission[];
  status: AdminUserStatus;
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "APPROVE"
  | "REJECT"
  | "PUBLISH"
  | "UNPUBLISH";

export interface AuditLog {
  id: number;
  actorId: number;
  actorEmail: string;
  action: AuditAction;
  targetType: "product" | "order" | "page" | "user" | "governance" | "system";
  targetId: string | number;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export type GovernanceDecisionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "under_review";

export interface GovernanceDecision {
  id: number;
  title: string;
  description: string;
  requestedBy: number;
  reviewers: number[];
  status: GovernanceDecisionStatus;
  notes?: string;
  createdAt: string;
  decidedAt?: string;
}

export type ManagedPageStatus = "draft" | "published" | "archived";

export interface ManagedPageVersion {
  id: number;
  title: string;
  slug: string;
  content: string;
  createdBy: number;
  createdAt: string;
  changeSummary?: string;
}

export interface ManagedPage {
  id: number;
  title: string;
  slug: string;
  status: ManagedPageStatus;
  currentVersionId?: number;
  versions: ManagedPageVersion[];
  createdAt: string;
  updatedAt?: string;
}

export type ProductCategory =
  | "fashion"
  | "accessories"
  | "home"
  | "ceramics"
  | "decor"
  | "kitchen"
  | "other";

export type ProductStatus = "draft" | "active" | "inactive" | "archived";

export interface ProductRecord {
  id: number;
  sku: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  currency: string;
  stock: number;
  exportScore: number;
  status: ProductStatus;
  images: string[];
  createdAt: string;
  updatedAt?: string;
}