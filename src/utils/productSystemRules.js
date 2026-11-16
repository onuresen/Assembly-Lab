export function evaluateProductSystem(parts, selectedVariants, productSystem) {
  const req = productSystem?.requirements ?? {}
  const issues = []

  for (const part of parts) {
    const variant = part.variants?.[selectedVariants?.[part.id] ?? 0] ?? {}
    if (req.max_transport_width_m && Math.min(part.size?.[0] ?? 0, part.size?.[2] ?? 0) > req.max_transport_width_m) {
      issues.push({ partId: part.id, rule: 'Transport width', value: `${Math.min(part.size[0], part.size[2]).toFixed(1)} m`, limit: `${req.max_transport_width_m} m` })
    }
    if (req.max_part_weight_kg && (variant.weight_kg ?? 0) > req.max_part_weight_kg) {
      issues.push({ partId: part.id, rule: 'Lift weight', value: `${variant.weight_kg} kg`, limit: `${req.max_part_weight_kg} kg` })
    }
    if (req.min_seismic_grade && (variant.seismic_grade ?? 0) < req.min_seismic_grade) {
      issues.push({ partId: part.id, rule: 'Seismic grade', value: variant.seismic_grade ?? 'unset', limit: `grade ${req.min_seismic_grade}` })
    }
  }

  return { pass: issues.length === 0, checked: parts.length * 3, issues }
}
