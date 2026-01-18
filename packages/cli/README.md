# CommitGen CLI

**The AI-Powered Commit Generator**

CommitGen is a powerful CLI tool that leverages AI to generate conventional commit messages from your staged changes. It works with 50 free credits (no key required) or your own Google AI API key. It now displays detailed credit usage and cost per generation.

## Installation

Install globally using your preferred package manager:

```bash
# npm
npm install -g @untools/commitgen

# pnpm
pnpm add -g @untools/commitgen

# yarn
yarn global add @untools/commitgen
```

Or run correctly via `npx` (no installation required):

```bash
npx @untools/commitgen
```

### Upgrading

To update to the latest version:

```bash
npm install -g @untools/commitgen@latest
```

## Quick Start

### ⚡ Option 1: Free 50 Credits (No Key Required)

Just sign up with your email to start generating commits immediately.

1.  **Login**:
    ```bash
    commitgen login
    ```
2.  **Generate**:
    Stage your files (`git add .`) and run:
    ```bash
    commitgen
    ```

### 🔑 Option 2: Bring Your Own Key (Unlimited)

Use your own Google Gemini API key for unlimited generations.

1.  **Configure**:
    ```bash
    commitgen config
    ```
2.  Select **"Vercel AI SDK - Google Gemini (Own Key)"**.
3.  Enter your API Key.
    > Don't have one? [Get a free Google AI Key here](https://aistudio.google.com/app/apikey).

## Advanced Features

### 🔄 Multi-Commit Mode

CommitGen can detect when you've modified unrelated files and suggest splitting them into multiple atomic commits.

```bash
commitgen --multi-commit
```

_The CLI will prompt you to confirm the split groups before proceeding._

### 🔄 Regeneration with Hints

Don't like the suggestions? You can ask the AI to try again, optionally providing a **hint** to guide the generation (e.g., "Use emojis", "Focus on the UI changes", "Be more descriptive").

Select **"🔄 Regenerate suggestions"** from the interactive menu.

### 🧠 History Learning

The tool learns from your previous commit messages to match your personal or team's style. This is enabled by default.

To disable:

```bash
commitgen --no-history
```

### 🎫 Issue Linking

If your branch name contains an issue ID (e.g., `feat/PROJ-123-new-auth`), CommitGen will automatically append the ticket reference to your commit message (e.g., `feat: add auth logic (PROJ-123)`).

To disable:

```bash
commitgen --no-issues
```

## Command Reference

### Main Commands

| Command                 | Description                                                      |
| :---------------------- | :--------------------------------------------------------------- |
| `commitgen`             | **Default.** Analyze staged changes and generate commit options. |
| `commitgen login`       | Log in/Sign up for the hosted credit service.                    |
| `commitgen config`      | Switch between Hosted and BYO-Key providers or change models.    |
| `commitgen dashboard`   | Open the web dashboard to manage credits and history.            |
| `commitgen buy-credits` | Purchase additional credits for the hosted service.              |
| `commitgen show-config` | Display your current configuration settings.                     |

### Options & Flags

| Flag                 | Description                                             |
| :------------------- | :------------------------------------------------------ |
| `-p, --push`         | Automatically push to remote after a successful commit. |
| `-n, --noverify`     | Skip git pre-commit hooks (`--no-verify`).              |
| `-m, --multi-commit` | Enable atomic multi-commit suggestions.                 |
| `--model <id>`       | Use a specific model (e.g., `gemini-1.5-pro`).          |
| `--no-use-ai`        | Force offline rule-based generation.                    |
| `--no-history`       | Disable style learning from git history.                |
| `--no-issues`        | Disable automatic issue tracking number linking.        |

## How to Get a Google AI API Key

1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and sign in.
2.  Click **"Create API key"**.
3.  Copy the key string (starts with `AIza...`).
4.  Run `commitgen config` and paste it in.

## License

MIT
