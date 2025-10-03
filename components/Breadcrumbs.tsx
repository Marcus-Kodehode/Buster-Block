import Link from "next/link";

type Crumb = { href?: string; label: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="text-sm text-gray-400 mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            {c.href ? (
              <Link href={c.href} className="hover:text-gray-200">
                {c.label}
              </Link>
            ) : (
              <span className="text-gray-300">{c.label}</span>
            )}
            {i < items.length - 1 && <span className="text-gray-600">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
