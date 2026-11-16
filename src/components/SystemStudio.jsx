import { useMemo, useState } from 'react'
import { SYSTEM_BLUEPRINTS } from '../data/systemBlueprints'
import { evaluateProductSystem } from '../utils/productSystemRules'
import { useKit } from './KitContext'

export default function SystemStudio({ selectedVariants, visible }) {
  const { parts, projectSettings, loadSystemBlueprint, updateProductSystem, exportProductSystem, savePreset } = useKit()
  const system = projectSettings.productSystem
  const [recipeName, setRecipeName] = useState('')
  const result = useMemo(() => evaluateProductSystem(parts, selectedVariants, system), [parts, selectedVariants, system])

  function requirement(field, value) {
    updateProductSystem({ requirements: { ...system.requirements, [field]: Number(value) } })
  }

  function saveRecipe() {
    const name = recipeName.trim()
    if (!name) return
    savePreset(name, selectedVariants, visible)
    setRecipeName('')
  }

  return <section className="system-studio">
    <div className="sidebar-section-label">System Playground</div>
    <div className="system-blueprints">
      {SYSTEM_BLUEPRINTS.map(blueprint => <button key={blueprint.id} className={system.id === blueprint.id ? 'active' : ''} onClick={() => loadSystemBlueprint(blueprint.id)} title={blueprint.description}>
        <strong>{blueprint.name}</strong><span>{blueprint.productSystem.kind}</span>
      </button>)}
    </div>

    <details className="studio-details">
      <summary>Product System Studio</summary>
      <label>System name<input value={system.name} onChange={event => updateProductSystem({ name: event.target.value })} /></label>
      <div className="studio-family-row"><span>Families</span><strong>{(system.families ?? []).join(' · ') || 'Derived from parts'}</strong></div>

      <div className="studio-subhead">Requirements</div>
      <label>Minimum seismic grade<input type="number" min="1" max="3" value={system.requirements.min_seismic_grade} onChange={event => requirement('min_seismic_grade', event.target.value)} /></label>
      <label>Maximum transport width (m)<input type="number" min="1" step="0.1" value={system.requirements.max_transport_width_m} onChange={event => requirement('max_transport_width_m', event.target.value)} /></label>
      <label>Maximum part weight (kg)<input type="number" min="100" step="100" value={system.requirements.max_part_weight_kg} onChange={event => requirement('max_part_weight_kg', event.target.value)} /></label>

      <div className={`rule-summary ${result.pass ? 'rule-summary--pass' : 'rule-summary--issues'}`}>
        <strong>{result.pass ? 'All current parts fit' : `${result.issues.length} rule issue${result.issues.length === 1 ? '' : 's'}`}</strong>
        <span>{result.checked} checks · requirements stay separate from product values</span>
      </div>
      {!result.pass && <div className="rule-issues">{result.issues.slice(0, 5).map(issue => <button key={`${issue.partId}-${issue.rule}`} title={`${issue.value}; requirement ${issue.limit}`}>
        <strong>{issue.partId}</strong><span>{issue.rule}: {issue.value} / {issue.limit}</span>
      </button>)}</div>}

      <div className="studio-subhead">Reusable recipe</div>
      <div className="recipe-row"><input placeholder="Recipe name" value={recipeName} onChange={event => setRecipeName(event.target.value)} /><button onClick={saveRecipe} disabled={!recipeName.trim()}>Save</button></div>
      <button className="product-system-export" onClick={() => exportProductSystem(selectedVariants)}>Export Product System v1</button>
    </details>
  </section>
}
