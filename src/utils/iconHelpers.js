export function getIconProps({ id, src, className = "w-5 h-5", title, ariaHidden = true }) {
  const normalizedClass = className || "w-5 h-5";
  if (src) {
    return {
      type: "img",
      props: {
        src,
        alt: title || id || "",
        className: normalizedClass,
        "aria-hidden": ariaHidden,
      },
    };
  }

  return {
    type: "svg",
    props: {
      className: normalizedClass,
      "aria-hidden": ariaHidden,
      role: ariaHidden ? undefined : "img",
      title,
      hrefId: id,
    },
  };
}


