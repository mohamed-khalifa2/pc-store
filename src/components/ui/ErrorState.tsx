import { EmptyState } from "@/components/ui/EmptyState";

type ErrorStateProps = {
  title?: string;
  description?: string;
};

export function ErrorState({
  title = "Something went wrong",
  description = "We could not load this content. Please try again shortly.",
}: ErrorStateProps) {
  return <EmptyState title={title} description={description} />;
}
