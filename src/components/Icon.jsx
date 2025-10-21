// Icon can render from sprite (default) or a direct svg file via src
export default function Icon({ id, className = "w-5 h-5", ariaHidden = true, title, src }) {
  if (src) {
    return <img src={src} alt={title || id || ""} className={className} aria-hidden={ariaHidden} />;
  }
  return (
    <svg className={className} aria-hidden={ariaHidden} role={ariaHidden ? undefined : 'img'}>
      {title && <title>{title}</title>}
      <use href={`/icons/cba-icons.svg#${id}`} />
    </svg>
  );
}
