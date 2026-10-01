import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { renderDefaultVarsCss } from '../../theme/utils/defaultVarsCss';

describe('default-vars.css', () => {
  it('is in sync with the token engine (run `pnpm gen:vars` if this fails)', () => {
    const onDisk = readFileSync(resolve(import.meta.dirname, '../default-vars.css'), 'utf8');
    expect(onDisk).toBe(renderDefaultVarsCss());
  });
});
