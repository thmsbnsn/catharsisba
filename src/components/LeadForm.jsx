import { useState, useEffect } from "react";

export default function LeadForm() {
  const [started, setStarted] = useState(0);
  const [status, setStatus] = useState(null); // 'loading' | 'sent' | 'fail'
  const [errorMsg, setErrorMsg] = useState("");
  const [artist, setArtist] = useState("");
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    setStarted(Math.floor(Date.now() / 1000));
    try {
      const params = new URLSearchParams(window.location.search);
      const a = params.get("artist");
      if (a) setArtist(a);
    } catch {
      /* noop for SSR */
    }
  }, []);

  // Auto-reset status after 5s
  useEffect(() => {
    if (status === "sent" || status === "fail") {
      const timer = setTimeout(() => {
        setStatus(null);
        setErrorMsg("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    data.set("started", String(started));
    if (artist) data.set("artist", artist);

    // Client validation
    const name = (form.elements.name && form.elements.name.value || '').trim();
    const email = (form.elements.email && form.elements.email.value || '').trim();
    const message = (form.elements.message && form.elements.message.value || '').trim();
    const newErrors = { name: '', email: '', message: '' };
    if (!name) newErrors.name = 'Please enter your name';
    if (!email) newErrors.email = 'Please enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Please enter a valid email';
    if (!message) newErrors.message = 'Please enter a brief message';
    setErrors(newErrors);
    if (newErrors.name || newErrors.email || newErrors.message) {
      setStatus('fail');
      setErrorMsg('Please correct the errors above');
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/lead.php", { method: "POST", body: data });
      const j = await res.json();

      if (res.ok && j.success) {
        setStatus("sent");
        form.reset();
        // Keep artist chip visible OR clear if you prefer:
        // setArtist("");
      } else {
        setStatus("fail");
        setErrorMsg(j.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setStatus("fail");
      setErrorMsg("Network error — please try again later.");
    }
  }

  const controlClass = (hasError) =>
    `field-control${hasError ? " has-error" : ""}`;

  return (
    <form onSubmit={handleSubmit} className="form-grid" noValidate>
      {/* Honeypot + time trap */}
      <input
        type="text"
        name="company"
        autoComplete="organization"
        className="hidden"
        tabIndex={-1}
      />
      <input type="hidden" name="started" value={started} />
      <input type="hidden" name="referrer" value={typeof window !== "undefined" ? window.location.href : ""} />

      {artist && (
        <>
          <input type="hidden" name="artist" value={artist} />
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-2 py-1 text-xs text-white/80">
            <span>Booking with:</span>
            <strong className="text-white">{artist}</strong>
            <button
              type="button"
              className="opacity-70 hover:opacity-100"
              onClick={() => setArtist("")}
              aria-label="Clear artist"
            >
              ✕
            </button>
          </div>
        </>
      )}

      <div className="form-field">
        <label htmlFor="lead_name" className="sr-only">
          Your name
        </label>
        <div className={controlClass(Boolean(errors.name))}>
        <input
          id="lead_name"
          name="name"
          required
          placeholder=" "
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby={errors.name ? 'err_name' : undefined}
          onBlur={(e) => {
            const v = (e.target.value || '').trim();
            setErrors((s) => ({ ...s, name: v ? '' : 'Please enter your name' }));
          }}
          className="field-input"
        />
        <label htmlFor="lead_name" className="field-label">
          Your name
        </label>
        <span className="field-underline" />
        </div>
        {errors.name && <p id="err_name" className="form-error" role="alert">{errors.name}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="lead_email" className="sr-only">
          Email address
        </label>
        <div className={controlClass(Boolean(errors.email))}>
        <input
          id="lead_email"
          name="email"
          type="email"
          required
          placeholder=" "
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'err_email' : undefined}
          onBlur={(e) => {
            const v = (e.target.value || '').trim();
            let msg = '';
            if (!v) msg = 'Please enter your email';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = 'Please enter a valid email';
            setErrors((s) => ({ ...s, email: msg }));
          }}
          className="field-input"
        />
        <label htmlFor="lead_email" className="field-label">
          Email address
        </label>
        <span className="field-underline" />
        </div>
        {errors.email && <p id="err_email" className="form-error" role="alert">{errors.email}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="lead_phone" className="sr-only">
          Phone number
        </label>
        <div className="field-control">
        <input
          id="lead_phone"
          name="phone"
          type="tel"
          placeholder=" "
          className="field-input"
        />
        <label htmlFor="lead_phone" className="field-label">
          Phone number
        </label>
        <span className="field-underline" />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="lead_message" className="sr-only">
          Message
        </label>
        <div className={controlClass(Boolean(errors.message))}>
        <textarea
          id="lead_message"
          name="message"
          required
          placeholder=" "
          aria-invalid={errors.message ? 'true' : 'false'}
          aria-describedby={errors.message ? 'err_message' : undefined}
          onBlur={(e) => {
            const v = (e.target.value || '').trim();
            setErrors((s) => ({ ...s, message: v ? '' : 'Please enter a brief message' }));
          }}
          className="field-textarea"
        ></textarea>
        <label htmlFor="lead_message" className="field-label">
          {artist ? `Project details for ${artist}` : "Tell us your idea"}
        </label>
        <span className="field-underline" />
        </div>
        {errors.message && <p id="err_message" className="form-error" role="alert">{errors.message}</p>}
      </div>

      <button
      className="btn-cta w-full justify-center disabled:opacity-60"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Sending..." : "Request consult"}
      </button>

      {status === "sent" && (
        <p className="form-status success" role="status">✅ Sent! We’ll reply soon.</p>
      )}
      {status === "fail" && (
        <p className="form-status error" role="alert">❌ {errorMsg}</p>
      )}
    </form>
  );
}
