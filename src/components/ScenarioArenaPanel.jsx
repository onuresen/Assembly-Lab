import { useMemo, useState } from 'react'
import { Play, X } from 'lucide-react'
import { useKit } from './KitContext'
import { analyzeScenario, compareScenario, SCENARIOS } from '../utils/scenarioArena'

export default function ScenarioArenaPanel({ selectedVariants, onActivate, onSelectPart, onClose }) {
  const { parts } = useKit()
  const [scenarioId, setScenarioId] = useState('earthquake')
  const result = useMemo(() => analyzeScenario(scenarioId, parts, selectedVariants), [scenarioId, parts, selectedVariants])
  const comparison = compareScenario(result)

  return <section className="scenario-arena">
    <header><div><span>Scenario Arena</span><strong>{result.label}</strong></div><button onClick={onClose} aria-label="Close"><X size={16} /></button></header>
    <div className="scenario-picker">{SCENARIOS.map(scenario => <button key={scenario.id} className={scenarioId === scenario.id ? 'active' : ''} onClick={() => setScenarioId(scenario.id)}>{scenario.label}</button>)}</div>
    <div className="scenario-answers">
      <article><span>What changed?</span><strong>{result.change}</strong></article>
      <article><span>What is affected?</span><strong>{result.affectedCount} of {parts.length} parts</strong><div className="affected-parts">{result.affectedIds.slice(0, 8).map(id => <button key={id} onClick={() => onSelectPart(id)}>{id}</button>)}</div></article>
      <article><span>What is the consequence?</span><strong>{result.consequence}</strong></article>
      <article><span>Which alternative is better?</span><strong>{result.alternative}</strong><div className="scenario-compare"><i style={{ width: `${Math.min(100, comparison.baseline * 10)}%` }} /><i className="better" style={{ width: `${Math.min(100, comparison.alternative * 10)}%` }} /></div><small>{comparison.reduction} affected part{comparison.reduction === 1 ? '' : 's'} potentially removed from exposure</small></article>
    </div>
    <footer><span className={`scenario-severity scenario-severity--${result.severity}`}>{result.severity} exposure</span><button onClick={() => onActivate(scenarioId)}><Play size={14} />{['supplier', 'late-change'].includes(scenarioId) ? 'Highlight evidence' : `Open ${result.label} test`}</button></footer>
  </section>
}
