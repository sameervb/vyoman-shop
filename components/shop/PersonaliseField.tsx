"use client";

const MAX_CHARS = 140;

interface PersonaliseFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PersonaliseField({
  value,
  onChange,
}: PersonaliseFieldProps) {
  const remaining = MAX_CHARS - value.length;

  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
        placeholder="A message for the back — or leave blank for a plain postcard"
        rows={4}
        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded px-4 py-3 text-sm text-[#f5f5f5] placeholder-[#555555] focus:outline-none focus:border-[#d4a853] transition-colors resize-none leading-relaxed"
      />
      <div className="flex justify-between mt-1.5">
        <p className="text-xs text-[#555555]">
          Printed on the left half of the postcard back.
        </p>
        <p
          className={`text-xs tabular-nums ${
            remaining < 20 ? "text-[#d4a853]" : "text-[#555555]"
          }`}
        >
          {remaining} left
        </p>
      </div>
    </div>
  );
}
