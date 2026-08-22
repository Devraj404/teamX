import { FormEvent, useMemo, useState } from "react";
import { Page3D } from "../components/Motion";
import { db } from "../db";
import type { User } from "../types";

export function CommunityPage({ user }: { user: User }) {
  const all = db.posts();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"new" | "old">("new");
  const [mine, setMine] = useState(false);
  const posts = useMemo(() => {
    let list = all.filter((p) => {
      const author = db.getUser(p.user_id);
      const hay = `${p.content} ${author?.first_name} ${author?.last_name}`.toLowerCase();
      const okQ = !q || hay.includes(q.toLowerCase());
      const okMine = !mine || p.user_id === user.user_id;
      return okQ && okMine;
    });
    list = [...list].sort((a, b) =>
      sort === "new"
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
    return list;
  }, [all, q, sort, mine, user.user_id]);
  const publish = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const content = String(new FormData(e.currentTarget).get("content") || "").trim();
    if (!content) return;
    db.addPost({ user_id: user.user_id, content });
    e.currentTarget.reset();
    location.reload();
  };

  return (
    <Page3D>
      <h1>Community</h1>
      <p className="muted">Share plans, notes, and inspiration. Others can copy a public itinerary from a post.</p>
      <div className="search-cluster" style={{ marginTop: 16 }}>
        <input placeholder="Search posts…" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="chip" type="button" onClick={() => setMine((v) => !v)}>
          {mine ? "All posts" : "Filter: mine"}
        </button>
        <button className="chip" type="button" onClick={() => setSort(sort === "new" ? "old" : "new")}>
          Sort by {sort === "new" ? "oldest" : "newest"}
        </button>
      </div>
      <form className="form" style={{ margin: "20px 0" }} onSubmit={publish}>
        <textarea name="content" placeholder="What are you mapping next?" />
        <button className="btn" type="submit">Publish</button>
      </form>
      <div className="grid">
        {posts.map((post) => {
          const author = db.getUser(post.user_id);
          return (
            <article key={post.post_id} className="card feed-card">
              <img className="avatar" src={author?.photo} alt="" style={{ width: 56, height: 56 }} />
              <div>
                <strong>
                  {author?.first_name} {author?.last_name}
                </strong>
                <div className="muted">{new Date(post.created_at).toLocaleString()}</div>
                <p>{post.content}</p>
                {post.image && (
                  <img src={post.image} alt="" style={{ borderRadius: 16, marginTop: 8, maxHeight: 280, objectFit: "cover" }} />
                )}
              </div>
            </article>
          );
        })}
      </div>
    </Page3D>
  );
}
