---
name: nextjs-starshop
description: StarShop Next.js project conventions. Apply when writing, reviewing, or modifying any code in this repository — components, API routes, forms, state, types, and pages.
user-invocable: false
---

# StarShop Next.js Conventions

## Project Stack
- **Next.js 15** App Router + TypeScript + Tailwind CSS v4
- **Zustand** for global client state
- **TanStack React Query** for server state (fetching, caching, mutations)
- **React Hook Form + Zod** for all forms
- **shadcn/ui** (Radix UI) for base UI primitives — `components/ui/`
- **Axios** via `lib/api/api.gateway.ts` for all HTTP calls
- **Sonner** for toast notifications
- **Lucide React** for icons

---

## User Types & Auth
Three user roles enforced in `middleware.ts` via `token` + `user` cookies:
- **Public** — unauthenticated, routes: `/`, `/products`, `/news`, etc.
- **Admin** (`userType: 1`) — `/admin/*`
- **FC / Franchise** (`userType: 2`) — `/fc/*`

No manual auth checks needed in pages — middleware handles redirection.

---

## Import Rules
Always use the `@/` path alias. Never use `../` across feature boundaries.
```ts
import { api } from "@/lib/api/api.gateway";      // Good
import { Button } from "@/components/ui/button";   // Good
import { api } from "../../lib/api/api.gateway";   // Bad
```

---

## File Naming
| Type | Convention | Example |
|------|-----------|---------|
| Pages / Layouts | Next.js default | `page.tsx`, `layout.tsx` |
| Components | PascalCase + suffix | `ProductItemComponent.tsx` |
| Hooks | `use` prefix | `useAuthStore.ts` |
| Types | Domain scoped | `types/admin/order.type.ts` |
| Zod schemas | Domain scoped | `lib/schema/fc/basicInfo.schema.ts` |

---

## API Layer

All backend calls go through `lib/api/`:
```
lib/api/
  api.gateway.ts       ← Axios client + auth interceptors
  api.route.ts         ← Aggregates all route files
  routes/
    public.route.ts    ← /pub/* endpoints
    admin.route.ts     ← /admin/* endpoints
    fc.route.ts        ← /fc/* endpoints
    user.route.ts      ← /user/* endpoints
```

### Adding an Endpoint
Add to the correct route file inside a grouped const object, export via the section aggregator:
```ts
// lib/api/routes/admin.route.ts
const newsAPI = {
  getNews: (page: number, pageSize: number) =>
    api.get<NewsResponse>("/admin/news", { params: { page, pageSize } }),
  createNews: (news: NewsPayload) =>
    api.post<NewsPayload, NewsResponse>("/admin/news", news),
};
export const adminRoutes = { news: newsAPI, ... };
```

### Typing Pattern
```ts
api.get<ResponseType>(url, { params })
api.post<PayloadType, ResponseType>(url, data)
api.put<PayloadType, ResponseType>(url, data)
api.patch<PayloadType, ResponseType>(url, data)
api.delete<ApiResponse<null>>(url)
```

### Using in Components
```ts
import { apiRoutes } from "@/lib/api/api.route";

const { data } = useQuery({
  queryKey: ["admin", "news", page],
  queryFn: () => apiRoutes.admin.news.getNews(page, 10),
});
```

### Error Handling
```ts
import { ApiError } from "@/lib/api/api.gateway";
import { toast } from "sonner";

try {
  await apiRoutes.admin.news.createNews(payload);
} catch (error) {
  if (error instanceof ApiError) toast.error(error.message);
}
```

### File Uploads to S3
```ts
import { putObjects, Photo } from "@/lib/api/aws/putObjects";

const photos: Photo[] = files.map(file => ({ id: Date.now(), file, imgUrl: "" }));
const uploaded = await putObjects(`products/${productId}`, photos);
// uploaded[n].imgUrl = S3 URL → save to backend
```

---

## Components

### Layout Wrappers (always use the right one)
- `PublicLayout` — public pages with header/footer
- `AdminLayout` — admin dashboard shell
- `SectionLayout` — consistent padding/max-width
- `PublicDetailsLayout` — detail page with back nav
- `ComponentLayout` — component showcase

