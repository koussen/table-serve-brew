<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Café photos use CDN-backed WebP variants from the shared image registry and CafeImage component so each placement downloads an appropriate size.
- Café motion uses CSS opacity/transform animations and one shared intersection observer, with reduced-motion support, to avoid a heavy animation dependency.
