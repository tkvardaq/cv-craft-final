"use client";

import { useCvStore } from "@/lib/store/cv-store";

interface AtsGaugeProps {
  size?: number;
}

export function AtsGauge({ size = 160 }: AtsGaugeProps) {
  const score = useCvStore((s) => s.score);
  const missingKeywords = useCvStore((s) => s.missingKeywords);
  const formatWarnings = useCvStore((s) => s.formatWarnings);

  if (score === null) return null;

  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color =
    score >= 80
      ? "#059669"
      : score >= 60
        ? "#d97706"
        : score >= 40
          ? "#ea580c"
          : "#dc2626";

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div
          className="absolute flex flex-col items-center justify-center"
          style={{ width: size, height: size }}
        >
          <span
            className="text-3xl font-bold"
            style={{ color }}
          >
            {score}
          </span>
          <span className="text-xs text-slate-500 font-medium">ATS Score</span>
        </div>
      </div>

      {missingKeywords.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-amber-800 mb-1">
            Missing Keywords ({missingKeywords.length})
          </p>
          <div className="flex flex-wrap gap-1">
            {missingKeywords.slice(0, 10).map((kw) => (
              <span
                key={kw}
                className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded"
              >
                {kw}
              </span>
            ))}
            {missingKeywords.length > 10 && (
              <span className="text-xs text-amber-600">
                +{missingKeywords.length - 10} more
              </span>
            )}
          </div>
        </div>
      )}

      {formatWarnings.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-red-800 mb-1">
            Format Warnings
          </p>
          <ul className="space-y-1">
            {formatWarnings.map((w, i) => (
              <li key={i} className="text-xs text-red-700">
                ⚠ {w}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
