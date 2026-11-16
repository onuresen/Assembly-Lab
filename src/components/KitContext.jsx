import React, { createContext, useContext, useState, useEffect } from 'react';
import { inferStcRating, inferSupplyRisk, inferThermalConductivity } from '../utils/materialMetrics';
import { isProductSystem, productSystemEnvelope } from '../contracts/productSystem';
import { getSystemBlueprint } from '../data/systemBlueprints';

const KitContext = createContext();

const DEFAULT_PROJECT = {
  name: 'IC Kit',
  currency: 'USD',
  jpyRate: 155,
  standard: 'UK',
  casbee_building_type: 'residential',
  casbee_target_rank: 'A',
  productSystem: {
    id: 'custom-system', name: 'Custom Product System', kind: 'custom', families: [], interfaces: [], rules: [],
    requirements: { min_seismic_grade: 2, max_transport_width_m: 3, max_part_weight_kg: 3000 },
  },
};

function normalizeProjectSettings(settings = {}) {
  return {
    ...DEFAULT_PROJECT,
    ...settings,
    productSystem: {
      ...DEFAULT_PROJECT.productSystem,
      ...(settings.productSystem ?? {}),
      requirements: {
        ...DEFAULT_PROJECT.productSystem.requirements,
        ...(settings.productSystem?.requirements ?? {}),
      },
    },
  };
}

function normalizeParts(parts) {
  return (parts || []).map(part => ({
    ...part,
    variants: (part.variants || []).map(variant => ({
      ...variant,
      thermal_conductivity_wpmk: variant.thermal_conductivity_wpmk ?? inferThermalConductivity(variant),
      supply_risk: variant.supply_risk ?? inferSupplyRisk(variant),
      stc_rating: variant.stc_rating ?? inferStcRating(variant),
    })),
  }));
}

