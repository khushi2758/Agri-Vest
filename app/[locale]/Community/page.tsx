"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import NavBar from "../navbar";
import Footer from "../Footer";
import { Heart, Send } from "lucide-react";

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchPosts();
    fetchUser();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/community/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (e) {}
  };

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (e) {}
  };

  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        setContent("");
        fetchPosts();
      }
    } catch (e) {}
  };

  const reactToPost = async (postId: string) => {
    try {
      const res = await fetch("/api/community/react", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      if (res.ok) {
        fetchPosts();
      }
    } catch (e) {}
  };

  const parseContent = (text: string) => {
    const parts = text.split(/(@investors|@farmers|@landowners)/gi);
    return parts.map((part, i) => {
      if (part.toLowerCase().match(/^@(investors|farmers|landowners)$/)) {
        return (
          <span key={i} className="text-[#c8e639] font-bold bg-[#1b2620] px-1.5 py-0.5 rounded-md">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f9f2] font-sans">
      <NavBar />
      
      <main className="mx-auto max-w-3xl px-6 py-12 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-black text-[#1b2620] tracking-tight uppercase md:text-5xl">
            Community Ideas
          </h1>
          <p className="mt-4 text-[#1b2620]/60 font-medium">
            Share your thoughts, suggestions, and connect with specific roles using @investors, @farmers, or @landowners.
          </p>
        </motion.div>

        {user && (
          <motion.form 
            onSubmit={submitPost}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-12 bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-3"
          >
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind? Ping a role using @farmers, @investors..."
              className="w-full bg-gray-50 border-none rounded-2xl p-4 min-h-[120px] focus:ring-2 focus:ring-[#c8e639] outline-none text-[#1b2620] font-medium resize-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!content.trim()}
                className="flex items-center gap-2 px-6 py-3 bg-[#1b2620] text-[#c8e639] rounded-xl font-bold transition-all hover:bg-black disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> Share Thought
              </button>
            </div>
          </motion.form>
        )}

        <div className="flex flex-col gap-6">
          {posts.map((post, idx) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * Math.min(idx, 10) }}
              className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm relative overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#c8e639]/20 text-[#1b2620] flex items-center justify-center font-black text-lg">
                  {post.authorName?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h3 className="font-extrabold text-[#1b2620] leading-tight">
                    {post.authorName}
                  </h3>
                  <div className="flex gap-1 mt-0.5">
                    {post.authorRoles?.map((r: string) => (
                      <span key={r} className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">
                {parseContent(post.content)}
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => reactToPost(post._id)}
                  disabled={!user || post.reactedBy?.includes(user.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-sm transition-all ${
                    post.reactedBy?.includes(user?.id) 
                      ? "text-red-500 bg-red-50 cursor-not-allowed" 
                      : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.reactedBy?.includes(user?.id) ? "fill-red-500" : ""}`} /> 
                  {post.upvotes || 0}
                </button>
              </div>
            </motion.div>
          ))}
          
          {posts.length === 0 && (
            <div className="text-center py-20 text-gray-400 font-bold">
              No thoughts shared yet. Be the first!
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
