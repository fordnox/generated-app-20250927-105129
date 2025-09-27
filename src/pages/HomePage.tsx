import { useState, useEffect, useCallback } from 'react';
import { Car } from '@shared/types';
import { api } from '@/lib/api-client';
import Layout from '@/components/Layout';
import CarCard from '@/components/CarCard';
import { Button } from '@/components/ui/button';
import { PlusCircle, Car as CarIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster, toast } from 'sonner';
import CarForm from '@/components/CarForm';
import { motion, AnimatePresence } from 'framer-motion';
export function HomePage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const fetchCars = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedCars = await api<Car[]>('/api/cars');
      setCars(fetchedCars);
    } catch (error) {
      toast.error('Failed to fetch fleet data.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchCars();
  }, [fetchCars]);
  const openAddModal = () => {
    setEditingCar(null);
    setIsModalOpen(true);
  };
  const handleFormSubmit = async (data: Partial<Car>) => {
    try {
      if (editingCar) {
        await api<Car>(`/api/cars/${editingCar.id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        toast.success('Vehicle updated successfully!');
      } else {
        await api<Car>('/api/cars', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        toast.success('Vehicle added successfully!');
      }
      setIsModalOpen(false);
      setEditingCar(null);
      fetchCars();
    } catch (error: any) {
      const action = editingCar ? 'update' : 'add';
      toast.error(`Failed to ${action} vehicle: ${error.message}`);
      console.error(error);
    }
  };
  const renderSkeletons = () => (
    Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="flex flex-col space-y-3">
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <div className="space-y-2 p-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex gap-2 p-4 pt-0">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>
    ))
  );
  const renderEmptyState = () => (
    <div className="text-center col-span-full py-24">
      <CarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold text-foreground">No vehicles in your fleet</h3>
      <p className="mt-2 text-sm text-muted-foreground">Get started by adding your first car.</p>
      <div className="mt-6">
        <Button onClick={openAddModal}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add First Car
        </Button>
      </div>
    </div>
  );
  return (
    <Layout>
      <Toaster richColors position="top-right" />
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Fleet Dashboard</h1>
        <Button onClick={openAddModal}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Car
        </Button>
      </div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.05 } },
          hidden: {},
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
      >
        <AnimatePresence>
          {isLoading
            ? renderSkeletons()
            : cars.length > 0
            ? cars.map((car) => (
                <motion.div
                  key={car.id}
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1 },
                  }}
                  layout
                >
                  <CarCard car={car} />
                </motion.div>
              ))
            : renderEmptyState()}
        </AnimatePresence>
      </motion.div>
      <CarForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCar(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingCar}
      />
    </Layout>
  );
}