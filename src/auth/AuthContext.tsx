import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Vehicle } from '../types';
import { DEMO_USERS, DEMO_VEHICLES } from '../database/mockData';

interface AuthContextType {
  user: User | null;
  currentRole: UserRole | null;
  isAuthenticated: boolean;
  activeVehicle: Vehicle | null;
  vehicles: Vehicle[];
  loginAs: (role: UserRole) => void;
  loginWithCredentials: (email: string, role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  setActiveVehicle: (vehicle: Vehicle) => void;
  isAuthModalOpen: boolean;
  openAuthModal: (targetRole?: UserRole) => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const safeGetRole = (): UserRole | null => {
  try {
    const saved = localStorage.getItem('autosense_auth_role');
    if (saved === 'owner' || saved === 'mechanic' || saved === 'admin') {
      return saved;
    }
    return null;
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole | null>(() => safeGetRole());

  const [user, setUser] = useState<User | null>(() => {
    const initialRole = safeGetRole();
    return initialRole && DEMO_USERS[initialRole] ? DEMO_USERS[initialRole] : null;
  });

  const [vehicles] = useState<Vehicle[]>(DEMO_VEHICLES);
  const [activeVehicle, setActiveVehicle] = useState<Vehicle | null>(DEMO_VEHICLES[0] || null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (currentRole && DEMO_USERS[currentRole]) {
      setUser(DEMO_USERS[currentRole]);
      try {
        localStorage.setItem('autosense_auth_role', currentRole);
      } catch (e) {
        console.warn(e);
      }
    } else if (!currentRole) {
      setUser(null);
      try {
        localStorage.removeItem('autosense_auth_role');
      } catch (e) {
        console.warn(e);
      }
    }
  }, [currentRole]);

  const loginAs = (role: UserRole) => {
    const demoUser = DEMO_USERS[role];
    if (demoUser) {
      setUser(demoUser);
      setCurrentRole(role);
      try {
        localStorage.setItem('autosense_auth_role', role);
      } catch (e) {
        console.warn(e);
      }
      setIsAuthModalOpen(false);
    }
  };

  const loginWithCredentials = (email: string, role: UserRole) => {
    const baseDemo = DEMO_USERS[role];
    const newUser: User = {
      id: baseDemo ? baseDemo.id : `usr_${Date.now()}`,
      role,
      name: baseDemo ? baseDemo.name : email.split('@')[0].replace('.', ' '),
      email,
      phone: baseDemo?.phone || '+91 98765 43210',
      location: baseDemo?.location || 'Bengaluru, India',
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    setCurrentRole(role);
    try {
      localStorage.setItem('autosense_auth_role', role);
    } catch (e) {
      console.warn(e);
    }
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    setCurrentRole(null);
    try {
      localStorage.removeItem('autosense_auth_role');
    } catch (e) {
      console.warn(e);
    }
  };

  const switchRole = (role: UserRole) => {
    loginAs(role);
  };

  const openAuthModal = (_targetRole?: UserRole) => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentRole,
        isAuthenticated: !!user && !!currentRole,
        activeVehicle,
        vehicles,
        loginAs,
        loginWithCredentials,
        logout,
        switchRole,
        setActiveVehicle,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
