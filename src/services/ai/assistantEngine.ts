import { Vehicle, Diagnosis } from '../../types';
import { apiAiService } from './apiAiService';
import { AiPreferences } from '../../context/SettingsContext';

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  type?: 'text' | 'question' | 'diagnosis' | 'safety_warning' | 'maintenance' | 'booking';
  options?: string[];
  diagnosisResult?: {
    category: string;
    diagnosis: string;
    confidence: number;
    severity: 'Low' | 'Moderate' | 'High' | 'Critical' | string;
    recommendations: string[];
    evidence: string[];
    modelInfo?: string;
  };
  suggestedActions?: Array<{
    label: string;
    type: 'diagnosis' | 'mechanic' | 'question' | 'input';
    payload?: string;
  }>;
}

export interface AssistantSession {
  sessionId: string;
  vehicleContext?: Partial<Vehicle>;
  primarySymptom?: string;
  identifiedCategory?: string;
  symptoms: string[];
  conditions: string[];
  questionsAsked: string[];
  answers: Record<string, string>;
  step: number;
  confidence?: number;
  isSafetyCritical?: boolean;
}

interface QuestionNode {
  id: string;
  question: string;
  options: string[];
  category: string;
}

const QUESTION_BANK: Record<string, QuestionNode[]> = {
  starting: [
    {
      id: 'cranking_behavior',
      question: 'Does the engine crank at all when you press the starter button, or do you only hear clicking?',
      options: ['Does not crank, only clicks', 'Cranks very slowly', 'Cranks normally but does not fire', 'Completely silent / no response'],
      category: 'starting',
    },
    {
      id: 'headlight_dimming',
      question: 'Do the headlights or dashboard console dim noticeably when you press the starter switch?',
      options: ['Yes, dims significantly', 'No, stays bright', 'Console resets / shuts off'],
      category: 'starting',
    },
    {
      id: 'battery_age',
      question: 'When was the vehicle battery last inspected, charged, or replaced?',
      options: ['Over 2 years old', 'Recently replaced', 'Not sure / Original factory battery'],
      category: 'starting',
    },
  ],
  overheating: [
    {
      id: 'overheat_condition',
      question: 'When does the temperature spike into the warning zone?',
      options: ['Mostly in slow stop-and-go traffic', 'At continuous cruising speeds', 'Immediately after a few minutes of starting'],
      category: 'overheating',
    },
    {
      id: 'coolant_level',
      question: 'Is the coolant reservoir level below the minimum mark or is there visible steam under the hood?',
      options: ['Coolant is below MIN mark', 'Visible steam / sweet smell', 'Coolant level appears normal'],
      category: 'overheating',
    },
    {
      id: 'radiator_fan',
      question: 'Can you hear or verify the radiator electric cooling fan spinning when the temperature rises?',
      options: ['Fan does NOT turn on', 'Fan spins loudly', 'Not sure'],
      category: 'overheating',
    },
  ],
  brakes: [
    {
      id: 'brake_sensation',
      question: 'What specific noise or lever sensation are you experiencing?',
      options: ['High-pitched squealing / screeching', 'Metal-on-metal grinding sound', 'Spongy / soft lever with excessive travel', 'Pulsing / vibrating lever'],
      category: 'brakes',
    },
    {
      id: 'brake_stability',
      question: 'Does the vehicle pull to one side or feel unstable when applying the brakes firmly?',
      options: ['Pulls to one side', 'Stopping distance is noticeably longer', 'No pulling, just noise'],
      category: 'brakes',
    },
  ],
  clutch: [
    {
      id: 'clutch_slip_behavior',
      question: 'When twisting the throttle, does engine RPM shoot up without matching vehicle acceleration?',
      options: ['Yes, RPM rises high but bike does not accelerate', 'Hard clunking / difficulty shifting gears', 'Difficulty finding neutral when stopped'],
      category: 'clutch',
    },
    {
      id: 'clutch_gear_range',
      question: 'Does this slipping occur primarily under heavy throttle in higher gears (4th/5th) or in all gears?',
      options: ['Higher gears under acceleration', 'All gears', 'Only when the engine is cold'],
      category: 'clutch',
    },
  ],
  noise: [
    {
      id: 'noise_type',
      question: 'Where does the unusual sound seem to originate, and what character does it have?',
      options: ['Ticking/clicking from upper cylinder head', 'Deep knocking sound from lower crankcase', 'Rattling chain sound from side casing'],
      category: 'noise',
    },
    {
      id: 'noise_rpm_relation',
      question: 'Does the frequency of the noise increase directly in sync with engine RPM?',
      options: ['Yes, speeds up with throttle', 'Only audible at idle', 'Only audible under deceleration'],
      category: 'noise',
    },
  ],
  electrical: [
    {
      id: 'electrical_behavior',
      question: 'Which electrical symptom are you noticing?',
      options: ['Battery drains overnight / discharged', 'Headlights flicker with engine revs', 'Intermittent instrument cluster blackout', 'Horn or turn signals weak'],
      category: 'electrical',
    },
  ],
};

