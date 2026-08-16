import { db, usersTable, sellerProfilesTable, type User, type InsertUser, type InsertSellerProfile, type SellerProfile } from "@workspace/db";
import { eq } from "drizzle-orm";
import { usersStore, sellerProfilesStore, type UserAccount, type MockSellerProfile } from "../data/mockUsers.js";

export class UserRepository {
  private isDbConnected(): boolean {
    return Boolean(process.env.DATABASE_URL);
  }

  async findByPhone(phone: string): Promise<UserAccount | null> {
    const cleanPhone = phone.trim();
    if (this.isDbConnected()) {
      try {
        const rows = await db.select().from(usersTable).where(eq(usersTable.phone, cleanPhone));
        if (rows.length > 0) {
          const row = rows[0];
          return {
            id: row.id,
            name: row.name,
            phone: row.phone,
            email: row.email || undefined,
            passwordHash: row.passwordHash,
            district: row.district,
            city: row.city,
            state: row.state,
            landHolding: Number(row.landHolding),
            primaryCrops: row.primaryCrops,
            role: row.role as any,
            isVerified: row.isVerified,
            createdAt: row.createdAt.toISOString(),
          };
        }
        return null;
      } catch (e) {
        console.error("DB error in findByPhone, falling back:", e);
      }
    }

    const user = usersStore.find(u => u.phone === cleanPhone || u.email?.toLowerCase() === cleanPhone.toLowerCase());
    return user ? { ...user } : null;
  }

  async findById(id: string): Promise<UserAccount | null> {
    if (this.isDbConnected()) {
      try {
        const rows = await db.select().from(usersTable).where(eq(usersTable.id, id));
        if (rows.length > 0) {
          const row = rows[0];
          return {
            id: row.id,
            name: row.name,
            phone: row.phone,
            email: row.email || undefined,
            passwordHash: row.passwordHash,
            district: row.district,
            city: row.city,
            state: row.state,
            landHolding: Number(row.landHolding),
            primaryCrops: row.primaryCrops,
            role: row.role as any,
            isVerified: row.isVerified,
            createdAt: row.createdAt.toISOString(),
          };
        }
        return null;
      } catch (e) {
        console.error("DB error in findById, falling back:", e);
      }
    }

    const user = usersStore.find(u => u.id === id);
    return user ? { ...user } : null;
  }

  async create(user: UserAccount): Promise<UserAccount> {
    if (this.isDbConnected()) {
      try {
        await db.insert(usersTable).values({
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          passwordHash: user.passwordHash,
          district: user.district,
          city: user.city,
          state: user.state,
          landHolding: String(user.landHolding),
          primaryCrops: user.primaryCrops,
          role: user.role,
          isVerified: user.isVerified,
        });
      } catch (e) {
        console.error("DB error in create user, saving in memory:", e);
      }
    }

    usersStore.push(user);
    return user;
  }

  async update(id: string, updates: Partial<UserAccount>): Promise<UserAccount | null> {
    if (this.isDbConnected()) {
      try {
        const updateData: Record<string, any> = {};
        if (updates.name) updateData.name = updates.name;
        if (updates.email !== undefined) updateData.email = updates.email;
        if (updates.district) updateData.district = updates.district;
        if (updates.city) updateData.city = updates.city;
        if (updates.landHolding !== undefined) updateData.landHolding = String(updates.landHolding);
        if (updates.primaryCrops) updateData.primaryCrops = updates.primaryCrops;
        if (updates.passwordHash) updateData.passwordHash = updates.passwordHash;

        await db.update(usersTable).set(updateData).where(eq(usersTable.id, id));
        
        // Fetch and return the updated user
        return await this.findById(id);
      } catch (e) {
        console.error("DB error in update user:", e);
      }
    }

    const idx = usersStore.findIndex(u => u.id === id);
    if (idx !== -1) {
      usersStore[idx] = { ...usersStore[idx], ...updates };
      return usersStore[idx];
    }
    return null;
  }
}

export const userRepository = new UserRepository();
