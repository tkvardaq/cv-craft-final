"use client";

import { useState } from "react";
import { Share2, Check, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function ShareButton({ cvId }: { cvId?: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const enable = async () => {
    if (!cvId) {
      toast.error("Save your CV first, then share it.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/cv/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv_id: cvId, enable: true }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.error || "Couldn't enable sharing");
        return;
      }
      const json = await res.json();
      setUrl(`${window.location.origin}/cv/${json.slug}`);
    } finally {
      setLoading(false);
    }
  };

  const disable = async () => {
    if (!cvId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/cv/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv_id: cvId, enable: false }),
      });
      if (!res.ok) {
        toast.error("Couldn't disable sharing");
        return;
      }
      setUrl(null);
      toast.success("Sharing disabled");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className="w-full border-royal-navy/20 text-royal-navy hover:bg-royal-navy/5"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Share publicly
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share your CV</DialogTitle>
            <DialogDescription>
              Generate a public link anyone can open — even without an account. Disable it any time.
            </DialogDescription>
          </DialogHeader>

          {url ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
                <code className="flex-1 truncate text-xs text-slate-700 font-mono">{url}</code>
                <Button type="button" size="sm" variant="ghost" onClick={copy} className="shrink-0">
                  {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                Anyone with this link can view your CV. Changes you make are reflected instantly.
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-600">
              Your CV is currently private. Generate a public link below.
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Close</Button>
            {url ? (
              <Button type="button" variant="destructive" onClick={disable} disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                Stop sharing
              </Button>
            ) : (
              <Button type="button" onClick={enable} disabled={loading || !cvId}>
                {loading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                Generate link
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
