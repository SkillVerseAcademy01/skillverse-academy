 "use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Course = {
  id: string; title: string; slug: string; description: string | null;
  price: number; thumbnail: string | null; published: boolean;
  category: { id: string; name: string } | null;
};

type Category = { id: string; name: string };

export default function AdminClient({
  initialCourses, categories, enrollmentCount
}: {
  initialCourses: Course[]; categories: Category[]; enrollmentCount: number;
}) {
  const router = useRouter();
  const [courses, setCourses] = useState(initialCourses);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);

  const filtered = useMemo(
    () => courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase())),
    [courses, search]
  );

  async function save(data: FormData) {
    const payload = Object.fromEntries(data.entries());
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/courses/${editing.id}` : "/api/courses";
    const res = await fetch(url, {
      method, headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      setShowForm(false); setEditing(null); router.refresh();
      const list = await fetch("/api/courses").then(r => r.json());
      setCourses(list);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this course?")) return;
    await fetch(`/api/courses/${id}`, { method: "DELETE" });
    setCourses(courses.filter(c => c.id !== id));
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <main className="admin-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark small">S</span><b>SkillVerse</b></div>
        <nav><a className="active">Dashboard</a><a>Courses</a><a>Categories</a><a>Students</a><a>Enrollments</a></nav>
        <button className="logout" onClick={logout}>Logout</button>
      </aside>

      <section className="content">
        <header className="topbar">
          <div><p className="eyebrow">ADMIN PANEL</p><h1>Dashboard</h1></div>
          <button className="primary" onClick={() => { setEditing(null); setShowForm(true); }}>+ Add Course</button>
        </header>

        <div className="stats">
          <div><span>Total Courses</span><strong>{courses.length}</strong></div>
          <div><span>Published</span><strong>{courses.filter(c => c.published).length}</strong></div>
          <div><span>Categories</span><strong>{categories.length}</strong></div>
          <div><span>Enrollments</span><strong>{enrollmentCount}</strong></div>
        </div>

        <section className="panel">
          <div className="panel-head">
            <div><h2>Courses</h2><p className="muted">Manage your course catalog.</p></div>
            <input className="search" placeholder="Search courses…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="table-wrap">
            <table><thead><tr><th>Course</th><th>Category</th><th>Price</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {filtered.map(c => <tr key={c.id}>
                <td><b>{c.title}</b><small>{c.slug}</small></td>
                <td>{c.category?.name ?? "Uncategorized"}</td>
                <td>₹{c.price}</td>
                <td><span className={c.published ? "badge success" : "badge"}>{c.published ? "Published" : "Draft"}</span></td>
                <td className="actions"><button onClick={() => { setEditing(c); setShowForm(true); }}>Edit</button><button onClick={() => remove(c.id)}>Delete</button></td>
              </tr>)}
            </tbody></table>
          </div>
        </section>

        {showForm && <CourseForm course={editing} categories={categories} onClose={() => { setShowForm(false); setEditing(null); }} onSave={save} />}
      </section>
    </main>
  );
}

function CourseForm({ course, categories, onClose, onSave }: {
  course: Course | null; categories: Category[]; onClose: () => void; onSave: (f: FormData) => void;
}) {
  return <div className="modal-backdrop"><form className="modal form" action={onSave}>
    <div className="modal-head"><h2>{course ? "Edit Course" : "Add Course"}</h2><button type="button" onClick={onClose}>×</button></div>
    <label>Title<input name="title" defaultValue={course?.title ?? ""} required /></label>
    <label>Slug<input name="slug" defaultValue={course?.slug ?? ""} required /></label>
    <label>Description<textarea name="description" defaultValue={course?.description ?? ""} /></label>
    <label>Price (₹)<input name="price" type="number" min="0" defaultValue={course?.price ?? 0} /></label>
    <label>Category<select name="categoryId" defaultValue={course?.category?.id ?? ""}><option value="">Uncategorized</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
    <label className="check"><input name="published" type="checkbox" defaultChecked={course?.published ?? false} /> Published</label>
    <button className="primary">Save Course</button>
  </form></div>;
}