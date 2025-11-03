#!/usr/bin/env node

// ./src/index.ts
import { execSync } from "child_process";
import chalk from "chalk";
import { Command } from "commander";
import inquirer from "inquirer";
import { CommitMessage, GitAnalysis } from "./types";
import { ConfigManager } from "./config";
import { configureCommand } from "./commands/configure";
import { createProvider } from "./providers";

class CommitGen {
  private exec(cmd: string): string {
    try {
      return execSync(cmd, {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "ignore"],
      }).trim();
    } catch (error) {
      return "";
    }
  }

  private isGitRepo(): boolean {
    return this.exec("git rev-parse --git-dir") !== "";
  }

  private getStagedChanges(): string {
    return this.exec("git diff --cached --stat");
  }

  private getStagedDiff(): string {
    return this.exec("git diff --cached");
  }

  private getTrackedChanges(): string {
    return this.exec("git diff --stat");
  }

  private analyzeChanges(): GitAnalysis {
    const staged = this.getStagedChanges();
    const unstaged = this.getTrackedChanges();
    const diff = this.getStagedDiff();

    const files: string[] = [];
    if (staged) {
      const lines = staged.split("\n");
      lines.forEach((line) => {
        const match = line.match(/^\s*(.+?)\s+\|/);
        if (match) files.push(match[1]);
      });
    }

    const additions = (diff.match(/^\+(?!\+)/gm) || []).length;
    const deletions = (diff.match(/^-(?!-)/gm) || []).length;

    return {
      filesChanged: files,
      additions,
      deletions,
      hasStaged: staged !== "",
      hasUnstaged: unstaged !== "",
      diff,
    };
  }

  private formatCommitMessage(msg: CommitMessage): string {
    let result = `${msg.type}`;
    if (msg.scope) result += `(${msg.scope})`;
    if (msg.breaking) result += "!";
    result += `: ${msg.subject}`;
    if (msg.body) result += `\n\n${msg.body}`;
    if (msg.breaking)
      result += `\n\nBREAKING CHANGE: Major version update required`;
    return result;
  }

  private displayAnalysis(analysis: GitAnalysis): void {
    console.log(chalk.cyan.bold("\n📊 Analysis:"));
    console.log(
      chalk.gray(
        `   Files changed: ${chalk.white(analysis.filesChanged.length)}`,
      ),
    );
    console.log(
      chalk.gray(`   Additions: ${chalk.green(`+${analysis.additions}`)}`),
    );
    console.log(
      chalk.gray(`   Deletions: ${chalk.red(`-${analysis.deletions}`)}`),
    );

    console.log(chalk.cyan.bold("\n📝 Changed files:"));
    analysis.filesChanged.slice(0, 10).forEach((f) => {
      const ext = f.split(".").pop();
      const icon = this.getFileIcon(ext || "");
      console.log(chalk.gray(`   ${icon} ${f}`));
    });

    if (analysis.filesChanged.length > 10) {
      console.log(
        chalk.gray(
          `   ... and ${analysis.filesChanged.length - 10} more files`,
        ),
      );
    }
  }

  private getFileIcon(ext: string): string {
    const icons: Record<string, string> = {
      ts: "📘",
      js: "📒",
      tsx: "⚛️",
      jsx: "⚛️",
      json: "📋",
      md: "📝",
      css: "🎨",
      scss: "🎨",
      html: "🌐",
      test: "🧪",
      spec: "🧪",
    };
    return icons[ext] || "📄";
  }

  async run(options: {
    push?: boolean;
    noverify?: boolean;
    useAi?: boolean;
  }): Promise<void> {
    console.log(
      chalk.bold.cyan("\n🚀 CommitGen") +
        chalk.gray(" - AI-Powered Commit Message Generator\n"),
    );

    if (!this.isGitRepo()) {
      console.error(chalk.red("❌ Error: Not a git repository"));
      process.exit(1);
    }

    const analysis = this.analyzeChanges();

    if (!analysis.hasStaged) {
      console.log(chalk.yellow("⚠️  No staged changes found."));
      if (analysis.hasUnstaged) {
        console.log(
          chalk.blue("💡 You have unstaged changes. Stage them with:") +
            chalk.gray(" git add <files>"),
        );
      }
      process.exit(0);
    }

    this.displayAnalysis(analysis);

    let suggestions: CommitMessage[];

    if (options.useAi !== false) {
      try {
        // Load provider configuration
        const configManager = new ConfigManager();
        const providerConfig = configManager.getProviderConfig();

        console.log(
          chalk.blue(
            `\n🤖 Generating commit messages using ${providerConfig.provider}...\n`,
          ),
        );

        // Create provider and generate suggestions
        const provider = createProvider(providerConfig);
        suggestions = await provider.generateCommitMessage(analysis);

        if (!suggestions || suggestions.length === 0) {
          throw new Error("No suggestions generated");
        }
      } catch (error) {
        console.warn(
          chalk.yellow(
            `⚠️  AI generation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          ),
        );
        console.log(chalk.gray("Falling back to rule-based suggestions...\n"));
        suggestions = this.getFallbackSuggestions(analysis);
      }
    } else {
      suggestions = this.getFallbackSuggestions(analysis);
    }

    console.log(chalk.cyan.bold("💡 Suggested commit messages:\n"));

    const choices = suggestions.map((s, i) => {
      const formatted = this.formatCommitMessage(s);
      const preview = formatted.split("\n")[0];
      return {
        name: `${chalk.gray(`${i + 1}.`)} ${preview}`,
        value: formatted,
        short: preview,
      };
    });

    choices.push({
      name: chalk.gray("✏️  Write custom message"),
      value: "__custom__",
      short: "Custom message",
    });

    const { selected } = await inquirer.prompt([
      {
        type: "list",
        name: "selected",
        message: "Choose a commit message:",
        choices,
        pageSize: 10,
      },
    ]);

    let commitMessage: string;

    if (selected === "__custom__") {
      const { customMessage } = await inquirer.prompt([
        {
          type: "input",
          name: "customMessage",
          message: "Enter your commit message:",
          validate: (input: string) => {
            if (!input.trim()) return "Commit message cannot be empty";
            return true;
          },
        },
      ]);
      commitMessage = customMessage;
    } else {
      const { confirmed } = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirmed",
          message: "Confirm this commit message?",
          default: true,
        },
      ]);

      if (!confirmed) {
        const { customMessage } = await inquirer.prompt([
          {
            type: "input",
            name: "customMessage",
            message: "Enter your commit message:",
            validate: (input: string) => {
              if (!input.trim()) return "Commit message cannot be empty";
              return true;
            },
          },
        ]);
        commitMessage = customMessage;
      } else {
        commitMessage = selected;
      }
    }

    if (!commitMessage.trim()) {
      console.log(chalk.red("\n❌ Commit cancelled - empty message"));
      return;
    }

    try {
      let commitCmd = `git commit -m "${commitMessage.replace(/"/g, '\\"')}"`;

      if (options.noverify) {
        commitCmd += " --no-verify";
      }

      this.exec(commitCmd);
      console.log(chalk.green("\n✅ Commit successful!"));

      if (options.push) {
        console.log(chalk.blue("\n📤 Pushing to remote..."));
        const currentBranch = this.exec("git branch --show-current");
        this.exec(`git push origin ${currentBranch}`);
        console.log(chalk.green("✅ Pushed successfully!"));
      }
    } catch (error) {
      console.error(chalk.red("❌ Commit failed:"), error);
      process.exit(1);
    }
  }

  private getFallbackSuggestions(analysis: GitAnalysis): CommitMessage[] {
    const { filesChanged, additions, deletions } = analysis;
    const suggestions: CommitMessage[] = [];

    const hasTests = filesChanged.some(
      (f) =>
        f.includes("test") || f.includes("spec") || f.includes("__tests__"),
    );
    const hasDocs = filesChanged.some(
      (f) => f.includes("README") || f.includes(".md"),
    );
    const hasConfig = filesChanged.some(
      (f) =>
        f.includes("config") ||
        f.includes(".json") ||
        f.includes("package.json"),
    );

    if (additions > deletions * 2 && additions > 20) {
      suggestions.push({
        type: "feat",
        subject: `add new feature`,
      });
    }

    if (deletions > additions * 2 && deletions > 20) {
      suggestions.push({
        type: "refactor",
        subject: `remove unused code`,
      });
    }

    if (hasTests) {
      suggestions.push({
        type: "test",
        subject: `add tests`,
      });
    }

    if (hasDocs) {
      suggestions.push({
        type: "docs",
        subject: "update documentation",
      });
    }

    if (hasConfig) {
      suggestions.push({
        type: "chore",
        subject: "update configuration",
      });
    }

    if (suggestions.length === 0) {
      suggestions.push(
        {
          type: "feat",
          subject: `add feature`,
        },
        {
          type: "fix",
          subject: `fix issue`,
        },
        {
          type: "refactor",
          subject: `refactor code`,
        },
      );
    }

    return suggestions.slice(0, 5);
  }
}

// CLI setup
const program = new Command();

program
  .name("commitgen")
  .description("AI-powered commit message generator for Git")
  .version("0.0.4")
  .option("-p, --push", "Push changes after committing")
  .option("-n, --noverify", "Skip git hooks (--no-verify)")
  .option("--no-ai", "Disable AI generation and use rule-based suggestions")
  .action(async (options) => {
    const commitGen = new CommitGen();
    await commitGen.run(options);
  });

program
  .command("config")
  .description("Configure AI provider and settings")
  .action(configureCommand);

program.parse();
