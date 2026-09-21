import { rm } from 'node:fs/promises';
// A rescheduled or withdrawn article must not survive in an earlier build.
await rm(new URL('../_site/', import.meta.url), { recursive: true, force: true });
