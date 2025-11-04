# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

`@untools/commitgen` is a CLI tool that generates AI-powered commit messages following the Conventional Commits specification. It analyzes git changes and uses AI providers (primarily Google Gemini via Vercel AI SDK) to suggest meaningful commit messages.

## Common Commands

### Development
```bash
# Build the TypeScript project
npm run build

# Run in development mode (uses ts-node)
npm run dev

# Run tests
npm test
```

### Testing the CLI Locally
After building, the CLI can be tested locally:
```bash
# Link the package globally for testing
npm link

# Run the CLI
commitgen

# Or run directly from dist
node dist/index.js
```

### Release Management
The project uses `standard-version` for versioning:
```bash
# Automatic version bump based on commits
npm run release

# Specific version bumps
npm run release:patch  # 0.2.0 -> 0.2.1
npm run release:minor  # 0.2.0 -> 0.3.0
npm run release:major  # 0.2.0 -> 1.0.0
```

### Publishing
```bash
# Build and publish to npm (runs prepublishOnly script automatically)
npm publish
```

## Architecture

### Core Components

**Main Entry Point** (`src/index.ts`)
- `CommitGen` class: Main orchestrator for the entire commit generation flow
- Handles git operations, analysis, AI provider interaction, and user prompts
- Manages three major features: history learning, multi-commit mode, and issue tracking

**Type System** (`src/types.ts`)
- `CommitMessage`: Structure for conventional commit messages (type, scope, subject, body, breaking)
- `GitAnalysis`: Represents analyzed git changes
- `CommitGenOptions`: CLI options and feature flags
- `ProviderConfig`: AI provider configuration

**Configuration** (`src/config.ts`)
- `ConfigManager`: Handles `~/.commitgenrc.json` for storing API keys and preferences
- Supports environment variables (e.g., `GOOGLE_GENERATIVE_AI_API_KEY`)

### AI Provider System

**Provider Interface** (`src/providers/base.ts`)
- `BaseProvider`: Abstract class defining the provider contract
- Contains shared logic for inferring commit types and scopes
- Provides system prompts for consistent AI behavior

**Provider Implementations** (`src/providers/`)
- `vercel-google.ts`: Google Gemini integration via Vercel AI SDK (currently the only active provider)
- `index.ts`: Factory function to create provider instances
- Future providers will be added here (OpenAI, Groq, local LLMs)

### Feature Modules

**Commit History Learning** (`src/utils/commit-history.ts`)
- `CommitHistoryAnalyzer`: Analyzes last 50 commits to understand user's style
- Caches results for 5 minutes to optimize performance
- Personalizes suggestions based on:
  - Preferred commit types
  - Average subject length
  - Capitalization and punctuation style
  - Common phrases

**Multi-Commit Mode** (`src/utils/multi-commit.ts`)
- `MultiCommitAnalyzer`: Intelligently splits large changesets into atomic commits
- Groups files by concern: tests, docs, config, types, components, API, utils, styles
- Suggests splitting when 4+ files with 2+ distinct concerns are detected
- Orders commits logically: types → config → features → tests → docs

**Issue Tracker Integration** (`src/utils/issue-tracker.ts`)
- `IssueTrackerIntegration`: Detects issue IDs from branch names
- Supports Jira (PROJ-123), GitHub (#123), Linear (TEAM-123), GitLab
- Infers commit type from branch prefix (feature/, fix/, hotfix/, docs/)
- Appends issue references to commit messages

### Configuration Flow

1. User runs `commitgen config` or is prompted on first run
2. `ConfigManager` saves to `~/.commitgenrc.json`
3. On subsequent runs, config is loaded or environment variables are checked
4. Provider is instantiated with the appropriate credentials

### Commit Generation Flow

1. Check if in a git repository
2. Analyze staged changes (files, additions, deletions, diff)
3. Check for issue tracking (branch name → issue ID)
4. Evaluate if multi-commit mode should be suggested
5. Load commit history for personalization (if enabled)
6. Generate suggestions:
   - Via AI provider (Vercel AI SDK → Google Gemini)
   - Fallback to rule-based suggestions if AI fails
7. Personalize suggestions using history patterns
8. Adjust commit type based on issue branch prefix
9. Present interactive menu for user selection
10. Allow editing, combining, or custom messages
11. Execute git commit (with optional `--no-verify` and `--push`)

## Key Technical Patterns

### Error Handling
- AI generation failures automatically fall back to rule-based suggestions
- Missing API keys trigger interactive configuration prompts
- Git operations use try-catch with empty string fallbacks

### Performance Considerations
- Commit history analysis is cached for 5 minutes
- Only last 50 commits are analyzed for patterns
- Multi-commit analysis uses lazy evaluation
- Git diffs are limited to 2000 characters for AI prompts

### Interactive CLI
- Built with `inquirer` for rich prompts
- Uses `chalk` for colored output
- Provides clear visual feedback with emojis and icons

### Git Operations
- All git commands use `execSync` with error suppression
- Commands return empty strings on failure for graceful degradation
- Supports selective file commits for multi-commit mode

## Configuration Files

- **`tsconfig.json`**: TypeScript compiler targeting ES2018 with CommonJS modules
- **`.versionrc.json`**: standard-version configuration for changelog generation
- **`~/.commitgenrc.json`**: User configuration (created at runtime, not in repo)
- **`.gitignore`**: Excludes `node_modules`, `dist`, and IDE files

## Testing

Currently minimal test coverage with basic CLI smoke tests. Tests use Jest and are located in `__tests__/index.test.ts`.

To add new tests:
1. Create test files in `__tests__/` directory
2. Ensure files match `*.test.ts` pattern
3. Build the project first: `npm run build`
4. Run tests: `npm test`

## Development Notes

### Adding a New AI Provider

1. Create new file in `src/providers/` (e.g., `openai.ts`)
2. Extend `BaseProvider` class
3. Implement `generateCommitMessage()` method
4. Add provider type to `ProviderConfig` union in `src/types.ts`
5. Update provider factory in `src/providers/index.ts`
6. Add environment variable check in `hasEnvironmentApiKey()` in `src/index.ts`
7. Update `configureCommand` in `src/commands/configure.ts`

### Modifying Commit Message Format

The commit message format is controlled by:
- `formatCommitMessage()` in `src/index.ts` - assembles the final string
- `buildSystemPrompt()` in `src/providers/base.ts` - instructs AI on format rules
- Conventional Commits spec must be maintained for compatibility

### Feature Flags

Features can be disabled via:
- CLI flags: `--no-history`, `--no-multi-commit`, `--no-issues`
- Config file: `~/.commitgenrc.json` → `features` object
- Default behavior: all features enabled

## Building and Distribution

The project outputs to `dist/` directory:
- Entry point: `dist/index.js` (must have executable permissions)
- Includes source maps and type declarations
- Only `dist/` is published to npm (see `files` in `package.json`)

The build process (`npm run build`) automatically:
1. Compiles TypeScript to JavaScript
2. Generates `.d.ts` declaration files
3. Makes `dist/index.js` executable with `chmod +x`
