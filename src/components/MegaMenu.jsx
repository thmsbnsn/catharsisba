import Icon from "./Icon.jsx";

const items = [
  { href: "/artists", title: "Artists", desc: "Meet the team", icon: "icon-home" },
  { href: "/gallery", title: "Gallery", desc: "Selected works", icon: "icon-gallery" },
  { href: "/contact", title: "Book", desc: "Consult & questions", icon: "icon-shop" }
];

export default function MegaMenu() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {items.map((it) => (
        <a key={it.title} href={it.href}
           className="group card p-6 transition-transform duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl">{it.title}</h3>
            <Icon id={it.icon} className="w-6 h-6 opacity-70 group-hover:opacity-100" />
          </div>
          <p className="mt-2 text-white/70">{it.desc}</p>
        </a>
      ))}
    </div>
  );
}
