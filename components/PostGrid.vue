<template>
  <section class="post-grid">
    <div class="post-grid__inner">
      <article v-for="(post, index) in posts" :key="index" class="post-card">
        <img 
          v-if="post.image" 
          :src="post.image" 
          :alt="post.title" 
          class="post-card__image" 
        />
        <h3 class="post-card__title">{{ post.title }}</h3>
        <p class="post-card__excerpt">{{ post.excerpt }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Post {
  title: string
  excerpt: string
  image?: string
}

const posts: Post[] = [
  { title: "First Post", excerpt: "This is a short description of the first post.", image: "/images/post1.jpg" },
  { title: "Second Post", excerpt: "A quick summary about the second post.", image: "/images/post2.jpg" },
  { title: "Third Post", excerpt: "Something interesting goes here.", image: "/images/post3.jpg" },
  { title: "Fourth Post", excerpt: "Another small snippet of content.", image: "/images/post4.jpg" }
]
</script>
