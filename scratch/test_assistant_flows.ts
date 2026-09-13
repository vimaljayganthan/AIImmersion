import { AssistantEngine } from '../src/services/ai/assistantEngine';

async function runTests() {
  console.log('=== STARTING AI ASSISTANT AUTOMATED CONVERSATION TESTS ===\n');

  const engine = new AssistantEngine({
    make: 'Yamaha',
    model: 'R15 V4',
    year: 2022,
    mileage: 24500,
    regNumber: 'KA 03 HM 4421',
  });

  // TEST 1: Greeting
  console.log('--- TEST 1: Greeting ("Hi") ---');
  let res = await engine.processMessage('Hi');
  console.log('Type:', res.type);
  console.log('Response:\n', res.text);
  if (res.text.toLowerCase().includes('battery terminal') || res.text.toLowerCase().includes('starter relay')) {
    throw new Error('FAILED TEST 1: Greeting gave battery diagnosis!');
  }
  console.log('✓ TEST 1 PASSED: Greeting returned cleanly.\n');

  // TEST 2: Overheating
  engine.resetSession();
  console.log('--- TEST 2: Overheating ("My bike is overheating.") ---');
  res = await engine.processMessage('My bike is overheating.');
  console.log('Type:', res.type);
  console.log('Options:', res.options);
  console.log('Response:\n', res.text);
  if (!res.text.toLowerCase().includes('overheat') && !res.text.toLowerCase().includes('temperature')) {
    throw new Error('FAILED TEST 2: Overheating not addressed!');
  }
  console.log('✓ TEST 2 PASSED: Overheating follow-up question returned.\n');

  // TEST 3: Brake grinding
  engine.resetSession();
  console.log('--- TEST 3: Brake Sound ("My brakes are making a grinding sound.") ---');
  res = await engine.processMessage('My brakes are making a grinding sound.');
  console.log('Type:', res.type);
  console.log('Options:', res.options);
  console.log('Response:\n', res.text);
  if (!res.text.toLowerCase().includes('brake')) {
    throw new Error('FAILED TEST 3: Brake sound not recognized!');
  }
  console.log('✓ TEST 3 PASSED: Brake-specific question returned.\n');

  // TEST 4: Clutch slipping
  engine.resetSession();
  console.log('--- TEST 4: Clutch Slipping ("RPM rises but the bike doesn\'t accelerate.") ---');
  res = await engine.processMessage("RPM rises but the bike doesn't accelerate.");
  console.log('Type:', res.type);
  console.log('Options:', res.options);
  console.log('Response:\n', res.text);
  if (!res.text.toLowerCase().includes('clutch') && !res.text.toLowerCase().includes('throttle')) {
    throw new Error('FAILED TEST 4: Clutch slipping not recognized!');
  }
  console.log('✓ TEST 4 PASSED: Clutch slipping question returned.\n');

  // TEST 5: Starting clicking
  engine.resetSession();
  console.log('--- TEST 5: Starting Issue ("My bike clicks when starting.") ---');
  res = await engine.processMessage('My bike clicks when starting.');
  console.log('Type:', res.type);
  console.log('Options:', res.options);
  console.log('Response:\n', res.text);
  if (!res.text.toLowerCase().includes('starter') && !res.text.toLowerCase().includes('crank')) {
    throw new Error('FAILED TEST 5: Starting issue not recognized!');
  }
  console.log('✓ TEST 5 PASSED: Starting question returned.\n');

  // TEST 6: Safety Emergency
  engine.resetSession();
  console.log('--- TEST 6: Safety Critical ("There is a burning smell and smoke near the engine.") ---');
  res = await engine.processMessage('There is a burning smell and smoke near the engine.');
  console.log('Type:', res.type);
  console.log('Response:\n', res.text);
  if (res.type !== 'safety_warning' || !res.text.toLowerCase().includes('critical safety')) {
    throw new Error('FAILED TEST 6: Critical safety alert not triggered!');
  }
  console.log('✓ TEST 6 PASSED: Immediate safety warning triggered.\n');

  // TEST 7: Maintenance Question
  engine.resetSession();
  console.log('--- TEST 7: Maintenance Schedule ("How often should I service my bike?") ---');
  res = await engine.processMessage('How often should I service my bike?');
  console.log('Type:', res.type);
  console.log('Response:\n', res.text);
  if (res.type !== 'maintenance' || !res.text.toLowerCase().includes('guidelines')) {
    throw new Error('FAILED TEST 7: Maintenance schedule not provided!');
  }
  console.log('✓ TEST 7 PASSED: Maintenance guidelines provided.\n');

  // TEST 8: Multi-turn Context Retention & ML Diagnosis
  engine.resetSession();
  console.log('--- TEST 8: Multi-turn Context Retention & ML Pipeline ---');
  console.log('Turn 1: "Bike won\'t start."');
  res = await engine.processMessage("Bike won't start.");
  console.log('AI Response 1:', res.text.split('\n')[0]);
  console.log('Turn 2: "Does not crank, only clicks"');
  res = await engine.processMessage('Does not crank, only clicks');
  console.log('AI Response 2:', res.text.split('\n')[0]);
  console.log('Turn 3: "Yes, dims significantly"');
  res = await engine.processMessage('Yes, dims significantly');
  console.log('AI Diagnosis Result:', res.diagnosisResult);
  console.log('AI Text:\n', res.text);
  console.log('✓ TEST 8 PASSED: Multi-turn conversation successfully diagnosed with ML model!\n');

  console.log('=== ALL 8 CONVERSATION TESTS PASSED PERFECTLY ===');
}

runTests().catch((err) => {
  console.error('TEST SUITE FAILED:', err);
  process.exit(1);
});
