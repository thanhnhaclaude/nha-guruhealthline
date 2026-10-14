// Plain GET form: works without JavaScript and lands on /search?q=...
export default function SearchBox({ placeholder = "Search supplements, ingredients, goals…", className = "hero-search", defaultValue }) {
  return (
    <form action="/search" method="get" role="search" className={className}>
      <label htmlFor="site-search" className="visually-hidden">Search the site</label>
      <input id="site-search" name="q" type="search" placeholder={placeholder} defaultValue={defaultValue} autoComplete="off" />
      <button type="submit">Search</button>
    </form>
  );
}
