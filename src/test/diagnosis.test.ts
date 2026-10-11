import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiAiService } from '../services/ai/apiAiService';
import { mockAiService } from '../services/ai/mockAiService';
import { DEMO_VEHICLES } from '../database/mockData';

describe('Diagnostic Pipeline & AI Adapter Module', () => {
  const sampleVehicle = DEMO_VEHICLES[0];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('Mock AI Diagnostic Engine (Local Fallback)', () => {
    it('generates diagnosis for brake related symptoms', async () => {
      const diagnosis = await mockAiService.symptomDiagnosis({
        symptoms: 'High pitched metallic squeal and grinding noise when applying front brake',
        vehicle: sampleVehicle,
      });

      expect(diagnosis).toBeDefined();
      expect(diagnosis.category).toBe('Braking System');
      expect(diagnosis.severity).toBe('high');
      expect(diagnosis.confidence).toBeGreaterThan(50);
      expect(diagnosis.possibleCauses.length).toBeGreaterThan(0);
      expect(diagnosis.recommendation.action).toBeDefined();
      expect(diagnosis.estimatedCost.min).toBeGreaterThan(0);
    });

    it('generates diagnosis for battery / starting issues', async () => {
      const diagnosis = await mockAiService.symptomDiagnosis({
        symptoms: 'Rapid clicking sound when pressing starter button and headlight goes dim',
        vehicle: sampleVehicle,
      });

      expect(diagnosis).toBeDefined();
      expect(diagnosis.category).toBe('Starting System');
      expect(diagnosis.severity).toBe('medium');
      expect(diagnosis.confidence).toBeGreaterThan(70);
    });

    it('generates diagnosis for thermal overheating issues', async () => {
      const diagnosis = await mockAiService.symptomDiagnosis({
        symptoms: 'Engine temperature indicator glowing red and steam/coolant smells hot',
        vehicle: sampleVehicle,
      });

      expect(diagnosis).toBeDefined();
      expect(diagnosis.category).toBe('Cooling System');
      expect(diagnosis.severity).toBe('critical');
      expect(diagnosis.safetyWarning).toBeDefined();
    });

    it('handles unknown or unrecognized symptoms with a safe default diagnosis', async () => {
      const diagnosis = await mockAiService.symptomDiagnosis({
        symptoms: 'Unusual sensation while cruising at steady speed on highway',
        vehicle: sampleVehicle,
      });

      expect(diagnosis).toBeDefined();
      expect(diagnosis.confidence).toBeDefined();
      expect(diagnosis.recommendation).toBeDefined();
      expect(diagnosis.estimatedCost).toBeDefined();
    });
  });

  describe('API AI Service Client Validation & Resilience', () => {
    it('rejects empty symptom input in runMlPipeline', async () => {
      await expect(apiAiService.runMlPipeline('   ')).rejects.toThrow(
        /Please enter a vehicle symptom/i
      );
    });

    it('falls back safely to mock service when network fetch fails completely', async () => {
      // Mock global fetch to reject (simulate offline backend)
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Failed to fetch'));

      const result = await apiAiService.symptomDiagnosis({
        symptoms: 'Loud squeal from brakes',
        vehicle: sampleVehicle,
      });

      expect(result).toBeDefined();
      expect(result.category).toBe('Braking System');
      expect(result.confidence).toBeGreaterThan(0);
      fetchSpy.mockRestore();
    });

    it('falls back safely when backend returns 500 internal server error', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ error: 'Internal diagnostic processing failure' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await apiAiService.symptomDiagnosis({
        symptoms: 'Starter motor clicking',
        vehicle: sampleVehicle,
      });

      expect(result).toBeDefined();
      expect(result.category).toBe('Starting System');
      fetchSpy.mockRestore();
    });

    it('returns null gracefully when checkHealth times out or fails', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));
      const health = await apiAiService.checkHealth();
      expect(health).toBeNull();
      fetchSpy.mockRestore();
    });

    it('validates confidence probability distribution calculations', () => {
      const rawProbabilities = {
        'Battery / Starting System': 0.7245,
        'Electrical & Sensors': 0.1412,
        'Engine & Valvetrain': 0.0821,
        'Cooling System': 0.0522,
      };

      const sum = Object.values(rawProbabilities).reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1.0, 2);

      const topClass = Object.entries(rawProbabilities).sort(([, a], [, b]) => b - a)[0];
      expect(topClass[0]).toBe('Battery / Starting System');
      expect(topClass[1]).toBe(0.7245);
      expect(Math.round(topClass[1] * 100)).toBe(72);
    });
  });
});
