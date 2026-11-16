import { useMemo, useState } from 'react'
import { ArrowRight, Compass, Sparkles, X } from 'lucide-react'

const TOUR_STEPS = [
  {
    eyebrow: 'Welcome to the system',
    title: 'Explore the building first',
    body: 'Orbit, zoom, and inspect freely. The model stays central while tools appear only when they are useful.',
  },
  {
    eyebrow: 'Read through objects',
    title: 'Select a real component',
    body: 'Selection focuses the component, keeps connected parts legible, and reveals exact product information.',
    action: 'select',
    actionLabel: 'Focus a component',
  },
  {
    eyebrow: 'Understand the system',
    title: 'Explode the assembly',
    body: 'The motion reveals how the kit is composed without leaving the design workspace.',
    action: 'explode',
    actionLabel: 'Explode system',
  },
  {
    eyebrow: 'Follow the delivery story',
    title: 'Move from design to delivery',
    body: 'Factory to Site turns the authored kit into a spatial production, transport, and installation journey.',
    action: 'flow',
    actionLabel: 'Open Factory to Site',
  },
]

export default function GuidedDiscovery({
  activeWorkspace,
  selected,
  exploded,
  deliveryMode,
  showScenarioArena,
  showMetrics,
  onSelectFirst,
  onToggleExplode,
  onWorkspaceChange,
  onOpenDelivery,
  onOpenScenario,
  onOpenMetrics,
  onClose,
}) {
  const [step, setStep] = useState(0)
  const [tourComplete, setTourComplete] = useState(false)
  const current = TOUR_STEPS[step]

  const suggestion = useMemo(() => {
    if (!selected) return { label: 'Select a component', detail: 'See its role and interfaces', action: onSelectFirst }
    if (activeWorkspace === 'design' && !exploded) return { label: 'Explode the system', detail: 'Reveal how the kit is assembled', action: onToggleExplode }
    if (activeWorkspace === 'design') return { label: 'Follow it to site', detail: 'Open the delivery workspace', action: () => onWorkspaceChange('flow') }
    if (activeWorkspace === 'flow' && !deliveryMode) return { label: 'Play the journey', detail: 'Factory, truck, buffer, installed', action: onOpenDelivery }
    if (activeWorkspace === 'test' && !showScenarioArena) return { label: 'Compare a scenario', detail: 'Show affected parts and alternatives', action: onOpenScenario }
    if (activeWorkspace === 'review' && !showMetrics) return { label: 'Review the evidence', detail: 'Open cost, carbon, and schedule', action: onOpenMetrics }
    return { label: 'Keep exploring', detail: 'Choose any workspace or component', action: onClose }
  }, [activeWorkspace, deliveryMode, exploded, onClose, onOpenDelivery, onOpenMetrics, onOpenScenario, onSelectFirst, onToggleExplode, onWorkspaceChange, selected, showMetrics, showScenarioArena])

  function runStepAction(action) {
    if (action === 'select') onSelectFirst()
    if (action === 'explode') onToggleExplode()
    if (action === 'flow') onWorkspaceChange('flow')
  }

  function finishTour() {
    setTourComplete(true)
    try { localStorage.setItem('ic-guided-discovery-seen', '1') } catch { /* optional persistence */ }
  }

  function dismiss() {
    try { localStorage.setItem('ic-guided-discovery-seen', '1') } catch { /* optional persistence */ }
    onClose()
  }

  if (tourComplete) {
    return <aside className="discovery-suggestion" aria-live="polite">
      <Compass size={17} />
      <button onClick={suggestion.action}>
        <span>Try this</span>
        <strong>{suggestion.label}</strong>
        <small>{suggestion.detail}</small>
      </button>
      <button className="discovery-close" onClick={dismiss} aria-label="Hide suggestion"><X size={14} /></button>
    </aside>
  }

  return <aside className="discovery-card" aria-label="Guided discovery">
    <header>
      <span><Sparkles size={14} /> Guided discovery</span>
      <button onClick={dismiss} aria-label="Explore without guide"><X size={15} /></button>
    </header>
    <div className="discovery-progress" aria-label={`Step ${step + 1} of ${TOUR_STEPS.length}`}>
      {TOUR_STEPS.map((_, index) => <i key={index} className={index <= step ? 'active' : ''} />)}
    </div>
    <span className="discovery-eyebrow">{current.eyebrow}</span>
    <strong>{current.title}</strong>
    <p>{current.body}</p>
    <footer>
      <button className="discovery-skip" onClick={finishTour}>Explore freely</button>
      <div>
        {current.action && <button className="discovery-action" onClick={() => runStepAction(current.action)}>{current.actionLabel}</button>}
        <button className="discovery-next" onClick={() => step === TOUR_STEPS.length - 1 ? finishTour() : setStep(value => value + 1)}>
          {step === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'} <ArrowRight size={14} />
        </button>
      </div>
    </footer>
  </aside>
}
