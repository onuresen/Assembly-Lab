import test from 'node:test'
import assert from 'node:assert/strict'
import { planDeliveryFlow } from '../src/utils/deliveryFlow.js'

const parts = [
  { id: 'A', family: 'frame', sequence: 1, size: [2, 2, 4], variants: [{ weight_kg: 1000, assembly_time_min: 20, lead_time_days: 20 }] },
  { id: 'B', family: 'frame', sequence: 2, size: [4, 2, 4], variants: [{ weight_kg: 3500, assembly_time_min: 30, lead_time_days: 60 }] },
]

test('plans every part through four delivery stages', () => {
  const plan = planDeliveryFlow(parts, {}, { max_transport_width_m: 3, max_part_weight_kg: 3000 })
  assert.equal(plan.steps.length, 8)
  assert.deepEqual(plan.steps.slice(0, 4).map(step => step.stage), ['factory', 'transport', 'site', 'installed'])
  assert.equal(plan.summary.parts, 2)
})

test('reports transport, lift and lead-time bottlenecks', () => {
  const plan = planDeliveryFlow(parts, {}, { max_transport_width_m: 3, max_part_weight_kg: 3000 })
  const issue = plan.bottlenecks.find(item => item.partId === 'B')
  assert.ok(issue.warnings.some(warning => warning.startsWith('Oversize')))
  assert.ok(issue.warnings.some(warning => warning.startsWith('Lift')))
  assert.ok(issue.warnings.some(warning => warning.startsWith('Lead')))
})
