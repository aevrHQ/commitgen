import { defineConfig } from '@airdraft/core'
import { GitHubAdapter } from '@airdraft/core'
import { createAirdraftTokenProvider } from '@airdraft/next'

const adapter = new GitHubAdapter({
  tokenProvider: createAirdraftTokenProvider({
    projectKey: process.env.AIRDRAFT_PROJECT_KEY!,
  }),
  repo: process.env.GITCMS_REPO!,
  branch: process.env.GITCMS_BRANCH ?? 'main',
})

export default defineConfig({
  adapter,
  collections: {
    posts: {
      path: 'content/posts/{slug}.mdx',
      format: 'mdx',
      publish: true,
      slugSource: 'title',
      fields: {
        title: { type: 'text', required: true },
        excerpt: { type: 'text' },
        body: { type: 'rich-text' },
      },
    },
  },
})
