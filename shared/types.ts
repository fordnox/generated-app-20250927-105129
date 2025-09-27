// Core data structures for Veloce Fleet Management
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}
export type FuelType = 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid' | 'LPG' | 'CNG';
export interface Car {
  id: string; // VIN will be used as the ID
  vin: string;
  manufacturer: string;
  model: string;
  year: number;
  // Deadlines
  inspectionValidUntil?: string; // ISO Date string
  insuranceValidUntil?: string; // ISO Date string
  cascoValidUntil?: string; // ISO Date string
  // Technical Specs
  fuelType: FuelType;
  engineCapacity?: number; // in cm³
  enginePower?: number; // in HP
  enginePowerKW?: number; // in kW
  // Ownership & History
  purchaseDate?: string; // ISO Date string
  previousOwnersCount?: number;
  countryOfOrigin?: string;
  countryOfManufacture?: string;
  // Documents
  registrationDocumentNumber?: string;
  registrationDocumentPhotoUrl?: string; // URL to the image
  // Relations (will be expanded in Phase 2)
  expenses: Expense[];
  documents: Document[];
  photos: Photo[];
  primaryPhotoUrl?: string; // For the card view
  createdAt: string; // ISO Date string
}
export interface Expense {
  id: string;
  carId: string;
  title: string;
  amount: number;
  date: string; // ISO Date string
  category: 'Insurance' | 'Service' | 'Fuel' | 'Repair' | 'Other';
  notes?: string;
}
export interface Document {
  id: string;
  carId: string;
  name: string;
  url: string; // URL to the stored document
  uploadedAt: string; // ISO Date string
}
export interface Photo {
  id: string;
  carId: string;
  url: string; // URL to the stored photo
  isPrimary: boolean;
  uploadedAt: string; // ISO Date string
}