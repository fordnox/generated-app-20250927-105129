import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Document } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
const documentFormSchema = z.object({
  name: z.string().min(1, "Document name is required"),
  url: z.string().url("Must be a valid URL"),
});
type DocumentFormValues = z.infer<typeof documentFormSchema>;
interface DocumentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Document, 'id' | 'carId' | 'uploadedAt'>) => Promise<void>;
  initialData?: Document | null;
}
const DocumentForm: React.FC<DocumentFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      url: initialData?.url || '',
    },
  });
  React.useEffect(() => {
    form.reset({
      name: initialData?.name || '',
      url: initialData?.url || '',
    });
  }, [initialData, form, isOpen]);
  const handleFormSubmit = async (values: DocumentFormValues) => {
    await onSubmit(values);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Document' : 'Add Document'}</DialogTitle>
          <DialogDescription>
            Link to an important document for this vehicle.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Insurance Policy" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Document'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default DocumentForm;