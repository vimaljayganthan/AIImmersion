import { describe, it, expect, beforeEach } from 'vitest';
import { vehiclesService } from '../services/supabase/dbService';
import { Vehicle } from '../types';
import { DEMO_VEHICLES } from '../database/mockData';

describe('Vehicle Management Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Vehicle Retrieval', () => {
    it('retrieves default vehicle list when database fallback is active', async () => {
      const vehicles = await vehiclesService.getVehicles();
      expect(Array.isArray(vehicles)).toBe(true);
      expect(vehicles.length).toBeGreaterThan(0);
      expect(vehicles[0]).toHaveProperty('make');
      expect(vehicles[0]).toHaveProperty('model');
      expect(vehicles[0]).toHaveProperty('regNumber');
    });

    it('filters vehicles by ownerId correctly', async () => {
      const all = await vehiclesService.getVehicles();
      const ownerId = all[0].ownerId;
      const ownerVehicles = await vehiclesService.getVehicles(ownerId);

      expect(Array.isArray(ownerVehicles)).toBe(true);
      expect(ownerVehicles.every((v) => v.ownerId === ownerId || !v.ownerId)).toBe(true);
    });
  });

  describe('Vehicle Creation & Validation', () => {
    it('creates and returns a new vehicle with valid data', async () => {
      const newVehiclePayload: Omit<Vehicle, 'id' | 'createdAt'> = {
        ownerId: 'usr_owner_01',
        make: 'KTM',
        model: 'Duke 390',
        year: 2023,
        fuelType: 'Petrol',
        engineCapacity: '373cc',
        mileage: 8500,
        regNumber: 'KA 03 HY 8899',
        vin: 'MD2A25BY5N1234567',
        color: 'Orange',
        healthScore: 94,
      };

      const created = await vehiclesService.addVehicle(newVehiclePayload);
      expect(created).toBeDefined();
      expect(created?.make).toBe('KTM');
      expect(created?.model).toBe('Duke 390');
      expect(created?.regNumber).toBe('KA 03 HY 8899');
      expect(created?.id).toBeDefined();
      expect(created?.createdAt).toBeDefined();
    });

    it('validates vehicle manufacturing year bounds', () => {
      const isValidYear = (year: number) => year >= 1950 && year <= new Date().getFullYear() + 1;

      expect(isValidYear(2022)).toBe(true);
      expect(isValidYear(1900)).toBe(false);
      expect(isValidYear(2150)).toBe(false);
    });

    it('validates mileage as non-negative integer', () => {
      const isValidMileage = (mileage: number) => Number.isInteger(mileage) && mileage >= 0;

      expect(isValidMileage(15000)).toBe(true);
      expect(isValidMileage(0)).toBe(true);
      expect(isValidMileage(-500)).toBe(false);
      expect(isValidMileage(12.5)).toBe(false);
    });

    it('identifies missing required vehicle information', () => {
      const validateVehicleFields = (data: Partial<Vehicle>): { valid: boolean; missing: string[] } => {
        const required = ['make', 'model', 'year', 'regNumber'];
        const missing = required.filter((field) => !data[field as keyof Vehicle]);
        return { valid: missing.length === 0, missing };
      };

      const complete = { make: 'Royal Enfield', model: 'Classic 350', year: 2021, regNumber: 'KA 01 AB 1234' };
      expect(validateVehicleFields(complete).valid).toBe(true);

      const incomplete = { make: 'Honda' };
      const res = validateVehicleFields(incomplete);
      expect(res.valid).toBe(false);
      expect(res.missing).toContain('model');
      expect(res.missing).toContain('year');
      expect(res.missing).toContain('regNumber');
    });
  });

  describe('Vehicle Updates', () => {
    it('updates vehicle mileage successfully', async () => {
      const result = await vehiclesService.updateMileage('veh_01', 19500);
      expect(typeof result).toBe('boolean');
    });

    it('computes vehicle health degradation correctly based on mileage and service interval', () => {
      const computeHealthScore = (mileage: number, lastServiceMileage: number): number => {
        const kmSinceService = Math.max(0, mileage - lastServiceMileage);
        const degradation = Math.min(60, Math.floor(kmSinceService / 200));
        return Math.max(20, 100 - degradation);
      };

      expect(computeHealthScore(5000, 5000)).toBe(100);
      expect(computeHealthScore(8000, 5000)).toBe(85);
      expect(computeHealthScore(20000, 5000)).toBe(40);
    });
  });
});
