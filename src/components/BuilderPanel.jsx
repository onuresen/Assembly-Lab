import React, { useRef } from 'react'
import { useKit } from './KitContext'

export default function BuilderPanel({ selected }) {
  const { parts, updatePart, addPart, duplicatePart, removePart, exportKit, clearAutoSave, snapPart, rotatePart, replacePartFamily } = useKit()

  const part = selected ? parts.find(p => p.id === selected.id) : null
  const glbInputRef = useRef()

  function handleSize(axis, value) {
    if (!part) return
    const newSize = [...part.size]
    newSize[axis] = Number(value)
    updatePart(part.id, { size: newSize })
  }

  function handleCylArg(idx, value) {
    if (!part) return
    const newArgs = part.cylinderArgs ? [...part.cylinderArgs] : [part.size[0]/2, part.size[0]/2, part.size[1], 32]
    newArgs[idx] = Number(value)
    updatePart(part.id, { cylinderArgs: newArgs })
  }

  function handleVariant(field, value, isNumber = false) {
    if (!part) return
    const v = { ...part.variants[0] }
    v[field] = isNumber ? Number(value) : value
    const newVariants = [v, ...part.variants.slice(1)]
    updatePart(part.id, { variants: newVariants })
  }

  function handleGlbImport(e) {
    const file = e.target.files[0]
    if (!file || !part) return
    const reader = new FileReader()
    reader.onload = (ev) => updatePart(part.id, { glb: ev.target.result })
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function handleDelete() {
    if (!part) return
    removePart(part.id)
  }

  function handleDuplicate() {
    if (!part) return
    duplicatePart(part.id)
  }

  return (
    <div className="builder-panel" style={{ marginTop: '16px', padding: '12px', background: 'rgba(0,0,0,0.05)', borderRadius: '6px' }}>
      <div style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '13px', textTransform: 'uppercase' }}>Builder Panel</div>
      
      {!part && (
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
          Select a part in the scene to edit its properties, or add a new part.
        </div>
      )}

      {part && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          
          <label style={{ fontSize: '11px', display: 'block' }}>Name:
            <input type="text" value={part.id} disabled style={{ width: '100%', fontSize: '12px', padding: '4px' }} />
          </label>

          <label style={{ fontSize: '11px', display: 'block' }}>Shape:
            <select 
              value={part.shape || 'box'} 
              onChange={e => updatePart(part.id, { shape: e.target.value })}
              style={{ width: '100%', fontSize: '12px', padding: '4px' }}
            >
              <option value="box">Box</option>
              <option value="cylinder">Cylinder</option>
              <option value="window">Window</option>
              <option value="door">Door</option>
            </select>
          </label>

          <label style={{ fontSize: '11px', display: 'block' }}>Product family:
            <select value={part.family ?? 'frame'} onChange={e => replacePartFamily(part.id, e.target.value)} style={{ width: '100%', fontSize: '12px', padding: '4px' }}>
              <option value="foundation">Foundation</option>
              <option value="frame">Frame</option>
              <option value="cassette">Cassette</option>
              <option value="envelope">Envelope</option>
              <option value="pod">Volumetric pod</option>
              <option value="service">Service module</option>
            </select>
          </label>

          <div className="playground-actions">
            <button onClick={() => snapPart(part.id, 0.1)}>Snap 100 mm</button>
            <button onClick={() => rotatePart(part.id)}>Rotate 90°</button>
          </div>
          <div className="playground-readout">
            Position {part.pos.map(n => n.toFixed(2)).join(', ')} m · Rotation {part.rotation_y_deg ?? 0}° · Interface {part.interface_type ?? 'unset'}
          </div>

          {(part.shape === 'cylinder') ? (
            <div style={{ display: 'flex', gap: '4px' }}>
              <label style={{ fontSize: '11px', flex: 1 }}>Radius Top:
                <input type="number" step="0.1" value={part.cylinderArgs?.[0] ?? (part.size[0]/2)} onChange={e => handleCylArg(0, e.target.value)} style={{ width: '100%', padding: '2px' }} />
              </label>
              <label style={{ fontSize: '11px', flex: 1 }}>Radius Bot:
                <input type="number" step="0.1" value={part.cylinderArgs?.[1] ?? (part.size[0]/2)} onChange={e => handleCylArg(1, e.target.value)} style={{ width: '100%', padding: '2px' }} />
              </label>
              <label style={{ fontSize: '11px', flex: 1 }}>Height:
                <input type="number" step="0.1" value={part.cylinderArgs?.[2] ?? part.size[1]} onChange={e => handleCylArg(2, e.target.value)} style={{ width: '100%', padding: '2px' }} />
              </label>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '4px' }}>
              <label style={{ fontSize: '11px', flex: 1 }}>Width (X):
                <input type="number" step="0.1" value={part.size[0]} onChange={e => handleSize(0, e.target.value)} style={{ width: '100%', padding: '2px' }} />
              </label>
              <label style={{ fontSize: '11px', flex: 1 }}>Height (Y):
                <input type="number" step="0.1" value={part.size[1]} onChange={e => handleSize(1, e.target.value)} style={{ width: '100%', padding: '2px' }} />
              </label>
              <label style={{ fontSize: '11px', flex: 1 }}>Depth (Z):
                <input type="number" step="0.1" value={part.size[2]} onChange={e => handleSize(2, e.target.value)} style={{ width: '100%', padding: '2px' }} />
              </label>
            </div>
          )}

          <div style={{ margin: '8px 0', borderTop: '1px solid #ccc' }} />

          <label style={{ fontSize: '11px', display: 'flex', alignItems: 'center' }}>
            Color:
            <input type="color" value={part.variants[0].color} onChange={e => handleVariant('color', e.target.value)} style={{ marginLeft: '8px' }} />
          </label>

          <label style={{ fontSize: '11px', display: 'block' }}>Cost ($):
            <input type="number" value={part.variants[0].unit_cost_usd} onChange={e => handleVariant('unit_cost_usd', e.target.value, true)} style={{ width: '100%', padding: '2px' }} />
          </label>

          <label style={{ fontSize: '11px', display: 'block' }}>Carbon (CO2e):
            <input type="number" value={part.variants[0].carbon_kgco2e} onChange={e => handleVariant('carbon_kgco2e', e.target.value, true)} style={{ width: '100%', padding: '2px' }} />
          </label>

          <label style={{ fontSize: '11px', display: 'block' }}>Weight (kg):
            <input type="number" value={part.variants[0].weight_kg} onChange={e => handleVariant('weight_kg', e.target.value, true)} style={{ width: '100%', padding: '2px' }} />
          </label>

          <label style={{ fontSize: '11px', display: 'block' }}>Thermal conductivity (W/mK):
            <input type="number" step="0.01" value={part.variants[0].thermal_conductivity_wpmk ?? 0.8} onChange={e => handleVariant('thermal_conductivity_wpmk', e.target.value, true)} style={{ width: '100%', padding: '2px' }} />
          </label>

          <label style={{ fontSize: '11px', display: 'block' }}>Supply risk:
            <select value={part.variants[0].supply_risk ?? 'low'} onChange={e => handleVariant('supply_risk', e.target.value)} style={{ width: '100%', fontSize: '12px', padding: '4px' }}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>

          <label style={{ fontSize: '11px', display: 'block' }}>STC rating:
            <input type="number" min="20" max="70" value={part.variants[0].stc_rating ?? 40} onChange={e => handleVariant('stc_rating', e.target.value, true)} style={{ width: '100%', padding: '2px' }} />
          </label>

          <label style={{ fontSize: '11px', display: 'flex', alignItems: 'center', marginTop: '4px' }}>
            <input type="checkbox" checked={!!part.wire} onChange={e => updatePart(part.id, { wire: e.target.checked })} style={{ marginRight: '6px' }} />
            Wireframe Only
          </label>

          <label style={{ fontSize: '11px', display: 'flex', alignItems: 'center' }}>
            <input type="checkbox" checked={!!part.transparent} onChange={e => updatePart(part.id, { transparent: e.target.checked })} style={{ marginRight: '6px' }} />
            Transparent
          </label>

          <div style={{ margin: '8px 0 4px', borderTop: '1px solid #ccc' }} />

          <div className="interface-check">
            <strong>Connections</strong>
            {(part.connections ?? []).length === 0 && <span>No interfaces connected yet</span>}
            {(part.connections ?? []).map(connection => {
              const target = parts.find(candidate => candidate.id === connection.to)
              const compatible = !target || !part.interface_type || !target.interface_type || part.interface_type === target.interface_type || connection.type === 'bolted'
              return <span key={`${connection.to}-${connection.type}`} className={compatible ? 'interface-ok' : 'interface-warning'}>
                {compatible ? '✓' : '!'} {connection.to} · {connection.type}{compatible ? '' : ' · interface mismatch'}
              </span>
            })}
          </div>

          <div style={{ margin: '8px 0 4px', borderTop: '1px solid #ccc' }} />

          <input ref={glbInputRef} type="file" accept=".glb,.gltf" style={{ display: 'none' }} onChange={handleGlbImport} />
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => glbInputRef.current.click()}
              style={{ flex: 1, background: '#8e44ad', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
            >
              {part.glb ? 'Replace GLB' : 'Import GLB'}
            </button>
            {part.glb && (
              <button
                onClick={() => updatePart(part.id, { glb: null })}
                style={{ background: '#7f8c8d', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
              >
                Remove
              </button>
            )}
          </div>
          {part.glb && (
            <div style={{ fontSize: '10px', color: '#27ae60', marginTop: '2px' }}>GLB loaded</div>
          )}

          <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
            <button onClick={handleDuplicate} style={{ flex: 1, background: '#f39c12', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}>
              Duplicate Part
            </button>
            <button onClick={handleDelete} style={{ flex: 1, background: '#e74c3c', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}>
              Delete Part
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
        <button onClick={addPart} style={{ background: '#3498db', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          + Add New Part
        </button>
        <button onClick={exportKit} style={{ background: '#27ae60', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          ↓ Export Kit JSON
        </button>
        <button onClick={clearAutoSave} style={{ background: '#7f8c8d', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
          ↻ Clear Local Save
        </button>
      </div>
    </div>
  )
}
