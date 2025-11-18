<template>
  <section class="about-page">
    <div class="about-panel">
      <h1>About Us</h1>
      <div class="section-row two-cols">
        <div class="section card">
          <h2><Icon icon="mdi:tools" class="section-icon" /> What We Do</h2>
          <p>
            We specialize in API-driven web architecture, modern frontend frameworks, and WordPress backend integrations. From headless CMS implementations to custom platform development, we turn complex needs into elegant solutions.
          </p>
        </div>

        <div class="section card">
          <h2><Icon icon="mdi:lightbulb-outline" class="section-icon" /> Our Philosophy</h2>
          <p>
            We believe that technology should empower — not overwhelm. That’s why we build tools that are as intuitive as they are powerful, tailored to your team's workflow and your users' experience.
          </p>
        </div>
      </div>
      <div class="section">
  <h2><Icon icon="mdi:account-group" class="section-icon" /> Meet the Team</h2>
        <p>
          We’re a small, passionate team of engineers, designers, and problem solvers committed to delivering human-centric digital tools.
        </p>
        <div class="team-member">
          <div class="team-member-content">
            <div class="team-member-left">
              <img src="/images/primary/marine.png" alt="Marine" class="team-member-image" />
              <a href="https://github.com/pandemicprogrammer" target="_blank" rel="noopener noreferrer" class="github-link">
                <Icon icon="mdi:github" class="github-icon" />
                GitHub Profile
              </a>
            </div>
            <div class="team-member-info">
              <h3>Marine</h3>
              <p class="role">CEO and Lead Developer</p>
              <p>
                Marine leads our team with a focus on innovative API-driven solutions and modern web architectures. With extensive experience in full-stack development, they ensure our projects deliver exceptional user experiences and robust backend systems.
              </p>

              <!-- Recent Activity Section -->
              <div class="recent-activity" v-if="githubStats?.activity">
                <div class="recent-activity-header">
                  <h4>Recent Activity</h4>
                  <button
                    class="activity-toggle"
                    type="button"
                    @click="recentActivityOpen = !recentActivityOpen"
                    :aria-expanded="recentActivityOpen"
                  >
                    <span v-if="!recentActivityOpen">Show activity ({{ totalActivityCount }})</span>
                    <span v-else>Hide activity</span>
                  </button>
                </div>

                <div class="recent-activity-body" :class="{ collapsed: !recentActivityOpen }">

                  <!-- Latest Releases -->
                  <div class="activity-section" v-if="githubStats.activity.latestReleases?.length">
                    <h5><Icon icon="mdi:rocket" class="section-small-icon" /> Latest Releases</h5>
                    <div class="activity-list">
                      <div
                        v-for="release in githubStats.activity.latestReleases"
                        :key="release.repo + release.release.tag_name"
                        class="activity-item"
                      >
                        <div class="activity-content">
                          <strong>{{ release.release.name || release.release.tag_name }}</strong>
                          <span class="activity-repo">{{ release.repo }}</span>
                          <div class="activity-date">{{ formatDate(release.published_at) }}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Recent Pull Requests -->
                  <div class="activity-section" v-if="githubStats.activity.recentPullRequests?.length">
                    <h5><Icon icon="mdi:git-pull-request" class="section-small-icon" /> Recent PRs</h5>
                    <div class="activity-list">
                      <div
                        v-for="pr in githubStats.activity.recentPullRequests"
                        :key="pr.id"
                        class="activity-item"
                      >
                        <div class="activity-content">
                          <strong>{{ pr.title }}</strong>
                          <span class="activity-repo">{{ pr.repository_url.split('/').slice(-2).join('/') }}</span>
                          <div class="activity-date">{{ formatDate(pr.updated_at) }}</div>
                          <div class="activity-status" :class="pr.state">{{ pr.state }}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Recent Commits -->
                  <div class="activity-section" v-if="githubStats.activity.recentCommits?.length">
                    <h5><Icon icon="mdi:git-commit" class="section-small-icon" /> Recent Commits</h5>
                    <div class="activity-list">
                      <div
                        v-for="commit in githubStats.activity.recentCommits"
                        :key="commit.sha || commit.id"
                        class="activity-item"
                      >
                        <div class="activity-content">
                          <strong>{{ commit.message || commit.commit?.message || commit.sha }}</strong>
                          <div class="activity-date">{{ formatDate(commit.date || commit.commit?.author?.date) }}</div>
                          <div class="commit-sha">{{ commit.sha?.slice(0, 8) || commit.id }}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="team-member hiring">
          <div class="team-member-content">
            <div class="question-mark-portrait">?</div>
            <div class="team-member-info">
              <h3>Could this be you?</h3>
              <p class="role">Join Our Team</p>
              <p>
                We're always looking for talented developers, designers, and problem solvers who share our passion for creating impactful digital experiences. If you're excited about modern web technologies and innovative solutions, we'd love to hear from you.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="cta">
        <h3>Want to Work with Us?</h3>
        <NuxtLink to="/contact" class="cta-button">Let’s Talk</NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface GitHubStats {
  user: any
  stats: {
    total_repos: number
    public_repos: number
    followers: number
    following: number
    stars: number
    forks: number
    languages: Record<string, number>
  }
  contributions: any
  activity?: {
    latestReleases: any[]
    recentPullRequests: any[]
    recentCommits: any[]
  }
  debug?: any
  error?: string
}

