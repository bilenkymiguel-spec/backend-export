// backend/src/data/mockDb.ts

import type {
  AdminUser,
  AuditLog,
  GovernanceDecision,
  ManagedPage,
  ProductRecord,
} from "../types/system";

export const adminUsers: AdminUser[] = [
  {
    id: 1,
    name: "Miguel Machado Bilenky",
    email: "admin@doutrolado.com",
    role: "super_admin",
    permissions: [
      "products.read",
      "products.write",
      "products.delete",
      "orders.read",
      "orders.write",
      "users.read",
      "users.write",
      "pages.read",
      "pages.write",
      "governance.read",
      "governance.write",
      "audit.read",
      "settings.read",
      "settings.write",
    ],
    status: "active",
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Administrador Secundário",
    email: "manager@doutrolado.com",
    role: "admin",
    permissions: [
      "products.read",
      "products.write",
      "orders.read",
      "orders.write",
      "pages.read",
      "pages.write",
      "governance.read",
      "audit.read",
    ],
    status: "active",
    createdAt: new Date().toISOString(),
  },
];

export const auditLogs: AuditLog[] = [
  {
    id: 1,
    actorId: 1,
    actorEmail: "admin@doutrolado.com",
    action: "LOGIN",
    targetType: "system",
    targetId: "auth",
    description: "Login realizado com sucesso no painel administrativo.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    actorId: 1,
    actorEmail: "admin@doutrolado.com",
    action: "CREATE",
    targetType: "product",
    targetId: 101,
    description: "Produto premium criado no catálogo.",
    metadata: {
      sku: "DOL-LEATHER-001",
    },
    createdAt: new Date().toISOString(),
  },
];

export const governanceDecisions: GovernanceDecision[] = [
  {
    id: 1,
    title: "Aprovação de nova coleção premium",
    description:
      "Avaliação e aprovação da entrada de novos produtos de couro no catálogo internacional.",
    requestedBy: 1,
    reviewers: [1, 2],
    status: "approved",
    notes: "Coleção alinhada com a estratégia premium internacional.",
    createdAt: new Date().toISOString(),
    decidedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Revisão de política de curadoria",
    description:
      "Definição de critérios para entrada de cerâmicas e itens de decoração.",
    requestedBy: 2,
    reviewers: [1],
    status: "under_review",
    createdAt: new Date().toISOString(),
  },
];

export const managedPages: ManagedPage[] = [
  {
    id: 1,
    title: "Home",
    slug: "/",
    status: "published",
    currentVersionId: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    versions: [
      {
        id: 1,
        title: "Home v1",
        slug: "/",
        content: "<section>Versão inicial da homepage</section>",
        createdBy: 1,
        createdAt: new Date().toISOString(),
        changeSummary: "Versão inicial",
      },
      {
        id: 2,
        title: "Home v2",
        slug: "/",
        content: "<section>Versão atual publicada da homepage</section>",
        createdBy: 1,
        createdAt: new Date().toISOString(),
        changeSummary: "Refino visual premium",
      },
    ],
  },
  {
    id: 2,
    title: "Sobre",
    slug: "/about",
    status: "draft",
    currentVersionId: 3,
    createdAt: new Date().toISOString(),
    versions: [
      {
        id: 3,
        title: "Sobre v1",
        slug: "/about",
        content: "<section>Página institucional em edição</section>",
        createdBy: 2,
        createdAt: new Date().toISOString(),
        changeSummary: "Primeiro rascunho",
      },
    ],
  },
];

export const productRecords: ProductRecord[] = [
  {
    id: 101,
    sku: "DOL-LEATHER-001",
    name: "Bolsa de Couro Premium",
    description: "Bolsa de couro legítimo com acabamento refinado.",
    category: "accessories",
    price: 1290,
    currency: "BRL",
    stock: 12,
    exportScore: 95,
    status: "active",
    images: ["/products/leather-bag-1.jpg"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 102,
    sku: "DOL-CERAMIC-001",
    name: "Conjunto de Cerâmica Brasileira",
    description: "Peça autoral em cerâmica com estética sofisticada.",
    category: "ceramics",
    price: 890,
    currency: "BRL",
    stock: 8,
    exportScore: 92,
    status: "active",
    images: ["/products/ceramic-set-1.jpg"],
    createdAt: new Date().toISOString(),
  },
];

export const mockDb = {
  adminUsers,
  auditLogs,
  governanceDecisions,
  managedPages,
  productRecords,
};

export default mockDb;