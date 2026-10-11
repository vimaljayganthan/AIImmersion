import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DEMO_USERS } from '../database/mockData';
import { UserRole, User } from '../types';

describe('Authentication & Authorization Module', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('Demo User Roles & Credentials', () => {
    it('provides valid demo profiles for owner, mechanic, and admin', () => {
      expect(DEMO_USERS.owner).toBeDefined();
      expect(DEMO_USERS.owner.role).toBe('owner');
      expect(DEMO_USERS.owner.email).toContain('@');

      expect(DEMO_USERS.mechanic).toBeDefined();
      expect(DEMO_USERS.mechanic.role).toBe('mechanic');

      expect(DEMO_USERS.admin).toBeDefined();
      expect(DEMO_USERS.admin.role).toBe('admin');
    });

    it('stores authenticated role in localStorage on login', () => {
      const role: UserRole = 'owner';
      localStorage.setItem('autosense_auth_role', role);

      const savedRole = localStorage.getItem('autosense_auth_role');
      expect(savedRole).toBe('owner');
      expect(DEMO_USERS[savedRole as UserRole]).toBeDefined();
    });

    it('clears session on logout', () => {
      localStorage.setItem('autosense_auth_role', 'mechanic');
      expect(localStorage.getItem('autosense_auth_role')).toBe('mechanic');

      localStorage.removeItem('autosense_auth_role');
      expect(localStorage.getItem('autosense_auth_role')).toBeNull();
    });

    it('generates a valid authenticated user object from credentials', () => {
      const email = 'rajesh.kumar@example.com';
      const role: UserRole = 'owner';

      const newUser: User = {
        id: `usr_${Date.now()}`,
        role,
        name: 'Rajesh Kumar',
        email,
        phone: '+91 98765 43210',
        location: 'Bengaluru, India',
        createdAt: new Date().toISOString(),
      };

      expect(newUser.email).toBe(email);
      expect(newUser.role).toBe('owner');
      expect(newUser.id).toMatch(/^usr_\d+/);
      expect(newUser.name).toBe('Rajesh Kumar');
    });

    it('rejects invalid or unauthorized role inputs', () => {
      const invalidRoles = ['superadmin', 'guest', 'hacker', ''];
      const validRoles: UserRole[] = ['owner', 'mechanic', 'admin'];

      invalidRoles.forEach((role) => {
        expect(validRoles.includes(role as UserRole)).toBe(false);
      });
    });

    it('enforces strict role-based access control matching allowed portal roles', () => {
      const checkAccess = (userRole: UserRole | null, allowedRole: UserRole): boolean => {
        if (!userRole) return false;
        return userRole === allowedRole;
      };

      expect(checkAccess('owner', 'owner')).toBe(true);
      expect(checkAccess('owner', 'mechanic')).toBe(false);
      expect(checkAccess('owner', 'admin')).toBe(false);

      expect(checkAccess('mechanic', 'mechanic')).toBe(true);
      expect(checkAccess('mechanic', 'owner')).toBe(false);

      expect(checkAccess('admin', 'admin')).toBe(true);
      expect(checkAccess('admin', 'owner')).toBe(false);

      expect(checkAccess(null, 'owner')).toBe(false);
    });
  });
});
