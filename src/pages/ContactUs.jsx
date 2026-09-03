import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, Clock, MapPin } from "lucide-react";
import { contactSchema } from "../schemas/contactSchema";
import { ContentPage } from "../components/layout/ContentPage";
import { Button, Spinner } from "../components/common/Common";

const contactDetails = [
  { icon: Mail, label: "Email", value: "hello@waypoint.travel", href: "mailto:hello@waypoint.travel" },
  { icon: Phone, label: "Phone", value: "+1 (555) 000-0000", href: "tel:+15550000000" },
  { icon: Clock, label: "Hours", value: "Mon–Fri, 9am–6pm UTC", href: null },
  { icon: MapPin, label: "Based in", value: "Kalmeshwar, Karnataka, India", href: null },
];

export function ContactUs() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data) {
    await new Promise((res) => setTimeout(res, 800));
    console.log("[contact]", data);
    setSubmitted(true);
  }

  return (
    <ContentPage
      title="Contact us"
      subtitle="Have a question, a bug to report, or a destination you'd like to see added? Send us a line."
    >
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-label="Contact form">
          {submitted ? (
            <div className="flex flex-col items-center justify-center gap-4 border border-[var(--color-line)] py-20 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-harbor)]/10">
                <Mail className="h-6 w-6 text-[var(--color-harbor)]" aria-hidden="true" />
              </div>
              <h2 className="font-display text-2xl">Message sent</h2>
              <p className="max-w-sm text-sm text-[var(--color-ink-soft)]">
                Thanks for reaching out. We'll be in touch within one business day.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="coord mb-1 block text-[var(--color-ink-soft)]">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    {...register("name")}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className="w-full border border-[var(--color-line)] px-3 py-2 text-[var(--color-ink)] placeholder:text-[var(--color-ink-soft)]/40"
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1 text-xs text-[var(--color-warn)]">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="coord mb-1 block text-[var(--color-ink-soft)]">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className="w-full border border-[var(--color-line)] px-3 py-2 text-[var(--color-ink)] placeholder:text-[var(--color-ink-soft)]/40"
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-xs text-[var(--color-warn)]">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="coord mb-1 block text-[var(--color-ink-soft)]">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  placeholder="What's this about?"
                  {...register("subject")}
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={errors.subject ? "subject-error" : undefined}
                  className="w-full border border-[var(--color-line)] px-3 py-2 text-[var(--color-ink)] placeholder:text-[var(--color-ink-soft)]/40"
                />
                {errors.subject && (
                  <p id="subject-error" className="mt-1 text-xs text-[var(--color-warn)]">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="coord mb-1 block text-[var(--color-ink-soft)]">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Tell us what's on your mind…"
                  {...register("message")}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className="w-full border border-[var(--color-line)] px-3 py-2 text-[var(--color-ink)] placeholder:text-[var(--color-ink-soft)]/40"
                />
                {errors.message && (
                  <p id="message-error" className="mt-1 text-xs text-[var(--color-warn)]">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <Button type="submit" variant="route" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting && <Spinner className="h-4 w-4" />}
                {isSubmitting ? "Sending…" : "Send message"}
              </Button>
            </>
          )}
        </form>

        <aside>
          <ul className="space-y-4 text-sm">
            {contactDetails.map((d) => {
              const Icon = d.icon;
              const value = d.href ? (
                <a href={d.href} className="text-[var(--color-route)] hover:underline">
                  {d.value}
                </a>
              ) : (
                d.value
              );
              return (
                <li key={d.label} className="flex gap-3">
                  <Icon className="h-4 w-4 shrink-0 text-[var(--color-ink-soft)]" aria-hidden="true" />
                  <span className="coord text-[var(--color-ink-soft)]">{d.label}</span>
                  <span className="ml-auto text-right text-[var(--color-ink)]">{value}</span>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </ContentPage>
  );
}
