export default function NavCard({ href, title, desc }) {
  return (
    <a href={href} className="group card p-6 transition-transform duration-200 hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-2xl">{title}</h3>
        <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span>
      </div>
      <p className="mt-2 text-white/70">{desc}</p>
    </a>
  );
}
