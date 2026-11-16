import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Backdrop } from "@/components/visual/Backdrop";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <Backdrop />
      <CustomCursor />
      <ScrollProgress />
      <div className="relative z-10">{children}</div>
    </SmoothScroll>
  );
}
