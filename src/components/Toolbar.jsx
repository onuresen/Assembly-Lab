import { createElement, useState } from 'react'
import { MousePointer2, Pencil, Scissors, Copy, Trash2, Ruler, BarChart3, Map, Undo2, Redo2, Layers, Play, Zap, Moon, Sun, Keyboard, HardHat, Clapperboard, Activity, Wind, LayoutTemplate, Droplets, Menu, X, Flame, Shield, Thermometer, Volume2, Factory, Truck } from 'lucide-react'
import ShareButton from './ShareButton'

const WORKSPACES = [['design', 'Design'], ['flow', 'Factory → Site'], ['test', 'Test'], ['review', 'Review']]

function Tool({ icon, label, active, disabled, onClick, text, danger }) {
  return <button className={`tb-btn${text ? ' tb-btn--text' : ''}${active ? ' tb-btn--active' : ''}${danger && active ? ' tb-btn--danger' : ''}`} title={label} aria-label={label} aria-pressed={active ?? undefined} onClick={onClick} disabled={disabled}>{createElement(icon, { size: text ? 13 : 15 })}{text}</button>
}

export default function Toolbar(p) {
  const [workspace, setWorkspace] = useState('design')
  const selectMode = !p.builderMode && !p.siteMode && !p.factoryMode && !p.sequenceMode && !p.gameMode
  function select() {
    if (p.builderMode) p.onToggleBuilderMode()
    if (p.siteMode) p.onToggleSiteMode()
    if (p.factoryMode) p.onToggleFactoryMode()
    if (p.sequenceMode) p.onToggleSequence()
  }

  return <div className="workspace-tools">
    <nav className="workspace-tabs" aria-label="Workspace">
      <button className="tb-btn tb-btn--mobile-only" aria-label="Layers" onClick={p.onToggleMobileSidebar}>{p.mobileSidebarOpen ? <X size={15} /> : <Menu size={15} />}</button>
      {WORKSPACES.map(([id, label]) => <button key={id} className={`workspace-tab${workspace === id ? ' workspace-tab--active' : ''}`} onClick={() => setWorkspace(id)}>{label}</button>)}
    </nav>
    <div className="toolbar">
      {workspace === 'design' && <><div className="toolbar-group">
        <Tool icon={MousePointer2} label="Select" active={selectMode} onClick={select} />
        <Tool icon={Pencil} label="Edit parts" active={p.builderMode} onClick={p.onToggleBuilderMode} disabled={p.siteMode || p.factoryMode || p.sequenceMode || p.gameMode} />
        <Tool icon={Copy} label="Duplicate selected part" onClick={p.onDuplicate} disabled={!p.selected || !p.builderMode} />
        <Tool icon={Trash2} label="Delete selected part" onClick={p.onDelete} disabled={!p.selected || !p.builderMode} />
      </div><div className="toolbar-sep" /><div className="toolbar-group">
        <Tool icon={Scissors} label="Section cut" active={p.sectionCutActive} onClick={p.onToggleSectionCut} disabled={p.siteMode || p.factoryMode || p.gameMode} />
        <Tool icon={Ruler} label="Dimensions" active={p.showDimensions} onClick={p.onToggleDimensions} disabled={p.siteMode || p.factoryMode || p.gameMode} />
        <Tool icon={Zap} label={p.exploded ? 'Assemble' : 'Explode'} text={p.exploded ? 'ASSEMBLE' : 'EXPLODE'} active={p.exploded} onClick={p.onToggleExplode} disabled={p.sequenceMode || p.siteMode || p.factoryMode || p.gameMode} />
      </div></>}
      {workspace === 'flow' && <div className="toolbar-group">
        <Tool icon={Map} label="Site plan" active={p.siteMode} onClick={p.onToggleSiteMode} disabled={p.sequenceMode || p.builderMode || p.factoryMode || p.gameMode} />
        <Tool icon={Factory} label="Factory layout" active={p.factoryMode} onClick={p.onToggleFactoryMode} disabled={p.sequenceMode || p.builderMode || p.siteMode || p.gameMode} />
        <Tool icon={Layers} label="Assembly sequence" active={p.sequenceMode} onClick={p.onToggleSequence} disabled={p.siteMode || p.factoryMode || p.gameMode} />
        <Tool icon={HardHat} label="Tower crane" active={p.showCrane} onClick={p.onToggleCrane} disabled={p.siteMode || p.factoryMode || p.gameMode} />
        <Tool icon={Truck} label="Factory-to-site journey" active={p.deliveryMode} onClick={p.onToggleDelivery} disabled={p.gameMode} />
      </div>}
      {workspace === 'test' && <div className="toolbar-group">
        <Tool icon={Activity} label="Earthquake" active={p.showEarthquake} onClick={p.onToggleEarthquake} disabled={p.factoryMode || p.gameMode} />
        <Tool icon={Wind} label="Wind" active={p.showWindArrows} onClick={p.onToggleWindArrows} disabled={p.siteMode || p.factoryMode || p.gameMode} />
        <Tool icon={Droplets} label="Rain and water" active={p.showWaterSim} onClick={p.onToggleWaterSim} disabled={p.siteMode || p.factoryMode || p.gameMode} />
        <Tool icon={Flame} label="Fire" active={p.fireMode} danger onClick={p.onToggleFireMode} disabled={p.factoryMode || p.gameMode} />
        <Tool icon={Shield} label="Fire compartments" active={p.showFireCompartments} onClick={p.onToggleFireCompartments} disabled={p.siteMode || p.factoryMode || p.gameMode} />
      </div>}
      {workspace === 'review' && <div className="toolbar-group">
        <Tool icon={Thermometer} label="Thermal bridges" active={p.showThermal} onClick={p.onToggleThermal} disabled={p.siteMode || p.factoryMode || p.gameMode} />
        <Tool icon={Volume2} label="Acoustics" active={p.showAcoustic} onClick={p.onToggleAcoustic} disabled={p.siteMode || p.factoryMode || p.gameMode} />
        <Tool icon={LayoutTemplate} label="Floor plan" onClick={p.onShowFloorPlan} disabled={p.siteMode || p.factoryMode || p.gameMode} />
        <Tool icon={BarChart3} label="Metrics" active={p.showMetrics} onClick={p.onToggleMetrics} disabled={p.gameMode} />
      </div>}
      <div className="toolbar-sep" /><div className="toolbar-group">
        <Tool icon={Play} label="Assembly challenge" text="GAME" onClick={p.onStartGame} disabled={p.gameMode} />
        <Tool icon={Clapperboard} label="Demo tour" text="DEMO" active={p.cinematicMode} onClick={p.onToggleCinematic} disabled={p.gameMode || p.builderMode || p.factoryMode} />
        <ShareButton shareMetrics={p.shareMetrics} onShare={p.onShare} disabled={p.gameMode} />
        <Tool icon={Undo2} label="Undo" onClick={p.onUndo} disabled={!p.canUndo} />
        <Tool icon={Redo2} label="Redo" onClick={p.onRedo} disabled={!p.canRedo} />
        <Tool icon={p.darkMode ? Sun : Moon} label={p.darkMode ? 'Light mode' : 'Dark mode'} onClick={p.onToggleDark} />
        <Tool icon={Keyboard} label="Keyboard shortcuts" onClick={p.onToggleShortcuts} />
      </div>
    </div>
  </div>
}
