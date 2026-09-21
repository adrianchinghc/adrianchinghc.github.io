import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { articleIsVisible, publicationDate } from './publication.mjs';
import { dueArticlePaths, missingArticlePaths, checkScheduledPublication } from './check-scheduled-publication.mjs';

const data = { draft: false, date: '2026-09-25T09:00:00+08:00', title: 'A decision', description: 'A useful decision.', topic: 'AI decisions', socialTitle: 'AI first?', socialDescription: 'Where to start.', socialLabel: 'AI', socialAction: 'Read' };

test('publication respects the exact Malaysia-time boundary and draft gate', () => {
  const before = { now: new Date('2026-09-25T00:59:59.999Z'), preview: false };
  const due = { now: new Date('2026-09-25T01:00:00Z'), preview: false };
  assert.equal(articleIsVisible(data, before), false);
  assert.equal(articleIsVisible(data, due), true);
  assert.equal(articleIsVisible(data, { ...before, preview: true }), true);
  assert.equal(articleIsVisible({ ...data, draft: true }, { ...due, preview: true }), false);
  assert.equal(articleIsVisible({ date: data.date }, due), false);
  assert.equal(publicationDate('2026-09-25').toISOString(), '2026-09-25T00:00:00.000Z');
  for (const value of ['invalid', '2026-02-30T09:00:00+08:00', '2026-09-25T09:00:00', '', undefined, 0]) assert.throws(() => publicationDate(value));
});

test('scheduled check catches delayed posts, skips existing posts and fails closed on network errors', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'publication-'));
  const put = (name, frontmatter) => writeFile(join(directory, name + '.md'), `---json\n${JSON.stringify(frontmatter)}\n---\nTest.`);
  try {
    await put('due', data);
    await put('future', { ...data, date: '2099-01-01T09:00:00+08:00' });
    await put('draft', { ...data, draft: true });
    const now = new Date('2026-09-26T01:00:00Z');
    assert.deepEqual(await dueArticlePaths(directory, now), ['/blog/due/']);
    const sitemap = '<urlset><url><loc>https://adrianching.com/blog/due/</loc></url></urlset>';
    assert.deepEqual(missingArticlePaths(['/blog/due/'], sitemap), []);
    assert.deepEqual(missingArticlePaths(['/blog/due/'], '<urlset></urlset>'), ['/blog/due/']);
    assert.throws(() => missingArticlePaths([], '<html>Error</html>'));
    assert.deepEqual(await checkScheduledPublication({ directory, now, request: async url => {
      assert.match(url, /sitemap.xml\?schedule=/);
      return { ok: true, text: async () => sitemap };
    } }), []);
    await assert.rejects(checkScheduledPublication({ directory, now, request: async () => ({ ok: false, status: 503 }) }), /HTTP 503/);
    await assert.rejects(checkScheduledPublication({ directory, now, request: async () => { throw new Error('offline'); } }), /offline/);
    assert.deepEqual(await checkScheduledPublication({ directory, now: new Date('2026-01-01'), request: async () => { throw new Error('should not fetch'); } }), []);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
