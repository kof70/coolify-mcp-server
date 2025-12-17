# feat: Add confirmation prompts for destructive actions

**Labels:** `enhancement`, `security`

## Problem

Users are concerned about accidentally triggering destructive actions like stopping applications, restarting services, or deploying changes. They want a safety mechanism before executing dangerous operations.

## Solution

Add a confirmation mechanism for dangerous operations with `COOLIFY_REQUIRE_CONFIRM=true`.

### Dangerous Operations
- `stop_application`, `restart_application`
- `stop_service`, `restart_service`
- `deploy_application`
- `execute_command`
- Future: `delete_*` operations

### Implementation Options

**Option A: Dry-run first (Recommended)**
```typescript
// First call returns what would happen
{
  "action": "stop_application",
  "uuid": "abc123",
  "dry_run": true
}
// Returns:
{
  "confirmation_required": true,
  "action": "stop_application",
  "target": "my-app (production)",
  "warning": "This will stop the application and make it unavailable",
  "confirm_token": "xyz789"
}

// Second call with token executes
{
  "action": "stop_application", 
  "uuid": "abc123",
  "confirm_token": "xyz789"
}
```

**Option B: Add confirm parameter**
```typescript
// Without confirm - returns warning
stop_application({ uuid: "abc123" })
// Returns: "Confirmation required. Call again with confirm: true"

// With confirm - executes
stop_application({ uuid: "abc123", confirm: true })
```

## Configuration

```bash
# .env
COOLIFY_REQUIRE_CONFIRM=true
```

## Acceptance Criteria

- [x] Dangerous actions require confirmation when enabled
- [x] Clear warning messages explain the impact
- [x] Confirmation can be bypassed with explicit parameter
- [x] Works with all destructive operations
- [x] Documentation updated

## Implementation Notes (v1.2.0)

Implemented using **Option B** (confirm parameter) as it's simpler and doesn't require token management.

### Files Modified
- `src/tools/definitions.ts` - Added `DANGEROUS_OPERATIONS`, `isConfirmRequired()`, `isDangerousOperation()`, `getDangerWarning()`
- `src/tools/handlers.ts` - Added `checkConfirmation()` function that intercepts dangerous operations
- `README.md` - Added documentation for `COOLIFY_REQUIRE_CONFIRM` environment variable
- `CHANGELOG.md` - Added v1.2.0 release notes

### Tests Added
- `src/tools/definitions.test.ts` - Tests for confirmation-related functions
- `src/tools/handlers.test.ts` - Tests for confirmation flow in handlers
