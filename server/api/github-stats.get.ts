import { Octokit } from '@octokit/rest'

export default defineEventHandler(async (event) => {
  try {
    // GitHub token from environment variables (server-side only)
    const token = process.env.ACCESS_TOKEN_GITHUB

    if (!token) {
      console.log('No ACCESS_TOKEN_GITHUB found')
      return { error: 'No GitHub token configured' }
    }

    console.log('GitHub token found, length:', token.length)

    const octokit = new Octokit({
      auth: token,
    })

    // First, let's just get basic user info
    console.log('Fetching user info...')
    const { data: user } = await octokit.users.getByUsername({
      username: 'pandemicprogrammer',
    })

    console.log('User public repos:', user.public_repos)

    // Try to get authenticated user info
    console.log('Fetching authenticated user...')
    const { data: authenticatedUser } = await octokit.users.getAuthenticated()
    console.log('Authenticated as:', authenticatedUser.login)

    // Get repositories (both public and private - using authenticated user's repos)
    console.log('Fetching repos...')
    const { data: repos } = await octokit.repos.listForAuthenticatedUser({
      type: 'all', // owner repos (both public and private)
      per_page: 100,
      sort: 'updated',
    })

    console.log('Total repos fetched:', repos.length)

    // Filter to only include repos owned by pandemicprogrammer (not just contributed to)
    const ownedRepos = repos.filter(repo => repo.owner.login === 'pandemicprogrammer')

    console.log('Owned repos by pandemicprogrammer:', ownedRepos.length)
    console.log('Public repos count:', ownedRepos.filter(r => !r.private).length)
    console.log('Private repos count:', ownedRepos.filter(r => r.private).length)

    // Calculate stats with proper language analysis
    console.log('Analyzing languages by code volume...')

    // Get language statistics for each repository (bytes of code per language)
    const languagePromises = ownedRepos.map(async (repo) => {
      try {
        const { data: languages } = await octokit.repos.listLanguages({
          owner: repo.owner.login,
          repo: repo.name,
        })
        return languages // This returns { "JavaScript": 1234, "HTML": 567, ... }
      } catch (error) {
        console.log(`Could not fetch languages for ${repo.name}:`, error)
        return {}
      }
    })

    const languageData = await Promise.all(languagePromises)

    // Aggregate languages by total bytes across all repositories
    const totalLanguages: Record<string, number> = {}
    languageData.forEach(repoLanguages => {
      Object.entries(repoLanguages).forEach(([language, bytes]) => {
        totalLanguages[language] = (totalLanguages[language] || 0) + bytes
      })
    })

    const stats = {
      public_repos: user.public_repos,
      total_repos: ownedRepos.length,
      followers: user.followers,
      following: user.following,
      stars: ownedRepos.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0),
      forks: ownedRepos.reduce((acc: number, repo: any) => acc + repo.forks_count, 0),
      languages: totalLanguages, // Now contains total bytes per language
    }

    // Get recent activity data
    console.log('Fetching recent activity...')

    // Get latest releases from owned repos
    const releasesPromises = ownedRepos.slice(0, 10).map(async (repo) => {
      try {
        const { data: releases } = await octokit.repos.listReleases({
          owner: repo.owner.login,
          repo: repo.name,
          per_page: 1, // Get latest release only
        })
        return releases.length > 0 ? {
          repo: repo.name,
          release: releases[0],
          published_at: releases[0].published_at,
        } : null
      } catch (error) {
        // Some repos might not have releases or access might be denied
        return null
      }
    })

    const releasesData = (await Promise.all(releasesPromises)).filter(Boolean)
    const latestReleases = releasesData
      .filter(item => item && item.published_at)
      .sort((a, b) => new Date(b!.published_at!).getTime() - new Date(a!.published_at!).getTime())
      .slice(0, 5) // Show 5 most recent releases

    // Get recent pull requests (created by the user)
    const { data: pullRequests } = await octokit.search.issuesAndPullRequests({
      q: `author:pandemicprogrammer type:pr`,
      sort: 'updated',
      order: 'desc',
      per_page: 10,
    })

    // Get recent commits (across user's repos)
    const commitsPromises = ownedRepos.slice(0, 5).map(async (repo) => {
      try {
        const { data: commits } = await octokit.repos.listCommits({
          owner: repo.owner.login,
          repo: repo.name,
          per_page: 3, // Get 3 most recent commits per repo
        })
        return commits.map(commit => ({
          repo: repo.name,
          sha: commit.sha.substring(0, 7),
          message: commit.commit.message.split('\n')[0], // First line only
          date: commit.commit.author?.date,
          author: commit.commit.author?.name,
        }))
      } catch (error) {
        return []
      }
    })

    const commitsData = (await Promise.all(commitsPromises)).flat()
    const recentCommits = commitsData
      .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
      .slice(0, 10) // Show 10 most recent commits

    // Get contribution data (simplified - you might want to use GitHub's GraphQL API for more detailed contributions)
    const contributions = {
      // This is a simplified version - for full contribution calendar,
      // you'd need to use GitHub's GraphQL API or scrape the profile page
      total_contributions: 0, // Would need GraphQL API for accurate data
    }

    return {
      user,
      stats,
      contributions,
      activity: {
        latestReleases,
        recentPullRequests: pullRequests.items.slice(0, 5), // Show 5 most recent PRs
        recentCommits,
      },
      debug: {
        authenticated_user: authenticatedUser.login,
        total_repos_fetched: repos.length,
        owned_repos_count: ownedRepos.length,
        public_repos_count: ownedRepos.filter(r => !r.private).length,
        private_repos_count: ownedRepos.filter(r => r.private).length,
      },
    }
  } catch (error) {
    console.error('GitHub API error:', error)

    // Return public-only stats as fallback
    try {
      const octokit = new Octokit()
      const { data: user } = await octokit.users.getByUsername({
        username: 'pandemicprogrammer',
      })

      return {
        user,
        stats: {
          public_repos: user.public_repos,
          total_repos: user.public_repos, // Fallback to public only
          followers: user.followers,
          following: user.following,
          stars: 0, // Cannot calculate without repo access
          forks: 0, // Cannot calculate without repo access
          languages: {}, // Cannot get language stats without repo access
        },
        contributions: { total_contributions: 0 },
        activity: {
          latestReleases: [],
          recentPullRequests: [],
          recentCommits: [],
        },
        error: 'Using public stats only - check GitHub token configuration',
        debug: { error: (error as Error).message },
      }
    } catch (fallbackError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch GitHub stats - check token configuration',
      })
    }
  }
})