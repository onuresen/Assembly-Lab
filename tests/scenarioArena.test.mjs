import test from 'node:test'
import assert from 'node:assert/strict'
import { analyzeScenario, compareScenario, SCENARIOS } from '../src/utils/scenarioArena.js'

const parts = [
  { id: 'Frame', family: 'frame', structural_role: 'primary', factory_work: true, connections: [{ to: 'Roof' }, { to: 'Wall' }], variants: [{ seismic_grade: 2, fire_resistance_grade: '1hr', weight_kg: 900, supply_risk: 'high', lead_time_days: 60 }] },
  { id: 'Roof', family: 'cassette', structural_role: 'secondary', factory_work: true, size: [4, .3, 4], connections: [{ to: 'Frame' }], variants: [{ seismic_grade: 3, fire_resistance_grade: '2hr', weight_kg: 800, supply_risk: 'low' }] },
]

test('every arena scenario answers the same decision questions', () => {
  assert.equal(SCENARIOS.length, 6)
  for (const scenario of SCENARIOS) {
    const result = analyzeScenario(scenario.id, parts)
    assert.ok(result.change)
    assert.ok(result.consequence)
    assert.ok(result.alternative)
    assert.ok(Array.isArray(result.affectedIds))
  }
})

test('supplier disruption finds risky selected variants', () => {
  const result = analyzeScenario('supplier', parts)
  assert.deepEqual(result.affectedIds, ['Frame'])
  assert.equal(result.severity, 'medium')
})

test('comparison never claims more affected parts than baseline', () => {
  const comparison = compareScenario(analyzeScenario('earthquake', parts))
  assert.ok(comparison.alternative <= comparison.baseline)
})
