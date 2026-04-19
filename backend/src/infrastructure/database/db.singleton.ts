import Prisma from '@prisma/client';
const { PrismaClient } = Prisma;

/**
 * DatabaseManager implements the Singleton pattern to ensure only one 
 * PrismaClient instance is used throughout the application.
 * Simplified for Prisma 6 and Node.js v20 compatibility.
 */
class DatabaseManager {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new PrismaClient();
    }
    return DatabaseManager.instance;
  }
}

export const db = DatabaseManager.getInstance();
