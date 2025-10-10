/**
 * 블로그 포스트 상세 페이지
 * Markdown 렌더링 및 SEO 최적화
 */

import { useEffect, useState } from 'react';
import { useRoute, Link } from 'wouter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SEOHead from '@/components/seo-head';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BlogPostData {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  image?: string;
  content: string;
}

export default function BlogPost() {
  const [, params] = useRoute('/blog/:slug');
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.slug) return;

    const loadPost = async () => {
      try {
        const response = await fetch(`/api/blog/posts/${params.slug}`);
        if (!response.ok) {
          throw new Error('Post not found');
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        console.error('[Blog] Failed to load post:', err);
        setError('게시글을 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [params?.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" aria-label="Loading post" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">게시글을 찾을 수 없습니다</h1>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              블로그 목록으로
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${post.title} - 운명의 해답`}
        description={post.description}
        keywords={post.tags}
        ogImage={post.image}
        ogType="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.description,
          author: {
            '@type': 'Organization',
            name: post.author,
          },
          datePublished: post.date,
          image: post.image,
          publisher: {
            '@type': 'Organization',
            name: '운명의 해답',
            logo: {
              '@type': 'ImageObject',
              url: 'https://sajufortune.com/logo.png',
            },
          },
        }}
      />

      {/* Header Image */}
      {post.image && (
        <div className="w-full h-64 md:h-96 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Content */}
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back Button */}
        <Link href="/blog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            블로그 목록
          </Button>
        </Link>

        {/* Meta Information */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">{post.category}</Badge>
            <span className="text-sm text-muted-foreground">
              {new Date(post.date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="text-sm text-muted-foreground">• {post.author}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          <p className="text-xl text-muted-foreground mb-6">{post.description}</p>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Markdown Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // 링크를 wouter Link로 변환 (내부 링크만)
              a: ({ href, children, ...props }) => {
                const isInternal = href?.startsWith('/');
                if (isInternal && href) {
                  return (
                    <Link href={href}>
                      <a {...props}>{children}</a>
                    </Link>
                  );
                }
                return (
                  <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                    {children}
                  </a>
                );
              },
              // 코드 블록 스타일링
              code: ({ inline, className, children, ...props }: any) => {
                return inline ? (
                  <code className={className} {...props}>
                    {children}
                  </code>
                ) : (
                  <code className={`${className} block bg-muted p-4 rounded-lg overflow-x-auto`} {...props}>
                    {children}
                  </code>
                );
              },
              // 테이블 스타일링
              table: ({ children, ...props }) => (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border" {...props}>
                    {children}
                  </table>
                </div>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* CTA Section */}
        <div className="mt-12 p-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
          <h2 className="text-2xl font-bold mb-4">🔮 내 사주를 분석해보세요</h2>
          <p className="text-muted-foreground mb-6">
            이제 배운 명리학 지식을 바탕으로 나의 사주팔자를 직접 확인해보세요.
          </p>
          <Link href="/">
            <Button size="lg" className="w-full md:w-auto">
              무료 사주 분석 시작하기
            </Button>
          </Link>
        </div>
      </article>
    </div>
  );
}
