# feat: Enhanced logs support for apps, services, and databases

**Labels:** `enhancement`

## Problem

Currently only `get_application_logs` is implemented. Users need to view logs from services and databases as well for complete monitoring.

## Solution

Add comprehensive logging support:

### New Tools

1. **get_service_logs**
```typescript
{
  name: 'get_service_logs',
  description: 'Get logs from a service',
  inputSchema: {
    type: 'object',
    properties: {
      uuid: { type: 'string', description: 'Service UUID' },
      lines: { type: 'number', description: 'Number of lines', default: 100 }
    },
    required: ['uuid']
  }
}
```

2. **get_database_logs**
```typescript
{
  name: 'get_database_logs',
  description: 'Get logs from a database',
  inputSchema: {
    type: 'object',
    properties: {
      uuid: { type: 'string', description: 'Database UUID' },
      lines: { type: 'number', description: 'Number of lines', default: 100 }
    },
    required: ['uuid']
  }
}
```

3. **Enhanced get_application_logs**
```typescript
{
  name: 'get_application_logs',
  inputSchema: {
    type: 'object',
    properties: {
      uuid: { type: 'string', description: 'Application UUID' },
      lines: { type: 'number', description: 'Number of lines', default: 100 },
      since: { type: 'string', description: 'Show logs since timestamp (e.g., 2024-01-01T00:00:00Z)' },
      until: { type: 'string', description: 'Show logs until timestamp' },
      filter: { type: 'string', description: 'Filter logs by keyword' }
    },
    required: ['uuid']
  }
}
```

## API Endpoints to Implement

- `GET /api/v1/services/{uuid}/logs`
- `GET /api/v1/databases/{uuid}/logs`

## Acceptance Criteria

- [ ] `get_service_logs` implemented
- [ ] `get_database_logs` implemented
- [ ] Enhanced filtering options for all log tools
- [ ] Documentation updated
- [ ] Error handling for services/databases without logs
