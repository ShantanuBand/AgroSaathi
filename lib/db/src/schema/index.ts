import { pgTable, text, serial, numeric, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Table for Authentication
export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  email: text("email"),
  passwordHash: text("password_hash").notNull(),
  district: text("district").notNull(),
  city: text("city").notNull(),
  state: text("state").default("Maharashtra").notNull(),
  landHolding: numeric("land_holding").default("4.5").notNull(),
  primaryCrops: jsonb("primary_crops").$type<string[]>().default(["Soybean", "Tur", "Wheat"]).notNull(),
  role: text("role").$type<"farmer" | "trader" | "admin">().default("farmer").notNull(),
  isVerified: boolean("is_verified").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(usersTable);
export type InsertUser = typeof usersTable.$inferInsert;
export type User = typeof usersTable.$inferSelect;

// Districts Table
export const districtsTable = pgTable("districts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  state: text("state").notNull(),
  division: text("division").notNull(),
  latitude: numeric("latitude").notNull(),
  longitude: numeric("longitude").notNull(),
});

export const insertDistrictSchema = createInsertSchema(districtsTable);
export type InsertDistrict = typeof districtsTable.$inferInsert;
export type District = typeof districtsTable.$inferSelect;

// Cities / Talukas Table
export const citiesTable = pgTable("cities", {
  id: text("id").primaryKey(),
  districtId: text("district_id").notNull(),
  districtName: text("district_name").notNull(),
  name: text("name").notNull(),
  nameHindi: text("name_hindi"),
  pincode: text("pincode"),
  latitude: numeric("latitude").notNull(),
  longitude: numeric("longitude").notNull(),
  isMandiCenter: boolean("is_mandi_center").default(true).notNull(),
});

export const insertCitySchema = createInsertSchema(citiesTable);
export type InsertCity = typeof citiesTable.$inferInsert;
export type City = typeof citiesTable.$inferSelect;

// Farmer Profile Table
export const farmerProfilesTable = pgTable("farmer_profiles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  village: text("village").notNull(),
  district: text("district").notNull(),
  state: text("state").notNull(),
  landHolding: numeric("land_holding").notNull(),
  landUnit: text("land_unit").default("Acres").notNull(),
  primaryCrops: jsonb("primary_crops").$type<string[]>().notNull(),
  irrigationType: text("irrigation_type").notNull(),
  soilType: text("soil_type").notNull(),
  kccHolder: boolean("kcc_holder").default(false).notNull(),
  pmFasalBimaEnrolled: boolean("pm_fasal_bima_enrolled").default(false).notNull(),
  avatarUrl: text("avatar_url"),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const insertFarmerProfileSchema = createInsertSchema(farmerProfilesTable);
export type InsertFarmerProfile = typeof farmerProfilesTable.$inferInsert;
export type FarmerProfile = typeof farmerProfilesTable.$inferSelect;

// Crop Prices Table
export const cropPricesTable = pgTable("crop_prices", {
  id: text("id").primaryKey(),
  cropName: text("crop_name").notNull(),
  cropNameHindi: text("crop_name_hindi").notNull(),
  category: text("category").notNull(),
  currentPrice: numeric("current_price").notNull(),
  minPrice: numeric("min_price").notNull(),
  maxPrice: numeric("max_price").notNull(),
  unit: text("unit").notNull(),
  change: numeric("change").notNull(),
  changePercent: numeric("change_percent").notNull(),
  market: text("market").notNull(),
  state: text("state").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCropPriceSchema = createInsertSchema(cropPricesTable);
export type InsertCropPrice = typeof cropPricesTable.$inferInsert;
export type CropPrice = typeof cropPricesTable.$inferSelect;

// Marketplace Listings Table
export const marketplaceListingsTable = pgTable("marketplace_listings", {
  id: text("id").primaryKey(),
  sellerId: text("seller_id").references(() => usersTable.id, { onDelete: "cascade" }),
  type: text("type").$type<"sell" | "buy">().notNull(),
  cropName: text("crop_name").notNull(),
  category: text("category").notNull(),
  quantity: numeric("quantity").notNull(),
  unit: text("unit").notNull(),
  pricePerUnit: numeric("price_per_unit").notNull(),
  totalPrice: numeric("total_price").notNull(),
  sellerName: text("seller_name").notNull(),
  sellerPhone: text("seller_phone").notNull(),
  location: text("location").notNull(),
  state: text("state").notNull(),
  description: text("description").notNull(),
  quality: text("quality").$type<"A" | "B" | "C">().notNull(),
  isOrganic: boolean("is_organic").default(false).notNull(),
  isNegotiable: boolean("is_negotiable").default(true).notNull(),
  imageUrl: text("image_url"),
  postedAt: timestamp("posted_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true).notNull(),
  viewCount: integer("view_count").default(0).notNull(),
});

export const insertMarketplaceListingSchema = createInsertSchema(marketplaceListingsTable);
export type InsertMarketplaceListing = typeof marketplaceListingsTable.$inferInsert;
export type MarketplaceListing = typeof marketplaceListingsTable.$inferSelect;

// Government Schemes Table
export const governmentSchemesTable = pgTable("government_schemes", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description").notNull(),
  category: text("category").notNull(),
  ministry: text("ministry").notNull(),
  eligibility: jsonb("eligibility").$type<string[]>().notNull(),
  benefits: jsonb("benefits").$type<string[]>().notNull(),
  documents: jsonb("documents").$type<string[]>().notNull(),
  applicationDeadline: timestamp("application_deadline"),
  applicationUrl: text("application_url"),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  states: jsonb("states").$type<string[]>().notNull(),
  maxBenefitAmount: numeric("max_benefit_amount"),
  beneficiaryCount: integer("beneficiary_count"),
});

export const insertGovernmentSchemeSchema = createInsertSchema(governmentSchemesTable);
export type InsertGovernmentScheme = typeof governmentSchemesTable.$inferInsert;
export type GovernmentScheme = typeof governmentSchemesTable.$inferSelect;

// Notifications Table
export const notificationsTable = pgTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => usersTable.id, { onDelete: "cascade" }),
  type: text("type").$type<"price_alert" | "weather_alert" | "scheme_update" | "marketplace" | "system" | "advisory">().notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  actionUrl: text("action_url"),
  iconType: text("icon_type").notNull(),
});

export const insertNotificationSchema = createInsertSchema(notificationsTable);
export type InsertNotification = typeof notificationsTable.$inferInsert;
export type Notification = typeof notificationsTable.$inferSelect;

// User Favorite APMCs Table
export const userFavoritesTable = pgTable("user_favorites", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  apmcId: text("apmc_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserFavoriteSchema = createInsertSchema(userFavoritesTable);
export type InsertUserFavorite = typeof userFavoritesTable.$inferInsert;
export type UserFavorite = typeof userFavoritesTable.$inferSelect;

// Refresh Tokens Table
export const refreshTokensTable = pgTable("refresh_tokens", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  hashedToken: text("hashed_token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  isRevoked: boolean("is_revoked").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRefreshTokenSchema = createInsertSchema(refreshTokensTable);
export type InsertRefreshToken = typeof refreshTokensTable.$inferInsert;
export type RefreshToken = typeof refreshTokensTable.$inferSelect;

// Password Resets Table
export const passwordResetsTable = pgTable("password_resets", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  isUsed: boolean("is_used").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPasswordResetSchema = createInsertSchema(passwordResetsTable);
export type InsertPasswordReset = typeof passwordResetsTable.$inferInsert;
export type PasswordReset = typeof passwordResetsTable.$inferSelect;
