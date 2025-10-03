export default function Icon({ id, className = "w-5 h-5" }) {
  return (
    <svg className={className} aria-hidden={ariaHidden} role={ariaHidden ? undefined : 'img'}>
      {title && <title>{title}</title>}
      <use href={`/icons/cba-icons.svg#${id}`} />
    </svg>
  );
}
