# Themes (WordPress-style)

Each folder under `src/themes/<id>/` is a theme package:

```
themes/
  default/          ← parent theme (all slots required)
    theme.json      ← colors / tokens
    styles.css      ← optional CSS under .theme-default
    components/
      Header.tsx
      Footer.tsx
      Hero.tsx
      BlogCard.tsx
    index.ts
  modern/           ← child theme (only overrides)
    theme.json
    styles.css
    components/
      Hero.tsx      ← overrides default Hero
      BlogCard.tsx  ← overrides default BlogCard
    index.ts        ← Header/Footer omitted → fall back to default
  luxury/
    ...
```

## Override rules

1. Admin picks `theme.id` (`default` | `modern` | `luxury`).
2. `resolveThemeComponent(id, slot)` uses the child theme’s file if present.
3. Otherwise it loads the same slot from `default`.

Same idea as a WordPress child theme: only ship what you change.

## Add a new theme

1. Copy `default/` → `themes/mytheme/`.
2. Edit `theme.json` tokens and any `components/*.tsx` you want to change.
3. Delete component files you want to inherit from default.
4. Register in `registry.ts` and add the id to admin `THEME_OPTIONS`.
5. Redeploy commonblog.

## Runtime wiring

- Layout → `ThemeHeader` / `ThemeFooter`
- Home hero → `ThemeHero`
- Post grids → `ThemeBlogCard`
- Tokens → `loadTheme()` from each package’s `theme.json`
- Custom CSS → ChannelAdmin **Blogs → SEO → Custom CSS** (injected after theme CSS)
- Post HTML → inline `style` / `class` stripped (theme + custom CSS only)

## Custom CSS

Saved on the website as `theme.customCss`. Prefer selectors under `.theme-<id>` and semantic article markup (`.article-body h2`, etc.).
