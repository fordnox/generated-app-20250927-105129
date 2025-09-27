import { Hono } from "hono";
import type { Env } from './core-utils';
import { CarEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import { Car, Expense, Document as DocType, Photo } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // CARS API
  app.get('/api/cars', async (c) => {
    await CarEntity.ensureSeed(c.env);
    const { items } = await CarEntity.list(c.env);
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return ok(c, items);
  });
  app.get('/api/cars/:id', async (c) => {
    const id = c.req.param('id');
    const car = new CarEntity(c.env, id);
    if (!(await car.exists())) return notFound(c, 'Car not found');
    return ok(c, await car.getState());
  });
  app.post('/api/cars', async (c) => {
    const carData = (await c.req.json()) as Partial<Car>;
    if (!carData.vin || !isStr(carData.vin)) return bad(c, 'VIN is required');
    if (!carData.manufacturer) return bad(c, 'Manufacturer is required');
    if (!carData.model) return bad(c, 'Model is required');
    const carId = carData.vin;
    const existingCar = new CarEntity(c.env, carId);
    if (await existingCar.exists()) return bad(c, `Car with VIN ${carId} already exists.`);
    const newCar: Car = { ...CarEntity.initialState, ...carData, id: carId, vin: carId, createdAt: new Date().toISOString() };
    const createdCar = await CarEntity.create(c.env, newCar);
    return ok(c, createdCar);
  });
  app.put('/api/cars/:id', async (c) => {
    const id = c.req.param('id');
    const car = new CarEntity(c.env, id);
    if (!(await car.exists())) return notFound(c, 'Car not found');
    const carData = (await c.req.json()) as Partial<Car>;
    delete carData.vin;
    delete carData.id;
    await car.patch(carData);
    return ok(c, await car.getState());
  });
  app.delete('/api/cars/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await CarEntity.delete(c.env, id);
    if (!deleted) return notFound(c, 'Car not found');
    return ok(c, { id, deleted: true });
  });
  // EXPENSES SUB-ENTITY
  app.post('/api/cars/:id/expenses', async (c) => {
    const id = c.req.param('id');
    const car = new CarEntity(c.env, id);
    if (!(await car.exists())) return notFound(c, 'Car not found');
    const expenseData = await c.req.json<Omit<Expense, 'id' | 'carId'>>();
    const newExpense = await car.addExpense(expenseData);
    return ok(c, newExpense);
  });
  app.delete('/api/cars/:id/expenses/:expenseId', async (c) => {
    const { id, expenseId } = c.req.param();
    const car = new CarEntity(c.env, id);
    if (!(await car.exists())) return notFound(c, 'Car not found');
    const deleted = await car.deleteExpense(expenseId);
    if (!deleted) return notFound(c, 'Expense not found');
    return ok(c, { id: expenseId, deleted: true });
  });
  // DOCUMENTS SUB-ENTITY
  app.post('/api/cars/:id/documents', async (c) => {
    const id = c.req.param('id');
    const car = new CarEntity(c.env, id);
    if (!(await car.exists())) return notFound(c, 'Car not found');
    const docData = await c.req.json<Omit<DocType, 'id' | 'carId' | 'uploadedAt'>>();
    const newDoc = await car.addDocument(docData);
    return ok(c, newDoc);
  });
  app.delete('/api/cars/:id/documents/:docId', async (c) => {
    const { id, docId } = c.req.param();
    const car = new CarEntity(c.env, id);
    if (!(await car.exists())) return notFound(c, 'Car not found');
    const deleted = await car.deleteDocument(docId);
    if (!deleted) return notFound(c, 'Document not found');
    return ok(c, { id: docId, deleted: true });
  });
  // PHOTOS SUB-ENTITY
  app.post('/api/cars/:id/photos', async (c) => {
    const id = c.req.param('id');
    const car = new CarEntity(c.env, id);
    if (!(await car.exists())) return notFound(c, 'Car not found');
    const photoData = await c.req.json<Omit<Photo, 'id' | 'carId' | 'uploadedAt'>>();
    const newPhoto = await car.addPhoto(photoData);
    return ok(c, newPhoto);
  });
  app.delete('/api/cars/:id/photos/:photoId', async (c) => {
    const { id, photoId } = c.req.param();
    const car = new CarEntity(c.env, id);
    if (!(await car.exists())) return notFound(c, 'Car not found');
    const deleted = await car.deletePhoto(photoId);
    if (!deleted) return notFound(c, 'Photo not found');
    return ok(c, { id: photoId, deleted: true });
  });
  app.put('/api/cars/:id/photos/:photoId/set-primary', async (c) => {
    const { id, photoId } = c.req.param();
    const car = new CarEntity(c.env, id);
    if (!(await car.exists())) return notFound(c, 'Car not found');
    const success = await car.setPrimaryPhoto(photoId);
    if (!success) return notFound(c, 'Photo not found');
    return ok(c, await car.getState());
  });
}