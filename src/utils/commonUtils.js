import { createSelector } from '@reduxjs/toolkit';
import { get } from 'lodash-es';
import { isValidElement } from 'react';

export const selectorWithKey = createSelector([(state) => state, (_state, key) => key], (items, category) => {
  return items[category];
});

export const mapObjectValues = (obj, fn, keys = []) => {
  if (typeof obj !== 'object' || obj === null || isValidElement(obj)) return obj;
  const newObj = {};
  if (Array.isArray(obj)) {
    return obj.map((item) => mapObjectValues(item, fn, keys));
  }
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === 'object' && value !== null) {
      newObj[key] = mapObjectValues(value, fn, keys);
    } else {
      newObj[key] = keys.includes(key) && typeof value === 'string' ? fn(value) : value;
    }
  }
  return newObj;
};

/**
 * applyObjectMappings
 * Generic object transformer based on mappings.
 *
 * - mappings: Array of mapping entries. Each entry supports:
 *   - key: source path in input (required)
 *   - target: target key in output (defaults to `key`)
 *   - extract: string path relative to the source to pick (e.g. 'code' to take source.code)
 *   - transform: function(value, input) => transformedValue (optional)
 *   - includeIfExists: boolean (default true) -> only add target when source value exists (not null/undefined/empty string)
 *   - delete: boolean (if true, will delete `target` from output)
 *
 * - options:
 *   - copyUnmapped: boolean (default true) copy non-mentioned input props into output as-is
 *
 * Behavior:
 *  - Start with shallow copy of `input` when copyUnmapped is true.
 *  - For each mapping, compute `val = get(input, key)` then if `extract` is provided use get(val, extract).
 *  - If includeIfExists is true and computed val is null/undefined/'' then skip assignment.
 *  - If transform provided, call it to get final value.
 *  - Assign to `target` key in output (overwrites).
 *  - If mapping.delete === true then delete the `target` key from output.
 */
export const applyObjectMappings = (input = {}, mappings = [], options = {}) => {
  const { copyUnmapped = true } = options;
  const output = copyUnmapped ? { ...input } : {};

  const exists = (v) => v !== undefined && v !== null && !(typeof v === 'string' && v.trim() === '');

  mappings.forEach((m) => {
    const key = m.key;
    const target = m.target ?? key;

    if (m.delete) {
      if (Object.prototype.hasOwnProperty.call(output, target)) delete output[target];
      return;
    }

    let val = get(input, key);
    if (m.extract && val !== undefined && val !== null) {
      val = get(val, m.extract);
    }

    if (m.includeIfExists === undefined ? true : m.includeIfExists) {
      if (!exists(val)) return; // skip assignment
    }

    const finalVal = typeof m.transform === 'function' ? m.transform(val, input) : val;
    output[target] = finalVal;
  });

  return output;
};

export const toNumber = (v, def = 0) => {
  const n = Number(typeof v === 'string' && v.trim() === '' ? NaN : v);
  return Number.isFinite(n) ? n : def;
};
