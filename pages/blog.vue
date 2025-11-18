<template>
    <section class="education-page">
    <div class="header fade-up">
      <h1>Education</h1>
      <p class="subtitle">
        Stay up to date with our latest articles, news, and insights
      </p>
      
      <!-- Dynamic category tags with count -->
      <div v-if="categories.length > 0" class="tags">
        <span 
          class="tag"
          :class="{ active: !selectedCategory }"
          @click="resetFilters"
        >
          All
        </span>
        <span 
          v-for="category in sortedCategories" 
          :key="category.id"
          class="tag"
          :class="{ active: selectedCategory === category.slug }"
          @click="filterByCategory(category.slug)"
        >
          {{ category.name }}
          <span v-if="category.count" class="count">{{ category.count }}</span>
        </span>
        <span 
          v-if="selectedCategory"
          class="tag reset"
          @click="resetFilters"
        >
          Clear filters
        </span>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-state fade-up">
      <p>
        {{ selectedCategory ? `Loading posts for ${getCategoryName(selectedCategory)}...` : 'Loading posts...' }}
      </p>
      <div class="loading-spinner"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-state fade-up">
      <p>{{ error }}</p>
      <div class="error-actions">
        <button @click="fetchEducationContent" class="retry-button">Try Again</button>
        <button v-if="selectedCategory" @click="resetFilters" class="reset-button">View All Posts</button>
      </div>
    </div>

    <!-- Content when loaded -->
    <template v-else>
      <!-- Featured posts section -->
      <div v-if="featuredPosts.length > 0" class="featured-posts fade-up">
        <div class="post-card" v-for="post in featuredPosts" :key="post.id">
          <NuxtImg 
            v-if="post.featuredImage && post.featuredImage.node" 
            :src="post.featuredImage.node.sourceUrl" 
            :alt="post.title" 
            class="post-img" 
          />
          <div v-else class="post-img placeholder-img"></div>
          <div class="post-content">
            <h3>{{ post.title }}</h3>
            <p class="date">{{ post.date }}</p>
            <p>{{ post.summary || (post.excerpt && stripHtml(post.excerpt).substring(0, 120) + '...') }}</p>
            <NuxtLink :to="`/posts/${post.slug}`" class="read-more">
              Read More
            </NuxtLink>
          </div>
        </div>
      </div>
      
      <!-- No posts state -->
      <div v-else-if="!loading" class="no-posts fade-up">
        <p v-if="selectedCategory">
          No posts found for category "<strong>{{ getCategoryName(selectedCategory) }}</strong>".
          <span class="try-another" @click="resetFilters">View all posts</span>
        </p>
        <p v-else>No posts found. Please check back later!</p>
      </div>

      <!-- Newsletter section -->
      <div class="newsletter fade-up">
        <h2>Never miss an insight</h2>
        <p>Subscribe to our newsletter for updates</p>
        <button class="subscribe-button">Subscribe</button>
      </div>

      <!-- Popular reads section -->
      <div v-if="popularReads.length > 0" class="popular-reads fade-up">
        <h2>Popular Reads</h2>
        <div class="post-card" v-for="post in popularReads" :key="post.id">
          <NuxtImg 
            v-if="post.featuredImage && post.featuredImage.node" 
            :src="post.featuredImage.node.sourceUrl" 
            :alt="post.title" 
            class="post-img" 
          />
          <div v-else class="post-img placeholder-img"></div>
          <div class="post-content">
            <h3>{{ post.title }}</h3>
            <p class="date">{{ post.date }}</p>
            <NuxtLink :to="`/posts/${post.slug}`" class="read-more">
              Read More
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
// Define types for WordPress data
interface WordPressImage {
  node: {
    sourceUrl: string;
    altText?: string;
  }
}

