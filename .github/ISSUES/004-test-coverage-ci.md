# feat: Add test coverage and CI/CD pipeline

**Labels:** `enhancement`, `testing`, `ci/cd`

## Problem

The project lacks automated tests and CI/CD pipeline, making it harder to:
- Verify changes don't break existing functionality
- Maintain code quality
- Build confidence for contributors

## Solution

### 1. Testing Framework Setup

**Install dependencies:**
```bash
npm install -D vitest @types/node
```

**vitest.config.ts:**
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'build/', '*.config.*']
    }
  }
});
```

### 2. Test Structure

```
src/
├── __tests__/
│   ├── client.test.ts
│   ├── tools/
│   │   ├── handlers.test.ts
│   │   └── definitions.test.ts
│   └── mocks/
│       └── coolify-api.ts
```

### 3. Example Tests

```typescript
// src/__tests__/tools/handlers.test.ts
import { describe, it, expect, vi } from 'vitest';
import { handleToolCall } from '../../tools/handlers';

describe('Tool Handlers', () => {
  describe('list_servers', () => {
    it('should return list of servers', async () => {
      // Mock API response
      vi.mock('../../client', () => ({
        coolifyClient: {
          get: vi.fn().mockResolvedValue({ data: [{ id: 1, name: 'server1' }] })
        }
      }));

      const result = await handleToolCall('list_servers', {});
      expect(result).toHaveProperty('content');
    });
  });
});
```

### 4. GitHub Actions Workflow

**.github/workflows/ci.yml:**
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run build
      
      - name: Run tests
        run: npm test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
```

### 5. Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix"
  }
}
```

## Acceptance Criteria

- [ ] Vitest configured and working
- [ ] Unit tests for tool handlers
- [ ] Unit tests for client
- [ ] Mock Coolify API responses
- [ ] GitHub Actions workflow for CI
- [ ] Coverage reporting (target: 70%+)
- [ ] Coverage badge in README
- [ ] ESLint configured
