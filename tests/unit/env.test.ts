import { afterEach, describe, expect, it, vi } from "vitest";
import { isDemoMode } from "@/lib/env";

describe("isDemoMode", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("est désactivé par défaut", () => {
    vi.stubEnv("DEMO_MODE", "");
    expect(isDemoMode()).toBe(false);
  });

  it.each(["1", "true"])("s'active avec DEMO_MODE=%s", (value) => {
    vi.stubEnv("DEMO_MODE", value);
    expect(isDemoMode()).toBe(true);
  });
});
