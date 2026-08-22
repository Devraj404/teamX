import { FormEvent, useEffect, useMemo, useState } from "react";
import { Page3D } from "../components/Motion";
import { api, type ApiPost } from "../api";
import type { User } from "../types";

export function CommunityPage({ user }: { user: User }) {
  const [allPosts, setAllPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"new" | "old">("new");
  const [mine, setMine] = useState(false);

  const fetchPosts = () => {
    setLoading(true);
    setError(null);
    api.posts()
      .then(({ posts }) => setAllPosts(posts || []))
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load posts."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const posts = useMemo(() => {
    let list = allPosts.filter((p) => {
      const author = p.user;
      const name = `${author?.firstName || ""} ${author?.lastName || ""} ${author?.username || ""}`.toLowerCase();
      const hay = `${p.content} ${name}`.toLowerCase();
      const okQ = !q || hay.includes(q.toLowerCase());
      const okMine = !mine || p.userId === user.user_id;
      return okQ && okMine;
    });

    list = [...list].sort((a, b) => {
      const tA = new Date(a.createdAt).getTime();
      const tB = new Date(b.createdAt).getTime();
      return sort === "new" ? tB - tA : tA - tB;
    });

    return list;
  }, [allPosts, q, sort, mine, user.user_id]);

  const publish = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const content = String(new FormData(form).get("content") || "").trim();
    if (!content) return;

    setSubmitting(true);
    setError(null);
    try {
      const { post } = await api.createPost(content);
      setAllPosts((prev) => [post, ...prev]);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not publish post.");
    } finally {
      setSubmitting(false);
    }
  };

  const deletePost = async (postId: number) => {
    try {
      await api.deletePost(postId);
      setAllPosts((prev) => prev.filter((p) => p.postId !== postId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete post.");
    }
  };

  return (
    <Page3D>
      <h1>Community</h1>
      <p className="muted">Share plans, travel notes, and inspiration with fellow travelers.</p>

      {error && <div className="alert alert-error" style={{ margin: "16px 0" }}>{error}</div>}

      <div className="search-cluster" style={{ marginTop: 16 }}>
        <input placeholder="Search posts…" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="chip" type="button" onClick={() => setMine((v) => !v)}>
          {mine ? "Showing: mine" : "Filter: mine"}
        </button>
        <button className="chip" type="button" onClick={() => setSort(sort === "new" ? "old" : "new")}>
          Sort by {sort === "new" ? "oldest" : "newest"}
        </button>
      </div>

      <form className="form" style={{ margin: "20px 0" }} onSubmit={publish}>
        <textarea name="content" required placeholder="What are you mapping next?" disabled={submitting} />
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "Publishing…" : "Publish post"}
        </button>
      </form>

      {loading ? (
        <p className="muted">Loading community posts…</p>
      ) : (
        <div className="grid">
          {posts.map((post) => {
            const author = post.user;
            const initial = (author?.firstName || author?.username || "T").slice(0, 1).toUpperCase();
            const isOwner = post.userId === user.user_id;

            return (
              <article key={post.postId} className="card feed-card">
                {author?.photo ? (
                  <img className="avatar" src={author.photo} alt="" style={{ width: 56, height: 56, objectFit: "cover" }} />
                ) : (
                  <div className="avatar avatar-initial" style={{ width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
                    {initial}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <strong>
                      {author?.firstName ? `${author.firstName} ${author.lastName || ""}` : author?.username || "Traveler"}
                    </strong>
                    {isOwner && (
                      <button className="chip" style={{ fontSize: "0.75rem" }} onClick={() => deletePost(post.postId)}>
                        Delete
                      </button>
                    )}
                  </div>
                  <div className="muted" style={{ fontSize: "0.85rem", marginBottom: 8 }}>
                    {new Date(post.createdAt).toLocaleString()}
                  </div>
                  <p style={{ whiteSpace: "pre-wrap" }}>{post.content}</p>
                </div>
              </article>
            );
          })}
          {posts.length === 0 && <p className="muted">No posts found.</p>}
        </div>
      )}
    </Page3D>
  );
}
