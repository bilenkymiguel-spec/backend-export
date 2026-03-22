import { Router } from "express";
import { addAuditLog, pages } from "../data/mockDb";
import type { PageBlock, ManagedPage, PageVersion } from "../types/system";

const router = Router();

router.get("/", (_req, res) => {
  return res.json(pages);
});

router.get("/:slug", (req, res) => {
  const page = pages.find((item) => item.slug === req.params.slug);

  if (!page) {
    return res.status(404).json({ message: "Página não encontrada." });
  }

  return res.json(page);
});

router.post("/:slug/draft-block", (req, res) => {
  const page = pages.find((item) => item.slug === req.params.slug);

  if (!page) {
    return res.status(404).json({ message: "Página não encontrada." });
  }

  const draft = page.versions.find((version) => version.id === page.draftVersionId);

  if (!draft) {
    return res.status(400).json({ message: "Versão draft não encontrada." });
  }

  const {
    actorUserId,
    actorName,
    block,
    changeSummary,
  }: {
    actorUserId: number;
    actorName: string;
    block: Omit<PageBlock, "id">;
    changeSummary?: string;
  } = req.body;

  if (!block?.type) {
    return res.status(400).json({ message: "O bloco precisa ter o campo 'type'." });
  }

  const newBlock: PageBlock = {
    id: `block-${Date.now()}`,
    type: block.type,
    title: block.title,
    subtitle: block.subtitle,
    content: block.content,
    imageUrl: block.imageUrl,
    buttonLabel: block.buttonLabel,
    buttonHref: block.buttonHref,
    items: block.items,
  };

  draft.blocks.push(newBlock);
  draft.changeSummary = changeSummary || draft.changeSummary;

  addAuditLog({
    action: "page_draft_updated",
    actorUserId,
    actorName,
    targetType: "page",
    targetId: page.slug,
    description: `Draft da página ${page.slug} atualizado.`,
  });

  return res.json(draft);
});

router.post("/:slug/publish", (req, res) => {
  const page = pages.find((item) => item.slug === req.params.slug);

  if (!page) {
    return res.status(404).json({ message: "Página não encontrada." });
  }

  const draft = page.versions.find((version) => version.id === page.draftVersionId);
  const active = page.versions.find((version) => version.id === page.activeVersionId);

  if (!draft) {
    return res.status(400).json({ message: "Draft não encontrado." });
  }

  if (active) active.status = "archived";
  draft.status = "active";
  page.activeVersionId = draft.id;

  addAuditLog({
    action: "page_published",
    actorUserId: req.body.actorUserId,
    actorName: req.body.actorName,
    targetType: "page",
    targetId: page.slug,
    description: `Página ${page.slug} publicada.`,
  });

  return res.json(page);
});

router.post("/:slug/rollback", (req, res) => {
  const page = pages.find((item) => item.slug === req.params.slug);

  if (!page) {
    return res.status(404).json({ message: "Página não encontrada." });
  }

  const archivedVersions = page.versions
    .filter((version) => version.status === "archived")
    .sort((a, b) => b.versionNumber - a.versionNumber);

  const targetVersion = archivedVersions[0];

  if (!targetVersion) {
    return res.status(400).json({ message: "Nenhuma versão para rollback." });
  }

  const currentActive = page.versions.find((version) => version.id === page.activeVersionId);

  if (currentActive) {
    currentActive.status = "archived";
  }

  targetVersion.status = "active";
  page.activeVersionId = targetVersion.id;

  addAuditLog({
    action: "page_rollback",
    actorUserId: req.body.actorUserId,
    actorName: req.body.actorName,
    targetType: "page",
    targetId: page.slug,
    description: `Rollback realizado na página ${page.slug}.`,
  });

  return res.json(page);
});

export default router;