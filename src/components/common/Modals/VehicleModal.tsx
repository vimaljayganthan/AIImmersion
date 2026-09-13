import React, { useState, useEffect } from 'react';
import { Vehicle } from '../../../types';
import { X, Car, CheckCircle2 } from 'lucide-react';
import { Button } from '../Button';

interface VehicleModalProps {
  isOpen: boolean;
  vehicle?: Vehicle | null;
  onSave: (vehicleData: Omit<Vehicle, 'id' | 'ownerId' | 'createdAt'>, id?: string) => void;
  onClose: () => void;
}

export const VehicleModal: React.FC<VehicleModalProps> = ({
  isOpen,
  vehicle,
  onSave,
  onClose,
}) => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(2023);
  const [fuelType, setFuelType] = useState<Vehicle['fuelType']>('Petrol');
  const [engineCapacity, setEngineCapacity] = useState('155cc');
  const [mileage, setMileage] = useState(24000);
  const [regNumber, setRegNumber] = useState('');
  const [color, setColor] = useState('Metallic Blue');
  const [vin, setVin] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (vehicle) {
      setMake(vehicle.make);
      setModel(vehicle.model);
      setYear(vehicle.year);
      setFuelType(vehicle.fuelType);
      setEngineCapacity(vehicle.engineCapacity);
      setMileage(vehicle.mileage);
      setRegNumber(vehicle.regNumber);
      setColor(vehicle.color || 'Metallic Blue');
      setVin(vehicle.vin || '');
    } else {
      setMake('');
      setModel('');
      setYear(2023);
      setFuelType('Petrol');
      setEngineCapacity('155cc');
      setMileage(15000);
      setRegNumber('');
      setColor('Metallic Blue');
      setVin('');
    }
    setError('');
  }, [vehicle, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make.trim() || !model.trim() || !regNumber.trim()) {
      setError('Please fill in all required fields (Make, Model, and Registration Number).');
      return;
    }

    onSave(
      {
        make: make.trim(),
        model: model.trim(),
        year: Number(year),
        fuelType,
        engineCapacity: engineCapacity.trim(),
        mileage: Number(mileage),
        regNumber: regNumber.trim().toUpperCase(),
        color: color.trim(),
        vin: vin.trim() || `VIN${Date.now().toString().slice(-8)}`,
        healthScore: vehicle ? vehicle.healthScore : 95,
      },
      vehicle?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-lg border border-brand-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-brand-border flex items-center justify-between bg-brand-veryLight/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-lightSky text-brand-skyHover flex items-center justify-center">
              <Car size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-navy">
                {vehicle ? 'Edit Vehicle Specifications' : 'Add New Vehicle to Garage'}
              </h3>
              <p className="text-xs text-brand-slate">
                Vehicle specs are used to calibrate AI diagnostic accuracy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-brand-navy hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-slate mb-1">
                Make / Brand *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Yamaha, Hyundai, Honda"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-sky/20 focus:border-brand-sky focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-slate mb-1">
                Model Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. R15 V4, i20 Asta, Activa"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-sky/20 focus:border-brand-sky focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-brand-slate mb-1">Year</label>
              <input
                type="number"
                min={2000}
                max={2027}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-sky/20 focus:border-brand-sky focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-slate mb-1">Fuel</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as Vehicle['fuelType'])}
                className="w-full px-2 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-sky/20 focus:border-brand-sky focus:outline-none bg-white"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-slate mb-1">Capacity</label>
              <input
                type="text"
                placeholder="155cc / 1.2L"
                value={engineCapacity}
                onChange={(e) => setEngineCapacity(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-sky/20 focus:border-brand-sky focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-slate mb-1">
                Current Odometer (km)
              </label>
              <input
                type="number"
                min={0}
                value={mileage}
                onChange={(e) => setMileage(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-sky/20 focus:border-brand-sky focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-slate mb-1">
                Reg Number *
              </label>
              <input
                type="text"
                required
                placeholder="KA 03 HM 4421"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                className="w-full px-3.5 py-2 text-xs uppercase font-mono rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-sky/20 focus:border-brand-sky focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-slate mb-1">Color</label>
              <input
                type="text"
                placeholder="e.g. Racing Blue"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-sky/20 focus:border-brand-sky focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-slate mb-1">VIN (Optional)</label>
              <input
                type="text"
                placeholder="17-character VIN"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-sky/20 focus:border-brand-sky focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-brand-border flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" leftIcon={<CheckCircle2 size={16} />}>
              {vehicle ? 'Save Changes' : 'Add to Garage'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
