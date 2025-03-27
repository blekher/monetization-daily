import fs from 'fs';
import path from 'path';
import { test, expect } from '@playwright/test';

// Utility to compare numbers with a pixel tolerance
function compareWithTolerance(actual, expected, tolerance = 1) {
  const diffs = [];

  for (const key in expected) {
    if (typeof expected[key] === 'number') {
      const diff = Math.abs(expected[key] - actual[key]);
      if (diff > tolerance) {
        diffs.push(`✗ ${key}: expected ${expected[key]}, got ${actual[key]}`);
      }
    } else if (typeof expected[key] === 'object' && expected[key] !== null) {
      const nestedDiffs = compareWithTolerance(actual[key], expected[key], tolerance);
      nestedDiffs.forEach(d => diffs.push(`${key}.${d}`));
    } else {
      if (actual[key] !== expected[key]) {
        diffs.push(`✗ ${key}: expected ${expected[key]}, got ${actual[key]}`);
      }
    }
  }

  return diffs;
}

test('Compare iframe JSON snapshot with tolerance', async () => {
  const actualPath = path.resolve('./snapshots/iframe-details/iframe-page-1.json');
  const expectedPath = path.resolve('./snapshots/expected/iframe-page-1.json');

  const actual = JSON.parse(fs.readFileSync(actualPath, 'utf-8'));
  const expected = JSON.parse(fs.readFileSync(expectedPath, 'utf-8'));

  const diffs = compareWithTolerance(actual, expected, 1);

  if (diffs.length > 0) {
    console.error('Differences found:');
    diffs.forEach(diff => console.error(diff));
  }

  expect(diffs.length).toBe(0);
});