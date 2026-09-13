import { Diagnosis, Vehicle } from '../../types';
import { AiServiceAdapter, SymptomDiagnosisInput } from './index';

export class MockAiService implements AiServiceAdapter {
  async symptomDiagnosis(input: SymptomDiagnosisInput): Promise<Diagnosis> {
    // Artificial delay to simulate real AI processing pipeline
    await new Promise((res) => setTimeout(res, 800));

    const sym = input.symptoms.toLowerCase();
    const isBattery = sym.includes('click') || sym.includes('start') || sym.includes('battery') || sym.includes('crank');
    const isBrake = sym.includes('brake') || sym.includes('squeal') || sym.includes('grind') || sym.includes('stop');
    const isOverheat = sym.includes('heat') || sym.includes('hot') || sym.includes('smoke') || sym.includes('coolant') || sym.includes('steam');

    if (isBrake) {
      return {
        id: `diag_${Date.now()}`,
        vehicleId: input.vehicle.id || 'veh_01',
        userId: 'usr_owner_01',
        title: 'Brake Pad Degradation & Rotor Glaze',
        category: 'Braking System',
        severity: 'high',
        confidence: 88,
        possibleCauses: [
          { name: 'Worn Brake Friction Pads', confidence: 88, description: 'Pads below 3mm safety margin contacting rotor' },
          { name: 'Rotor Surface Glazing', confidence: 45, description: 'Heat-tempered disc causing reduced friction' },
          { name: 'Floating Caliper Pin Sticking', confidence: 22, description: 'Uneven wear due to unlubricated slider pins' },
        ],
        reasoning: [
          'Acoustic squeal matches wear-indicator harmonic frequency',
          'Mileage indicates brake wear cycle is near threshold',
          'Symptom occurs during active mechanical deceleration',
        ],
        recommendation: {
          priority: 'high',
          action: 'Inspect front and rear brake pads; replace if friction material is under 3mm',
          avoid: 'Avoid high-speed driving or riding the brake lever/pedal',
        },
        estimatedCost: {
          min: 2200,
          max: 4200,
          currency: 'INR',
          partsCost: 2400,
          labourCost: 800,
          inspectionCost: 200,
        },
        safetyWarning: 'Braking distance may increase. Consult a qualified mechanic immediately before highway trips.',
        inputSymptoms: input.symptoms,
        additionalContext: input.additionalContext,
        status: 'preliminary',
        createdAt: new Date().toISOString(),
      };
    }

    if (isOverheat) {
      return {
        id: `diag_${Date.now()}`,
        vehicleId: input.vehicle.id || 'veh_01',
        userId: 'usr_owner_01',
        title: 'Engine Thermal Overheating Alert',
        category: 'Cooling System',
        severity: 'critical',
        confidence: 91,
        possibleCauses: [
          { name: 'Low Coolant Level / Radiator Leak', confidence: 91, description: 'Insufficient heat transfer medium in circulation' },
          { name: 'Radiator Fan Relay Failure', confidence: 54, description: 'Cooling fan not triggering at high temperature threshold' },
          { name: 'Thermostat Valve Jammed Shut', confidence: 38, description: 'Coolant circulation blocked from engine jacket' },
        ],
        reasoning: [
          'High thermal readout reported during engine load',
          'Possible loss of cooling system pressure or fluid volume',
          'Symptoms indicate risk of head gasket damage if continued',
        ],
        recommendation: {
          priority: 'urgent',
          action: 'Allow vehicle to cool down fully; inspect coolant reservoir level safely',
          avoid: 'DO NOT open the radiator cap while the engine is hot. Do not drive while overheating.',
        },
        estimatedCost: {
          min: 1500,
          max: 5500,
          currency: 'INR',
          partsCost: 2500,
          labourCost: 1200,
          inspectionCost: 300,
        },
        safetyWarning: '⚠ Severe Safety Warning: Do not continue driving. Engine overheating can cause catastrophic internal seizure.',
        inputSymptoms: input.symptoms,
        additionalContext: input.additionalContext,
        status: 'preliminary',
        createdAt: new Date().toISOString(),
      };
    }

    // Default Starting / Battery issue
    return {
      id: `diag_${Date.now()}`,
      vehicleId: input.vehicle.id || 'veh_01',
      userId: 'usr_owner_01',
      title: 'Possible Weak Battery',
      category: 'Starting System',
      severity: 'medium',
      confidence: 82,
      possibleCauses: [
        { name: 'Weak Battery', confidence: 82, description: 'Voltage drops below 10.5V under starter load' },
        { name: 'Starter Relay Resistance', confidence: 51, description: 'Clicking sound indicates relay trigger without motor spin' },
        { name: 'Starter Motor Wear', confidence: 27, description: 'Carbon brushes worn or armature commutator oxidized' },
      ],
      reasoning: [
        'Clicking occurs during ignition startup',
        'The symptom is strongly associated with insufficient electrical current',
        'Vehicle age makes battery chemical degradation a plausible primary factor',
      ],
      recommendation: {
        priority: 'medium',
        action: 'Check battery resting voltage and inspect terminal connectors for oxidation',
        avoid: 'Do not replace the starter motor before testing battery state-of-health',
      },
      estimatedCost: {
        min: 1800,
        max: 3500,
        currency: 'INR',
        partsCost: 1800,
        labourCost: 700,
        inspectionCost: 200,
      },
      safetyWarning: null,
      inputSymptoms: input.symptoms,
      additionalContext: input.additionalContext,
      status: 'preliminary',
      createdAt: new Date().toISOString(),
    };
  }

