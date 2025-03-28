import { test, expect } from '@playwright/test';
import path from 'path';
import { testData } from './testData.js';
import { loadSnapshot, generateSnapshotReport } from '../utils/helpers.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

function snapshotPath(type, pageNumber) {
  return path.resolve(__dirname, `../snapshots/${type}/iframe-page-${pageNumber}.json`);
}

test.describe('Compare iframe snapshots from page 1 and page 2', () => {
  test('Page 1 snapshot matches expected', async () => {
    const expected = loadSnapshot(snapshotPath('expected', 1));
    const actual = loadSnapshot(snapshotPath('actual', 1));
    const report = generateSnapshotReport(expected, actual, testData.searchQuery);

    if (!report.passed) {
      console.error('❗ Differences found on page 1:');
      report.diffs.forEach(diff => console.error('-', diff));
    }

    expect(report.passed, 'Snapshot comparison failed on page 1').toBe(true);
  });

  test('Page 2 snapshot matches expected', async () => {
    const expected = loadSnapshot(snapshotPath('expected', 2));
    const actual = loadSnapshot(snapshotPath('actual', 2));
    const report = generateSnapshotReport(expected, actual, testData.searchQuery);

    if (!report.passed) {
      console.error('❗ Differences found on page 2:');
      report.diffs.forEach(diff => console.error('-', diff));
    }

    expect(report.passed, 'Snapshot comparison failed on page 2').toBe(true);
  });
});