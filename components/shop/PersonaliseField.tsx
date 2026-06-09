"use client";

const MAX_CHARS = 140;

interface PersonaliseFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PersonaliseField({ value, onChange }: PersonaliseFieldProps) {
  const remaining = MAX_CHARS - value.length;

  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
        placeholder="A message for the back — or leave blank for a plain postcard"
        rows={4}
        style={{
          width: "100%", background: "var(--paper-2)", border: "1px solid var(--rule)",
          borderRadius: "3px", padding: "0.75rem 1rem",
          fontSize: "0.875rem", color: "var(--ink)",
          fontFamily: "inherit", lineHeight: 1.65, resize: "none",
          outline: "none", transition: "border-color 0.15s",
        }}
        onFocus={e => (e.target.style.borderColor = "var(--ink)")}
        onBlur={e => (e.target.style.borderColor = "var(--rule)")}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem" }}>
        <p style={{ fontSize: "0.75rem", color: "var(--faint)" }}>
          Printed on the left half of the postcard back.
        </p>
        <p style={{ fontSize: "0.75rem", color: remaining < 20 ? "var(--ink)" : "var(--faint)", fontVariantNumeric: "tabular-nums" }}>
          {remaining} left
        </p>
      </div>
    </div>
  );
}
