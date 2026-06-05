"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  Buildings,
  Globe,
  MapPin,
  Users,
  Article,
  EnvelopeSimple,
  ShieldCheck,
  CircleNotch,
  FloppyDisk,
  PencilSimple,
  Storefront,
  Lock,
  Camera,
} from "@phosphor-icons/react";
import { authApi } from "@/lib/api";
import { getStoredCompany, setStoredCompany } from "@/lib/auth";
import type { AxiosError } from "axios";

type FormState = {
  name: string;
  website: string;
  industry: string;
  size: string;
  location: string;
  description: string;
};

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "E-commerce",
  "Media & Entertainment",
  "Manufacturing",
  "Consulting",
  "Legal",
  "Real Estate",
  "Non-profit",
  "Other",
];

const COMPANY_SIZES = [
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-500", label: "201–500 employees" },
  { value: "500+", label: "500+ employees" },
];

/* ════════════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════════════ */
export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    website: "",
    industry: "",
    size: "",
    location: "",
    description: "",
  });

  const company = getStoredCompany();

  useEffect(() => {
    // Pre-fill logoUrl from localStorage immediately to avoid flash
    const stored = getStoredCompany();
    if (stored?.logoUrl) {
      setLogoUrl(stored.logoUrl);
    }

    authApi
      .me()
      .then((res) => {
        const c = res.data.data?.company ?? res.data.data;
        setForm({
          name: c.name ?? "",
          website: c.website ?? "",
          industry: c.industry ?? "",
          size: c.size ?? "",
          location: c.location ?? "",
          description: c.description ?? "",
        });
        if (c.logoUrl) setLogoUrl(c.logoUrl);
      })
      .catch(() => {
        if (stored) {
          setForm((prev) => ({
            ...prev,
            name: stored.name ?? "",
            industry: stored.industry ?? "",
          }));
        }
      })
      .finally(() => setFetching(false));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  /* ── Logo upload ──────────────────────────────────────── */
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset so same file can be re-uploaded if needed
    e.target.value = "";

    const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!ALLOWED.includes(file.type)) {
      toast.error("Please upload a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB.");
      return;
    }

    setUploading(true);
    setImgError(false);

    // Optimistic preview while uploading
    const preview = URL.createObjectURL(file);
    setLogoUrl(preview);

    try {
      const fd = new FormData();
      fd.append("logo", file);
      const res = await authApi.uploadLogo(fd);
      const newUrl: string = res.data.data.logoUrl;

      setLogoUrl(newUrl);

      // Persist in localStorage so sidebar + header update on next navigation
      const stored = getStoredCompany();
      if (stored) setStoredCompany({ ...stored, logoUrl: newUrl });

      toast.success("Logo updated.");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      // Revert preview to previous logo / null
      setLogoUrl(getStoredCompany()?.logoUrl ?? null);
      setImgError(false);
      toast.error(
        error.response?.data?.message ?? "Upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
      URL.revokeObjectURL(preview);
    }
  };

  /* ── Profile save ─────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Company name is required.");
      return;
    }
    setLoading(true);
    try {
      await authApi.updateProfile({
        name: form.name,
        website: form.website || null,
        industry: form.industry || null,
        size: form.size || null,
        location: form.location || null,
        description: form.description || null,
      });
      const stored = getStoredCompany();
      if (stored)
        setStoredCompany({
          ...stored,
          name: form.name,
          industry: form.industry || null,
        });
      toast.success("Profile updated.");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message ?? "Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Skeleton ─────────────────────────────────────────── */
  if (fetching) return <SkeletonPage />;

  const initials = (form.name || company?.name || "?")
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  const showImage = logoUrl && !imgError;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* ── Hidden file input ── */}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleLogoChange}
      />

      {/* ── Hero header ─────────────────────────────────── */}
      <div
        className="relative rounded-2xl overflow-hidden px-5 py-5 md:px-8 md:py-7 anim-1"
        style={{
          background:
            "linear-gradient(135deg,#0e0e1a 0%,#13102a 45%,#0e0e1a 100%)",
          border: "1px solid rgba(124,58,237,0.22)",
        }}
      >
        {/* Orb */}
        <div
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 65%)",
          }}
        />

        <div className="relative flex items-center gap-5">
          {/* ── Clickable avatar ── */}
          <div
            className="relative flex-shrink-0 cursor-pointer"
            style={{ width: 72, height: 72 }}
            onClick={() => !uploading && fileRef.current?.click()}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            title="Change company logo"
          >
            {/* Avatar (image or initials) */}
            {showImage ? (
              <img
                src={logoUrl}
                alt="Company logo"
                onError={() => setImgError(true)}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 18,
                  objectFit: "cover",
                  display: "block",
                  border: "2px solid rgba(124,58,237,0.3)",
                  boxShadow: "0 0 28px rgba(124,58,237,0.35)",
                }}
              />
            ) : (
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 18,
                  background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
                  boxShadow: "0 0 28px rgba(124,58,237,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  fontWeight: 900,
                  color: "#fff",
                }}
              >
                {initials}
              </div>
            )}

            {/* Hover / upload overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 18,
                background: uploading
                  ? "rgba(0,0,0,0.55)"
                  : hovering
                    ? "rgba(0,0,0,0.45)"
                    : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.18s",
              }}
            >
              {uploading ? (
                <CircleNotch size={22} color="#fff" className="animate-spin" />
              ) : hovering ? (
                <div className="flex flex-col items-center gap-0.5">
                  <Camera weight="fill" size={20} color="#fff" />
                  <span
                    style={{
                      fontSize: 9,
                      color: "#fff",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                    }}
                  >
                    UPLOAD
                  </span>
                </div>
              ) : null}
            </div>

            {/* Camera badge (bottom-right pip) */}
            {!uploading && (
              <div
                style={{
                  position: "absolute",
                  bottom: -4,
                  right: -4,
                  width: 22,
                  height: 22,
                  borderRadius: 7,
                  background: "#7c3aed",
                  border: "2px solid #0e0e1a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Camera weight="fill" size={10} color="#fff" />
              </div>
            )}
          </div>

          {/* ── Company info ── */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              <h1 className="text-[22px] font-extrabold text-white tracking-tight leading-none">
                {form.name || "Your company"}
              </h1>
              {form.industry && (
                <span
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    color: "#a78bfa",
                    background: "rgba(124,58,237,0.15)",
                    border: "1px solid rgba(124,58,237,0.25)",
                  }}
                >
                  {form.industry}
                </span>
              )}
            </div>
            <p
              className="text-[13px] flex items-center gap-1.5"
              style={{ color: "rgba(255,255,255,0.38)" }}
            >
              <EnvelopeSimple size={12} />
              {company?.email}
            </p>
            {form.location && (
              <p
                className="text-[13px] flex items-center gap-1.5 mt-1"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                <MapPin size={12} />
                {form.location}
              </p>
            )}
            <p
              className="text-[11px] mt-2"
              style={{ color: "rgba(255,255,255,0.22)" }}
            >
              Click the logo to upload a new one · JPEG, PNG or WebP · max 5 MB
            </p>
          </div>

          {/* Edit badge */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium flex-shrink-0"
            style={{
              color: "rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <PencilSimple size={12} />
            Editing profile
          </div>
        </div>
      </div>

      {/* ── Form ─────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ── Section 1 · Company identity ──────────────── */}
        <SettingsSection
          icon={
            <Buildings
              weight="duotone"
              size={16}
              style={{ color: "#a78bfa" }}
            />
          }
          title="Company identity"
          subtitle="Core information shown on all your role listings"
          className="anim-2"
        >
          <Field label="Company name" required>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Acme Corp"
              className="hirex-input"
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Website">
              <div className="relative">
                <Globe
                  weight="duotone"
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                />
                <input
                  type="url"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="https://yourcompany.com"
                  className="hirex-input"
                  style={{ paddingLeft: "34px" }}
                />
              </div>
            </Field>
            <Field label="Location">
              <div className="relative">
                <MapPin
                  weight="duotone"
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                />
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Lagos, Nigeria"
                  className="hirex-input"
                  style={{ paddingLeft: "34px" }}
                />
              </div>
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Industry">
              <div className="relative">
                <Storefront
                  weight="duotone"
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                />
                <select
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                  className="hirex-input appearance-none cursor-pointer"
                  style={{ paddingLeft: "34px" }}
                >
                  <option value="">Select industry…</option>
                  {INDUSTRIES.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
            </Field>
            <Field label="Company size">
              <div className="relative">
                <Users
                  weight="duotone"
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                />
                <select
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  className="hirex-input appearance-none cursor-pointer"
                  style={{ paddingLeft: "34px" }}
                >
                  <option value="">Select size…</option>
                  {COMPANY_SIZES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </Field>
          </div>
        </SettingsSection>

        {/* ── Section 2 · About ─────────────────────────── */}
        <SettingsSection
          icon={
            <Article weight="duotone" size={16} style={{ color: "#a78bfa" }} />
          }
          title="About your company"
          subtitle="Shown to candidates browsing your open roles"
          className="anim-3"
        >
          <Field
            label="Description"
            hint="Keep it punchy — candidates spend ~8 seconds on this."
          >
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              placeholder="We build tools that help teams move faster. Founded in 2020, we're a remote-first team of 30 engineers passionate about developer experience…"
              className="hirex-input resize-y"
            />
          </Field>
        </SettingsSection>

        {/* ── Section 3 · Account ───────────────────────── */}
        <SettingsSection
          icon={
            <ShieldCheck
              weight="duotone"
              size={16}
              style={{ color: "#a78bfa" }}
            />
          }
          title="Account"
          subtitle="Your login credentials and security settings"
          className="anim-4"
        >
          <Field label="Email address">
            <div className="relative">
              <EnvelopeSimple
                weight="duotone"
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "rgba(255,255,255,0.2)" }}
              />
              <input
                type="email"
                value={company?.email ?? ""}
                disabled
                className="hirex-input"
                style={{ paddingLeft: "34px" }}
              />
              <div
                className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 rounded-lg"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <Lock
                  weight="fill"
                  size={10}
                  style={{ color: "rgba(255,255,255,0.3)" }}
                />
                <span
                  className="text-[10px] font-semibold"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  fixed
                </span>
              </div>
            </div>
            <p
              className="text-[12px] mt-2"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              Email address cannot be changed. Contact support if you need to
              update it.
            </p>
          </Field>
        </SettingsSection>

        {/* ── Save button ───────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1 anim-4">
          <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            Changes are applied immediately after saving.
          </p>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2.5 px-7 py-3 rounded-xl text-[14px] font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: loading
                ? "rgba(124,58,237,0.5)"
                : "linear-gradient(135deg,#7c3aed 0%,#6d28d9 100%)",
              boxShadow: loading
                ? "none"
                : "0 0 24px rgba(124,58,237,0.35), 0 4px 12px rgba(0,0,0,0.3)",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 0 32px rgba(124,58,237,0.55), 0 4px 16px rgba(0,0,0,0.4)";
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 0 24px rgba(124,58,237,0.35), 0 4px 12px rgba(0,0,0,0.3)";
                (e.currentTarget as HTMLElement).style.transform = "";
              }
            }}
          >
            {loading ? (
              <>
                <CircleNotch size={15} className="animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <FloppyDisk weight="fill" size={15} />
                Save changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   SETTINGS SECTION CARD
════════════════════════════════════════════════════════════ */
function SettingsSection({
  icon,
  title,
  subtitle,
  children,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl overflow-hidden ${className ?? ""}`}
      style={{
        background: "#111118",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="flex items-center gap-3 px-6 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: "rgba(124,58,237,0.15)",
            border: "1px solid rgba(124,58,237,0.2)",
          }}
        >
          {icon}
        </div>
        <div>
          <p className="text-[14px] font-semibold text-white leading-tight">
            {title}
          </p>
          <p
            className="text-[12px] mt-0.5"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            {subtitle}
          </p>
        </div>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   FIELD
════════════════════════════════════════════════════════════ */
function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        className="block text-[13px] font-medium"
        style={{ color: "rgba(255,255,255,0.65)" }}
      >
        {label}
        {required && (
          <span className="ml-0.5" style={{ color: "#a78bfa" }}>
            *
          </span>
        )}
      </label>
      {hint && (
        <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.28)" }}>
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   SKELETON
════════════════════════════════════════════════════════════ */
function Bone({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      className="animate-pulse rounded-xl"
      style={{ background: "rgba(255,255,255,0.06)", ...style }}
    />
  );
}

function SkeletonPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div
        className="rounded-2xl p-7 flex items-center gap-5"
        style={{
          background: "#0e0e1a",
          border: "1px solid rgba(124,58,237,0.12)",
        }}
      >
        <Bone
          style={{ width: 72, height: 72, borderRadius: 18, flexShrink: 0 }}
        />
        <div className="flex-1 space-y-2.5">
          <Bone style={{ width: 180, height: 22 }} />
          <Bone style={{ width: 220, height: 14 }} />
          <Bone style={{ width: 160, height: 11 }} />
        </div>
      </div>
      {[5, 3, 1].map((_, ci) => (
        <div
          key={ci}
          className="rounded-2xl overflow-hidden"
          style={{
            background: "#111118",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="flex items-center gap-3 px-6 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <Bone style={{ width: 28, height: 28, borderRadius: 8 }} />
            <div className="space-y-1.5">
              <Bone style={{ width: 120, height: 14 }} />
              <Bone style={{ width: 180, height: 11 }} />
            </div>
          </div>
          <div className="p-6 space-y-4">
            {[...Array(ci === 0 ? 3 : ci === 1 ? 2 : 1)].map((__, i) => (
              <Bone key={i} style={{ width: "100%", height: 44 }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
