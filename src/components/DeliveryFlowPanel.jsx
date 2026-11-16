import { useEffect, useMemo, useState } from 'react'
import { Pause, Play, RotateCcw, X } from 'lucide-react'
import { useKit } from './KitContext'
import { planDeliveryFlow } from '../utils/deliveryFlow'

const STAGES = [['factory', 'Factory'], ['transport', 'Truck'], ['site', 'Site buffer'], ['installed', 'Installed']]

export default function DeliveryFlowPanel({ selectedVariants, onSelectPart, onStepChange, onClose }) {
  const { parts, projectSettings } = useKit()
  const plan = useMemo(() => planDeliveryFlow(parts, selectedVariants, projectSettings.productSystem?.requirements), [parts, selectedVariants, projectSettings])
  const [stepIndex, setStepIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const step = plan.steps[Math.min(stepIndex, Math.max(0, plan.steps.length - 1))]

  useEffect(() => {
    if (!playing || !plan.steps.length) return undefined
    const timer = setInterval(() => setStepIndex(current => {
      if (current >= plan.steps.length - 1) { setPlaying(false); return current }
      return current + 1
    }), 650)
    return () => clearInterval(timer)
  }, [playing, plan.steps.length])

  useEffect(() => {
    if (!step) return
    onSelectPart(step.partId)
    onStepChange?.({ ...step, stepIndex, totalSteps: plan.steps.length })
  }, [step, stepIndex, plan.steps.length, onSelectPart, onStepChange])

  useEffect(() => () => onStepChange?.(null), [onStepChange])

  const completed = new Set(plan.steps.slice(0, stepIndex + 1).map(item => `${item.partId}:${item.stage}`))

  return <section className="delivery-flow-panel" aria-label="Factory to site flow">
    <header><div><span>Factory → Site</span><strong>{step ? `${step.partId} · ${STAGES.find(([id]) => id === step.stage)?.[1]}` : 'No parts'}</strong></div><button onClick={onClose} aria-label="Close"><X size={16} /></button></header>
    <div className="delivery-kpis">
      <span><strong>{plan.summary.parts}</strong> parts</span><span><strong>{plan.summary.batches}</strong> batches</span><span><strong>{plan.summary.trucks}</strong> trucks</span><span className={plan.summary.warnings ? 'warn' : ''}><strong>{plan.summary.warnings}</strong> constraints</span>
    </div>
    <div className="delivery-board">
      {STAGES.map(([stageId, label]) => <div key={stageId} className="delivery-stage"><strong>{label}</strong><div>
        {parts.slice().sort((a, b) => (a.sequence ?? 999) - (b.sequence ?? 999)).map(part => {
          const active = step?.partId === part.id && step?.stage === stageId
          return <button key={part.id} className={`${completed.has(`${part.id}:${stageId}`) ? 'done' : ''}${active ? ' active' : ''}`} onClick={() => { const found = plan.steps.findIndex(item => item.partId === part.id && item.stage === stageId); setStepIndex(found); setPlaying(false) }} title={part.id}>{part.id}</button>
        })}
      </div></div>)}
    </div>
    <div className="journey-scrubber">
      <input type="range" min="0" max={Math.max(0, plan.steps.length - 1)} value={stepIndex} onChange={event => { setStepIndex(Number(event.target.value)); setPlaying(false) }} aria-label="Delivery journey position" />
      <div className="journey-route" aria-hidden="true"><span>Factory</span><span>Truck</span><span>Site</span><span>Building</span></div>
    </div>
    {step?.warnings.length > 0 && <div className="delivery-warning"><strong>Constraint to resolve</strong>{step.warnings.join(' · ')}</div>}
    <footer><button onClick={() => { setStepIndex(0); setPlaying(false) }}><RotateCcw size={14} /> Reset</button><button className="delivery-play" onClick={() => setPlaying(value => !value)}>{playing ? <Pause size={14} /> : <Play size={14} />}{playing ? 'Pause' : 'Play journey'}</button><span>{stepIndex + 1} / {plan.steps.length}</span></footer>
  </section>
}
