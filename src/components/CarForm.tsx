import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Car, FuelType } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
const fuelTypes: FuelType[] = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'LPG', 'CNG'];
const carFormSchema = z.object({
  vin: z.string().min(11, "VIN must be at least 11 characters").max(17, "VIN must be at most 17 characters"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  model: z.string().min(1, "Model is required"),
  year: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().int().min(1900, "Year must be after 1900").max(new Date().getFullYear() + 1, "Year cannot be in the future")
  ),
  fuelType: z.enum(fuelTypes),
  inspectionValidUntil: z.date().optional(),
  insuranceValidUntil: z.date().optional(),
  primaryPhotoUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});
type CarFormValues = z.infer<typeof carFormSchema>;
interface CarFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Car>) => Promise<void>;
  initialData?: Car | null;
}
const CarForm: React.FC<CarFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const form = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      vin: '',
      manufacturer: '',
      model: '',
      year: new Date().getFullYear(),
      fuelType: 'Gasoline',
      inspectionValidUntil: undefined,
      insuranceValidUntil: undefined,
      primaryPhotoUrl: '',
    },
  });
  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          vin: initialData.vin,
          manufacturer: initialData.manufacturer,
          model: initialData.model,
          year: initialData.year,
          fuelType: initialData.fuelType,
          inspectionValidUntil: initialData.inspectionValidUntil ? new Date(initialData.inspectionValidUntil) : undefined,
          insuranceValidUntil: initialData.insuranceValidUntil ? new Date(initialData.insuranceValidUntil) : undefined,
          primaryPhotoUrl: initialData.primaryPhotoUrl || '',
        });
      } else {
        form.reset({
          vin: '',
          manufacturer: '',
          model: '',
          year: new Date().getFullYear(),
          fuelType: 'Gasoline',
          inspectionValidUntil: undefined,
          insuranceValidUntil: undefined,
          primaryPhotoUrl: '',
        });
      }
    }
  }, [initialData, form, isOpen]);
  const handleFormSubmit = async (values: CarFormValues) => {
    const submissionData: Partial<Car> = {
      ...values,
      inspectionValidUntil: values.inspectionValidUntil?.toISOString(),
      insuranceValidUntil: values.insuranceValidUntil?.toISOString(),
    };
    await onSubmit(submissionData);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Car' : 'Add New Car'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Update the details of your vehicle.' : 'Fill in the details for the new vehicle in your fleet.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="vin" render={({ field }) => (
                <FormItem>
                  <FormLabel>VIN</FormLabel>
                  <FormControl><Input placeholder="WBA123..." {...field} disabled={!!initialData} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="manufacturer" render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturer</FormLabel>
                  <FormControl><Input placeholder="BMW" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="model" render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl><Input placeholder="M3" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="year" render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl><Input type="number" placeholder="2023" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="fuelType" render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuel Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select fuel type" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {fuelTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="inspectionValidUntil" render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Inspection Valid Until</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="insuranceValidUntil" render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Insurance Valid Until</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="primaryPhotoUrl" render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Photo URL</FormLabel>
                <FormControl><Input placeholder="https://images.unsplash.com/..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Car'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default CarForm;