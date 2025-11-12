import { memo } from "react";
import { getIconProps } from "../utils/iconHelpers.js";

/**
 * @typedef {{
 *   id?: string;
 *   src?: string;
 *   className?: string;
 *   ariaHidden?: boolean;
 *   title?: string;
 * }} IconProps
 */

// Icon can render from sprite (default) or a direct svg file via src
/**
 * @param {IconProps} props
 */
function IconComponent(props) {
  const { type, props: iconProps } = getIconProps(props);

  if (type === "img") {
    const { hrefId, title, ...rest } = iconProps;
    return <img {...rest} />;
  }

  const { hrefId, title, ...rest } = iconProps;
  return (
    <svg {...rest}>
      {title && <title>{title}</title>}
      <use href={`/icons/cba-icons.svg#${hrefId}`} />
    </svg>
  );
}

export default memo(IconComponent);
