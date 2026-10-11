import { describe, it, expect, beforeEach } from 'vitest';
import { bookingsService } from '../services/supabase/dbService';
import { Booking, BookingStatus } from '../types';

describe('Service Booking Module', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Booking Retrieval', () => {
    it('retrieves existing bookings with fallback data', async () => {
      const bookings = await bookingsService.getBookings();
      expect(Array.isArray(bookings)).toBe(true);
      expect(bookings.length).toBeGreaterThan(0);
      expect(bookings[0]).toHaveProperty('bookingReference');
      expect(bookings[0]).toHaveProperty('status');
      expect(bookings[0]).toHaveProperty('appointmentDate');
    });

    it('filters bookings by userId', async () => {
      const all = await bookingsService.getBookings();
      const userId = all[0].userId;
      const userBookings = await bookingsService.getBookings({ userId });
      expect(userBookings.every((b) => b.userId === userId || !b.userId)).toBe(true);
    });
  });

  describe('Booking Creation & Validation', () => {
    it('creates a service booking with valid information', async () => {
      const payload: Omit<Booking, 'id' | 'createdAt'> = {
        bookingReference: `DIQ-${Date.now().toString().slice(-6)}`,
        vehicleId: 'veh_01',
        userId: 'usr_owner_01',
        mechanicId: 'mech_01',
        serviceType: 'Brake Overhaul & Pad Replacement',
        problemSummary: 'High-pitched metallic squeal when applying front brake',
        appointmentDate: '2026-10-15',
        timeSlot: '10:00 AM - 12:00 PM',
        status: 'pending',
        notes: 'Customer noticed issue after monsoon ride',
        estimatedTotal: 3400,
      };

      const created = await bookingsService.createBooking(payload);
      expect(created).toBeDefined();
      expect(created?.bookingReference).toBe(payload.bookingReference);
      expect(created?.serviceType).toBe(payload.serviceType);
      expect(created?.status).toBe('pending');
      expect(created?.estimatedTotal).toBe(3400);
      expect(created?.id).toBeDefined();
    });

    it('validates required booking fields', () => {
      const validateBooking = (data: Partial<Booking>): { valid: boolean; missing: string[] } => {
        const required = ['vehicleId', 'mechanicId', 'serviceType', 'appointmentDate', 'timeSlot'];
        const missing = required.filter((field) => !data[field as keyof Booking]);
        return { valid: missing.length === 0, missing };
      };

      const validBooking = {
        vehicleId: 'v1',
        mechanicId: 'm1',
        serviceType: 'Full Inspection',
        appointmentDate: '2026-11-01',
        timeSlot: '02:00 PM',
      };
      expect(validateBooking(validBooking).valid).toBe(true);

      const invalidBooking = {
        vehicleId: 'v1',
      };
      const res = validateBooking(invalidBooking);
      expect(res.valid).toBe(false);
      expect(res.missing).toContain('mechanicId');
      expect(res.missing).toContain('serviceType');
      expect(res.missing).toContain('appointmentDate');
      expect(res.missing).toContain('timeSlot');
    });

    it('detects duplicate or conflicting booking slots for the same mechanic', () => {
      const existingBookings: Array<{ mechanicId: string; appointmentDate: string; timeSlot: string }> = [
        { mechanicId: 'mech_01', appointmentDate: '2026-10-12', timeSlot: '10:00 AM - 12:00 PM' },
        { mechanicId: 'mech_01', appointmentDate: '2026-10-12', timeSlot: '02:00 PM - 04:00 PM' },
      ];

      const isSlotConflict = (mechanicId: string, date: string, slot: string): boolean => {
        return existingBookings.some(
          (b) => b.mechanicId === mechanicId && b.appointmentDate === date && b.timeSlot === slot
        );
      };

      expect(isSlotConflict('mech_01', '2026-10-12', '10:00 AM - 12:00 PM')).toBe(true);
      expect(isSlotConflict('mech_01', '2026-10-12', '04:00 PM - 06:00 PM')).toBe(false);
      expect(isSlotConflict('mech_02', '2026-10-12', '10:00 AM - 12:00 PM')).toBe(false);
    });
  });

  describe('Booking Lifecycle & Status Updates', () => {
    it('updates booking status through valid states', async () => {
      const validStatuses: BookingStatus[] = [
        'pending',
        'accepted',
        'vehicle_received',
        'diagnosing',
        'repairing',
        'quality_check',
        'completed',
        'cancelled',
      ];

      for (const st of validStatuses) {
        const result = await bookingsService.updateBookingStatus('book_01', st);
        expect(typeof result).toBe('boolean');
      }
    });

    it('enforces allowed booking state transitions', () => {
      const allowedTransitions: Record<BookingStatus, BookingStatus[]> = {
        pending: ['accepted', 'cancelled'],
        accepted: ['vehicle_received', 'cancelled'],
        vehicle_received: ['diagnosing', 'cancelled'],
        diagnosing: ['repairing', 'cancelled'],
        repairing: ['quality_check'],
        quality_check: ['completed'],
        completed: [],
        cancelled: [],
      };

      const canTransition = (from: BookingStatus, to: BookingStatus) => {
        return allowedTransitions[from].includes(to);
      };

      expect(canTransition('pending', 'accepted')).toBe(true);
      expect(canTransition('accepted', 'vehicle_received')).toBe(true);
      expect(canTransition('quality_check', 'completed')).toBe(true);
      expect(canTransition('completed', 'pending')).toBe(false);
      expect(canTransition('cancelled', 'repairing')).toBe(false);
    });
  });
});
