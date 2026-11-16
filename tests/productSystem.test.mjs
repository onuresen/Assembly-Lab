import test from 'node:test'
import assert from 'node:assert/strict'
import { SYSTEM_BLUEPRINTS } from '../src/data/systemBlueprints.js'
import { evaluateProductSystem } from '../src/utils/productSystemRules.js'
import { isProductSystem, productSystemEnvelope } from '../src/contracts/productSystem.js'

test('four distinct starter systems are playable and connected', () => {
  assert.deepEqual(SYSTEM_BLUEPRINTS.map(system => system.id), ['timber-frame', 'precast-platform', 'volumetric-pods', 'hybrid-chassis'])
  for (const system of SYSTEM_BLUEPRINTS) {
    assert.ok(system.parts.length >= 4)
    assert.ok(system.parts.every(part => part.family && part.interface_type && part.variants.length))
    assert.equal(new Set(system.parts.map(part => part.id)).size, system.parts.length)
  }
})

test('requirements remain separate and produce explainable rule issues', () => {
  const system = SYSTEM_BLUEPRINTS[0]
  const result = evaluateProductSystem(system.parts, {}, { requirements: { min_seismic_grade: 3, max_transport_width_m: 2, max_part_weight_kg: 500 } })
  assert.equal(result.pass, false)
  assert.ok(result.issues.some(issue => issue.rule === 'Seismic grade'))
  assert.ok(result.issues.some(issue => issue.rule === 'Transport width'))
})

test('product-system exports use the shared v1 envelope', () => {
  const system = SYSTEM_BLUEPRINTS[0]
  const payload = productSystemEnvelope({ id: system.id, name: system.name, parts: system.parts })
  assert.equal(isProductSystem(payload), true)
})
