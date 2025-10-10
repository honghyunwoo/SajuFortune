/**
 * 블로그 서비스
 *
 * Markdown 기반 블로그 포스트 관리
 * - gray-matter로 프론트매터 파싱
 * - 파일 시스템 기반 콘텐츠 관리
 * - 메모리 캐싱으로 성능 최적화
 */

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { log } from './logger';

export interface BlogPostMetadata {
  title: string;
  description: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  image?: string;
}

export interface BlogPostSummary extends BlogPostMetadata {
  slug: string;
}

export interface BlogPost extends BlogPostSummary {
  content: string;
}

const BLOG_CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

// 메모리 캐시 (프로덕션에서는 Redis 사용 권장)
let postsCache: BlogPostSummary[] | null = null;
let postContentCache = new Map<string, BlogPost>();

class BlogService {
  /**
   * 모든 블로그 포스트 목록 조회 (메타데이터만)
   */
  async getAllPosts(): Promise<BlogPostSummary[]> {
    // 캐시 확인
    if (postsCache) {
      return postsCache;
    }

    try {
      // content/blog 디렉토리의 모든 .md 파일 읽기
      const files = await fs.readdir(BLOG_CONTENT_DIR);
      const mdFiles = files.filter(file => file.endsWith('.md'));

      const posts: BlogPostSummary[] = [];

      for (const file of mdFiles) {
        const slug = file.replace('.md', '');
        const filePath = path.join(BLOG_CONTENT_DIR, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');

        // gray-matter로 프론트매터 파싱
        const { data } = matter(fileContent);

        posts.push({
          slug,
          title: data.title || 'Untitled',
          description: data.description || '',
          author: data.author || '운명의 해답',
          date: data.date || new Date().toISOString().split('T')[0],
          category: data.category || '기타',
          tags: data.tags || [],
          image: data.image,
        });
      }

      // 날짜 순으로 정렬 (최신순)
      posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // 캐시 저장
      postsCache = posts;

      log.info(`[Blog] Loaded ${posts.length} posts`);
      return posts;
    } catch (error: any) {
      log.error('[Blog] Failed to load posts:', error);

      // 디렉토리가 없으면 빈 배열 반환
      if (error.code === 'ENOENT') {
        log.warn('[Blog] Blog content directory not found, returning empty array');
        return [];
      }

      throw error;
    }
  }

  /**
   * 특정 슬러그의 블로그 포스트 상세 조회
   */
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    // 캐시 확인
    if (postContentCache.has(slug)) {
      return postContentCache.get(slug)!;
    }

    try {
      const filePath = path.join(BLOG_CONTENT_DIR, `${slug}.md`);
      const fileContent = await fs.readFile(filePath, 'utf-8');

      // gray-matter로 프론트매터와 본문 분리
      const { data, content } = matter(fileContent);

      const post: BlogPost = {
        slug,
        title: data.title || 'Untitled',
        description: data.description || '',
        author: data.author || '운명의 해답',
        date: data.date || new Date().toISOString().split('T')[0],
        category: data.category || '기타',
        tags: data.tags || [],
        image: data.image,
        content,
      };

      // 캐시 저장
      postContentCache.set(slug, post);

      log.info(`[Blog] Loaded post: ${slug}`);
      return post;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        log.warn(`[Blog] Post not found: ${slug}`);
        return null;
      }

      log.error(`[Blog] Failed to load post ${slug}:`, error);
      throw error;
    }
  }

  /**
   * 캐시 초기화 (새 포스트 추가 시 호출)
   */
  clearCache() {
    postsCache = null;
    postContentCache.clear();
    log.info('[Blog] Cache cleared');
  }
}

export const blogService = new BlogService();
