// marketplaces.controller.ts
import { Request, Response, NextFunction } from "express";
import { Messages } from "../../core/constants/messages";
import * as service from "./marketplaces.service";

export async function getTemplates(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const pageParam = req.query.page;
    const page =
      typeof pageParam === "string" ? Math.max(1, Number(pageParam) || 1) : 1;

    const result = await service.getTemplates(page);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getTemplateById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number(req.params.id);
    const template = await service.getTemplateById(id);
    res.json(template);
  } catch (err) {
    next(err);
  }
}

export async function createTemplate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const file = req.file;
    const { name } = req.body as { name: string };

    if (!file) {
      return res.status(400).json({ message: Messages.VALIDATION.FILE_REQUIRED });
    }

    const created = await service.createTemplate(name, file);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}
