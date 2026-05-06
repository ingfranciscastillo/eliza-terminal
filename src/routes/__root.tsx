import { HeadContent, Link, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
  meta: [
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },

    { title: "ELIZA" },
    { name: "description", content: "A retro terminal recreation of the 1966 ELIZA chatbot." },
    { name: "author", content: "Francis Castillo" },

    // Open Graph
    { property: "og:title", content: "ELIZA" },
    { property: "og:description", content: "A retro terminal recreation of the 1966 ELIZA chatbot." },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "/og-image.jpg" },

    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "ELIZA" },
    { name: "twitter:description", content: "A retro terminal recreation of the 1966 ELIZA chatbot." },
    { name: "twitter:image", content: "/og-image.jpg" },

    // PWA / theme
    { name: "theme-color", content: "#000000" },
  ],

  links: [
    { rel: "stylesheet", href: appCss },

    // Fonts
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" },

    // Favicons
    { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    { rel: "icon", type: "image/png", sizes: "96x96", href: "/favicon-96x96.png" },
    { rel: "shortcut icon", href: "/favicon.ico" },

    // Apple
    { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },

    // Manifest
    { rel: "manifest", href: "/site.webmanifest" },
  ],
}),
  shellComponent: RootDocument,
  component: RootComponent,
  notFoundComponent: NotFoundComponent
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  return <Outlet />;
}