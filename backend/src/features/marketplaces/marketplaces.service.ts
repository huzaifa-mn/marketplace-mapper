// marketplaces.service.ts
import { parseTemplateAttributes } from "../../core/helpers/csv-parse";
import * as repo from "./marketplaces.repository";

export async function getTemplates(page: number) {
  return repo.findAllWithPagination(page);
}

export async function getTemplateById(id: number) {
  return repo.findByIdWithAttributes(id);
}

export async function createTemplate(
  name: string,
  file: Express.Multer.File,
) {
  const attributeNames = await parseTemplateAttributes(file.path);

  return repo.createTemplateWithAttributes({
    name,
    originalPath: file.path,
    attributeNames,
  });
}
