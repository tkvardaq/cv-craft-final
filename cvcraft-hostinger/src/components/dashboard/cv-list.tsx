"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { FileText, Clock, ChevronRight, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type CvListItem = {
  id: string;
  updated_at: string;
  status: string;
  json_content?: {
    title?: string;
    personal?: {
      firstName?: string;
    };
  };
};

interface CvListProps {
  initialCvs: CvListItem[];
}

export function CvList({ initialCvs }: CvListProps) {
  const [cvs, setCvs] = useState(initialCvs);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const router = useRouter();

  const openConfirm = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmId(id);
  };

  const performDelete = async () => {
    if (!confirmId) return;
    const id = confirmId;
    setConfirmId(null);
    setDeletingId(id);
    const prev = cvs;
    setCvs(cvs.filter((cv) => cv.id !== id));
    try {
      const res = await fetch(`/api/cv?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("delete failed");
      router.refresh();
    } catch {
      setCvs(prev);
      toast.error("Couldn't delete this CV. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (cvs.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
        <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText className="h-8 w-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-royal-navy">No CVs yet</h3>
        <p className="text-slate-500 mt-2 mb-6">Create your first professional CV in minutes.</p>
        <Link
          href="/builder"
          className="inline-flex items-center gap-2 bg-royal-navy text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all"
        >
          Start Building
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {cvs.map((cv) => (
        <Link 
          key={cv.id} 
          href={`/builder?id=${cv.id}`}
          className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-royal-gold/20 transition-all flex items-center justify-between overflow-hidden relative"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-royal-gold transform -translate-x-full group-hover:translate-x-0 transition-transform" />
          <div className="flex items-center gap-6">
            <div className="h-16 w-12 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 group-hover:bg-royal-gold/5 transition-colors">
              <FileText className="h-8 w-8 text-slate-300 group-hover:text-royal-gold/50 transition-colors" />
            </div>
            <div>
              <h3 className="font-bold text-lg group-hover:text-royal-gold transition-colors">
                {cv.json_content?.title || (cv.json_content?.personal?.firstName ? `${cv.json_content.personal.firstName}'s Resume` : "Untitled Resume")}
              </h3>
              <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Edited {formatDistanceToNow(new Date(cv.updated_at), { addSuffix: true })}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="capitalize">{cv.status}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => openConfirm(e, cv.id)}
              disabled={deletingId === cv.id}
              aria-label="Delete this CV"
              className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
              {deletingId === cv.id ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Trash2 className="h-5 w-5" />
              )}
            </button>
            <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-royal-navy group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      ))}

      <Dialog open={confirmId !== null} onOpenChange={(open) => !open && setConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this CV?</DialogTitle>
            <DialogDescription>
              This permanently removes the CV from your vault. This action can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={performDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
