import { BaseAdapter } from "./base.adapter";
import { LinkedInAdapter } from "./linkedin.adapter";
import { GreenhouseAdapter, LeverAdapter, GenericAdapter } from "./greenhouse-lever.adapter";

const ADAPTERS: BaseAdapter[] = [
  new LinkedInAdapter(),
  new GreenhouseAdapter(),
  new LeverAdapter(),
  new GenericAdapter(), // Must remain last — is the fallback
];

/**
 * Returns the most appropriate adapter for the current URL.
 */
export function getAdapter(url: string = window.location.href): BaseAdapter {
  for (const adapter of ADAPTERS) {
    if (adapter.matches(url) && !(adapter instanceof GenericAdapter)) {
      return adapter;
    }
  }
  return new GenericAdapter();
}
