import type { Company, Lead } from './types';

import appJson from '../../app.json';

// Android emulator can reach host machine via 10.0.2.2
// iOS simulator can use http://localhost
// Real device: use http://<your-lan-ip>
// You can override at runtime by setting: globalThis.HPCL_API_BASE_URL = 'http://<ip>:4000'
const DEFAULT_API_BASE_URL = 'http://10.0.2.2:4000';

function getApiBaseUrl(): string {
  const override = (globalThis as unknown as { HPCL_API_BASE_URL?: string }).HPCL_API_BASE_URL;
  const fromAppJson = (appJson as unknown as { apiBaseUrl?: string }).apiBaseUrl;
  return override || fromAppJson || DEFAULT_API_BASE_URL;
}

async function requestJson<T>(path: string): Promise<T> {
  const res = await fetch(`${getApiBaseUrl()}${path}`);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request failed (${res.status}): ${text || res.statusText}`);
  }
  return (await res.json()) as T;
}

export const api = {
  getLeads: () => requestJson<Lead[]>('/leads'),
  getLeadById: (id: string) => requestJson<Lead>(`/leads/${encodeURIComponent(id)}`),
  getCompanies: () => requestJson<Company[]>('/companies'),
};
