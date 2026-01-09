import {
  Shield,
  Package,
  Heart,
  Grid3x3,
  Lock,
} from 'lucide-react';

export const HubIcon = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  switch (name) {
    case 'shield':
      return <Shield className={className} />;
    case 'package':
      return <Package className={className} />;
    case 'heart':
      return <Heart className={className} />;
    case 'grid':
      return <Grid3x3 className={className} />;
    case 'lock':
      return <Lock className={className} />;
    default:
      return <Shield className={className} />;
  }
};
