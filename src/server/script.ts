import { eq } from 'drizzle-orm';
import { db } from './db';
import { properties } from './db/schema';

async function updatePropertyTypes() {
  try {
    await db.transaction(async (trx) => {
      await trx.update(properties)
        .set({ propertyType: 'Apartment' })
        .where(eq(properties.propertyType, 'Studio'));

      await trx.update(properties)
        .set({ propertyType: 'Tiny House' })
        .where(eq(properties.propertyType, 'Tiny house'));

      await trx.update(properties)
        .set({ propertyType: 'Hotel' })
        .where(eq(properties.propertyType, 'Hotels'));

      await trx.update(properties)
        .set({ propertyType: 'House' })
        .where(eq(properties.propertyType, 'house'));

      await trx.update(properties)
        .set({ propertyType: 'House' })
        .where(eq(properties.propertyType, 'Home'));

      await trx.update(properties)
        .set({ propertyType: 'Guest Suite' })
        .where(eq(properties.propertyType, 'Guest suite'));

      await trx.update(properties)
        .set({ propertyType: 'Camper/RV' })
        .where(eq(properties.propertyType, 'Camper/rv'));

      await trx.update(properties)
        .set({ propertyType: 'Bed & Breakfast' })
        .where(eq(properties.propertyType, 'Bed & breakfast'));

      await trx.update(properties)
        .set({ propertyType: 'Other' })
        .where(eq(properties.propertyType, 'Alternative'));

      console.log('Property types updated successfully.');
    });
  } catch (error) {
    console.error('Error updating property types:', error);
  }
}

await updatePropertyTypes();
