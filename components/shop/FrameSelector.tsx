"use client";

import type { FrameOption } from "@/types/catalog";

interface FrameSelectorProps {
  selected: FrameOption;
  onChange: (value: FrameOption) => void;
}

const FRAMES: { value: FrameOption; label: string; swatch: string }[] = [
  { value: "black", label: "Black frame", swatch: "#1a1a1a" },
  { value: "white", label: "White frame", swatch: "#f0f0f0" },
];

export default function FrameSelector({
  selected,
  onChange,
}: FrameSelectorProps) {
  return (
    <div className="flex gap-3">
      {FRAMES.map((frame) => (
        <button
          key={frame.value}
          onClick={() => onChange(frame.value)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded border text-sm transition-colors ${
            selected === frame.value
              ? "border-[#d4a853] text-[#f5f5f5]"
              : "border-[#2a2a2a] text-[#888888] hover:border-[#3a3a3a]"
          }`}
          aria-pressed={selected === frame.value}
        >
          <span
            className="w-4 h-4 rounded-sm border border-[#3a3a3a]"
            style={{ backgroundColor: frame.swatch }}
          />
          {frame.label}
        </button>
      ))}
    </div>
  );
}