const githubStats = ref<GitHubStats | null>(null)

// controls whether the Recent Activity panel is expanded (default: collapsed)
const recentActivityOpen = ref(false)

// computed total count of items in the activity sections
const totalActivityCount = computed(() => {
  const activity = githubStats.value?.activity
  if (!activity) return 0
  return (
    (activity.latestReleases?.length || 0) +
    (activity.recentPullRequests?.length || 0) +
    (activity.recentCommits?.length || 0)
  )
})

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

onMounted(async () => {
  try {
    const data = await $fetch<GitHubStats>('/api/github-stats')
    githubStats.value = data

    // Log debug info if available
    if (data.debug) {
      console.log('GitHub Stats Debug:', data.debug)
    }

    // Log any errors
    if (data.error) {
      console.warn('GitHub Stats Warning:', data.error)
    }
  } catch (error) {
    console.error('Failed to fetch GitHub stats:', error)
  }
})
</script>

<style scoped lang="scss">
.about-page {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: auto;
  padding: 2rem 1rem;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
}

.about-panel {
  background: rgba(0, 0, 0, 0.65);
  padding: 2rem;
  border-radius: 1rem;
  max-width: 980px;
  color: #fff;
  width: 100%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.35);
}

h1 {
  font-size: 2rem;
  font-weight: 800;
  color: #00d1ff;
  margin-bottom: 1.25rem;
}

.section {
  margin-bottom: 1.25rem;
}

.section-row.two-cols {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  align-items: stretch; /* make grid items stretch to equal height */
  margin-bottom: 1.25rem;
}
.card {
  background: rgba(255, 255, 255, 0.03);
  padding: 0.9rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255,255,255,0.03);
  display: flex;
  flex-direction: column;
}

.card > p {
  /* make paragraph take remaining space so cards are uniform height */
  flex: 1 1 auto;
}

.section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.section p {
  font-size: 1.1rem;
  line-height: 1.1;
  color: #e2e2e2;
}

.team-member {
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 0.75rem;
}

.team-member-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.team-member-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.team-member-image {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #00d1ff;
}

.github-link {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #00d1ff;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s;
}

.github-link:hover {
  color: #0099cc;
}

.github-icon {
  font-size: 1.1rem;
}

.github-preview {
  margin-top: 1rem;
}

.github-stats-card {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 0.5rem;
  padding: 1rem;
  color: #ffffff;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}

/* Icon styling for headings */
.section-icon {
  font-size: 1.05rem;
  color: #00d1ff;
  margin-right: 0.6rem;
}

.section-small-icon {
  font-size: 0.95rem;
  color: #00d1ff;
  margin-right: 0.45rem;
}

.stat-item {
  text-align: center;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.25rem;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #00d1ff;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.8rem;
  color: #e2e2e2;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.languages-section h4 {
  font-size: 1rem;
  color: #00d1ff;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.language-bars {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.language-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.language-name {
  min-width: 80px;
  color: #e2e2e2;
}

.language-fill {
  flex: 1;
  height: 8px;
  background: rgba(0, 209, 255, 0.3);
  border-radius: 4px;
  position: relative;
}

.language-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #00d1ff, #0099cc);
  border-radius: 4px;
  width: 100%;
}

