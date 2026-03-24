import { generateInputSchema, type GenerateInput, type GenerateOutput } from "@shared/schema";

export interface IStorage {
  // Empty storage interface since we use Dexie.js on the client for this specific app
}

export class MemStorage implements IStorage {
  constructor() {}
}

export const storage = new MemStorage();
