import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { CartPageContent } from "@/features/cart/components/CartPageContent";
import { NAV_LABELS } from "@/lib/constants";

export default function CartPage() {
  return (
    <Container className="py-16">
      <Heading level={1}>{NAV_LABELS.cart}</Heading>
      <div className="mt-12">
        <CartPageContent />
      </div>
    </Container>
  );
}
