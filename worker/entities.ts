/**
 * Veloce Fleet Management Entities
 */
import { IndexedEntity } from "./core-utils";
import type { Car, Expense, Document, Photo } from "@shared/types";
import { MOCK_CARS } from "@shared/mock-data";
// CAR ENTITY: one DO instance per car, identified by VIN
export class CarEntity extends IndexedEntity<Car> {
  static readonly entityName = "car";
  static readonly indexName = "cars";
  static get initialState(): Car {
    return {
      id: "",
      vin: "",
      manufacturer: "",
      model: "",
      year: new Date().getFullYear(),
      fuelType: 'Gasoline',
      expenses: [],
      documents: [],
      photos: [],
      createdAt: new Date().toISOString(),
    };
  }
  static seedData = MOCK_CARS;
  // Sub-entity management methods
  async addExpense(expenseData: Omit<Expense, 'id' | 'carId'>): Promise<Expense> {
    const newExpense: Expense = {
      ...expenseData,
      id: crypto.randomUUID(),
      carId: this.id,
    };
    await this.mutate(car => {
      car.expenses.push(newExpense);
      car.expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return car;
    });
    return newExpense;
  }
  async deleteExpense(expenseId: string): Promise<boolean> {
    let found = false;
    await this.mutate(car => {
      const initialLength = car.expenses.length;
      car.expenses = car.expenses.filter(exp => exp.id !== expenseId);
      found = car.expenses.length < initialLength;
      return car;
    });
    return found;
  }
  async addDocument(docData: Omit<Document, 'id' | 'carId' | 'uploadedAt'>): Promise<Document> {
    const newDoc: Document = {
      ...docData,
      id: crypto.randomUUID(),
      carId: this.id,
      uploadedAt: new Date().toISOString(),
    };
    await this.mutate(car => {
      car.documents.unshift(newDoc);
      return car;
    });
    return newDoc;
  }
  async deleteDocument(docId: string): Promise<boolean> {
    let found = false;
    await this.mutate(car => {
      const initialLength = car.documents.length;
      car.documents = car.documents.filter(doc => doc.id !== docId);
      found = car.documents.length < initialLength;
      return car;
    });
    return found;
  }
  async addPhoto(photoData: Omit<Photo, 'id' | 'carId' | 'uploadedAt'>): Promise<Photo> {
    const newPhoto: Photo = {
      ...photoData,
      id: crypto.randomUUID(),
      carId: this.id,
      uploadedAt: new Date().toISOString(),
    };
    await this.mutate(car => {
      if (newPhoto.isPrimary) {
        car.photos.forEach(p => p.isPrimary = false);
        car.primaryPhotoUrl = newPhoto.url;
      }
      car.photos.unshift(newPhoto);
      if (!car.primaryPhotoUrl) {
        newPhoto.isPrimary = true;
        car.primaryPhotoUrl = newPhoto.url;
      }
      return car;
    });
    return newPhoto;
  }
  async deletePhoto(photoId: string): Promise<boolean> {
    let found = false;
    await this.mutate(car => {
      const photoToDelete = car.photos.find(p => p.id === photoId);
      if (!photoToDelete) {
        found = false;
        return car;
      }
      car.photos = car.photos.filter(p => p.id !== photoId);
      if (photoToDelete.isPrimary) {
        const newPrimary = car.photos[0];
        if (newPrimary) {
          newPrimary.isPrimary = true;
          car.primaryPhotoUrl = newPrimary.url;
        } else {
          car.primaryPhotoUrl = undefined;
        }
      }
      found = true;
      return car;
    });
    return found;
  }
  async setPrimaryPhoto(photoId: string): Promise<boolean> {
    let found = false;
    await this.mutate(car => {
      const newPrimary = car.photos.find(p => p.id === photoId);
      if (!newPrimary) {
        found = false;
        return car;
      }
      car.photos.forEach(p => p.isPrimary = (p.id === photoId));
      car.primaryPhotoUrl = newPrimary.url;
      found = true;
      return car;
    });
    return found;
  }
}