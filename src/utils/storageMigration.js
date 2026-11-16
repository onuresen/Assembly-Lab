const STORAGE_KEYS = {
  kit: ['assembly-lab-save', 'ic-kit-save'],
  theme: ['assembly-lab-theme', 'ic-dark'],
  discovery: ['assembly-lab-guided-discovery-seen', 'ic-guided-discovery-seen'],
}

export function readAssemblyStorage(kind) {
  const [currentKey, legacyKey] = STORAGE_KEYS[kind]
  const currentValue = localStorage.getItem(currentKey)
  if (currentValue !== null) return currentValue

  const legacyValue = localStorage.getItem(legacyKey)
  if (legacyValue !== null) localStorage.setItem(currentKey, legacyValue)
  return legacyValue
}

export function writeAssemblyStorage(kind, value) {
  localStorage.setItem(STORAGE_KEYS[kind][0], value)
}

export function clearAssemblyStorage(kind) {
  const [currentKey, legacyKey] = STORAGE_KEYS[kind]
  localStorage.removeItem(currentKey)
  localStorage.removeItem(legacyKey)
}

export { STORAGE_KEYS }