interface WordPressCategory {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

interface WordPressPost {
  id: string;
  title: string;
  excerpt?: string;
  slug: string;
  date: string;
  summary?: string;
  featuredImage?: WordPressImage;
}

interface EducationData {
  featuredPosts: WordPressPost[];
  popularPosts: WordPressPost[];
  categories: WordPressCategory[];
}

// State management
const loading = ref(true);
const error = ref<string | null>(null);
const featuredPosts = ref<WordPressPost[]>([]);
const popularReads = ref<WordPressPost[]>([]);
const categories = ref<WordPressCategory[]>([]);
const selectedCategory = ref<string | null>(null);

// Helper function to strip HTML tags from content
const stripHtml = (html: string): string => {
  // Create a temporary element to handle HTML parsing
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

// Sort categories by post count (if available) and then alphabetically
const sortedCategories = computed(() => {
  return [...categories.value].sort((a, b) => {
    // First sort by post count (descending)
    if (a.count && b.count) {
      return b.count - a.count;
    } else if (a.count) {
      return -1;
    } else if (b.count) {
      return 1;
    }
    
    // Then alphabetically by name
    return a.name.localeCompare(b.name);
  });
});

// Animation setup
onMounted(() => {
  // First, add a class to body to indicate JS is enabled
  document.body.classList.add('js-animation-enabled');
  
  // Set up fade animation with IntersectionObserver
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  // Slightly delay the observation to ensure proper rendering
  setTimeout(() => {
    document.querySelectorAll('.fade-up').forEach((el) => {
      observer.observe(el);
    });
  }, 100);
  
  // Fetch education posts from WordPress
  fetchEducationContent();
});

// Fetch all education content in a single request
const fetchEducationContent = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    // Fetch data from our education API endpoint
    const data = await $fetch<EducationData>('/api/education');
    
    // Update state with fetched data
    featuredPosts.value = data.featuredPosts || [];
    popularReads.value = data.popularPosts || [];
    categories.value = data.categories || [];
    
    // Save original featured posts for restoring when "All" is clicked
    originalFeaturedPosts.value = [...featuredPosts.value];
    
    // State updated with fetched data
    
    loading.value = false;
    
    // Force refresh the animation system for newly loaded content
    nextTick(() => {
      // Re-trigger the IntersectionObserver by toggling a class
      document.querySelectorAll('.fade-up:not(.visible)').forEach((el) => {
        // Force a reflow
        el.classList.add('refresh-animation');
        setTimeout(() => el.classList.remove('refresh-animation'), 50);
      });
    });
  } catch (err) {
    console.error('Error fetching education content:', err);
    error.value = 'Failed to load education content';
    loading.value = false;
  }
};

// Cache for category filtered posts to reduce API calls
const categoryPostsCache = ref<Record<string, WordPressPost[]>>({});

// Store original posts for the "All" view
const originalFeaturedPosts = ref<WordPressPost[]>([]);

// Filter posts by category
const filterByCategory = async (slug: string) => {
  // Skip if already selected
  if (selectedCategory.value === slug) return;
  
  selectedCategory.value = slug;
  loading.value = true;
  error.value = null;
  
  try {
    // Check if we have cached results
    if (categoryPostsCache.value[slug]) {
      // Using cached posts for this category
      featuredPosts.value = categoryPostsCache.value[slug];
      loading.value = false;
      return;
    }
    
    // Fetch posts by category
    const response = await $fetch('/api/posts', {
      params: {
        category: slug,
        perPage: 6 // Fetch more posts to show a good selection
      }
    }) as any;
    
    // Cache the results
    if (response.posts && response.posts.length > 0) {
      categoryPostsCache.value[slug] = response.posts;
    }
    
    // Update featured posts with category-filtered posts
    featuredPosts.value = response.posts || [];
    // Posts loaded for category
    loading.value = false;
  } catch (err) {
    console.error('Error filtering by category:', err);
    error.value = 'Failed to filter posts';
    loading.value = false;
  }
};

// Reset category filter
const resetFilters = () => {
  // Clear selected category
  selectedCategory.value = null;
  error.value = null;
  
  // Show loading state briefly
  loading.value = true;
  
  // Restore original posts if available, otherwise fetch them
  if (originalFeaturedPosts.value.length > 0) {
    // Restore from the cached original posts
    featuredPosts.value = [...originalFeaturedPosts.value];
    loading.value = false;
    
    // Trigger animation refresh for restored content
    nextTick(() => {
      document.querySelectorAll('.fade-up:not(.visible)').forEach((el) => {
        el.classList.add('refresh-animation');
        setTimeout(() => el.classList.remove('refresh-animation'), 50);
      });
    });
  } else {
    // Fetch all posts if originals aren't available
    fetchEducationContent();
  }
};

// Helper to get category name from slug
const getCategoryName = (slug: string): string => {
  const category = categories.value.find(cat => cat.slug === slug);
  return category ? category.name : slug;
};
</script>

<style scoped lang="scss">

