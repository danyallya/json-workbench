import type { JsonDocument } from '../domain/jsonDocument';

export const initialDocuments: JsonDocument[] = [
  {
    id: 'release-config',
    name: 'release-config.json',
    source: '{\n  "product": "Aster API",\n  "version": "2.4.0",\n  "workspace": "production-eu",\n  "features": [\n    { "key": "smart-routing", "enabled": true },\n    { "key": "legacy-export", "enabled": false }\n  ],\n  "limits": { "requestsPerMinute": 2400, "burst": 180 }\n}',
  },
  {
    id: 'routing-rules',
    name: 'routing-rules.json',
    source: '{\n  "defaultRegion": "eu-west",\n  "fallbackEnabled": true,\n  "rules": [\n    { "path": "/catalog", "region": "eu-west" },\n    { "path": "/status", "region": "global" }\n  ]\n}',
  },
  {
    id: 'feature-flags',
    name: 'feature-flags.json',
    source: '{\n  "flags": {\n    "smart-routing": true,\n    "legacy-export": false,\n    "bulk-import": false\n  }\n}',
  },
];
