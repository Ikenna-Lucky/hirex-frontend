"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  Article,
  Buildings,
  Camera,
  CheckCircle,
  CircleNotch,
  EnvelopeSimple,
  FloppyDisk,
  Globe,
  Lock,
  MapPin,
  ShieldCheck,
  Storefront,
  Users,
  WarningCircle,
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
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "500+", label: "500+ employees" },
];

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
      <label className="block text-[12px] font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}
        {required && <span className="ml-1 text-violet-300">*</span>}
      </label>
      {children}
      {hint && <p className="text-[12px] leading-5 text-slate-600">{hint}</p>}
    </div>
  );
}

function InputShell({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-11 items-center gap-3 rounded-lg border border-white/[0.07] bg-white/[0.035] px-3.5 transition-within focus-within:border-violet-400/30 focus-within:bg-white/[0.055]">
      <div className="flex-shrink-0 text-slate-600">{icon}</div>
      {children}
    </div>
  );
}

function Section({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-white/[0.07] bg-[#0d0f16] anim-2">
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-4">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-400/10 text-violet-300">
          {icon}
        </div>
        <div className="min-w-0">
          <h2 className="text-[15px] font-bold text-white">{title}</h2>
          <p className="mt-0.5 text-[12px] text-slate-600">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-5 p-5">{children}</div>
    </section>
  );
}

function Bone({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`animate-pulse rounded-lg ${className ?? ""}`}
      style={{ background: "rgba(255,255,255,0.06)", ...style }}
    />
  );
}

function SkeletonPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Bone className="h-7 w-32" />
          <Bone className="h-4 w-64" />
        </div>
        <Bone className="h-10 w-32" />
      </div>
      <Bone className="h-32 w-full" />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <Bone className="h-[340px]" />
          <Bone className="h-[190px]" />
        </div>
        <Bone className="h-[260px]" />
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resending, setResending] = useState(false);
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
    const stored = getStoredCompany();
    if (stored?.logoUrl) setLogoUrl(stored.logoUrl);
    if (stored) setIsVerified(!!stored.isVerified);

    authApi
      .me()
      .then((res) => {
        const current = res.data.data?.company ?? res.data.data;
        setForm({
          name: current.name ?? "",
          website: current.website ?? "",
          industry: current.industry ?? "",
          size: current.size ?? "",
          location: current.location ?? "",
          description: current.description ?? "",
        });
        if (current.logoUrl) setLogoUrl(current.logoUrl);
        setIsVerified(!!current.isVerified);
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
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleLogoChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Please upload a JPEG, PNG, or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB.");
      return;
    }

    setUploading(true);
    setImgError(false);

    const preview = URL.createObjectURL(file);
    setLogoUrl(preview);

    try {
      const formData = new FormData();
      formData.append("logo", file);
      const res = await authApi.uploadLogo(formData);
      const newUrl: string = res.data.data.logoUrl;

      setLogoUrl(newUrl);
      const stored = getStoredCompany();
      if (stored) setStoredCompany({ ...stored, logoUrl: newUrl });

      toast.success("Logo updated.");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
      if (stored) {
        setStoredCompany({
          ...stored,
          name: form.name,
          industry: form.industry || null,
        });
      }

      toast.success("Profile updated.");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message ?? "Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResending(true);
    try {
      await authApi.resendVerification();
      toast.success("Verification email sent. Check your inbox.");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(
        error.response?.data?.message ?? "Failed to send verification email.",
      );
    } finally {
      setResending(false);
    }
  };

  if (fetching) return <SkeletonPage />;

  const initials = (form.name || company?.name || "?")
    .split(" ")
    .slice(0, 2)
    .map((word: string) => word[0])
    .join("")
    .toUpperCase();
  const showImage = logoUrl && !imgError;

  return (
    <div className="space-y-5">
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleLogoChange}
      />

      <div className="flex flex-col justify-between gap-4 anim-1 sm:flex-row sm:items-start">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-300">
            Settings
          </p>
          <h1 className="mt-2 text-[26px] font-black leading-tight tracking-tight text-white">
            Company workspace
          </h1>
          <p className="mt-1 text-[14px] text-slate-500">
            Keep your public company profile and account access details current.
          </p>
        </div>
        <div
          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[12px] font-bold ${
            isVerified
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
              : "border-amber-400/20 bg-amber-400/10 text-amber-300"
          }`}
        >
          {isVerified ? (
            <CheckCircle weight="fill" size={15} />
          ) : (
            <WarningCircle weight="fill" size={15} />
          )}
          {isVerified ? "Email verified" : "Email unverified"}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <section className="rounded-lg border border-white/[0.07] bg-[#0d0f16] p-5 anim-1">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="group relative flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/[0.08] bg-violet-600 text-[22px] font-black text-white transition hover:border-violet-300/30 disabled:cursor-not-allowed disabled:opacity-70"
              aria-label="Upload company logo"
            >
              {showImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                initials
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 transition group-hover:opacity-100">
                {uploading ? (
                  <CircleNotch size={18} className="animate-spin" />
                ) : (
                  <Camera weight="fill" size={18} />
                )}
              </span>
            </button>

            <div className="min-w-0 flex-1">
              <p className="text-[17px] font-bold text-white">
                {form.name || company?.name || "Company profile"}
              </p>
              <p className="mt-1 max-w-2xl text-[13px] leading-6 text-slate-500">
                This profile appears around your workspace and can support your
                public job posts when candidates apply.
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            <Section
              icon={<Buildings weight="duotone" size={18} />}
              title="Company details"
              subtitle="Core information for your hiring workspace."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Company name" required>
                  <InputShell icon={<Storefront weight="duotone" size={16} />}>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="h-11 w-full bg-transparent text-[14px] text-white outline-none placeholder:text-slate-700"
                      placeholder="TechNova Solutions"
                    />
                  </InputShell>
                </Field>

                <Field label="Website">
                  <InputShell icon={<Globe weight="duotone" size={16} />}>
                    <input
                      name="website"
                      value={form.website}
                      onChange={handleChange}
                      className="h-11 w-full bg-transparent text-[14px] text-white outline-none placeholder:text-slate-700"
                      placeholder="https://company.com"
                    />
                  </InputShell>
                </Field>

                <Field label="Industry">
                  <InputShell icon={<Buildings weight="duotone" size={16} />}>
                    <select
                      name="industry"
                      value={form.industry}
                      onChange={handleChange}
                      className="h-11 w-full bg-transparent text-[14px] text-white outline-none"
                    >
                      <option value="" className="bg-[#0d0f16]">
                        Select industry
                      </option>
                      {INDUSTRIES.map((industry) => (
                        <option
                          key={industry}
                          value={industry}
                          className="bg-[#0d0f16]"
                        >
                          {industry}
                        </option>
                      ))}
                    </select>
                  </InputShell>
                </Field>

                <Field label="Company size">
                  <InputShell icon={<Users weight="duotone" size={16} />}>
                    <select
                      name="size"
                      value={form.size}
                      onChange={handleChange}
                      className="h-11 w-full bg-transparent text-[14px] text-white outline-none"
                    >
                      <option value="" className="bg-[#0d0f16]">
                        Select size
                      </option>
                      {COMPANY_SIZES.map((size) => (
                        <option
                          key={size.value}
                          value={size.value}
                          className="bg-[#0d0f16]"
                        >
                          {size.label}
                        </option>
                      ))}
                    </select>
                  </InputShell>
                </Field>
              </div>

              <Field label="Location">
                <InputShell icon={<MapPin weight="duotone" size={16} />}>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="h-11 w-full bg-transparent text-[14px] text-white outline-none placeholder:text-slate-700"
                    placeholder="Lagos, Nigeria"
                  />
                </InputShell>
              </Field>

              <Field label="Company description">
                <div className="rounded-lg border border-white/[0.07] bg-white/[0.035] p-3.5 transition-within focus-within:border-violet-400/30 focus-within:bg-white/[0.055]">
                  <div className="mb-2 flex items-center gap-2 text-slate-600">
                    <Article weight="duotone" size={16} />
                    <span className="text-[12px] font-semibold">
                      Public summary
                    </span>
                  </div>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    className="w-full resize-none bg-transparent text-[14px] leading-6 text-white outline-none placeholder:text-slate-700"
                    placeholder="A short description candidates can recognize."
                  />
                </div>
              </Field>
            </Section>

            <Section
              icon={<EnvelopeSimple weight="duotone" size={18} />}
              title="Account email"
              subtitle="Your sign-in email and verification status."
            >
              <Field
                label="Work email"
                hint="Email address cannot be changed here. Contact support if you need to update it."
              >
                <InputShell icon={<Lock weight="duotone" size={16} />}>
                  <input
                    value={company?.email ?? ""}
                    readOnly
                    className="h-11 w-full cursor-not-allowed bg-transparent text-[14px] text-slate-500 outline-none"
                  />
                </InputShell>
              </Field>

              {isVerified ? (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-[13px] font-bold text-emerald-300">
                  <CheckCircle weight="fill" size={16} />
                  Your email is verified
                </div>
              ) : (
                <div className="flex flex-col gap-3 rounded-lg border border-amber-400/20 bg-amber-400/[0.08] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-[13px] font-bold text-amber-300">
                    <WarningCircle weight="fill" size={16} />
                    Your email is not verified yet
                  </div>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resending}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.05] px-4 py-2 text-[12px] font-bold text-white transition hover:bg-white/[0.075] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {resending && (
                      <CircleNotch size={13} className="animate-spin" />
                    )}
                    {resending ? "Sending" : "Resend verification"}
                  </button>
                </div>
              )}
            </Section>
          </div>

          <aside className="space-y-5">
            <Section
              icon={<ShieldCheck weight="duotone" size={18} />}
              title="Workspace health"
              subtitle="Quick checks for your hiring account."
            >
              <div className="space-y-3">
                <HealthRow
                  label="Company profile"
                  active={!!form.name.trim()}
                  detail={form.name.trim() ? "Ready" : "Company name needed"}
                />
                <HealthRow
                  label="Logo"
                  active={!!showImage}
                  detail={showImage ? "Uploaded" : "Using initials"}
                />
                <HealthRow
                  label="Email"
                  active={isVerified}
                  detail={isVerified ? "Verified" : "Needs verification"}
                />
              </div>
            </Section>
          </aside>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-5 anim-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-slate-600">
            Changes are applied after saving.
          </p>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <CircleNotch size={15} className="animate-spin" />
            ) : (
              <FloppyDisk weight="fill" size={15} />
            )}
            {loading ? "Saving" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function HealthRow({
  label,
  detail,
  active,
}: {
  label: string;
  detail: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-3">
      <div>
        <p className="text-[13px] font-bold text-slate-200">{label}</p>
        <p className="mt-0.5 text-[12px] text-slate-600">{detail}</p>
      </div>
      <span
        className={`h-2 w-2 rounded-full ${
          active ? "bg-emerald-300 shadow-[0_0_8px_#34d399]" : "bg-slate-700"
        }`}
      />
    </div>
  );
}
