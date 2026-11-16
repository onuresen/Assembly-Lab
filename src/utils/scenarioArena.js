export const SCENARIOS = [
  { id: 'earthquake', label: 'Earthquake', change: 'Ground demand rises beyond the authored baseline.', alternative: 'Upgrade weak variants or use damping / isolation.' },
  { id: 'fire', label: 'Fire', change: 'One connected part ignites and heat can propagate.', alternative: 'Improve ratings and break vulnerable connection paths.' },
  { id: 'wind', label: 'Wind', change: 'Facade and roof pressure increases with wind speed.', alternative: 'Reduce exposed area or strengthen light envelope parts.' },
  { id: 'rain', label: 'Rain', change: 'Heavy rainfall tests exposed horizontal surfaces.', alternative: 'Add drainage and reduce unprotected collection areas.' },
  { id: 'supplier', label: 'Supplier failure', change: 'High-risk selected variants become unavailable.', alternative: 'Switch to compatible lower-risk variants.' },
  { id: 'late-change', label: 'Late design change', change: 'A factory-made module changes after coordination.', alternative: 'Change the smallest interface-bounded family first.' },
]

function selectedVariant(part, selectedVariants) {
  return part.variants?.[selectedVariants?.[part.id] ?? 0] ?? {}
}

export function analyzeScenario(id, parts, selectedVariants = {}) {
  const definition = SCENARIOS.find(item => item.id === id) ?? SCENARIOS[0]
  let affected = []
  let consequence = ''
  let score = 0

  if (id === 'earthquake') {
    affected = parts.filter(part => part.structural_role === 'primary' && (selectedVariant(part, selectedVariants).seismic_grade ?? 0) < 3)
    score = affected.length
    consequence = `${affected.length} primary part${affected.length === 1 ? '' : 's'} below seismic grade 3.`
  } else if (id === 'fire') {
    affected = parts.filter(part => !['2hr'].includes(selectedVariant(part, selectedVariants).fire_resistance_grade))
    score = affected.length
    consequence = `${affected.length} part${affected.length === 1 ? '' : 's'} lack a 2-hour rating.`
  } else if (id === 'wind') {
    affected = parts.filter(part => ['envelope', 'cassette', 'pod'].includes(part.family ?? part.module_type) && (selectedVariant(part, selectedVariants).weight_kg ?? 0) < 1800)
    score = affected.length
    consequence = `${affected.length} lightweight exposed part${affected.length === 1 ? '' : 's'} need pressure and uplift review.`
  } else if (id === 'rain') {
    affected = parts.filter(part => ['cassette', 'pod'].includes(part.family ?? part.module_type) && (part.size?.[0] ?? 0) * (part.size?.[2] ?? 0) > 8)
    score = affected.reduce((sum, part) => sum + (part.size?.[0] ?? 0) * (part.size?.[2] ?? 0), 0)
    consequence = `${score.toFixed(1)} m² of large cassette/pod surface can collect water.`
  } else if (id === 'supplier') {
    affected = parts.filter(part => selectedVariant(part, selectedVariants).supply_risk === 'high' || (selectedVariant(part, selectedVariants).lead_time_days ?? 0) > 45)
    const alternatives = affected.filter(part => part.variants?.some(variant => variant.supply_risk === 'low')).length
    score = affected.length
    consequence = `${affected.length} selected part${affected.length === 1 ? '' : 's'} are exposed; ${alternatives} have a lower-risk variant.`
  } else {
    affected = parts.filter(part => part.factory_work === true && (part.connections?.length ?? 0) > 1)
    score = affected.reduce((sum, part) => sum + (part.connections?.length ?? 0), 0)
    consequence = `${affected.length} factory-made modules touch ${score} interfaces and can create downstream rework.`
  }

  return {
    ...definition,
    affectedIds: affected.map(part => part.id),
    affectedCount: affected.length,
    consequence,
    score,
    severity: affected.length === 0 ? 'low' : affected.length <= Math.max(1, parts.length * 0.2) ? 'medium' : 'high',
  }
}

export function compareScenario(result) {
  const reduction = result.affectedCount === 0 ? 0 : Math.max(1, Math.ceil(result.affectedCount * 0.6))
  return { baseline: result.affectedCount, alternative: Math.max(0, result.affectedCount - reduction), reduction }
}