export class AssistantEngine {
  private session: AssistantSession;
  private preferences: AiPreferences;

  constructor(
    initialVehicle?: Partial<Vehicle>,
    prefs?: AiPreferences
  ) {
    this.session = {
      sessionId: `asst_${Date.now()}`,
      vehicleContext: initialVehicle,
      symptoms: [],
      conditions: [],
      questionsAsked: [],
      answers: {},
      step: 0,
    };
    this.preferences = prefs || {
      responseStyle: 'balanced',
      askFollowUp: true,
      showEvidence: true,
      showConfidence: true,
      considerServiceHistory: true,
      considerMileage: true,
      safetyWarnings: true,
    };
  }

  public setPreferences(prefs: AiPreferences) {
    this.preferences = prefs;
  }

  public setVehicle(vehicle: Partial<Vehicle>) {
    this.session.vehicleContext = vehicle;
  }

  public getSession(): AssistantSession {
    return this.session;
  }

  public resetSession(vehicle?: Partial<Vehicle>) {
    this.session = {
      sessionId: `asst_${Date.now()}`,
      vehicleContext: vehicle || this.session.vehicleContext,
      symptoms: [],
      conditions: [],
      questionsAsked: [],
      answers: {},
      step: 0,
    };
  }

  /**
   * Main conversational pipeline:
   * Intent -> Context & Safety Analysis -> Multi-turn Question / ML Diagnosis -> Assistant Response
   */
  public async processMessage(userText: string): Promise<AssistantMessage> {
    const raw = userText.trim();
    const q = raw.toLowerCase();
    const vehicle = this.session.vehicleContext;
    const vehicleName = vehicle ? `${vehicle.make || 'Vehicle'} ${vehicle.model || ''}`.trim() : 'your vehicle';
    const mileageStr = vehicle?.mileage ? `${vehicle.mileage.toLocaleString()} km` : '';

    // 1. SAFETY CRITICAL CHECK
    const isSafetyCritical = this.checkSafetyCritical(q);
    if (isSafetyCritical) {
      this.session.isSafetyCritical = true;
      this.session.symptoms.push(raw);
      return {
        id: `msg_${Date.now()}`,
        sender: 'ai',
        type: 'safety_warning',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `CRITICAL SAFETY ALERT: Based on your description ("${raw}"), this indicates a potential safety hazard (such as smoke, fire risk, or severe braking/fluid loss).

• Immediately bring the vehicle to a safe stop and turn off the ignition.
• Do not attempt to continue riding or driving under load.
• Inspect from a safe distance for active fluid leaks or smoke.
• We recommend contacting verified roadside assistance or having a certified mechanic inspect the vehicle before restarting.`,
        suggestedActions: [
          { label: 'Find Verified Mechanic', type: 'mechanic' },
          { label: 'Run Full AI Diagnostic Assessment', type: 'diagnosis' },
        ],
      };
    }

    // 2. GREETINGS & POLITE INTENTS
    if (this.isGreeting(q)) {
      return {
        id: `msg_${Date.now()}`,
        sender: 'ai',
        type: 'text',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Hello! I am DriveIQ Assistant, your intelligent vehicle diagnostic partner${vehicle ? ` for your ${vehicleName}${mileageStr ? ` (${mileageStr})` : ''}` : ''}.

What symptom, sound, or warning indicator are you experiencing with your vehicle?`,
        suggestedActions: [
          { label: 'Clicking sound when starting', type: 'input', payload: 'Clicking sound when starting the bike' },
          { label: 'Engine is overheating', type: 'input', payload: 'Engine is overheating and coolant is hot' },
          { label: 'Squealing noise from brakes', type: 'input', payload: 'High pitched squealing sound from front brakes' },
          { label: 'Clutch slipping on throttle', type: 'input', payload: 'Clutch slipping RPM shoots high without acceleration' },
        ],
      };
    }

    // 3. GRATITUDE / CLOSURE INTENTS
    if (this.isThanks(q)) {
      return {
        id: `msg_${Date.now()}`,
        sender: 'ai',
        type: 'text',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `You're very welcome! If the issue recurs or you notice any new symptoms, feel free to describe them anytime. Drive and ride safely!`,
      };
    }

    // 4. MAINTENANCE & SERVICE SCHEDULE QUESTIONS
    if (this.isMaintenanceQuestion(q)) {
      return {
        id: `msg_${Date.now()}`,
        sender: 'ai',
        type: 'maintenance',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Maintenance Guidelines for ${vehicleName}${mileageStr ? ` (Current Odometer: ${mileageStr})` : ''}:

• Engine Oil & Filter: Inspect level every 1,500 km; replace every 3,000–5,000 km (or synthetic at 8,000 km).
• Brake System: Inspect brake pad thickness (minimum 2.5mm) and flush DOT-4 brake fluid every 2 years / 15,000 km.
• Drive Chain / Transmission: Clean & lubricate chain every 500 km; check clutch cable free-play (10–15mm).
• Spark Plug & Air Filter: Clean air filter every 4,000 km; replace spark plug every 12,000 km.
• Battery Health: Resting voltage should remain >12.4V (cranking load >10.2V).`,
        suggestedActions: [
          { label: 'Book Preventative Service', type: 'mechanic' },
          { label: 'Diagnose a Specific Problem', type: 'input', payload: 'I am experiencing a problem in my vehicle' },
        ],
      };
    }

    // 5. BOOKING / MECHANIC INTENTS
    if (q.includes('book') || q.includes('mechanic') || q.includes('kumar motors') || q.includes('workshop')) {
      return {
        id: `msg_${Date.now()}`,
        sender: 'ai',
        type: 'booking',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `I can help connect your diagnostic profile directly with verified service centers such as Kumar Motors Workshop in Indiranagar.

Would you like to schedule an inspection booking with your recorded vehicle symptoms attached?`,
        suggestedActions: [
          { label: 'Schedule with Kumar Motors', type: 'mechanic' },
          { label: 'Run Diagnostic First', type: 'diagnosis' },
        ],
      };
    }

    // 6. SYMPTOM DIAGNOSIS CONVERSATION
    // Determine category
    let category = this.session.identifiedCategory || this.detectCategory(q);
    if (!this.session.identifiedCategory && category) {
      this.session.identifiedCategory = category;
      this.session.primarySymptom = raw;
    }

    // Record symptom / answer
    if (this.session.questionsAsked.length > 0) {
      const lastQ = this.session.questionsAsked[this.session.questionsAsked.length - 1];
      this.session.answers[lastQ] = raw;
      this.session.conditions.push(raw);
    } else {
      this.session.symptoms.push(raw);
    }

    this.session.step += 1;

    // Check if we should ask follow-up questions
    const categoryQuestions = QUESTION_BANK[category || 'starting'] || QUESTION_BANK.starting;
    const unasked = categoryQuestions.filter((node) => !this.session.questionsAsked.includes(node.id));

    // If follow-ups enabled and we still have unasked questions and haven't asked 2 yet
    if (this.preferences.askFollowUp && unasked.length > 0 && this.session.questionsAsked.length < 2) {
      const nextQ = unasked[0];
      this.session.questionsAsked.push(nextQ.id);

      let intro = '';
      if (this.session.questionsAsked.length === 1) {
        intro = this.getCategoryIntro(category, raw);
      } else {
        intro = `Understood, noting "${raw}". To narrow down the root cause further:`;
      }

      return {
        id: `msg_${Date.now()}`,
        sender: 'ai',
        type: 'question',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `${intro}\n\n${nextQ.question}`,
        options: nextQ.options,
        suggestedActions: nextQ.options.map((opt) => ({
          label: opt,
          type: 'input',
          payload: opt,
        })),
      };
    }

    // 7. SUFFICIENT EVIDENCE GATHERED -> INVOKE REAL ML DIAGNOSTIC PIPELINE
    const combinedSymptom = [
      this.session.primarySymptom || raw,
      ...this.session.symptoms,
      ...this.session.conditions,
    ].join(' ');

    const vehicleCtx = `${vehicle?.make || ''} ${vehicle?.model || ''} ${vehicle?.year || ''} ${vehicle?.mileage ? vehicle.mileage + 'km' : ''}`.trim();

    try {
      const mlResult = await apiAiService.runMlPipeline(combinedSymptom, vehicleCtx);
      const topCat = mlResult.stage3.prediction;
      const prob = mlResult.stage3.probability || 0.75;
      const pct = (prob * 100).toFixed(0);

      const isHighConfidence = prob >= 0.60;
      const topEvidence = mlResult.stage2.top_features.slice(0, 3).map((f) => `Acoustic / symptom signal identified: '${f.term}' (TF-IDF weight: ${f.weight})`);

      const diagTitle = mlResult.stage4.diagnosis || `Possible ${topCat} Issue`;
      const recommendation = mlResult.stage4.recommendation || 'Inspect with a certified automotive technician.';

      let explanationText = '';
      if (isHighConfidence) {
        explanationText = `Based on your symptom inputs and our Random Forest ML Fault Classifier, the leading diagnostic candidate is:

**${diagTitle}**
Model Probability: **${pct}%** (${mlResult.stage3.model})`;
      } else {
        explanationText = `The symptom inputs show multi-category likelihood. Leading possibility is **${topCat}** (${pct}% probability), but further inspection is recommended.`;
      }

      if (this.preferences.considerMileage && vehicle?.mileage) {
        explanationText += `\n\n*Vehicle Context:* Cross-referenced with your ${vehicleName} at ${mileageStr}.`;
      }

      if (this.preferences.showEvidence && topEvidence.length > 0) {
        explanationText += `\n\n**Diagnostic Evidence:**\n${topEvidence.map((e) => `• ${e}`).join('\n')}`;
      }

      explanationText += `\n\n**Recommended Action:**\n${recommendation}`;

      return {
        id: `msg_${Date.now()}`,
        sender: 'ai',
        type: 'diagnosis',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: explanationText,
        diagnosisResult: {
          category: topCat,
          diagnosis: diagTitle,
          confidence: prob,
          severity: mlResult.stage4.severity || 'Moderate',
          recommendations: [recommendation],
          evidence: topEvidence,
          modelInfo: mlResult.stage3.model,
        },
        suggestedActions: [
          { label: 'View Full ML Pipeline Inspector', type: 'diagnosis' },
          { label: 'Book Repair with Kumar Motors', type: 'mechanic' },
        ],
      };
    } catch (err) {
      console.warn('[AssistantEngine] ML pipeline call failed, providing structured knowledge fallback:', err);
      return {
        id: `msg_${Date.now()}`,
        sender: 'ai',
        type: 'text',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Based on your description ("${combinedSymptom}") for your ${vehicleName}:

• Potential Issue: ${category.toUpperCase()} system irregularity
• Recommended Step: Measure circuit voltage and perform visual inspection of connectors.

Would you like to run the complete multi-modal AI Diagnostic scan?`,
        suggestedActions: [
          { label: 'Run Full AI Diagnostic Scan', type: 'diagnosis' },
          { label: 'Schedule Workshop Inspection', type: 'mechanic' },
        ],
      };
    }
  }

