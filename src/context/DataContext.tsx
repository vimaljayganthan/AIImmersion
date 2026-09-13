import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Vehicle,
  Diagnosis,
  Mechanic,
  Booking,
  ServiceRecord,
  MaintenanceRecord,
  NotificationItem,
  BookingStatus,
} from '../types';
import {
  DEMO_VEHICLES,
  DEMO_DIAGNOSES,
  DEMO_MECHANICS,
  DEMO_BOOKINGS,
  DEMO_SERVICE_RECORDS,
  DEMO_MAINTENANCE_RECORDS,
  DEMO_NOTIFICATIONS,
} from '../database/mockData';
import { aiService, SymptomDiagnosisInput } from '../services/ai';
import { VehicleModal } from '../components/common/Modals/VehicleModal';
import { BookingModal } from '../components/common/Modals/BookingModal';
import { MechanicProfileModal } from '../components/common/Modals/MechanicProfileModal';
import { DiagnosisDetailModal } from '../components/common/Modals/DiagnosisDetailModal';
import { ServiceReportModal } from '../components/common/Modals/ServiceReportModal';
import { ConfirmDialog } from '../components/common/Modals/ConfirmDialog';

interface ConfirmDialogConfig {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  onConfirm: () => void;
}

interface DataContextType {
  // Vehicles
  vehicles: Vehicle[];
  activeVehicle: Vehicle | null;
  setActiveVehicleId: (id: string) => void;
  addVehicle: (vehicleData: Omit<Vehicle, 'id' | 'ownerId' | 'createdAt'>) => Vehicle;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;

  // Diagnoses
  diagnoses: Diagnosis[];
  runAiDiagnosis: (input: SymptomDiagnosisInput) => Promise<Diagnosis>;
  saveDiagnosis: (diagnosis: Diagnosis) => void;
  deleteDiagnosis: (id: string) => void;

  // Mechanics
  mechanics: Mechanic[];
  toggleMechanicVerification: (id: string) => void;

  // Bookings
  bookings: Booking[];
  createBooking: (bookingData: {
    vehicleId: string;
    mechanicId: string;
    diagnosisId?: string;
    serviceType: string;
    problemSummary: string;
    aiPreliminaryAssessment?: string;
    appointmentDate: string;
    timeSlot: string;
    notes: string;
    estimatedTotal: number;
  }) => Booking;
  updateBookingStatus: (
    id: string,
    status: BookingStatus,
    mechanicFeedback?: {
      mechanicNotes: string;
      partsReplaced: Array<{ name: string; cost: number }>;
      labourCost: number;
    }
  ) => void;

  // Service Records
  serviceRecords: ServiceRecord[];

  // Maintenance Records
  maintenanceRecords: MaintenanceRecord[];

  // Notifications
  notifications: NotificationItem[];
  addNotification: (notif: Omit<NotificationItem, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Global Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Modals Triggers
  openVehicleModal: (vehicle?: Vehicle | null) => void;
  openBookingModal: (mechanic: Mechanic, diagnosis?: Diagnosis | null) => void;
  openMechanicProfileModal: (mechanic: Mechanic) => void;
  openDiagnosisDetailModal: (diagnosis: Diagnosis) => void;
  openServiceReportModal: (record: ServiceRecord) => void;
  openConfirmDialog: (config: Omit<ConfirmDialogConfig, 'isOpen'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const safeGetStorage = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved || saved === 'undefined' || saved === 'null') return fallback;
    return JSON.parse(saved) as T;
  } catch (err) {
    console.warn(`Failed to parse localStorage for key: ${key}`, err);
    return fallback;
  }
};

const safeSetStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to save localStorage for key: ${key}`, err);
  }
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Safe initial states with guaranteed fallbacks
  const [vehicles, setVehicles] = useState<Vehicle[]>(() =>
    safeGetStorage('aim_vehicles', DEMO_VEHICLES)
  );

  const [activeVehicleId, setActiveVehicleIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('aim_active_vehicle_id');
      return saved || (DEMO_VEHICLES[0] ? DEMO_VEHICLES[0].id : '');
    } catch {
      return DEMO_VEHICLES[0] ? DEMO_VEHICLES[0].id : '';
    }
  });

  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>(() =>
    safeGetStorage('aim_diagnoses', DEMO_DIAGNOSES)
  );

  const [mechanics, setMechanics] = useState<Mechanic[]>(() =>
    safeGetStorage('aim_mechanics', DEMO_MECHANICS)
  );

  const [bookings, setBookings] = useState<Booking[]>(() =>
    safeGetStorage('aim_bookings', DEMO_BOOKINGS)
  );

  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>(() =>
    safeGetStorage('aim_service_records', DEMO_SERVICE_RECORDS)
  );

  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(() =>
    safeGetStorage('aim_maintenance_records', DEMO_MAINTENANCE_RECORDS)
  );

  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    safeGetStorage('aim_notifications', DEMO_NOTIFICATIONS)
  );

  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingMechanic, setBookingMechanic] = useState<Mechanic | null>(null);
  const [bookingDiagnosis, setBookingDiagnosis] = useState<Diagnosis | null>(null);

  const [mechanicProfileModalOpen, setMechanicProfileModalOpen] = useState(false);
  const [viewingMechanic, setViewingMechanic] = useState<Mechanic | null>(null);

  const [diagnosisDetailModalOpen, setDiagnosisDetailModalOpen] = useState(false);
  const [viewingDiagnosis, setViewingDiagnosis] = useState<Diagnosis | null>(null);

  const [serviceReportModalOpen, setServiceReportModalOpen] = useState(false);
  const [viewingServiceRecord, setViewingServiceRecord] = useState<ServiceRecord | null>(null);

  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogConfig>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Sync state to localStorage safely
  useEffect(() => {
    safeSetStorage('aim_vehicles', vehicles);
  }, [vehicles]);

  useEffect(() => {
    try {
      localStorage.setItem('aim_active_vehicle_id', activeVehicleId);
    } catch (err) {
      console.warn(err);
    }
  }, [activeVehicleId]);

  useEffect(() => {
    safeSetStorage('aim_diagnoses', diagnoses);
  }, [diagnoses]);

  useEffect(() => {
    safeSetStorage('aim_mechanics', mechanics);
  }, [mechanics]);

  useEffect(() => {
    safeSetStorage('aim_bookings', bookings);
  }, [bookings]);

  useEffect(() => {
    safeSetStorage('aim_service_records', serviceRecords);
  }, [serviceRecords]);

  useEffect(() => {
    safeSetStorage('aim_notifications', notifications);
  }, [notifications]);

  // Derived active vehicle
  const activeVehicle = vehicles.find((v) => v.id === activeVehicleId) || vehicles[0] || null;

  const setActiveVehicleId = (id: string) => {
    setActiveVehicleIdState(id);
  };

  // Vehicles CRUD
  const addVehicle = (vehicleData: Omit<Vehicle, 'id' | 'ownerId' | 'createdAt'>): Vehicle => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `veh_${Date.now()}`,
      ownerId: 'usr_owner_01',
      createdAt: new Date().toISOString(),
    };
    setVehicles((prev) => [newVehicle, ...prev]);
    setActiveVehicleIdState(newVehicle.id);

    addNotification({
      userId: 'usr_owner_01',
      title: 'Vehicle Added to Garage',
      message: `${newVehicle.year} ${newVehicle.make} ${newVehicle.model} (${newVehicle.regNumber}) is now active.`,
      type: 'success',
      read: false,
      link: '/owner/vehicles',
    });

    return newVehicle;
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates, updatedAt: new Date().toISOString() } : v))
    );
  };

  const deleteVehicle = (id: string) => {
    setVehicles((prev) => {
      const remaining = prev.filter((v) => v.id !== id);
      if (activeVehicleId === id && remaining.length > 0) {
        setActiveVehicleIdState(remaining[0].id);
      }
      return remaining;
    });
  };

  // AI Diagnosis Execution
  const runAiDiagnosis = async (input: SymptomDiagnosisInput): Promise<Diagnosis> => {
    const result = await aiService.symptomDiagnosis(input);
    setDiagnoses((prev) => [result, ...prev]);

    addNotification({
      userId: 'usr_owner_01',
      title: 'New AI Diagnosis Generated',
      message: `${result.title} for ${input.vehicle.make} ${input.vehicle.model} (${result.confidence}% confidence).`,
      type: result.severity === 'critical' ? 'alert' : 'info',
      read: false,
      link: '/owner/diagnosis',
    });

    return result;
  };

  const saveDiagnosis = (diag: Diagnosis) => {
    setDiagnoses((prev) => {
      const exists = prev.some((d) => d.id === diag.id);
      if (exists) {
        return prev.map((d) => (d.id === diag.id ? diag : d));
      }
      return [diag, ...prev];
    });
  };

  const deleteDiagnosis = (id: string) => {
    setDiagnoses((prev) => prev.filter((d) => d.id !== id));
  };

  // Mechanics
  const toggleMechanicVerification = (id: string) => {
    setMechanics((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isVerified: !m.isVerified } : m))
    );
  };

  // Bookings
  const createBooking = (bookingData: {
    vehicleId: string;
    mechanicId: string;
    diagnosisId?: string;
    serviceType: string;
    problemSummary: string;
    aiPreliminaryAssessment?: string;
    appointmentDate: string;
    timeSlot: string;
    notes: string;
    estimatedTotal: number;
  }): Booking => {
    const newBooking: Booking = {
      id: `bk_${Date.now()}`,
      bookingReference: `AM-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: 'usr_owner_01',
      vehicleId: bookingData.vehicleId,
      mechanicId: bookingData.mechanicId,
      diagnosisId: bookingData.diagnosisId,
      serviceType: bookingData.serviceType,
      problemSummary: bookingData.problemSummary,
      aiPreliminaryAssessment: bookingData.aiPreliminaryAssessment,
      appointmentDate: bookingData.appointmentDate,
      timeSlot: bookingData.timeSlot,
      status: 'pending',
      notes: bookingData.notes,
      estimatedTotal: bookingData.estimatedTotal,
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Push notifications to both Owner and Mechanic
    addNotification({
      userId: 'usr_owner_01',
      title: 'Service Booking Dispatched',
      message: `Appointment scheduled for ${bookingData.appointmentDate} at ${bookingData.timeSlot}. Ref: ${newBooking.bookingReference}.`,
      type: 'info',
      read: false,
      link: '/owner/bookings',
    });

    addNotification({
      userId: 'usr_mech_01',
      title: 'New Service Request Received',
      message: `New booking ${newBooking.bookingReference} for ${bookingData.serviceType}.`,
      type: 'warning',
      read: false,
      link: '/mechanic/requests',
    });

    return newBooking;
  };

  const updateBookingStatus = (
    id: string,
    status: BookingStatus,
    mechanicFeedback?: {
      mechanicNotes: string;
      partsReplaced: Array<{ name: string; cost: number }>;
      labourCost: number;
    }
  ) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        return {
          ...b,
          status,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    // If completed, automatically create a finalized ServiceRecord
    if (status === 'completed' && mechanicFeedback) {
      const targetBooking = bookings.find((b) => b.id === id);
      const targetMechanic = mechanics.find((m) => m.id === targetBooking?.mechanicId);
      const targetVehicle = vehicles.find((v) => v.id === targetBooking?.vehicleId);

      const partsTotal = mechanicFeedback.partsReplaced.reduce((acc, p) => acc + p.cost, 0);
      const finalCost = partsTotal + mechanicFeedback.labourCost;

      const newRecord: ServiceRecord = {
        id: `sr_${Date.now()}`,
        bookingId: id,
        vehicleId: targetBooking?.vehicleId || 'veh_01',
        mechanicId: targetBooking?.mechanicId || 'mech_01',
        mechanicName: targetMechanic?.name || 'Rajesh Kumar',
        workshopName: targetMechanic?.workshopName || 'Kumar Motors',
        serviceDate: new Date().toISOString().split('T')[0],
        title: targetBooking?.serviceType || 'General Service',
        finalCost,
        partsReplaced: mechanicFeedback.partsReplaced,
        labourCost: mechanicFeedback.labourCost,
        mechanicNotes: mechanicFeedback.mechanicNotes,
        mileageAtService: targetVehicle ? targetVehicle.mileage : 24500,
        nextServiceDueMileage: (targetVehicle ? targetVehicle.mileage : 24500) + 5000,
      };

      setServiceRecords((prev) => [newRecord, ...prev]);

      // Update vehicle health score
      if (targetVehicle) {
        updateVehicle(targetVehicle.id, {
          healthScore: Math.min(100, targetVehicle.healthScore + 15),
          lastServicedAt: new Date().toISOString(),
        });
      }

      addNotification({
        userId: 'usr_owner_01',
        title: 'Vehicle Service Completed',
        message: `${targetMechanic?.workshopName} has completed service on your vehicle. Final bill: ₹${finalCost.toLocaleString()}.`,
        type: 'success',
        read: false,
        link: '/owner/history',
      });
    }
  };

  // Notifications
  const addNotification = (notif: Omit<NotificationItem, 'id' | 'createdAt'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Modals actions
  const openVehicleModal = (vehicle?: Vehicle | null) => {
    setEditingVehicle(vehicle || null);
    setVehicleModalOpen(true);
  };

  const openBookingModal = (mechanic: Mechanic, diagnosis?: Diagnosis | null) => {
    setBookingMechanic(mechanic);
    setBookingDiagnosis(diagnosis || null);
    setBookingModalOpen(true);
  };

  const openMechanicProfileModal = (mechanic: Mechanic) => {
    setViewingMechanic(mechanic);
    setMechanicProfileModalOpen(true);
  };

  const openDiagnosisDetailModal = (diagnosis: Diagnosis) => {
    setViewingDiagnosis(diagnosis);
    setDiagnosisDetailModalOpen(true);
  };

  const openServiceReportModal = (record: ServiceRecord) => {
    setViewingServiceRecord(record);
    setServiceReportModalOpen(true);
  };

  const openConfirmDialog = (config: Omit<ConfirmDialogConfig, 'isOpen'>) => {
    setConfirmDialog({
      isOpen: true,
      ...config,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <DataContext.Provider
      value={{
        vehicles,
        activeVehicle,
        setActiveVehicleId,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        diagnoses,
        runAiDiagnosis,
        saveDiagnosis,
        deleteDiagnosis,
        mechanics,
        toggleMechanicVerification,
        bookings,
        createBooking,
        updateBookingStatus,
        serviceRecords,
        maintenanceRecords,
        notifications,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        searchQuery,
        setSearchQuery,
        openVehicleModal,
        openBookingModal,
        openMechanicProfileModal,
        openDiagnosisDetailModal,
        openServiceReportModal,
        openConfirmDialog,
      }}
    >
      {children}

      {/* Global Modals rendered once */}
      <VehicleModal
        isOpen={vehicleModalOpen}
        vehicle={editingVehicle}
        onSave={(data, id) => {
          if (id) {
            updateVehicle(id, data);
          } else {
            addVehicle(data);
          }
        }}
        onClose={() => {
          setVehicleModalOpen(false);
          setEditingVehicle(null);
        }}
      />

      <BookingModal
        isOpen={bookingModalOpen}
        mechanic={bookingMechanic}
        vehicles={vehicles}
        activeVehicle={activeVehicle}
        initialDiagnosis={bookingDiagnosis}
        onConfirm={(data) => {
          createBooking(data);
        }}
        onClose={() => {
          setBookingModalOpen(false);
          setBookingMechanic(null);
          setBookingDiagnosis(null);
        }}
      />

      <MechanicProfileModal
        isOpen={mechanicProfileModalOpen}
        mechanic={viewingMechanic}
        onBook={(mech) => {
          setMechanicProfileModalOpen(false);
          openBookingModal(mech, null);
        }}
        onClose={() => {
          setMechanicProfileModalOpen(false);
          setViewingMechanic(null);
        }}
      />

      <DiagnosisDetailModal
        isOpen={diagnosisDetailModalOpen}
        diagnosis={viewingDiagnosis}
        vehicle={activeVehicle}
        onBookMechanic={(diag) => {
          setDiagnosisDetailModalOpen(false);
          if (mechanics.length > 0) {
            openBookingModal(mechanics[0], diag);
          }
        }}
        onClose={() => {
          setDiagnosisDetailModalOpen(false);
          setViewingDiagnosis(null);
        }}
      />

      <ServiceReportModal
        isOpen={serviceReportModalOpen}
        record={viewingServiceRecord}
        vehicle={activeVehicle}
        onClose={() => {
          setServiceReportModalOpen(false);
          setViewingServiceRecord(null);
        }}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        cancelLabel={confirmDialog.cancelLabel}
        isDanger={confirmDialog.isDanger}
        onConfirm={() => {
          confirmDialog.onConfirm();
          closeConfirmDialog();
        }}
        onCancel={closeConfirmDialog}
      />
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
