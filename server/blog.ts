/**
 * 블로그 API 라우트
 * Markdown 파일 파싱 및 제공
 */

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import type { Express } from 'express';

const BLOG_CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  image?: string;
}

interface BlogPostFull extends BlogPostMeta {
  content: string;
}

/**
 * Markdown 파일에서 메타데이터 추출
 */
async function parseBlogPost(filePath: string): Promise<BlogPostFull | null> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    const slug = path.basename(filePath, '.md');

    return {
      slug,
      title: data.title || 'Untitled',
      description: data.description || '',
      author: data.author || '운명의 해답',
      date: data.date || new Date().toISOString(),
      category: data.category || '일반',
      tags: data.tags || [],
      image: data.image,
      content,
    };
  } catch (error) {
    console.error(`[Blog] Failed to parse ${filePath}:`, error);
    return null;
  }
}

/**
 * 모든 블로그 포스트 메타데이터 가져오기
 */
async function getAllPosts(): Promise<BlogPostMeta[]> {
  try {
    const files = await fs.readdir(BLOG_CONTENT_DIR);
    const mdFiles = files.filter(file => file.endsWith('.md'));

    const posts = await Promise.all(
      mdFiles.map(async (file) => {
        const filePath = path.join(BLOG_CONTENT_DIR, file);
        const post = await parseBlogPost(filePath);
        if (!post) return null;

        // 메타데이터만 반환 (content 제외)
        const { content, ...meta } = post;
        return meta;
      })
    );

    // null 제거 및 날짜순 정렬 (최신순)
    return posts
      .filter((post): post is BlogPostMeta => post !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('[Blog] Failed to load posts:', error);
    return [];
  }
}

/**
 * 특정 블로그 포스트 가져오기
 */
async function getPostBySlug(slug: string): Promise<BlogPostFull | null> {
  try {
    const filePath = path.join(BLOG_CONTENT_DIR, `${slug}.md`);
    return await parseBlogPost(filePath);
  } catch (error) {
    console.error(`[Blog] Failed to load post ${slug}:`, error);
    return null;
  }
}

/**
 * 블로그 라우트 등록
 */
export function registerBlogRoutes(app: Express) {
  // 모든 블로그 포스트 목록
  app.get('/api/blog/posts', async (req, res) => {
    try {
      const posts = await getAllPosts();
      res.json(posts);
    } catch (error) {
      console.error('[Blog] /api/blog/posts error:', error);
      res.status(500).json({ error: 'Failed to load blog posts' });
    }
  });

  // 특정 블로그 포스트 상세
  app.get('/api/blog/posts/:slug', async (req, res) => {
    try {
      const { slug } = req.params;

      // 보안: slug validation (파일 경로 traversal 방지)
      if (!slug || slug.includes('..') || slug.includes('/')) {
        return res.status(400).json({ error: 'Invalid slug' });
      }

      const post = await getPostBySlug(slug);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      res.json(post);
    } catch (error) {
      console.error('[Blog] /api/blog/posts/:slug error:', error);
      res.status(500).json({ error: 'Failed to load blog post' });
    }
  });
}
