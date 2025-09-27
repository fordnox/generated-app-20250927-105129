import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Car, Expense, Document as DocType, Photo } from '@shared/types';
import { api } from '@/lib/api-client';
import Layout from '@/components/Layout';
import { Toaster, toast } from 'sonner';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, CarIcon, Fuel, Gauge, Gem, Grip, Hash, MapPin, Users, Wrench, PlusCircle, Trash2, Edit, Star, FileText, DollarSign, Image as ImageIcon, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, isValid } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import CarForm from '@/components/CarForm';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import ExpenseForm from '@/components/forms/ExpenseForm';
import DocumentForm from '@/components/forms/DocumentForm';
import PhotoForm from '@/components/forms/PhotoForm';
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};
const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | number | null }) => {
  if (value === null || value === undefined || value === '') return null;
  return (
    <motion.div variants={itemVariants} className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-md font-semibold text-foreground">{value}</p>
      </div>
    </motion.div>
  );
};
const EmptyState = ({ icon: Icon, title, description, onActionClick }: { icon: React.ElementType; title: string; description: string; onActionClick: () => void; }) => (
  <div className="text-center py-16">
    <Icon className="mx-auto h-12 w-12 text-muted-foreground" />
    <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
    <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    <div className="mt-6">
      <Button onClick={onActionClick}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add First Entry
      </Button>
    </div>
  </div>
);
const CarDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [modal, setModal] = useState<'expense' | 'document' | 'photo' | null>(null);
  const fetchCar = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const fetchedCar = await api<Car>(`/api/cars/${id}`);
      setCar(fetchedCar);
    } catch (error) {
      toast.error('Failed to fetch car details.');
      console.error(error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);
  useEffect(() => {
    fetchCar();
  }, [fetchCar]);
  const handleUpdateCar = async (data: Partial<Car>) => {
    if (!id) return;
    try {
      await api<Car>(`/api/cars/${id}`, { method: 'PUT', body: JSON.stringify(data) });
      toast.success('Vehicle details updated!');
      setEditModalOpen(false);
      fetchCar();
    } catch (error: any) {
      toast.error(`Update failed: ${error.message}`);
    }
  };
  const handleDeleteCar = async () => {
    if (!id) return;
    try {
      await api(`/api/cars/${id}`, { method: 'DELETE' });
      toast.success('Vehicle deleted successfully.');
      navigate('/');
    } catch (error: any) {
      toast.error(`Deletion failed: ${error.message}`);
    }
  };
  const handleAddExpense = async (data: Omit<Expense, 'id' | 'carId'>) => {
    if (!id) return;
    try {
      await api(`/api/cars/${id}/expenses`, { method: 'POST', body: JSON.stringify(data) });
      toast.success('Expense added.');
      setModal(null);
      fetchCar();
    } catch (error: any) {
      toast.error(`Failed to add expense: ${error.message}`);
    }
  };
  const handleDeleteExpense = async (expenseId: string) => {
    if (!id) return;
    try {
      await api(`/api/cars/${id}/expenses/${expenseId}`, { method: 'DELETE' });
      toast.success('Expense deleted.');
      fetchCar();
    } catch (error: any) {
      toast.error(`Failed to delete expense: ${error.message}`);
    }
  };
  const handleAddDocument = async (data: Omit<DocType, 'id' | 'carId' | 'uploadedAt'>) => {
    if (!id) return;
    try {
      await api(`/api/cars/${id}/documents`, { method: 'POST', body: JSON.stringify(data) });
      toast.success('Document added.');
      setModal(null);
      fetchCar();
    } catch (error: any) {
      toast.error(`Failed to add document: ${error.message}`);
    }
  };
  const handleDeleteDocument = async (docId: string) => {
    if (!id) return;
    try {
      await api(`/api/cars/${id}/documents/${docId}`, { method: 'DELETE' });
      toast.success('Document deleted.');
      fetchCar();
    } catch (error: any) {
      toast.error(`Failed to delete document: ${error.message}`);
    }
  };
  const handleAddPhoto = async (data: Omit<Photo, 'id' | 'carId' | 'uploadedAt'>) => {
    if (!id) return;
    try {
      await api(`/api/cars/${id}/photos`, { method: 'POST', body: JSON.stringify(data) });
      toast.success('Photo added.');
      setModal(null);
      fetchCar();
    } catch (error: any) {
      toast.error(`Failed to add photo: ${error.message}`);
    }
  };
  const handleDeletePhoto = async (photoId: string) => {
    if (!id) return;
    try {
      await api(`/api/cars/${id}/photos/${photoId}`, { method: 'DELETE' });
      toast.success('Photo deleted.');
      fetchCar();
    } catch (error: any) {
      toast.error(`Failed to delete photo: ${error.message}`);
    }
  };
  const handleSetPrimaryPhoto = async (photoId: string) => {
    if (!id) return;
    try {
      await api(`/api/cars/${id}/photos/${photoId}/set-primary`, { method: 'PUT' });
      toast.success('Primary photo updated.');
      fetchCar();
    } catch (error: any) {
      toast.error(`Failed to set primary photo: ${error.message}`);
    }
  };
  if (isLoading) {
    return (
      <Layout>
        <Skeleton className="h-8 w-1/4 mb-8" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </Layout>
    );
  }
  if (!car) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">Car not found</h2>
          <p className="text-muted-foreground mt-2">The vehicle you are looking for does not exist.</p>
          <Button asChild className="mt-6">
            <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'PPP') : 'N/A';
  };
  return (
    <Layout>
      <Toaster richColors position="top-right" />
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{car.manufacturer} {car.model}</h1>
          <p className="text-lg text-muted-foreground">{car.year}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setEditModalOpen(true)}><Edit className="mr-2 h-4 w-4" /> Edit</Button>
          <Button variant="destructive" onClick={() => setDeleteConfirmOpen(true)}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader><CardTitle>Technical Specifications</CardTitle></CardHeader>
                <CardContent>
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <DetailItem icon={Gem} label="VIN" value={car.vin} />
                    <DetailItem icon={Wrench} label="Manufacturer" value={car.manufacturer} />
                    <DetailItem icon={CarIcon} label="Model" value={car.model} />
                    <DetailItem icon={Calendar} label="Year" value={car.year} />
                    <DetailItem icon={Fuel} label="Fuel Type" value={car.fuelType} />
                    <DetailItem icon={Grip} label="Engine Capacity" value={car.engineCapacity ? `${car.engineCapacity} cm³` : 'N/A'} />
                    <DetailItem icon={Gauge} label="Engine Power" value={car.enginePower ? `${car.enginePower} HP / ${car.enginePowerKW} kW` : 'N/A'} />
                    <DetailItem icon={Users} label="Previous Owners" value={car.previousOwnersCount ?? 0} />
                    <DetailItem icon={MapPin} label="Country of Origin" value={car.countryOfOrigin} />
                    <DetailItem icon={MapPin} label="Country of Manufacture" value={car.countryOfManufacture} />
                    <DetailItem icon={Hash} label="Registration #" value={car.registrationDocumentNumber} />
                  </motion.div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="expenses" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Expenses</CardTitle>
                  <Button size="sm" onClick={() => setModal('expense')}><PlusCircle className="mr-2 h-4 w-4" /> Add Expense</Button>
                </CardHeader>
                <CardContent>
                  {car.expenses.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {car.expenses.map(exp => (
                          <TableRow key={exp.id}>
                            <TableCell className="font-medium">{exp.title}</TableCell>
                            <TableCell><Badge variant="secondary">{exp.category}</Badge></TableCell>
                            <TableCell>{formatDate(exp.date)}</TableCell>
                            <TableCell className="text-right">${exp.amount.toFixed(2)}</TableCell>
                            <TableCell><Button variant="ghost" size="icon" onClick={() => handleDeleteExpense(exp.id)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : <EmptyState icon={DollarSign} title="No Expenses Recorded" description="Keep track of service, fuel, and other costs." onActionClick={() => setModal('expense')} />}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="documents" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Documents</CardTitle>
                  <Button size="sm" onClick={() => setModal('document')}><PlusCircle className="mr-2 h-4 w-4" /> Add Document</Button>
                </CardHeader>
                <CardContent>
                  {car.documents.length > 0 ? (
                    <div className="space-y-2">
                      {car.documents.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between rounded-md border p-3">
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 font-medium text-primary hover:underline">
                            <FileText className="h-5 w-5" /> {doc.name}
                          </a>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteDocument(doc.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      ))}
                    </div>
                  ) : <EmptyState icon={FolderOpen} title="No Documents Found" description="Upload and manage important vehicle documents." onActionClick={() => setModal('document')} />}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="photos" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Photo Gallery</CardTitle>
                  <Button size="sm" onClick={() => setModal('photo')}><PlusCircle className="mr-2 h-4 w-4" /> Add Photo</Button>
                </CardHeader>
                <CardContent>
                  {car.photos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {car.photos.map(photo => (
                        <div key={photo.id} className="relative group aspect-w-16 aspect-h-9">
                          <img src={photo.url} alt="Vehicle" className="rounded-md object-cover w-full h-full" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            {!photo.isPrimary && <Button size="icon" variant="outline" onClick={() => handleSetPrimaryPhoto(photo.id)}><Star className="h-4 w-4" /></Button>}
                            <Button size="icon" variant="destructive" onClick={() => handleDeletePhoto(photo.id)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                          {photo.isPrimary && <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1.5"><Star className="h-4 w-4" /></div>}
                        </div>
                      ))}
                    </div>
                  ) : <EmptyState icon={ImageIcon} title="No Photos Available" description="Create a beautiful gallery for your vehicle." onActionClick={() => setModal('photo')} />}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Key Dates</CardTitle></CardHeader>
            <CardContent>
              <motion.div
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <DetailItem icon={Calendar} label="Technical Inspection" value={formatDate(car.inspectionValidUntil)} />
                <DetailItem icon={Calendar} label="Insurance" value={formatDate(car.insuranceValidUntil)} />
                <DetailItem icon={Calendar} label="Casco Insurance" value={formatDate(car.cascoValidUntil)} />
                <DetailItem icon={Calendar} label="Purchase Date" value={formatDate(car.purchaseDate)} />
              </motion.div>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
             <CardHeader><CardTitle>Primary Photo</CardTitle></CardHeader>
             <CardContent>
                <img
                    src={car.primaryPhotoUrl || `https://via.placeholder.com/400x225/0000FF/FFFFFF?text=${car.manufacturer}`}
                    alt={`${car.manufacturer} ${car.model}`}
                    className="object-cover w-full h-auto rounded-lg"
                />
             </CardContent>
          </Card>
        </div>
      </div>
      <CarForm isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} onSubmit={handleUpdateCar} initialData={car} />
      <ConfirmationDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteCar}
        title="Are you sure?"
        description="This action cannot be undone. This will permanently delete the vehicle and all its associated data."
        confirmText="Delete"
      />
      <ExpenseForm isOpen={modal === 'expense'} onClose={() => setModal(null)} onSubmit={handleAddExpense} />
      <DocumentForm isOpen={modal === 'document'} onClose={() => setModal(null)} onSubmit={handleAddDocument} />
      <PhotoForm isOpen={modal === 'photo'} onClose={() => setModal(null)} onSubmit={handleAddPhoto} />
    </Layout>
  );
};
export default CarDetailPage;