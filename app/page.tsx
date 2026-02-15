"use client";

import { useState, useEffect } from "react";
import { Post } from "./types";
import { supabase } from "./lib/client";
import { PostCard } from "./components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  const [currentUseId, setCurrentUseId] = useState<string | null>(null);

  //obtener el usuario actual

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUseId(user?.id || null);
    };
    fetchUser();
  }, []);

  const handleLike = (postId: number | string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    );
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const { data: postsData, error: postsError } = await supabase
        .from("posts_new")
        .select("*")
        .order("created_at", { ascending: false });

      if (postsError) {
        console.error("Error al obtener los posts:", postsError);
        return;
      }

      const postIds = postsData.map((p) => p.id);
      const userIds = [...new Set(postsData.map((p) => p.user_id))];

      // 2. Obtener profiles
      const { data: profilesData } = await supabase
        .from("profile")
        .select("id, username, avatar_url")
        .in("id", userIds);

      const profilesMap = new Map(
        profilesData?.map((p) => [
          p.id,
          { username: p.username, avatar_url: p.avatar_url },
        ]) || [],
      );
      // 6. Combinar todo
      const postsWithData: Post[] = postsData.map((post) => ({
        ...post,
        profile: profilesMap.get(post.user_id),
      }));

      setPosts(postsWithData);
    };
    fetchPosts();
  }, [currentUseId]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card-bg border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Suplatzigram
          </h1>
        </div>
      </header>

      {/* Feed de posts */}
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              currentUserId={currentUseId}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
