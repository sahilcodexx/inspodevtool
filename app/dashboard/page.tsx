"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Pencil, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { Sidebar } from "@/app/components/sidebar";
import { Navbar } from "@/app/components/navbar";
import { useAuth } from "@/lib/auth-context";
import { getCategories, getImageProxyUrl, getToolsForOwner, type Tool } from "@/lib/tools";
import { deleteToolFromDatabase, refreshToolOgImage, updateToolInDatabase } from "@/lib/appwrite-db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [tools, setTools] = useState<Tool[]>([]);
  const [editing, setEditing] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const categories = useMemo(() => getCategories(tools).filter((item) => item !== "All"), [tools]);

  useEffect(() => {
    if (!user) return;
    getToolsForOwner(user.$id).then((items) => { setTools(items); setLoading(false); });
  }, [user]);

  async function handleDelete(tool: Tool) {
    if (!window.confirm(`Delete ${tool.name}?`)) return;
    await deleteToolFromDatabase(tool.id);
    setTools((current) => current.filter((item) => item.id !== tool.id));
    setMessage("Tool deleted successfully.");
  }

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing || !user) return;
    await updateToolInDatabase(editing.id, editing, user.$id);
    setTools((current) => current.map((item) => item.id === editing.id ? editing : item));
    setEditing(null);
    setMessage("Changes saved successfully.");
  }

  async function handleRefresh(tool: Tool) {
    setRefreshingId(tool.id);
    try {
      const document = await refreshToolOgImage(tool.id, tool.url);
      setTools((current) => current.map((item) => item.id === tool.id ? { ...item, ogImage: String(document.ogimage || "") } : item));
      setMessage(document.ogimage ? "Original OG image refreshed." : "No OG image was found on this site.");
    } catch {
      setMessage("Could not refresh the OG image. Check the Appwrite Function deployment.");
    } finally {
      setRefreshingId(null);
    }
  }

  if (authLoading) return <div className="min-h-screen bg-[#09090b]" />;
  if (!user) return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#09090b] px-6 py-12 text-zinc-100">
      <Card className="w-full max-w-md border-zinc-800/80 bg-zinc-950/80 py-8 text-center shadow-2xl shadow-black/20 sm:py-10">
        <Link href="/" className="mb-10 inline-flex items-center gap-2 text-xs text-zinc-500 transition hover:text-zinc-200">
          <ArrowLeft className="size-3.5" /> Back to directory
        </Link>
        <div className="mx-auto grid size-12 place-items-center rounded-2xl border border-zinc-800 bg-zinc-900 text-lg font-semibold text-zinc-200">D</div>
        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">Creator dashboard</p>
        <CardHeader className="px-8">
          <CardTitle className="text-2xl tracking-tight">Sign in to manage your tools</CardTitle>
          <CardDescription className="mx-auto max-w-xs leading-6 text-zinc-500">Submit, edit, refresh, and manage the tools you have shared with the directory.</CardDescription>
        </CardHeader>
        <CardContent className="px-8">
          <Button render={<Link href="/signup?mode=signin" />} className="rounded-full px-5">Sign in</Button>
        </CardContent>
      </Card>
    </main>
  );

  return (
    <div className="flex min-h-screen w-full min-w-0 bg-white text-zinc-900 dark:bg-[#09090b] dark:text-zinc-100">
      <Sidebar />
      <div className="flex min-w-0 w-0 flex-1 flex-col"><Navbar />
        <main className="mx-auto w-full max-w-none flex-1 px-6 py-8 sm:px-10 lg:px-14 xl:px-16">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 transition hover:text-zinc-900 dark:hover:text-white"><ArrowLeft className="size-3.5" /> Back to directory</Link>
          <header className="mt-8 flex flex-wrap items-end justify-between gap-5 border-b border-zinc-200/70 pb-8 dark:border-zinc-800/80">
            <div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-500">Creator workspace</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Your submitted tools</h1><p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Manage the tools you’ve shared with the community.</p></div>
            <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"><Plus className="size-3.5" /> Submit another</Link>
          </header>
          <div className="mt-6 flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Your library</p><span className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">{tools.length} {tools.length === 1 ? "tool" : "tools"}</span></div>
          {message && <p className="mt-4 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-500">{message}</p>}
          {loading ? <div className="mt-6 grid w-full gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="overflow-hidden rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70"><div className="aspect-[1.91/1] animate-pulse bg-zinc-100 dark:bg-zinc-900" /><div className="space-y-3 p-4"><div className="h-4 w-2/5 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" /><div className="h-3 w-1/3 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" /></div></div>)}</div> : tools.length === 0 ? <div className="mt-6 flex min-h-[360px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300/80 bg-zinc-50/50 px-6 text-center dark:border-zinc-800 dark:bg-zinc-950/40"><div className="grid size-12 place-items-center rounded-2xl border border-zinc-200 bg-white text-zinc-400 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><Plus className="size-5" /></div><p className="mt-5 font-medium">Your library is empty</p><p className="mt-2 max-w-sm text-sm text-zinc-500">Submit your first tool to start building your collection.</p><Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-zinc-900 shadow-sm ring-1 ring-zinc-200 transition hover:bg-zinc-100 dark:bg-zinc-100 dark:ring-0">Submit your first tool <Plus className="size-3.5" /></Link></div> : <div className="mt-6 grid w-full gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{tools.map((tool) => <article key={tool.id} className="group overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800/80 dark:bg-zinc-950"><Link href={`/tools/${tool.id}`} className="block aspect-[1.91/1] overflow-hidden bg-zinc-100 dark:bg-zinc-900">{tool.ogImage ? <img src={getImageProxyUrl(tool.ogImage, tool.url)} alt="" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" /> : <div className="grid h-full place-items-center text-xs text-zinc-500">No preview yet</div>}</Link><div className="p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="truncate font-semibold">{tool.name}</h2><p className="mt-1 truncate text-xs text-zinc-500">{tool.category}</p></div><a href={tool.url} target="_blank" rel="noreferrer" className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"><ExternalLink className="size-4" /></a></div><div className="mt-4 flex flex-wrap gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800"><button onClick={() => handleRefresh(tool)} disabled={refreshingId === tool.id} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-800 dark:hover:bg-zinc-800"><RefreshCw className={`size-3.5 ${refreshingId === tool.id ? "animate-spin" : ""}`} /> Refresh image</button><button onClick={() => setEditing(tool)} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800"><Pencil className="size-3.5" /> Edit</button><button onClick={() => handleDelete(tool)} className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:border-red-950 dark:hover:bg-red-950/40"><Trash2 className="size-3.5" /> Delete</button></div></div></article>)}</div>}
        </main>
      </div>
      {editing && <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-5"><form onSubmit={handleUpdate} className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-100 shadow-2xl"><div className="mb-5 flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-widest text-zinc-500">Edit submission</p><h2 className="mt-1 text-xl font-semibold">Update your tool</h2></div><button type="button" onClick={() => setEditing(null)} className="rounded-full p-2 text-zinc-500 hover:bg-zinc-800 hover:text-white"><X className="size-4" /></button></div><div className="space-y-4"><input required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm outline-none focus:border-zinc-500" placeholder="Tool name" /><input required type="url" value={editing.url} onChange={(e) => setEditing({ ...editing, url: e.target.value })} className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm outline-none focus:border-zinc-500" placeholder="https://example.com" /><select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm outline-none focus:border-zinc-500">{categories.map((category) => <option key={category}>{category}</option>)}</select><textarea rows={4} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm outline-none focus:border-zinc-500" placeholder="Description" /><button type="submit" className="w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200">Save changes</button></div></form></div>}
    </div>
  );
}