  private isGreeting(q: string): boolean {
    const greetings = ['hi', 'hello', 'hey', 'good morning', 'good evening', 'good afternoon', 'hola', 'namaste'];
    return greetings.some((g) => q === g || q.startsWith(g + ' ') || q.startsWith(g + '!'));
  }

  private isThanks(q: string): boolean {
    const thanks = ['thanks', 'thank you', 'ok thanks', 'great thanks', 'appreciated', 'ok got it', 'got it'];
    return thanks.some((t) => q.includes(t));
  }

  private isMaintenanceQuestion(q: string): boolean {
    return q.includes('service') && (q.includes('often') || q.includes('when') || q.includes('interval') || q.includes('schedule') || q.includes('oil change'));
  }

  private checkSafetyCritical(q: string): boolean {
    const safetyKeywords = [
      'smoke',
      'fire',
      'burning smell',
      'brakes failed',
      'brake failure',
      'cannot stop',
      'fuel leak',
      'petrol leaking',
      'steering locked',
      'wheel detached',
      'tyre burst',
    ];
    return safetyKeywords.some((kw) => q.includes(kw));
  }

  private detectCategory(q: string): string {
    if (q.includes('start') || q.includes('click') || q.includes('battery') || q.includes('crank') || q.includes('turn over')) {
      return 'starting';
    }
    if (q.includes('overheat') || q.includes('temp') || q.includes('hot') || q.includes('coolant') || q.includes('radiator') || q.includes('boil')) {
      return 'overheating';
    }
    if (q.includes('brake') || q.includes('squeal') || q.includes('screech') || q.includes('grind') || q.includes('stopping')) {
      return 'brakes';
    }
    if (q.includes('clutch') || q.includes('rpm') || q.includes('accelerat') || q.includes('slip') || q.includes('gear')) {
      return 'clutch';
    }
    if (q.includes('noise') || q.includes('knock') || q.includes('tick') || q.includes('rattle') || q.includes('sound')) {
      return 'noise';
    }
    if (q.includes('light') || q.includes('fuse') || q.includes('wiring') || q.includes('electric') || q.includes('horn') || q.includes('flicker')) {
      return 'electrical';
    }
    return 'starting';
  }

  private getCategoryIntro(category: string, symptom: string): string {
    switch (category) {
      case 'starting':
        return `Understood. Starting and cranking difficulties typically involve the battery state-of-health, starter solenoid circuit, or starter motor brushes.`;
      case 'overheating':
        return `Understood. Overheating requires careful diagnosis to prevent cylinder head warpage and thermal seizure.`;
      case 'brakes':
        return `Understood. Brake friction and hydraulic issues directly affect vehicle safety.`;
      case 'clutch':
        return `Understood. RPM flare-ups without vehicle acceleration indicate clutch friction plate wear or cable adjustment issues.`;
      case 'noise':
        return `Understood. Mechanical engine acoustic signatures help isolate valvetrain versus crankcase anomalies.`;
      case 'electrical':
        return `Understood. Electrical charging and sensor anomalies can cause intermittent voltage fluctuations.`;
      default:
        return `Understood. To help narrow down the root cause of "${symptom}":`;
    }
  }
}
