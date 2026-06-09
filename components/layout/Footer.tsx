import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#2a2a2a] mt-24 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#888888]">
        <div className="flex items-center gap-1">
          <span className="tracking-[0.2em] uppercase text-[#f5f5f5]">Vyoman</span>
          <span className="mx-2 text-[#2a2a2a]">·</span>
          <span>Sky in Sanskrit</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="https://vyomanaerials.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#f5f5f5] transition-colors"
          >
            vyomanaerials.com
          </Link>
          <span className="text-[#2a2a2a]">·</span>
          <Link
            href="/about"
            className="hover:text-[#f5f5f5] transition-colors"
          >
            About
          </Link>
          <span className="text-[#2a2a2a]">·</span>
          <Link
            href="mailto:hello@vyomanaerials.com"
            className="hover:text-[#f5f5f5] transition-colors"
          >
            Contact
          </Link>
        </div>
        <p>© {new Date().getFullYear()} Vyoman</p>
      </div>
    </footer>
  );
}
