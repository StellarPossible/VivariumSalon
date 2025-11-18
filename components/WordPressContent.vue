<template>
  <div class="wordpress-content-renderer">
    <!-- Blog post card with featured image and title -->
    <div v-if="title" class="blog-post-card">
      <div v-if="featuredImage" class="featured-image">
        <NuxtImg 
          :src="featuredImage" 
          :alt="title"
          class="post-image"
        />
      </div>
      <h1 class="post-title">{{ title }}</h1>
    </div>
    
    <!-- Content display with direct HTML rendering -->
    <div 
      class="wp-rendered-content" 
      v-html="sanitizedContent"
      ref="contentRef"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Define props
const props = defineProps({
  content: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  featuredImage: {
    type: String,
    default: ''
  },
  debug: {
    type: Boolean,
    default: false
  }
});

// Basic sanitization (expand this as needed)
const sanitizedContent = computed(() => {
  if (!props.content) return '';
  
  // Return the original content for now
  // In a real app, you might want to use a proper sanitizer library
  return props.content;
});
</script>

<style scoped lang="scss">
.wordpress-content-renderer {
  width: 100%;

  .wp-block-heading {
    color: rgb(51, 51, 51, .8);

  }
  
  .blog-post-card {
    background-color: rgb(255, 255, 255, .9);
    color: rgb(51, 51, 51);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    margin-bottom: 2rem;
    
    .featured-image {
      width: 100%;
      height: 300px;
      overflow: hidden;
      
      .post-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
        
        &:hover {
          transform: scale(1.03);
        }
      }
    }
    
    .post-title {
      padding: 1.5rem;
      font-size: 2rem;
      font-weight: 700;
      margin: 0;
      color: rgb(51, 51, 51);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
  }

  .wp-rendered-content {
    background-color: rgb(255, 255, 255, .8);
    color: rgb(51, 51, 51, .7);
    padding: .75rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    
    /* Allow WordPress content to be displayed properly */
    :deep(p) {
      display: block;
      margin-bottom: 1.5rem;
      line-height: 1.3;
      margin-top: 0;
    }
    
    /* Only the first paragraph should be italicized */
    :deep(p):first-of-type {
      font-style: italic;
      margin-top: 0;
    }
    
    :deep(h1), :deep(h2), :deep(h3), 
    :deep(h4), :deep(h5), :deep(h6) {
      display: block;
      margin-top: 1.5rem;
      font-weight: 600;
      line-height: 2rem;
    }
    
    :deep(ul), :deep(ol) {
      display: block;
      margin-left: 1.5rem;
      margin-bottom: 1.5rem;
      
      :deep(li) {
        display: list-item;
        margin-bottom: 0.5rem;
      }
    }
    
    :deep(img) {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 1.5rem 0;
    }
    
    :deep(a) {
      color: #0066cc;
      text-decoration: underline;
      
      &:hover {
        color: #004499;
      }
    }
    
    :deep(blockquote) {
      margin: 1.5rem 0;
      padding-left: 1rem;
      border-left: 4px solid #0066cc;
      font-style: italic;
      color: #555;
    }
    
    :deep(pre), :deep(code) {
      background-color: #f5f5f5;
      border-radius: 4px;
      padding: 0.2rem 0.4rem;
      font-family: monospace;
    }
    
    :deep(pre) {
      padding: 1rem;
      overflow-x: auto;
    }
    
    :deep(table) {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
      
      :deep(th), :deep(td) {
        padding: 0.75rem;
        border: 1px solid #ddd;
      }
      
      :deep(th) {
        background-color: #f5f5f5;
        font-weight: bold;
      }
    }
  }
}

/* Responsive design for the blog post card */
@media screen and (max-width: 768px) {
  .blog-post-card {
    .featured-image {
      height: 200px;
    }
    
    .post-title {
      padding: 1.2rem;
      font-size: 1.5rem;
    }
  }
}

@media screen and (max-width: 480px) {
  .blog-post-card {
    .featured-image {
      height: 180px;
    }
    
    .post-title {
      padding: 1rem;
      font-size: 1.25rem;
    }
  }
}
</style>