# Contributing to Coolify MCP Server

First off, thank you for considering contributing to Coolify MCP Server! 🎉

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title** describing the issue
- **Steps to reproduce** the behavior
- **Expected behavior** vs actual behavior
- **Environment details**: Node.js version, Coolify version, OS
- **Error messages** or logs if applicable

### Suggesting Features

Feature requests are welcome! Please:

- Check if the feature has already been requested
- Describe the feature and its use case
- Explain why this would be useful to most users

### Pull Requests

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```
4. **Make your changes** following our coding standards
5. **Test** your changes
6. **Commit** with a clear message:
   ```bash
   git commit -m "feat: add new feature"
   # or
   git commit -m "fix: resolve issue with X"
   ```
7. **Push** to your fork
8. **Open a Pull Request**

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/coolify-mcp-server.git
cd coolify-mcp-server

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev
```

### Testing with a Coolify Instance

Set up environment variables:

```bash
export COOLIFY_BASE_URL="https://your-coolify.com"
export COOLIFY_TOKEN="your-api-token"
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Define proper types/interfaces
- Avoid `any` type when possible

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in multi-line arrays/objects
- Use meaningful variable and function names

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### File Structure

```
src/
├── index.ts          # Entry point
├── types.ts          # TypeScript interfaces
├── client.ts         # Coolify API client
├── tools/            # MCP tool handlers
│   ├── index.ts
│   ├── definitions.ts
│   └── handlers.ts
└── resources/        # MCP resource handlers
    └── index.ts
```

## Adding New Tools

1. Add the tool definition in `src/tools/definitions.ts`:
   ```typescript
   {
     name: 'your_tool_name',
     description: 'Clear description of what the tool does',
     inputSchema: {
       type: 'object',
       properties: {
         param1: { type: 'string', description: 'Parameter description' }
       },
       required: ['param1']
     }
   }
   ```

2. Add the handler in `src/tools/handlers.ts`:
   ```typescript
   case 'your_tool_name':
     return await client.yourMethod(args.param1);
   ```

3. Add the API method in `src/client.ts` if needed

4. Update the README with the new tool

## Questions?

Feel free to open an issue for any questions or discussions!
