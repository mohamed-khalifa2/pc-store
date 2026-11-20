import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { ROUTES } from "@/lib/constants";

export default function NotFound() {
  return (
    <Container className="flex min-h-screen flex-col items-center justify-center gap-8 text-center">
      <p className="text-accent font-mono text-sm font-bold tracking-[0.3em] uppercase">404</p>
      <Heading level={1}>Page not found</Heading>
      <p className="text-surface-400 max-w-md">
        The build you are looking for is not in this inventory.
      </p>
      <LinkButton href={ROUTES.home} size="lg">
        Back to home
      </LinkButton>
    </Container>
  );
}