  async imageDiagnosis(imageUrl: string, vehicle: Partial<Vehicle>): Promise<Partial<Diagnosis>> {
    await new Promise((res) => setTimeout(res, 600));
    return {
      title: 'Visual Surface Inspection: Component Wear',
      category: 'Visual Diagnostics',
      confidence: 84,
      reasoning: [
        'Visual pattern recognition identified surface degradation on component',
        `Vehicle context (${vehicle.make || 'Vehicle'} ${vehicle.model || ''}) cross-referenced with component geometry`,
      ],
    };
  }

  async audioAnalysis(audioUrl: string, vehicle: Partial<Vehicle>): Promise<Partial<Diagnosis>> {
    await new Promise((res) => setTimeout(res, 600));
    return {
      title: 'Acoustic Signature: Frequency Anomaly',
      category: 'Audio Diagnostics',
      confidence: 76,
      reasoning: [
        'Acoustic waveform analysis detected intermittent repetitive clicking frequency',
        'Harmonic signature matches relay solenoid oscillation',
      ],
    };
  }

  async costEstimation(diagnosisTitle: string, vehicleModel: string): Promise<Diagnosis['estimatedCost']> {
    return {
      min: 1800,
      max: 3500,
      currency: 'INR',
      partsCost: 1800,
      labourCost: 700,
      inspectionCost: 200,
    };
  }

  async maintenancePrediction(vehicle: Vehicle): Promise<{ recommendations: string[]; priority: string }> {
    return {
      recommendations: [
        'Brake pad wear check recommended within 500 km',
        'Engine oil change due at next scheduled service interval',
      ],
      priority: 'medium',
    };
  }

  async assistantResponse(
    query: string,
    context: { vehicle?: Vehicle; previousDiagnoses?: Diagnosis[] }
  ): Promise<{
    message: string;
    suggestedAction?: { label: string; type: 'diagnosis' | 'mechanic' | 'upload' };
  }> {
    await new Promise((res) => setTimeout(res, 500));
    const q = query.toLowerCase();

    if (q.includes('overheat') || q.includes('hot')) {
      return {
        message:
          'Overheating can have several causes. If the temperature gauge is in the red zone, stop riding and allow the vehicle to cool safely. Possible causes include low coolant, radiator issues, or oil degradation. Would you like to start a structured diagnosis?',
        suggestedAction: {
          label: 'Start Thermal Diagnosis',
          type: 'diagnosis',
        },
      };
    }

    if (q.includes('battery') || q.includes('click') || q.includes('start')) {
      return {
        message:
          'A clicking sound or failure to start usually points toward a discharged battery, loose terminal connection, or starter relay issue. Let me run our AI diagnostic tool to estimate repair costs.',
        suggestedAction: {
          label: 'Diagnose Starting System',
          type: 'diagnosis',
        },
      };
    }

    return {
      message: `I'm your DriveIQ assistant for your ${context.vehicle ? `${context.vehicle.year} ${context.vehicle.make} ${context.vehicle.model}` : 'vehicle'}. Describe any symptom, sound, or warning light you're noticing, and I'll help you identify possible causes with confidence scores.`,
      suggestedAction: {
        label: 'Start AI Diagnosis',
        type: 'diagnosis',
      },
    };
  }
}

export const mockAiService = new MockAiService();
export const aiService = mockAiService;

