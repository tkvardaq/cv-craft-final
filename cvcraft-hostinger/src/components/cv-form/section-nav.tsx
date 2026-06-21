"use client";

import { cn } from "@/lib/utils";
import { 
  type LucideIcon,
  User, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  PlusCircle,
  CheckCircle2
} from "lucide-react";

interface Section {
  id: string;
  label: string;
  icon: LucideIcon;
}

const sections: Section[] = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "summary", label: "Professional Summary", icon: FileText },
  { id: "experience", label: "Work Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "extras", label: "Extras", icon: PlusCircle },
];

interface SectionNavProps {
  activeSection: string;
  onSectionChange: (id: string) => void;
  completedSections: string[];
}

export function SectionNav({ activeSection, onSectionChange, completedSections }: SectionNavProps) {
  return (
    <nav className="space-y-1">
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;
        const isCompleted = completedSections.includes(section.id);

        return (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group",
              isActive 
                ? "bg-royal-gold text-white shadow-md shadow-royal-gold/20" 
                : "text-slate-600 hover:bg-slate-100 hover:text-royal-navy"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-1.5 rounded-lg transition-colors",
                isActive ? "bg-white/20" : "bg-slate-100 group-hover:bg-white"
              )}>
                <Icon className="h-4 w-4" />
              </div>
              {section.label}
            </div>
            {isCompleted && !isActive && (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