.language-count {
  min-width: 30px;
  text-align: right;
  color: #00d1ff;
  font-weight: 500;
}

.language-size {
  min-width: 50px;
  text-align: right;
  color: #00d1ff;
  font-weight: 500;
  font-size: 0.8rem;
}

.recent-activity {
  margin-top: 2rem;
  border-top: 1px solid rgba(0, 209, 255, 0.2);
}

.recent-activity h4 {
  font-size: 1.2rem;
  color: #00d1ff;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.activity-section {
  margin-bottom: 2rem;
}

.activity-section h5 {
  font-size: 1rem;
  color: #ffffff;
  margin-bottom: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.recent-activity-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.activity-toggle {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #00d1ff;
  padding: 0.35rem 0.6rem;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}

.activity-toggle:hover {
  background: rgba(255, 255, 255, 0.03);
}

.recent-activity-body {
  overflow: hidden;
  transition: max-height 0.32s ease, opacity 0.22s ease, padding 0.22s ease;
  max-height: 2000px; /* large enough to show content when expanded */
  opacity: 1;
}

.recent-activity-body.collapsed {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.activity-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.activity-item {
  background: rgba(255, 255, 255, 0.05);
  padding: 0.75rem;
  border-radius: 0.25rem;
  border-left: 3px solid #00d1ff;
  box-sizing: border-box;
  /* flexible: try to show two items per row when space allows */
  flex: 1 1 calc(50% - 0.75rem);
  min-width: 260px;
}

.activity-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.activity-content strong {
  color: #ffffff;
  font-size: 0.9rem;
  line-height: 1.1;
}

.activity-repo {
  color: #00d1ff;
  font-size: 0.8rem;
  font-weight: 500;
}

.activity-date {
  color: #e2e2e2;
  font-size: 0.75rem;
}

.activity-status {
  display: inline-block;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-top: 0.25rem;
  align-self: flex-start;
}

.activity-status.open {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.activity-status.closed {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.activity-status.merged {
  background: rgba(168, 85, 247, 0.2);
  color: #a855f7;
}

.commit-sha {
  background: rgba(0, 0, 0, 0.3);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.7rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  color: #00d1ff;
  margin-top: 0.25rem;
  align-self: flex-start;
}

.team-member-info h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #00d1ff;
  margin-bottom: 0.25rem;
}

.team-member-info .role {
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.team-member-info p {
  margin: 0;
  line-height: 1.1;
}

.question-mark-portrait {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00d1ff, #0099cc);
  border: 3px solid #00d1ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  font-weight: bold;
  color: #ffffff;
  flex-shrink: 0;
}

.team-member.hiring {
  background: rgba(0, 209, 255, 0.1);
  border: 1px solid rgba(0, 209, 255, 0.3);
}

.team-member.hiring .team-member-info h3 {
  color: #00d1ff;
}

.cta {
  margin-top: 3rem;
  text-align: center;
}

.cta h3 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
}

.cta-button {
  display: inline-block;
  padding: 0.75rem 2rem;
  font-weight: 600;
  font-size: 1rem;
  color: #000;
  background-color: #00d1ff;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.3s;
}

@media (max-width: 768px) {
  .activity-item {
    padding: 0.5rem;
  }

  .activity-content strong {
    font-size: 0.85rem;
  }

  .activity-repo,
  .activity-date {
    font-size: 0.75rem;
  }

  .recent-activity h4 {
    font-size: 1.1rem;
  }

  .activity-section h5 {
    font-size: 0.95rem;
  }

  /* Ensure activity cards stack neatly on small screens */
  .activity-list {
    flex-direction: column;
    gap: 0.5rem;
  }

  .activity-item {
    flex: 1 1 100%;
    min-width: 0;
  }

  /* Stack the intro cards on small screens */
  .section-row.two-cols {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}
</style>
