'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { docsNavigation } from '../_config/navigation';

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 overflow-y-auto border-r border-border px-4 py-6">
      <nav className="space-y-6">
        {docsNavigation.map((section) => {
          const isActiveSection = section.items.some((item) => pathname === `/docs/${item.slug}`);

          return (
            <div key={section.section}>
              {/* Section title */}
              <h4
                className={clsx(
                  'mb-2 text-sm font-semibold transition-colors',
                  isActiveSection ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {section.section}
              </h4>

              {/* Section items (ALWAYS RENDERED) */}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const href = `/docs/${item.slug}`;
                  const isActive = pathname === href;

                  return (
                    <li key={item.slug}>
                      <Link
                        href={href}
                        className={clsx(
                          'block rounded-md px-2 py-1 text-sm transition-colors',
                          isActive
                            ? 'bg-muted font-medium text-foreground'
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                        )}
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
