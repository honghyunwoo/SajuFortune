/**
 * 블로그 목록 페이지
 * 모든 블로그 포스트 표시
 */

import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import SEOHead from '@/components/seo-head';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  image?: string;
}

export default function BlogIndex() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 블로그 포스트 메타데이터 로드
    const loadPosts = async () => {
      try {
        const response = await fetch('/api/blog/posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('[Blog] Failed to load posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="명리학 블로그 - 운명의 해답"
        description="사주팔자, 격국, 대운, 십이운성 등 명리학에 대한 모든 것을 배워보세요."
        keywords={['명리학 블로그', '사주 공부', '운세 배우기', '격국 설명', '대운 이해']}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: '운명의 해답 블로그',
          description: '명리학 전문 교육 블로그',
          author: {
            '@type': 'Organization',
            name: '운명의 해답',
          },
        }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            📚 명리학 배움터
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            사주팔자의 기초부터 심화까지, 전문가가 알려주는 명리학 강좌
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="loading-spinner" aria-label="Loading posts" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">아직 게시글이 없습니다.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(post.date).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    <CardTitle className="text-xl hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription>{post.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">내 사주를 직접 확인해보세요</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            블로그에서 배운 명리학 지식을 바탕으로 나의 사주팔자를 분석해보세요.
          </p>
          <Link href="/">
            <a className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              🔮 무료 사주 분석 시작하기
            </a>
          </Link>
        </div>
      </section>
    </div>
  );
}
