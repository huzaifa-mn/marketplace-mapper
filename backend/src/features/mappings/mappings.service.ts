import { CreateMappingInput } from "../../shared/interfaces";
import * as repo from "./mappings.repository";

/**
 * Paginated list of mappings for the "Saved mappings" list page.
 */
export async function getMappings(page: number) {
  return repo.findAllWithPagination(page);
}

/**
 * Get a single mapping with marketplace template, attributes, seller file, and items.
 */
export async function getMappingById(id: number) {
  return repo.findByIdWithRelations(id);
}

/**
 * Create a mapping with items (mapping seller columns -> marketplace attributes).
 * Assumes Zod (or similar) already validated the input shape at the controller layer.
 */
export async function createMapping(input: CreateMappingInput) {
  return repo.createMappingWithItems(input);
}
