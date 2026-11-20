import { Button } from "@/components/ui/Button";
import { logoutAction } from "@/features/auth/actions/logout";
import { AUTH_COPY } from "@/features/auth/lib/copy";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="ghost" size="sm">
        {AUTH_COPY.logoutLabel}
      </Button>
    </form>
  );
}
