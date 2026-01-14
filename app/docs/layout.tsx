import { ReactNode } from 'react';
import { DocsSidebar } from './_components/DocsSidebar';
import { DocsBreadcrumb } from './_components/DocsBreadcrumb';
import { docsMetadata } from './_config/metadata';
import { DocsSearch } from './_components/DocSearch';
import { DocsSearchProvider } from './_search/use-docs-search';
import { Navbar } from '@/shared/ui/navbar';

export const metadata = docsMetadata;

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <DocsSearchProvider>
      <div className="flex min-h-screen flex-col">
        {/* Top navbar */}
        <Navbar />

        {/* Docs body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Docs search overlay */}
          <DocsSearch />

          {/* Sidebar */}
          <aside className="h-full w-64 shrink-0 overflow-y-auto border-r">
            <DocsSidebar />
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto px-8 py-6">
            <DocsBreadcrumb />
            {children}
          </main>
        </div>
      </div>
    </DocsSearchProvider>
  );
}
