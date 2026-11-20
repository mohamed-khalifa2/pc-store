"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Input } from "@/components/ui/Input";
import { Section } from "@/components/ui/Section";

import type { HomeSection } from "@/features/home/types";

type NewsletterSectionProps = {
  section: HomeSection;
};

export function NewsletterSection({ section }: NewsletterSectionProps) {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <Section spacing="tight">
      <Container className="rounded-card border-surface-800 bg-surface-900/60 grid gap-8 border p-8 md:grid-cols-[1fr_1fr] md:items-center md:p-12">
        <div className="space-y-3">
          <Heading level={2}>{section.title ?? "Stay in the loop"}</Heading>
          <p className="text-surface-400">
            {section.subtitle ?? "Drops, deals, and build guides. No noise."}
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              id="newsletter-email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
            />
            <Button type="submit">Join the list</Button>
          </div>
          {submitted && (
            <p aria-live="polite" className="text-accent text-sm font-bold">
              Thanks — newsletter signups are opening soon.
            </p>
          )}
        </form>
      </Container>
    </Section>
  );
}
