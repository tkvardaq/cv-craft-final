"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, ExternalLink, Building2, Briefcase } from "lucide-react";
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

type Application = {
  id: string;
  company_name: string;
  role_title: string;
  location: string | null;
  job_url: string | null;
  salary_range: string | null;
  status: "saved" | "applied" | "interviewing" | "offer" | "rejected" | "withdrawn";
  applied_at: string | null;
  notes: string | null;
  cv_id: string | null;
  updated_at: string;
};

const STATUSES: Application["status"][] = ["saved", "applied", "interviewing", "offer", "rejected", "withdrawn"];

const STATUS_LABEL: Record<Application["status"], string> = {
  saved: "Saved",
  applied: "Applied",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

const STATUS_STYLE: Record<Application["status"], string> = {
  saved: "bg-slate-100 text-slate-700",
  applied: "bg-blue-100 text-blue-800",
  interviewing: "bg-amber-100 text-amber-800",
  offer: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
  withdrawn: "bg-slate-100 text-slate-500",
};

export function ApplicationsBoard({
  initialApplications,
  cvs,
}: {
  initialApplications: Application[];
  cvs: { id: string; title: string }[];
}) {
  const [applications, setApplications] = useState(initialApplications);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Application | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [filter, setFilter] = useState<Application["status"] | "all">("all");

  const stats = STATUSES.reduce<Record<Application["status"], number>>(
    (acc, s) => {
      acc[s] = applications.filter((a) => a.status === s).length;
      return acc;
    },
    {} as Record<Application["status"], number>
  );

  const filtered = filter === "all" ? applications : applications.filter((a) => a.status === filter);

  const openNew = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (app: Application) => {
    setEditing(app);
    setOpen(true);
  };

  const save = async (form: FormData) => {
    const payload = {
      id: editing?.id,
      company_name: String(form.get("company_name") ?? ""),
      role_title: String(form.get("role_title") ?? ""),
      location: String(form.get("location") ?? ""),
      job_url: String(form.get("job_url") ?? ""),
      salary_range: String(form.get("salary_range") ?? ""),
      status: String(form.get("status") ?? "saved"),
      applied_at: String(form.get("applied_at") ?? "") || null,
      notes: String(form.get("notes") ?? ""),
      cv_id: String(form.get("cv_id") ?? "") || null,
    };

    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast.error(err?.error || "Couldn't save");
      return;
    }
    const { data } = await res.json();
    setApplications((prev) => {
      const without = prev.filter((a) => a.id !== data.id);
      return [data, ...without];
    });
    setOpen(false);
    toast.success(editing ? "Application updated" : "Application added");
  };

  const performDelete = async () => {
    if (!confirmDelete) return;
    const id = confirmDelete;
    setConfirmDelete(null);
    const prev = applications;
    setApplications(applications.filter((a) => a.id !== id));
    const res = await fetch(`/api/applications?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      setApplications(prev);
      toast.error("Couldn't delete");
    }
  };

  return (
    <>
      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
        <button
          onClick={() => setFilter("all")}
          className={`text-left bg-white p-4 rounded-2xl border transition-all ${filter === "all" ? "border-royal-gold ring-2 ring-royal-gold/20" : "border-royal-navy/5 hover:border-royal-navy/20"}`}
        >
          <div className="text-2xl font-black">{applications.length}</div>
          <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500">All</div>
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-left bg-white p-4 rounded-2xl border transition-all ${filter === s ? "border-royal-gold ring-2 ring-royal-gold/20" : "border-royal-navy/5 hover:border-royal-navy/20"}`}
          >
            <div className="text-2xl font-black">{stats[s]}</div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{STATUS_LABEL[s]}</div>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-royal-gold" />
          {filter === "all" ? "All applications" : STATUS_LABEL[filter]}
        </h2>
        <Button onClick={openNew} className="bg-royal-navy text-white hover:bg-slate-800">
          <Plus className="h-4 w-4 mr-1" /> Add application
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center">
          <Building2 className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No applications in this view yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <article
              key={app.id}
              onClick={() => openEdit(app)}
              className="bg-white p-5 rounded-2xl border border-royal-navy/5 hover:shadow-md hover:border-royal-gold/30 transition-all cursor-pointer flex items-start justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-black text-lg truncate">{app.role_title}</h3>
                  <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md ${STATUS_STYLE[app.status]}`}>
                    {STATUS_LABEL[app.status]}
                  </span>
                </div>
                <div className="text-sm text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-semibold text-royal-navy">{app.company_name}</span>
                  {app.location && <span>· {app.location}</span>}
                  {app.salary_range && <span>· {app.salary_range}</span>}
                  {app.applied_at && <span>· Applied {app.applied_at}</span>}
                </div>
                {app.notes && <p className="text-xs text-slate-500 mt-2 line-clamp-2">{app.notes}</p>}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {app.job_url && (
                  <a
                    href={app.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-slate-400 hover:text-royal-navy hover:bg-slate-50 rounded-lg"
                    aria-label="Open job posting"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDelete(app.id);
                  }}
                  className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                  aria-label="Delete application"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Form dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit application" : "Add application"}</DialogTitle>
            <DialogDescription>Track a role you&apos;re interested in or have applied to.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save(new FormData(e.currentTarget));
            }}
            className="space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Company *" name="company_name" defaultValue={editing?.company_name ?? ""} required />
              <FormField label="Role *" name="role_title" defaultValue={editing?.role_title ?? ""} required />
              <FormField label="Location" name="location" defaultValue={editing?.location ?? ""} />
              <FormField label="Salary range" name="salary_range" defaultValue={editing?.salary_range ?? ""} />
              <FormField label="Job URL" name="job_url" defaultValue={editing?.job_url ?? ""} />
              <FormField label="Applied date" name="applied_at" type="date" defaultValue={editing?.applied_at ?? ""} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SelectField
                label="Status"
                name="status"
                defaultValue={editing?.status ?? "saved"}
                options={STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] }))}
              />
              <SelectField
                label="Link CV"
                name="cv_id"
                defaultValue={editing?.cv_id ?? ""}
                options={[{ value: "", label: "(none)" }, ...cvs.map((c) => ({ value: c.id, label: c.title || "Untitled" }))]}
              />
            </div>
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Notes</span>
              <Textarea name="notes" defaultValue={editing?.notes ?? ""} rows={3} placeholder="Anything to remember?" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDelete !== null} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this application?</DialogTitle>
            <DialogDescription>This cannot be undone.</DialogDescription>
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

function FormField({ label, name, type = "text", defaultValue, required }: { label: string; name: string; type?: string; defaultValue?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">{label}</span>
      <Input name={name} type={type} defaultValue={defaultValue} required={required} />
    </label>
  );
}

function SelectField({ label, name, defaultValue, options }: { label: string; name: string; defaultValue?: string; options: { value: string; label: string }[] }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-royal-gold focus:outline-none focus:ring-2 focus:ring-royal-gold/20"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
