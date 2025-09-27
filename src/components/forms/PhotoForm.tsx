import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Photo } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
const photoFormSchema = z.object({
  url: z.string().url("Must be a valid image URL"),
  isPrimary: z.boolean().optional().default(false),
});
type PhotoFormValues = z.infer<typeof photoFormSchema>;
interface PhotoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Photo, 'id' | 'carId' | 'uploadedAt'>) => Promise<void>;
}
const PhotoForm: React.FC<PhotoFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const form = useForm<PhotoFormValues>({
    resolver: zodResolver(photoFormSchema),
    defaultValues: {
      url: '',
      isPrimary: false,
    },
  });
  React.useEffect(() => {
    if (isOpen) {
      form.reset({ url: '', isPrimary: false });
    }
  }, [isOpen, form]);
  const handleFormSubmit = async (values: PhotoFormValues) => {
    await onSubmit(values);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Photo</DialogTitle>
          <DialogDescription>
            Add a new photo to the vehicle's gallery by providing a URL.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://images.unsplash.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPrimary"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Set as primary photo
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      This image will be shown on the dashboard card.
                    </p>
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Photo'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default PhotoForm;