### shadcn/ui
Import base primitives from `@/components/ui/` only:
```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
```

### Server vs Client
- Default to **Server Components** in `app/` pages
- Add `"use client"` only when using: `useState`, `useEffect`, event handlers, browser APIs, or React Query hooks

### Props Pattern
```tsx
import { Product } from "@/types/dashboard/products";

interface Props {
  product: Product;
  onClick?: () => void;
}

export default function ProductItemComponent({ product, onClick }: Props) { ... }
```

### Conditional Classes
```tsx
import { cn } from "@/lib/utils";
<div className={cn("base-class", isActive && "active-class")} />
```

---

## Forms

### Schema — always in `lib/schema/<section>/<name>.schema.ts`
```ts
import { z } from "zod";

export const basicInfoSchema = z.object({
  firstName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
});

export type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;
```

### Form Component Pattern
```tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { basicInfoSchema, BasicInfoFormValues } from "@/lib/schema/fc/basicInfo.schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function BasicInfoForm() {
  const form = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: { firstName: "", email: "" },
  });

  const onSubmit = async (values: BasicInfoFormValues) => {
    try {
      await apiRoutes.public.signup(values);
    } catch (error) {
      if (error instanceof ApiError) form.setError("root", { message: error.message });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField control={form.control} name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

- Always use `z.infer<typeof schema>` for form value types — no separate interfaces
- Use shadcn `Form`/`FormField`/`FormItem`/`FormLabel`/`FormControl`/`FormMessage` wrappers

---

## State Management

### Zustand — global client state only
```ts
// store/useExampleStore.ts
import { create } from "zustand";

interface ExampleState {
  items: Item[];
  setItems: (items: Item[]) => void;
}

export const useExampleStore = create<ExampleState>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
}));
```
Do not store server-fetched data in Zustand — use React Query for that.

### React Query — server state
```ts
// Query key convention: mirrors API hierarchy
["admin", "products", page, filters]
["public", "news", page]

// Mutation pattern
const { mutate, isPending } = useMutation({
  mutationFn: (payload: CreatePayload) => apiRoutes.admin.news.createNews(payload),
  onSuccess: () => {
    toast.success("Created");
    queryClient.invalidateQueries({ queryKey: ["admin", "news"] });
  },
  onError: (error: ApiError) => toast.error(error.message),
});
```

---

## TypeScript Types

Place types in `types/` by domain:
```
types/
  api/api-response.ts      ← ApiResponse<T> wrapper
  admin/<domain>.type.ts   ← Admin-only types
  fc/<domain>.type.ts      ← FC-only types
  orders/index.ts          ← Shared domain types
  customers/index.ts
```

Export payload, response, and status variants together:
```ts
// types/admin/news.type.ts
export interface NewsItem { ... }
export interface NewsPayload { ... }
export interface NewsResponse { ... }
export interface NewsStatus { ... }
```

Avoid `any` — if unavoidable: `// eslint-disable-next-line @typescript-eslint/no-explicit-any`

---

## Next.js Pages & Routes

### App Router Structure
```
app/
  page.tsx                 ← Public home
  layout.tsx               ← Root layout (fonts, providers, GTM)
  admin/layout.tsx         ← Admin shell
  fc/layout.tsx            ← FC portal shell
  api/                     ← Thin proxy route handlers
```

### Route Handlers — keep thin
```ts
// app/api/admin/products/route.ts
import { NextResponse } from "next/server";
import { apiRoutes } from "@/lib/api/api.route";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? 1);
  const data = await apiRoutes.admin.product.getAllProducts({ page, ... });
  return NextResponse.json(data);
}
```

### Dynamic Routes
```tsx
export default function NewsDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
}
```

### Providers
Add new global providers to `app/provider.tsx` — not in individual layouts.

### Fonts (CSS variables, set in `app/layout.tsx`)
- `--font-geist-sans`, `--font-geist-mono`
- `--font-noto-sans-jp` (Japanese text)
- `--font-cormorant-infant` (decorative headings)

---

## Notifications
```ts
import { toast } from "sonner";
toast.success("Saved successfully");
toast.error("Something went wrong");
```
