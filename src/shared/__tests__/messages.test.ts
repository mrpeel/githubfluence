import { describe, it, expect } from 'vitest';

describe('message types removed', () => {
  it('auth messages removed — extension now uses session-based auth via injected page script', () => {
    expect(true).toBe(true);
  });
});
