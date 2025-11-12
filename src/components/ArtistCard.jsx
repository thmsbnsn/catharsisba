/**
 * @typedef {import("../types").Artist & {
 *   profileImageUrl?: string | null;
 *   profileImageAlt?: string;
 *   hero?: { path?: string } | string | null;
 * }} ArtistCardArtist
 */

/**
 * @param {{ artist: ArtistCardArtist }} props
 */
export default function ArtistCard({ artist }) {
  const profileImageUrl =
    artist.profileImageUrl ||
    artist.hero?.path ||
    artist.hero ||
    null;
  const profileImageAlt = artist.profileImageAlt || `${artist.name} portrait`;
  const baseSummary = artist.shortBio || artist.bio || "";
  const summary =
    baseSummary.length > 220 ? `${baseSummary.slice(0, 217)}…` : baseSummary;
  const position = artist.position || "";

  return (
    <article className="artist-luxe">
      <div className="artist-avatar">
        <div className="artist-avatar__frame">
          {profileImageUrl ? (
            <img src={profileImageUrl} alt={profileImageAlt} loading="lazy" decoding="async" />
          ) : (
            <div className="bg-[rgba(244,210,150,0.12)] w-full h-full rounded-full grid place-items-center text-sm text-[rgba(244,210,150,0.65)]">
              {artist.name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
      </div>
      <div className="artist-meta">
        {position && <span className="artist-style">{position}</span>}
        <h3 className="artist-name">{artist.name}</h3>
        {summary && <p className="artist-bio">{summary}</p>}
      </div>
      <div className="artist-actions">
        <a href={`/artists/${artist.slug}/`} className="btn-outline">
          View Profile
        </a>
      </div>
    </article>
  );
}
