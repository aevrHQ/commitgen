<!-- ./README.md -->

# @untools/commitgen

🚀 AI-powered commit message generator for Git with modular AI provider support.

## Features

✨ **AI-Powered Generation**: Leverages advanced AI models to analyze your git changes and generate meaningful commit messages

🎯 **Conventional Commits**: Follows the [Conventional Commits](https://www.conventionalcommits.org/) specification

🔌 **Modular Providers**: Support for multiple AI providers:

- ✅ Vercel AI SDK (Google Gemini)
- 🔜 Vercel AI SDK (OpenAI)
- 🔜 Groq
- 🔜 OpenAI Direct
- 🔜 Google Direct
- 🔜 Local LLMs (Ollama, LM Studio, etc.)

🎨 **Beautiful CLI**: Colorized output with interactive prompts using Inquirer

📊 **Smart Analysis**: Analyzes file patterns, additions/deletions, and git diffs

⚡ **Fast**: Efficient processing with fallback to rule-based suggestions

## Installation

```bash
# Global installation (recommended)
npm install -g @untools/commitgen

# Or use with npx
npx @untools/commitgen
```

## Quick Start

1. **Stage your changes**:

```bash
git add .
```

2. **Generate commit message**:

```bash
commitgen
```

That's it! If it's your first time, CommitGen will automatically prompt you to configure your API key. The tool will then analyze your changes and suggest commit messages.

### First-Time Setup

When you run `commitgen` for the first time without an API key, you'll see:

```
⚠️  API key not found for the selected provider.
? Would you like to configure your API key now? (Y/n)
```

Choose "Yes" to set up your configuration, or run `commitgen config` manually anytime.

## Usage

### Basic Commands

```bash
# Generate commit message (interactive)
commitgen

# Commit and push in one command
commitgen --push

# Skip git hooks
commitgen --noverify

# Use rule-based suggestions (no AI)
commitgen --no-ai

# Configure AI provider
commitgen config

# Show help
commitgen --help

# Show version
commitgen --version
```

### Configuration

The configuration file is stored at `~/.commitgenrc.json`:

```json
{
  "provider": {
    "provider": "vercel-google",
    "model": "gemini-2.5-flash",
    "apiKey": "optional-if-using-env-var"
  }
}
```

### Environment Variables

You can use environment variables instead of storing API keys in the config:

```bash
# For Google Gemini (via Vercel AI SDK)
export GOOGLE_GENERATIVE_AI_API_KEY="your-api-key"

# Then run without configuring
commitgen
```

## AI Providers

### Vercel AI SDK - Google Gemini (Available Now)

Uses the [Vercel AI SDK](https://sdk.vercel.ai/) with Google's Gemini models.

**Setup:**

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Run `commitgen config` and select "Vercel AI SDK - Google Gemini"
3. Enter your API key or set `GOOGLE_GENERATIVE_AI_API_KEY` environment variable

**Available Models:**

- `gemini-2.5-flash` (Recommended - Fast and efficient)
- `gemini-2.5-pro` (More capable, higher quality)
- `gemini-1.5-flash`
- `gemini-1.5-pro`

### Coming Soon

- **Vercel AI SDK - OpenAI**: GPT-4o, GPT-4o-mini
- **Groq**: Ultra-fast inference with Llama models
- **OpenAI Direct**: Direct OpenAI API integration
- **Google Direct**: Direct Google Generative AI integration
- **Local LLMs**: Ollama, LM Studio, LocalAI support

## How It Works

1. **Analysis**: Scans your staged git changes

   - File patterns (tests, docs, configs, components)
   - Addition/deletion statistics
   - Git diff content

2. **AI Generation**: Sends analysis to your configured AI provider

   - Uses a specialized prompt for commit message generation
   - Follows Conventional Commits specification
   - Returns 3-5 contextual suggestions

3. **Selection**: Interactive prompt to choose or customize

   - Select from AI-generated suggestions
   - Write a custom message
   - Confirm before committing

4. **Commit**: Executes git commit with your chosen message
   - Optional: Push to remote with `--push` flag
   - Optional: Skip hooks with `--noverify` flag

## Examples

### Typical Workflow

```bash
# Make some changes
vim src/components/Button.tsx

# Stage changes
git add src/components/Button.tsx

# Generate and commit
commitgen
```

Output:

```
🚀 CommitGen - AI-Powered Commit Message Generator

📊 Analysis:
   Files changed: 1
   Additions: +45
   Deletions: -12

📝 Changed files:
   ⚛️ src/components/Button.tsx

🤖 Generating commit messages using vercel-google...

💡 Suggested commit messages:

1. feat(components): add variant prop to Button component
2. feat(Button): implement new button styles and variants
3. refactor(components): restructure Button component props
4. style(Button): update button styling system
✏️  Write custom message

? Choose a commit message: (Use arrow keys)
```

### Configuration Example

```bash
$ commitgen config

⚙️  Configure CommitGen

? Select AI provider: Vercel AI SDK - Google Gemini
? Enter your Google AI API key: **********************
? Select model: Gemini 2.5 Flash (Fast, Recommended)

✅ Configuration saved successfully!
Config file: /Users/you/.commitgenrc.json
```

## Commit Message Format

Generated messages follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test updates
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Maintenance tasks
- `revert`: Revert previous commit

**Example:**

```
feat(auth): add OAuth2 authentication

Implemented OAuth2 flow with Google and GitHub providers.
Added JWT token management and refresh logic.

BREAKING CHANGE: Authentication API has changed
```

## Troubleshooting

### "No staged changes found"

Make sure you've staged your changes:

```bash
git add <files>
# or
git add .
```

### "API key is required"

Set your API key either:

1. Run `commitgen config` to save it in config file
2. Set environment variable: `export GOOGLE_GENERATIVE_AI_API_KEY="your-key"`

### AI generation fails

The tool will automatically fall back to rule-based suggestions if AI generation fails. You can also force rule-based mode with `--no-ai`.

## Development

```bash
# Clone the repository
git clone https://github.com/aevrHQ/untools-commitgen.git
cd untools-commitgen

# Install dependencies
npm install

# Build
npm run build

# Link for local testing
npm link

# Run
commitgen
```

## Dependencies

```json
{
  "@ai-sdk/google": "^1.x.x",
  "ai": "^4.x.x",
  "chalk": "^4.1.2",
  "commander": "^13.1.0",
  "inquirer": "^12.5.2"
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © Miracle Onyenma

## Links

- [GitHub Repository](https://github.com/aevrHQ/untools-commitgen)
- [npm Package](https://www.npmjs.com/package/@untools/commitgen)
- [Issue Tracker](https://github.com/aevrHQ/untools-commitgen/issues)

---

Made with ❤️ by [Miracle Onyenma](https://github.com/miracleonyenma)
