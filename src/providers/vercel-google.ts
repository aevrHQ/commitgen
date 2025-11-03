// ./src/providers/vercel-google.ts

import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { BaseProvider } from "./base";
import { GitAnalysis, CommitMessage, AIProvider } from "../types";

export class VercelGoogleProvider extends BaseProvider implements AIProvider {
  name = "vercel-google";
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model: string = "gemini-2.5-flash") {
    super();
    this.apiKey = apiKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
    this.model = model;

    if (!this.apiKey) {
      throw new Error(
        "Google API key is required. Set GOOGLE_GENERATIVE_AI_API_KEY environment variable or pass it in config."
      );
    }
  }

  async generateCommitMessage(analysis: GitAnalysis): Promise<CommitMessage[]> {
    this.analysis = analysis;

    try {
      const { text } = await generateText({
        model: google(this.model),
        system: this.buildSystemPrompt(),
        prompt: this.buildAnalysisPrompt(analysis),
        temperature: 0.7,
      });

      // Parse JSON response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("Failed to parse AI response");
      }

      const suggestions: CommitMessage[] = JSON.parse(jsonMatch[0]);
      return suggestions.slice(0, 5);
    } catch (error) {
      console.error("Error generating commit message:", error);
      // Fallback to rule-based suggestions
      return this.getFallbackSuggestions(analysis);
    }
  }

  private getFallbackSuggestions(analysis: GitAnalysis): CommitMessage[] {
    const { filesChanged, additions, deletions } = analysis;
    const suggestions: CommitMessage[] = [];

    const hasTests = filesChanged.some(
      (f) => f.includes("test") || f.includes("spec") || f.includes("__tests__")
    );
    const hasDocs = filesChanged.some(
      (f) => f.includes("README") || f.includes(".md")
    );
    const hasConfig = filesChanged.some(
      (f) =>
        f.includes("config") ||
        f.includes(".json") ||
        f.includes("package.json")
    );

    if (additions > deletions * 2 && additions > 20) {
      suggestions.push({
        type: "feat",
        subject: `add ${this.inferFeatureType(filesChanged)}`,
        scope: this.inferScope(filesChanged),
      });
    }

    if (deletions > additions * 2 && deletions > 20) {
      suggestions.push({
        type: "refactor",
        subject: `remove unused ${this.inferFeatureType(filesChanged)}`,
      });
    }

    if (hasTests) {
      suggestions.push({
        type: "test",
        subject: `add tests for ${this.inferScope(filesChanged)}`,
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
      suggestions.push({
        type: "feat",
        subject: `update ${this.inferScope(filesChanged)}`,
      });
    }

    return suggestions;
  }
}