h2 {
  color: rgb(51, 51, 51, .8);

}
.education-page {
  padding: 4rem 2rem;
  color: #fff;
  background: transparent;

  .fade-up {
    /* Make elements visible by default for accessibility and no-JS scenarios */
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }

  /* 
   * Apply animation only when JS is enabled - add a class via script
   * This ensures content is visible even if animation doesn't work
   */
  .js-animation-enabled .fade-up:not(.visible) {
    opacity: 0;
    transform: translateY(30px);
  }

  .fade-up.visible,
  .fade-up.refresh-animation {
    opacity: 1;
    transform: translateY(0);
  }

  .header {
    text-align: center;
    margin-bottom: 3rem;

    h1 {
      font-size: 3rem;
      font-weight: 800;
      color: #ffffff;
    }

    .subtitle {
      font-size: 1.2rem;
      color: #ccc;
      margin-top: 0.5rem;
    }

    .tags {
      margin-top: 1rem;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 0.75rem;

      .tag {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        padding: 0.5rem 1.25rem;
        border-radius: 20px;
        font-weight: 600;
        transition: all 0.3s ease;
        cursor: pointer;
        border: 1px solid transparent;
        
        &:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
        
        &.active {
          background: #00aaff;
          box-shadow: 0 0 15px rgba(0, 170, 255, 0.4);
        }
        
        .count {
          display: inline-block;
          background: rgba(0, 0, 0, 0.2);
          font-size: 0.75rem;
          padding: 0.1rem 0.4rem;
          border-radius: 12px;
          margin-left: 0.5rem;
          opacity: 0.8;
        }
        
        &.reset {
          background: rgba(255, 100, 100, 0.2);
          border: 1px solid rgba(255, 100, 100, 0.3);
          
          &:hover {
            background: rgba(255, 100, 100, 0.3);
          }
        }
      }
    }
  }

  .loading-state {
    text-align: center;
    padding: 3rem 0;
    
    .loading-spinner {
      margin: 1rem auto;
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255, 255, 255, 0.2);
      border-top-color: #00aaff;
      border-radius: 50%;
      animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  }
  
  .error-state {
    text-align: center;
    padding: 3rem 0;
    color: #ff6666;
    
    p {
      font-size: 1.1rem;
      margin-bottom: 1.5rem;
    }
    
    .error-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      
      button {
        background: rgba(0, 0, 0, 0.3);
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 0.5rem 1.25rem;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        
        &:hover {
          background: rgba(0, 0, 0, 0.5);
        }
        
        &.retry-button {
          background: #00aaff;
          
          &:hover {
            background: #0088cc;
          }
        }
      }
    }
  }
  
  .no-posts {
    text-align: center;
    padding: 3rem 0;
    
    .try-another {
      display: block;
      margin-top: 1rem;
      color: #00aaff;
      cursor: pointer;
      text-decoration: underline;
      
      &:hover {
        color: #0088cc;
      }
    }
  }

  .featured-posts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 4rem;

    .post-card {
      background: #fff;
      color: #000;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.02);
      }

      .post-img {
        width: 100%;
        height: 180px;
        object-fit: cover;
      }

      .post-content {
        padding: 1rem;

        h3 {
          font-size: 1.2rem;
          font-weight: 700;
        }

        .date {
          font-size: 0.9rem;
          color: #666;
          margin-top: 0.25rem;
        }

        p {
          font-size: 1rem;
          color: #333;
          margin-top: 0.5rem;
        }
      }
    }
  }

  .newsletter {
    background: linear-gradient(90deg, #002f4b, #005f83);
    padding: 2rem;
    text-align: center;
    border-radius: 12px;
    margin-bottom: 4rem;

    h2 {
      font-size: 1.8rem;
      margin-bottom: 0.5rem;
    }

    p {
      color: #ccc;
      margin-bottom: 1rem;
    }

    .subscribe-button {
      background: #00aaff;
      border: none;
      padding: 0.75rem 2rem;
      font-weight: 700;
      font-size: 1rem;
      border-radius: 8px;
      cursor: pointer;
      color: #fff;
      transition: background 0.3s;
      box-shadow: 0 0 10px #00aaff;

      &:hover {
        background: #008ecc;
      }
    }
  }

  .popular-reads {
    h2 {
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
    }

    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;

    .post-card {
      background: #fff;
      color: #000;
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.02);
      }

      .post-img {
        width: 100%;
        height: 160px;
        object-fit: cover;
      }

      .post-content {
        padding: 1rem;

        h3 {
          font-size: 1.1rem;
          font-weight: 600;
        }

        .date {
          font-size: 0.85rem;
          color: #555;
          margin-top: 0.25rem;
        }
      }
    }
  }
}
</style>
