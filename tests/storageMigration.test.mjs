import assert from 'node:assert/strict'
import test from 'node:test'

import { clearAssemblyStorage, readAssemblyStorage, writeAssemblyStorage } from '../src/utils/storageMigration.js'

function storage(initial = {}) {
  const values = new Map(Object.entries(initial))
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key),
  }
}

test('legacy Assembly Lab data migrates without deleting the old value', () => {
  global.localStorage = storage({ 'ic-kit-save': '{"parts":[]}' })

  assert.equal(readAssemblyStorage('kit'), '{"parts":[]}')
  assert.equal(localStorage.getItem('assembly-lab-save'), '{"parts":[]}')
  assert.equal(localStorage.getItem('ic-kit-save'), '{"parts":[]}')
})

test('current Assembly Lab data takes precedence over a legacy value', () => {
  global.localStorage = storage({ 'assembly-lab-theme': 'false', 'ic-dark': 'true' })
  assert.equal(readAssemblyStorage('theme'), 'false')
})

test('writes use the current key and reset clears both generations', () => {
  global.localStorage = storage({ 'ic-kit-save': 'legacy' })
  writeAssemblyStorage('kit', 'current')
  assert.equal(localStorage.getItem('assembly-lab-save'), 'current')

  clearAssemblyStorage('kit')
  assert.equal(localStorage.getItem('assembly-lab-save'), null)
  assert.equal(localStorage.getItem('ic-kit-save'), null)
})
