const MATERIALS = {
  timber: { label: 'Mass timber', color: '#b97842', weight: 620, cost: 3900, carbon: 95, grade: 2, fire: '1hr' },
  precast: { label: 'Precast concrete', color: '#aeb5b8', weight: 2600, cost: 4700, carbon: 420, grade: 3, fire: '2hr' },
  volumetric: { label: 'Steel volumetric', color: '#5f7890', weight: 1450, cost: 6900, carbon: 310, grade: 3, fire: '1hr' },
  hybrid: { label: 'Timber-steel hybrid', color: '#8d6f4e', weight: 980, cost: 5300, carbon: 175, grade: 3, fire: '1hr' },
}

function part(id, family, pos, size, sequence, material, connections = []) {
  return {
    id, family, module_type: family, shape: 'box', pos, exp: [pos[0], pos[1] + 3, pos[2]], size,
    sequence, factory_work: family !== 'foundation', structural_role: family === 'frame' || family === 'foundation' ? 'primary' : 'secondary',
    interface_type: family === 'foundation' ? 'base-plate' : family === 'pod' ? 'corner-cast' : 'dry-fit',
    connections: connections.map(to => ({ to, type: family === 'pod' ? 'bolted' : 'dry-fit' })),
    variants: [{
      label: material.label, color: material.color, weight_kg: material.weight, unit_cost_usd: material.cost,
      labor_cost_usd: Math.round(material.cost * 0.18), carbon_kgco2e: material.carbon, seismic_grade: material.grade,
      fire_resistance_grade: material.fire, lead_time_days: 28, assembly_time_min: 35, supply_risk: 'low', stc_rating: 45,
      thermal_conductivity_wpmk: family === 'envelope' ? 0.16 : 0.8,
    }],
  }
}

function framedSystem(id, name, materialKey, moduleWidth, kind) {
  const m = MATERIALS[materialKey]
  const pod = kind === 'volumetric'
  const parts = pod
    ? [
        part('Pod A', 'pod', [-moduleWidth / 2, 1.5, 0], [moduleWidth, 3, 6], 1, m),
        part('Pod B', 'pod', [moduleWidth / 2, 1.5, 0], [moduleWidth, 3, 6], 2, m, ['Pod A']),
        part('Pod C', 'pod', [-moduleWidth / 2, 4.5, 0], [moduleWidth, 3, 6], 3, m, ['Pod A']),
        part('Pod D', 'pod', [moduleWidth / 2, 4.5, 0], [moduleWidth, 3, 6], 4, m, ['Pod B', 'Pod C']),
      ]
    : [
        part('Foundation cassette', 'foundation', [0, 0.2, 0], [moduleWidth * 2, 0.4, 6], 1, m),
        part('Frame west', 'frame', [-moduleWidth / 2, 1.8, 0], [0.25, 3.2, 6], 2, m, ['Foundation cassette']),
        part('Frame east', 'frame', [moduleWidth / 2, 1.8, 0], [0.25, 3.2, 6], 3, m, ['Foundation cassette']),
        part('Floor cassette', 'cassette', [0, 0.55, 0], [moduleWidth * 2, 0.25, 6], 4, m, ['Frame west', 'Frame east']),
        part('Envelope west', 'envelope', [-moduleWidth, 1.8, 0], [0.2, 2.8, 6], 5, m, ['Frame west']),
        part('Envelope east', 'envelope', [moduleWidth, 1.8, 0], [0.2, 2.8, 6], 6, m, ['Frame east']),
        part('Service spine', 'service', [0, 1.8, 0], [0.8, 2.8, 5.5], 7, { ...m, color: '#4f8b78' }, ['Floor cassette']),
        part('Roof cassette', 'cassette', [0, 3.5, 0], [moduleWidth * 2 + 0.3, 0.3, 6.3], 8, m, ['Frame west', 'Frame east']),
      ]

  return {
    id, name, description: `${name}: a lightweight ${kind} system for fast configuration experiments.`, parts,
    presets: [{ id: 'base', label: 'Base system', description: 'The authored baseline', variants: {}, visible: Object.fromEntries(parts.map(p => [p.id, true])) }],
    productSystem: {
      id, name, kind,
      families: [...new Set(parts.map(p => p.family))],
      interfaces: ['dry-fit', 'bolted', 'base-plate', 'corner-cast'],
      requirements: { min_seismic_grade: 2, max_transport_width_m: 3.0, max_part_weight_kg: 3000 },
      rules: [
        { id: 'transport-width', label: 'Transport width', field: 'size[0]', operator: '<=', requirement: 'max_transport_width_m' },
        { id: 'lift-weight', label: 'Part lift weight', field: 'weight_kg', operator: '<=', requirement: 'max_part_weight_kg' },
        { id: 'seismic-grade', label: 'Seismic grade', field: 'seismic_grade', operator: '>=', requirement: 'min_seismic_grade' },
      ],
    },
  }
}

export const SYSTEM_BLUEPRINTS = [
  framedSystem('timber-frame', 'Timber Frame', 'timber', 2.7, 'panelized'),
  framedSystem('precast-platform', 'Precast Platform', 'precast', 3.0, 'panelized'),
  framedSystem('volumetric-pods', 'Volumetric Pods', 'volumetric', 3.0, 'volumetric'),
  framedSystem('hybrid-chassis', 'Hybrid Chassis', 'hybrid', 2.8, 'hybrid'),
]

export function getSystemBlueprint(id) {
  return SYSTEM_BLUEPRINTS.find(system => system.id === id)
}
