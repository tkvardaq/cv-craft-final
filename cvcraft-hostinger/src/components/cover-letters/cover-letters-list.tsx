"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, FileText, Sparkles, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";

type Letter = {
  id: string;
  title: string;
  company_name: string | null;
  role_title: string | null;
  tone: "professional" | "enthusiastic" | "concise" | "formal";
  updated_at: string;
  cv_id: string | null;
};

type FullLetter = Letter & {
  recipient_name?: string | null;
  job_description?: string | null;
  body?: string;
};

const TONES: Letter["tone"][] = ["professional", "enthusiastic", "concise", "formal"];

export function CoverLettersList({ initialLetters, cvs }: { initialLetters: Letter[]; cvs: { id: string; title: string }[] }) {
  const [letters, setLetters] = useState(initialLetters);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FullLetter | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [body, setBody] = useState("");
  const [tone, setTone] = useState<Letter["tone"]>("professional");
  const [cvId, setCvId] = useState<string>("");
  const [companyName, setCompanyName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [title, setTitle] = useState("");

  const resetForm = (l: FullLetter | null) => {
    setBody(l?.body ?? "");
    setTone(l?.tone ?? "professional");
    setCvId(l?.cv_id ?? "");
    setCompanyName(l?.company_name ?? "");
    setRoleTitle(l?.role_title ?? "");
    setRecipientName(l?.recipient_name ?? "");
    setJobDescription(l?.job_description ?? "");
    setTitle(l?.title ?? "");
  };

  const openNew = () => {
    setEditing(null);
    resetForm(null);
    setOpen(true);
  };

  const openEdit = async (id: string) => {
    // Re-fetch the full record (list query only returns metadata).
    const res = await fetch(`/api/cover-letters`);
    const { data } = await res.json();
    const found = data?.find((l: Letter) => l.id === id);
    if (!found) {
      toast.error("Couldn't load letter");
      return;
    }
    // The list endpoint doesn't include body — call a dedicated read.
    const fullRes = await fetch(`/api/cover-letters/${id}`).catch(() => null);
    if (fullRes && fullRes.ok) {
      const json = await fullRes.json();
      setEditing(json.data);
      resetForm(json.data);
    } else {
      // Fallback: load minimal fields, body will be blank
      setEditing(found);
      resetForm(found);
    }
    setOpen(true);
  };

  const generate = async () => {
    if (!roleTitle && !jobDescription) {
      toast.error("Add a role title or job description first");
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch("/api/cover-letters/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: companyName,
          role_title: roleTitle,
          recipient_name: recipientName,
          job_description: jobDescription,
          tone,
          cv_id: cvId || null,
        }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        toast.error(e?.error || "AI generation failed");
        return;
      }
      const json = await res.json();
      setBody(json.body || "");
      toast.success("Cover letter drafted");
    } finally {
      setGenerating(false);
    }
  };

  const save = async () => {
    const payload = {
      id: editing?.id,
      title: title || `${companyName || "Untitled"} — ${roleTitle || "Cover letter"}`,
      company_name: companyName,
      role_title: roleTitle,
      recipient_name: recipientName,
      job_description: jobDescription,
      body,
      tone,
      cv_id: cvId || null,
    };
    const res = await fetch("/api/cover-letters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      toast.error("Couldn't save");
      return;
    }
    const { data } = await res.json();
    setLetters((prev) => {
      const without = prev.filter((l) => l.id !== data.id);
      return [data, ...without];
    });
    setOpen(false);
    toast.success("Saved");
  };

  const performDelete = async () => {
    if (!confirmDelete) return;
    const id = confirmDelete;
    setConfirmDelete(null);
    const prev = letters;
    setLetters(letters.filter((l) => l.id !== id));
    const res = await fetch(`/api/cover-letters?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      setLetters(prev);
      toast.error("Couldn't delete");
    }
  };

  return (
    <>
      <div className="flex items-center justify-end mb-5">
        <Button onClick={openNew} className="bg-royal-navy text-white hover:bg-slate-800">
          <Plus className="h-4 w-4 mr-1" /> New cover letter
        </Button>
      </div>

      {letters.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center">
          <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-4">No cover letters yet.</p>
          <Button onClick={openNew} className="bg-royal-navy text-white hover:bg-slate-800">
            Create your first
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {letters.map((l) => (
            <article
              key={l.id}
              onClick={() => openEdit(l.id)}
              className="bg-white p-6 rounded-2xl border border-royal-navy/5 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer relative group"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDelete(l.id);
                }}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded transition-all"
                aria-label="Delete cover letter"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <h3 className="font-black text-base mb-1 truncate pr-6">{l.title}</h3>
              <p className="text-sm text-slate-500 truncate">
                {l.company_name ? l.company_name : "—"} · {l.role_title ? l.role_title : "—"}
              </p>
              <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-widest font-bold">
                <span className="text-royal-gold">{l.tone}</span>
                <span className="text-slate-400">{formatDistanceToNow(new Date(l.updated_at), { addSuffix: true })}</span>
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit cover letter" : "New cover letter"}</DialogTitle>
            <DialogDescription>Draft with AI, then edit until it sounds like you.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <FormField label="Title" value={title} onChange={setTitle} placeholder="Auto from company + role" />

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Company" value={companyName} onChange={setCompanyName} />
              <FormField label="Role" value={roleTitle} onChange={setRoleTitle} />
              <FormField label="Recipient name" value={recipientName} onChange={setRecipientName} placeholder="Hiring Manager" />
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Link CV</span>
                <select
                  value={cvId}
                  onChange={(e) => setCvId(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-royal-gold focus:outline-none focus:ring-2 focus:ring-royal-gold/20"
                >
                  <option value="">(no linked CV)</option>
                  {cvs.map((c) => (
                    <option key={c.id} value={c.id}>{c.title || "Untitled"}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Job description</span>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={3}
                placeholder="Paste the JD to tailor the letter (optional)"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Tone</span>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as Letter["tone"])}
                  className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-royal-gold focus:outline-none focus:ring-2 focus:ring-royal-gold/20"
                >
                  {TONES.map((t) => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
              <Button
                type="button"
                onClick={generate}
                disabled={generating}
                className="bg-royal-gold text-white hover:bg-royal-gold-dark mt-6 self-end"
              >
                {generating ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1" />}
                Generate with AI
              </Button>
            </div>

            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Letter body</span>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={14}
                placeholder="Dear Hiring Manager, ..."
                className="font-serif text-sm leading-relaxed"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDelete !== null} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this cover letter?</DialogTitle>
            <DialogDescription>This can&apos;t be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={performDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function FormField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">{label}</span>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </label>
  );
}
