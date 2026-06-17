import * as React from "react";

/**
 * The signature product card. The watch floats on a quiet surface with room
 * to breathe; brand + model hierarchy, reference, price, discreet badge.
 *
 * @startingPoint section="Product" subtitle="Floating watch product card" viewport="380x520"
 */
export interface WatchCardProps {
  /** Image URL of the watch (transparent PNG ideal). */
  image?: string;
  brand?: string;
  model?: string;
  reference?: string;
  /** Formatted price string, e.g. "€ 14.500". */
  price?: string;
  status?: "available" | "sold";
  /** Optional gold appreciation badge, e.g. "+23% em 6 meses". */
  appreciation?: string;
  /** Optional ReactNode rendered in the image bay (e.g. a placeholder visual). */
  visual?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function WatchCard(props: WatchCardProps): JSX.Element;
