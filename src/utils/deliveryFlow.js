const DEFAULT_TRUCK_CAPACITY_KG = 12000

function activeVariant(part, selectedVariants) {
  return part.variants?.[selectedVariants?.[part.id] ?? 0] ?? {}
}

export function planDeliveryFlow(parts, selectedVariants = {}, requirements = {}) {
  const ordered = [...parts].sort((a, b) => (a.sequence ?? 999) - (b.sequence ?? 999))
  const truckCapacity = requirements.max_truck_weight_kg ?? DEFAULT_TRUCK_CAPACITY_KG
  const maxWidth = requirements.max_transport_width_m ?? 3
  const maxLift = requirements.max_part_weight_kg ?? 3000
  const batches = []
  const loads = []

  for (const part of ordered) {
    const variant = activeVariant(part, selectedVariants)
    const family = part.family ?? part.module_type ?? 'unclassified'
    let batch = batches.at(-1)
    if (!batch || batch.family !== family || batch.parts.length >= 4) {
      batch = { id: `B${batches.length + 1}`, family, parts: [], minutes: 0 }
      batches.push(batch)
    }
    batch.parts.push(part.id)
    batch.minutes += variant.assembly_time_min ?? 30

    const weight = variant.weight_kg ?? 0
    let load = loads.at(-1)
    if (!load || load.weightKg + weight > truckCapacity) {
      load = { id: `T${loads.length + 1}`, parts: [], weightKg: 0 }
      loads.push(load)
    }
    load.parts.push(part.id)
    load.weightKg += weight
  }

  const steps = ordered.flatMap((part, partIndex) => {
    const variant = activeVariant(part, selectedVariants)
    const width = Math.min(part.size?.[0] ?? 0, part.size?.[2] ?? 0)
    const weight = variant.weight_kg ?? 0
    const warnings = []
    if (width > maxWidth) warnings.push(`Oversize ${width.toFixed(1)} m`)
    if (weight > maxLift) warnings.push(`Lift ${Math.round(weight)} kg`)
    if ((variant.lead_time_days ?? 0) > 45) warnings.push(`Lead ${variant.lead_time_days} d`)
    const load = loads.find(item => item.parts.includes(part.id))
    return ['factory', 'transport', 'site', 'installed'].map((stage, stageIndex) => ({
      id: `${part.id}:${stage}`,
      partId: part.id,
      stage,
      index: partIndex * 4 + stageIndex,
      loadId: load?.id,
      warnings,
    }))
  })

  const bottlenecks = steps.filter(step => step.stage === 'factory' && step.warnings.length).map(step => ({ partId: step.partId, warnings: step.warnings }))
  return {
    batches,
    loads,
    steps,
    bottlenecks,
    summary: { parts: ordered.length, batches: batches.length, trucks: loads.length, warnings: bottlenecks.length },
  }
}
