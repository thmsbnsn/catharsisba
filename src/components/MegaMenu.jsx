import Icon from "./Icon.jsx";

const items = [
  { href: "/artists", title: "Artists", desc: "Meet the team", iconSrc: "/icons/MeetTheArtists_Icon.svg" },
  { href: "/gallery", title: "Gallery", desc: "Selected works", iconSrc: "/icons/Gallery_Icon.svg" },
  { href: "/contact", title: "Book", desc: "Consult & questions", iconSrc: "/icons/Contact_Icon.svg" },
  { href: "/blog", title: "Blog", desc: "Stories & updates", iconSrc: "/icons/nav_blog.svg" }
];

export default function MegaMenu() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it) => (
        <a key={it.title} href={it.href}
           className="group card p-6 transition-transform duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-serif text-2xl">{it.title}</h3>
            <Icon src={it.iconSrc} className="w-6 h-6 opacity-70 group-hover:opacity-100" title={it.title} />
          </div>
          <p className="mt-2 text-white/70">{it.desc}</p>
        </a>
      ))}
    </div>
  );
}