export function KitProvider({ children }) {
  const [parts, setPartsInternal] = useState([]);
  const [presets, setPresets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [projectSettings, setProjectSettings] = useState(DEFAULT_PROJECT);

  // Undo/redo history
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  // setParts with history tracking
  function setParts(fnOrParts) {
    setPartsInternal(prev => {
      const next = typeof fnOrParts === 'function' ? fnOrParts(prev) : fnOrParts;
      setUndoStack(stack => [...stack.slice(-29), prev]);
      setRedoStack([]);
      return next;
    });
  }

  // setParts without history (used for load/reset)
  function setPartsNoHistory(fnOrParts) {
    setPartsInternal(fnOrParts);
    setUndoStack([]);
    setRedoStack([]);
  }

  function undo() {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack(s => s.slice(0, -1));
    setPartsInternal(current => {
      setRedoStack(s => [...s.slice(-9), current]);
      return prev;
    });
  }

  function redo() {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack(s => s.slice(0, -1));
    setPartsInternal(current => {
      setUndoStack(s => [...s.slice(-29), current]);
      return next;
    });
  }

  // Currency formatter
  function formatCurrency(usd) {
    if (projectSettings.currency === 'JPY') {
      const jpy = Math.round(usd * projectSettings.jpyRate);
      return `¥${jpy.toLocaleString()}`;
    }
    return `$${usd.toLocaleString()}`;
  }

  useEffect(() => {
    const saved = localStorage.getItem('ic-kit-save');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setPartsInternal(normalizeParts(data.parts));
        setPresets(data.presets || []);
        if (data.projectSettings) setProjectSettings(normalizeProjectSettings(data.projectSettings));
        setIsLoading(false);
        return;
      } catch (err) {}
    }

    const basePath = import.meta.env.BASE_URL;
    fetch(`${basePath}default-kit.json`)
      .then((res) => res.json())
      .then((data) => {
        setPartsInternal(normalizeParts(data.parts));
        setPresets(data.presets || []);
        if (data.projectSettings) setProjectSettings(normalizeProjectSettings(data.projectSettings));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load default kit:', err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!isLoading && parts.length > 0) {
      localStorage.setItem('ic-kit-save', JSON.stringify({ parts, presets, projectSettings }));
    }
  }, [parts, presets, projectSettings, isLoading]);

  const loadKitFromFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (isProductSystem(data)) {
          setPartsNoHistory(normalizeParts(data.parts));
          setPresets([{ id: 'imported-base', label: 'Imported base', description: 'Imported Product System v1', variants: {}, visible: Object.fromEntries(data.parts.map(part => [part.id, true])) }]);
          setProjectSettings(current => normalizeProjectSettings({
            ...current,
            name: data.name,
            productSystem: {
              id: data.id,
              name: data.name,
              kind: 'imported',
              families: [...new Set(data.parts.map(part => part.family).filter(Boolean))],
              interfaces: data.interfaces ?? [],
              rules: data.rules ?? [],
              requirements: data.provenance?.requirements ?? DEFAULT_PROJECT.productSystem.requirements,
            },
          }));
        } else if (data.parts && data.presets) {
          setPartsNoHistory(normalizeParts(data.parts));
          setPresets(data.presets);
          if (data.projectSettings) setProjectSettings(normalizeProjectSettings(data.projectSettings));
        } else {
          alert('Invalid file. Expected a Product System v1 document or legacy kit with parts and presets.');
        }
      } catch (err) {
        alert('Failed to parse kit JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const loadBundledKit = (filename) => {
    const basePath = import.meta.env.BASE_URL;
    fetch(`${basePath}${filename}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${filename}`);
        return res.json();
      })
      .then((data) => {
        if (data.parts && data.presets) {
          setPartsNoHistory(normalizeParts(data.parts));
          setPresets(data.presets);
          setProjectSettings(normalizeProjectSettings(data.projectSettings));
        } else {
          alert('Invalid bundled kit format. Missing parts or presets array.');
        }
      })
      .catch((err) => {
        console.error(err);
        alert(`Failed to load bundled kit: ${filename}`);
      });
  };

  const addPart = () => {
    setParts(prev => [...prev, {
      id: `Custom Part ${prev.length + 1}`,
      shape: 'box',
      pos: [0, 0, 0],
      exp: [0, 5, 0],
      size: [2, 2, 2],
      sequence: prev.length + 1,
      wire: false,
      transparent: false,
      structural_role: null,
      variants: [{
        label: 'Default Variant',
        color: '#aaaaaa',
        meta: 'Custom added part',
        weight_kg: 1000,
        unit_cost_usd: 5000,
        carbon_kgco2e: 500,
        thermal_conductivity_wpmk: 0.8,
        supply_risk: 'low',
        stc_rating: 40,
        seismic_grade: null,
        fire_resistance_grade: null,
        load_bearing_kn: null,
        bsl_compliant: null,
        bsl_notes: null,
        unit_cost_jpy: null,
        labor_cost_jpy: null,
        jis_standards: null,
        ifc_entity: 'IfcBuildingElementProxy',
        ifc_property_set: null,
      }]
    }]);
  };

  const updatePart = (id, newProps) => {
    setParts(prev => prev.map(p => p.id === id ? { ...p, ...newProps } : p));
  };

  const updatePartSequences = (orderedIds) => {
    const order = new Map(orderedIds.map((id, idx) => [id, idx + 1]));
    setParts(prev => prev.map(p => order.has(p.id) ? { ...p, sequence: order.get(p.id) } : p));
  };

  const addConnection = (fromId, conn) => {
    setParts(prev => prev.map(p => {
      if (p.id === fromId) {
        if ((p.connections ?? []).some(c => c.to === conn.to && c.type === conn.type)) return p;
        return { ...p, connections: [...(p.connections ?? []), conn] };
      }
      if (p.id === conn.to) {
        const reverse = { to: fromId, type: conn.type, hardware: conn.hardware };
        if ((p.connections ?? []).some(c => c.to === fromId && c.type === conn.type)) return p;
        return { ...p, connections: [...(p.connections ?? []), reverse] };
      }
      return p;
    }));
  };

  const removeConnection = (fromId, connTo) => {
    setParts(prev => prev.map(p => {
      if (p.id === fromId) return { ...p, connections: (p.connections ?? []).filter(c => c.to !== connTo) };
      if (p.id === connTo)  return { ...p, connections: (p.connections ?? []).filter(c => c.to !== fromId) };
      return p;
    }));
  };

  const removePart = (id) => {
    setParts(prev => prev.filter(p => p.id !== id));
  };

  const duplicatePart = (id) => {
    setParts(prev => {
      const partToDup = prev.find(p => p.id === id);
      if (!partToDup) return prev;
      const newPart = {
        ...partToDup,
        id: `${partToDup.id} (Copy ${Date.now().toString().slice(-4)})`,
        sequence: prev.length + 1,
        pos: [partToDup.pos[0] + 1, partToDup.pos[1], partToDup.pos[2]]
      };
      return [...prev, newPart];
    });
  };

  const snapPart = (id, grid = 0.1) => {
    setParts(prev => prev.map(p => p.id === id ? {
      ...p,
      pos: p.pos.map(value => Math.round(value / grid) * grid),
      exp: p.exp?.map(value => Math.round(value / grid) * grid),
    } : p));
  };

  const rotatePart = (id) => {
    setParts(prev => prev.map(p => p.id === id ? {
      ...p,
      rotation_y_deg: ((p.rotation_y_deg ?? 0) + 90) % 360,
      size: [p.size[2], p.size[1], p.size[0]],
    } : p));
  };

  const replacePartFamily = (id, family) => {
    const interfaceByFamily = { pod: 'corner-cast', foundation: 'base-plate', frame: 'dry-fit', cassette: 'dry-fit', envelope: 'dry-fit', service: 'bolted' };
    setParts(prev => prev.map(p => p.id === id ? { ...p, family, module_type: family, interface_type: interfaceByFamily[family] ?? 'dry-fit' } : p));
  };

  const loadSystemBlueprint = (id) => {
    const blueprint = getSystemBlueprint(id);
    if (!blueprint) return;
    setPartsNoHistory(normalizeParts(structuredClone(blueprint.parts)));
    setPresets(structuredClone(blueprint.presets));
    setProjectSettings(current => normalizeProjectSettings({ ...current, name: blueprint.name, productSystem: blueprint.productSystem }));
  };

  const updateProductSystem = (patch) => {
    setProjectSettings(current => normalizeProjectSettings({
      ...current,
      productSystem: { ...current.productSystem, ...patch },
    }));
  };

  const exportProductSystem = (selectedVariants = {}) => {
    const system = projectSettings.productSystem;
    const activeParts = parts.map(part => ({ ...part, selected_variant: selectedVariants[part.id] ?? 0 }));
    const payload = productSystemEnvelope({
      id: system.id,
      name: system.name,
      parts: activeParts,
      interfaces: system.interfaces,
      rules: system.rules,
      scenarios: [],
      provenance: { authoredIn: 'Kit of Parts', exportedAt: new Date().toISOString(), requirements: system.requirements },
    });
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${system.id || 'product-system'}.product-system.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportKit = () => {
    const dataObj = { parts, presets, projectSettings };
    const blob = new Blob([JSON.stringify(dataObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'custom-kit.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const savePreset = (label, selectedVariants, visible) => {
    const id = label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now().toString().slice(-4);
    const newPreset = {
      id,
      label,
      description: `Custom preset – ${label}`,
      custom: true,
      variants: { ...selectedVariants },
      visible: { ...visible },
    };
    setPresets([...presets, newPreset]);
  };

  const removePreset = (id) => {
    setPresets(presets.filter(p => p.id !== id));
  };

  const clearAutoSave = () => {
    localStorage.removeItem('ic-kit-save');
    window.location.reload();
  };

  return (
    <KitContext.Provider value={{
      parts, presets, setPresets,
      projectSettings, setProjectSettings, formatCurrency,
      loadKitFromFile, loadBundledKit, isLoading,
      addPart, duplicatePart, updatePart, updatePartSequences, removePart, exportKit, clearAutoSave,
      snapPart, rotatePart, replacePartFamily, loadSystemBlueprint, updateProductSystem, exportProductSystem,
      savePreset, removePreset, addConnection, removeConnection,
      undo, redo, canUndo, canRedo,
    }}>
      {children}
    </KitContext.Provider>
  );
}

export function useKit() {
  return useContext(KitContext);
}
