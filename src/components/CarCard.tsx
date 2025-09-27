import { Car as CarType } from '@shared/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ShieldCheck, AlertTriangle } from 'lucide-react';
import { differenceInDays, format, formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { AspectRatio } from '@/components/ui/aspect-ratio';
interface CarCardProps {
  car: CarType;
}
type DeadlineStatus = 'expired' | 'soon' | 'ok';
const getDeadlineStatus = (date?: string): { status: DeadlineStatus; days: number } => {
  if (!date) return { status: 'ok', days: Infinity };
  const daysUntil = differenceInDays(new Date(date), new Date());
  if (daysUntil < 0) return { status: 'expired', days: daysUntil };
  if (daysUntil < 30) return { status: 'soon', days: daysUntil };
  return { status: 'ok', days: daysUntil };
};
const DeadlineBadge = ({ date, label, icon: Icon }: { date?: string; label: string; icon: React.ElementType }) => {
  if (!date) return null;
  const { status, days } = getDeadlineStatus(date);
  const variant = status === 'expired' ? 'destructive' : status === 'soon' ? 'secondary' : 'default';
  const text = status === 'expired' ? 'Expired' : status === 'soon' ? `in ${days}d` : format(new Date(date), 'MMM yyyy');
  return (
    <Badge variant={variant} className="flex items-center gap-1.5 text-xs">
      <Icon className="h-3 w-3" />
      <span>{label}: {text}</span>
    </Badge>
  );
};
const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const inspection = getDeadlineStatus(car.inspectionValidUntil);
  const insurance = getDeadlineStatus(car.insuranceValidUntil);
  const mostUrgentStatus = [inspection, insurance].sort((a, b) => a.days - b.days)[0];
  const alertStatus = mostUrgentStatus.status;
  const handleAlertHover = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const messages = [];
    if (car.inspectionValidUntil) {
      if (inspection.status === 'expired') messages.push(`Inspection expired ${formatDistanceToNow(new Date(car.inspectionValidUntil), { addSuffix: true })}.`);
      else if (inspection.status === 'soon') messages.push(`Inspection expires in ${inspection.days} days.`);
    }
    if (car.insuranceValidUntil) {
      if (insurance.status === 'expired') messages.push(`Insurance expired ${formatDistanceToNow(new Date(car.insuranceValidUntil), { addSuffix: true })}.`);
      else if (insurance.status === 'soon') messages.push(`Insurance expires in ${insurance.days} days.`);
    }
    if (messages.length > 0) {
      toast.warning(messages.join(' '), {
        position: 'bottom-center',
        duration: 4000,
      });
    }
  };
  return (
    <Link to={`/cars/${car.id}`} className="block group">
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 ease-in-out group-hover:shadow-lg group-hover:-translate-y-1 relative">
        {alertStatus !== 'ok' && (
          <div
            onMouseEnter={handleAlertHover}
            className={cn(
              "absolute top-0 left-0 right-0 z-10 p-2 text-xs font-semibold flex items-center justify-center gap-2",
              alertStatus === 'expired' ? "bg-red-500 text-white" : "bg-yellow-400 text-black"
            )}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>{alertStatus === 'expired' ? 'Action Required' : 'Expires Soon'}</span>
          </div>
        )}
        <AspectRatio ratio={16 / 9}>
          <img
            src={car.primaryPhotoUrl || `https://via.placeholder.com/400x225/0000FF/FFFFFF?text=${car.manufacturer}`}
            alt={`${car.manufacturer} ${car.model}`}
            className="object-cover w-full h-full"
          />
        </AspectRatio>
        <CardHeader className={cn(alertStatus !== 'ok' && 'pt-12')}>
          <CardTitle className="text-lg font-bold tracking-tight">{car.manufacturer} {car.model}</CardTitle>
          <p className="text-sm text-muted-foreground">{car.year}</p>
        </CardHeader>
        <CardContent className="flex-grow">
          {/* Content can be added here if needed */}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          <DeadlineBadge date={car.inspectionValidUntil} label="Inspection" icon={Calendar} />
          <DeadlineBadge date={car.insuranceValidUntil} label="Insurance" icon={ShieldCheck} />
        </CardFooter>
      </Card>
    </Link>
  );
};
export default CarCard;