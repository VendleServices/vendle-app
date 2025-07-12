import { useState, useEffect } from 'react';
import { 
  Users, MapPin, Star, ClipboardCheck, Building2, 
  Image as ImageIcon, Check, X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Mock data for contractors
const CONTRACTORS = [
  {
    id: '1',
    name: 'Smith Construction',
    avatar: '🏗️',
    location: 'Los Angeles, CA',
    distance: '3.2 miles away',
    rating: 4.8,
    reviewCount: 127,
    specialty: 'Roofing & Structural Repairs',
    description: 'Family-owned business with 25+ years of experience in roofing and structural repairs. Specializing in insurance claim projects.',
    projects: [
      { id: 'p1', title: 'Roof Replacement', image: '🏠', description: 'Complete roof replacement after storm damage' },
      { id: 'p2', title: 'Structural Repair', image: '🏚️', description: 'Major structural repair after water damage' },
    ],
    reviews: [
      { id: 'r1', author: 'John D.', rating: 5, text: 'Excellent work on our roof. Finished ahead of schedule and on budget.' },
      { id: 'r2', author: 'Sarah M.', rating: 4, text: 'Professional team, quality workmanship. Highly recommend.' },
    ],
    businessInfo: {
      founded: '1997',
      employees: '15-20',
      license: 'CA-12345678',
      insurance: 'Fully insured',
      serviceArea: 'Greater Los Angeles Area',
    }
  },
  {
    id: '2',
    name: 'Elite Home Restoration',
    avatar: '🔨',
    location: 'Pasadena, CA',
    distance: '5.7 miles away',
    rating: 4.9,
    reviewCount: 93,
    specialty: 'Interior Renovation & Electrical',
    description: 'Premium home restoration services with expertise in interior renovations and electrical systems. We handle insurance claims with ease.',
    projects: [
      { id: 'p1', title: 'Kitchen Remodel', image: '🍳', description: 'Complete kitchen renovation after fire damage' },
      { id: 'p2', title: 'Electrical System Upgrade', image: '⚡', description: 'Comprehensive electrical system replacement' },
    ],
    reviews: [
      { id: 'r1', author: 'Michael T.', rating: 5, text: 'Amazing attention to detail. Our kitchen looks better than before the damage.' },
      { id: 'r2', author: 'Lisa R.', rating: 5, text: 'Excellent communication throughout the project. Very satisfied.' },
    ],
    businessInfo: {
      founded: '2005',
      employees: '10-15',
      license: 'CA-87654321',
      insurance: 'Fully insured',
      serviceArea: 'Pasadena and surrounding areas',
    }
  },
  {
    id: '3',
    name: 'BlueSky Contractors',
    avatar: '🔧',
    location: 'Glendale, CA',
    distance: '4.3 miles away',
    rating: 4.6,
    reviewCount: 78,
    specialty: 'Plumbing & HVAC Systems',
    description: 'Specialists in plumbing and HVAC repairs and installations. Experienced with insurance-funded reconstruction projects.',
    projects: [
      { id: 'p1', title: 'HVAC Replacement', image: '❄️', description: 'Full HVAC system replacement' },
      { id: 'p2', title: 'Plumbing Overhaul', image: '🚿', description: 'Complete plumbing system replacement after pipe burst' },
    ],
    reviews: [
      { id: 'r1', author: 'Robert J.', rating: 4, text: 'Professional service, fair pricing. HVAC works perfectly now.' },
      { id: 'r2', author: 'Emily K.', rating: 5, text: 'Quick response time and excellent work quality.' },
    ],
    businessInfo: {
      founded: '2010',
      employees: '8-12',
      license: 'CA-22446688',
      insurance: 'Fully insured',
      serviceArea: 'Greater Los Angeles County',
    }
  },
];

interface ContractorCardProps {
  contractor: typeof CONTRACTORS[0];
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onClick: (id: string) => void;
}

const ContractorCard = ({ contractor, isSelected, onSelect, onClick }: ContractorCardProps) => (
  <Card className={`mb-4 transition-all ${isSelected ? 'border-vendle-teal ring-1 ring-vendle-teal' : ''}`}>
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-vendle-sand text-vendle-navy text-2xl">
            {contractor.avatar}
          </div>
          <div>
            <CardTitle className="text-lg">{contractor.name}</CardTitle>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span>{contractor.location}</span>
              <span className="mx-1.5">•</span>
              <span>{contractor.distance}</span>
            </div>
          </div>
        </div>
        <div>
          <Button 
            size="sm" 
            variant={isSelected ? "default" : "outline"}
            className={isSelected ? "bg-vendle-teal hover:bg-vendle-teal/90" : "border-vendle-teal text-vendle-teal hover:text-vendle-teal/90 hover:bg-vendle-teal/10"}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(contractor.id, !isSelected);
            }}
          >
            {isSelected ? (
              <>
                <Check className="h-4 w-4 mr-1" /> Selected
              </>
            ) : 'Select'}
          </Button>
        </div>
      </div>
    </CardHeader>
    <CardContent className="pb-2 pt-0">
      <div className="flex items-center mb-2">
        <div className="flex items-center text-amber-500">
          <Star className="h-4 w-4 fill-current" />
          <span className="ml-1 font-medium">{contractor.rating}</span>
        </div>
        <span className="text-sm text-gray-500 ml-2">({contractor.reviewCount} reviews)</span>
        <Badge variant="outline" className="ml-3 bg-vendle-blue/10 text-vendle-navy border-0">
          {contractor.specialty}
        </Badge>
      </div>
      <CardDescription className="line-clamp-2">{contractor.description}</CardDescription>
    </CardContent>
    <CardFooter className="pt-2">
      <Button 
        variant="ghost" 
        className="w-full justify-center text-vendle-blue hover:text-vendle-blue/80 hover:bg-vendle-blue/10"
        onClick={() => onClick(contractor.id)}
      >
        View Details
      </Button>
    </CardFooter>
  </Card>
);

interface ContractorDetailsProps {
  contractor: typeof CONTRACTORS[0];
  onClose: () => void;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
}

const ContractorDetails = ({ contractor, onClose, isSelected, onSelect }: ContractorDetailsProps) => (
  <div className="flex flex-col h-full">
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-vendle-sand text-vendle-navy text-3xl">
          {contractor.avatar}
        </div>
        <div>
          <h2 className="text-xl font-bold">{contractor.name}</h2>
          <div className="flex items-center mt-1">
            <div className="flex items-center text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="ml-1 font-medium">{contractor.rating}</span>
            </div>
            <span className="text-sm text-gray-500 ml-1">({contractor.reviewCount} reviews)</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span>{contractor.location}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          variant={isSelected ? "default" : "outline"}
          className={isSelected ? "bg-vendle-teal hover:bg-vendle-teal/90" : "border-vendle-teal text-vendle-teal hover:text-vendle-teal/90 hover:bg-vendle-teal/10"}
          onClick={() => onSelect(contractor.id, !isSelected)}
        >
          {isSelected ? (
            <>
              <Check className="h-4 w-4 mr-1" /> Selected
            </>
          ) : 'Select Contractor'}
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>

    <p className="text-vendle-navy mb-4">{contractor.description}</p>

    <Tabs defaultValue="projects" className="flex-1 flex flex-col">
      <TabsList>
        <TabsTrigger value="projects" className="flex items-center gap-1">
          <ImageIcon className="h-4 w-4" /> Past Projects
        </TabsTrigger>
        <TabsTrigger value="reviews" className="flex items-center gap-1">
          <Star className="h-4 w-4" /> Reviews
        </TabsTrigger>
        <TabsTrigger value="business" className="flex items-center gap-1">
          <Building2 className="h-4 w-4" /> Business Info
        </TabsTrigger>
      </TabsList>

      <ScrollArea className="flex-1 mt-4">
        <TabsContent value="projects" className="space-y-4">
          {contractor.projects.map(project => (
            <Card key={project.id}>
              <CardHeader className="py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-vendle-blue/10 text-vendle-navy text-xl">
                    {project.image}
                  </div>
                  <CardTitle className="text-base">{project.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="py-0">
                <p className="text-sm text-gray-600">{project.description}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          {contractor.reviews.map(review => (
            <Card key={review.id}>
              <CardHeader className="py-3">
                <div className="flex justify-between">
                  <CardTitle className="text-base">{review.author}</CardTitle>
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'stroke-current fill-transparent'}`} 
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-0">
                <p className="text-sm text-gray-600">{review.text}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardContent className="py-4">
              <dl className="space-y-3">
                <div className="flex">
                  <dt className="w-1/3 text-sm text-gray-500">Founded</dt>
                  <dd className="w-2/3 text-sm font-medium">{contractor.businessInfo.founded}</dd>
                </div>
                <div className="flex">
                  <dt className="w-1/3 text-sm text-gray-500">Employees</dt>
                  <dd className="w-2/3 text-sm font-medium">{contractor.businessInfo.employees}</dd>
                </div>
                <div className="flex">
                  <dt className="w-1/3 text-sm text-gray-500">License #</dt>
                  <dd className="w-2/3 text-sm font-medium">{contractor.businessInfo.license}</dd>
                </div>
                <div className="flex">
                  <dt className="w-1/3 text-sm text-gray-500">Insurance</dt>
                  <dd className="w-2/3 text-sm font-medium">{contractor.businessInfo.insurance}</dd>
                </div>
                <div className="flex">
                  <dt className="w-1/3 text-sm text-gray-500">Service Area</dt>
                  <dd className="w-2/3 text-sm font-medium">{contractor.businessInfo.serviceArea}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>
      </ScrollArea>
    </Tabs>
  </div>
);

interface ContractorBrowserProps {
  onSelect?: (contractors: Array<{
    id: string;
    name: string;
    avatar: string;
    location: string;
    specialty: string;
  }>) => void;
}

const ContractorBrowser = ({ onSelect }: ContractorBrowserProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedContractors, setSelectedContractors] = useState<string[]>([]);
  const [viewingContractor, setViewingContractor] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedContractors = localStorage.getItem("selectedContractors");
    if (savedContractors) {
      try {
        const parsedContractors = JSON.parse(savedContractors);
        setSelectedContractors(parsedContractors.map((c: any) => c.id));
      } catch (e) {
        console.error("Error parsing saved contractors", e);
      }
    }
  }, []);

  const handleSelect = (id: string, selected: boolean) => {
    let newSelected: string[];
    
    if (selected) {
      newSelected = [...selectedContractors, id];
      setSelectedContractors(newSelected);
      toast({
        title: "Contractor Selected",
        description: `Notification sent to ${CONTRACTORS.find(c => c.id === id)?.name}`,
      });
    } else {
      newSelected = selectedContractors.filter(contractorId => contractorId !== id);
      setSelectedContractors(newSelected);
      toast({
        title: "Contractor Removed",
        description: `${CONTRACTORS.find(c => c.id === id)?.name} has been removed from selection`,
      });
    }
    
    if (onSelect) {
      const selectedContractorObjects = CONTRACTORS
        .filter(c => newSelected.includes(c.id))
        .map(({ id, name, avatar, location, specialty }) => ({ 
          id, name, avatar, location, specialty 
        }));
      
      onSelect(selectedContractorObjects);
    }
  };

  const viewContractor = (id: string) => {
    setViewingContractor(id);
  };

  const closeContractorView = () => {
    setViewingContractor(null);
  };

  const viewingContractorData = CONTRACTORS.find(c => c.id === viewingContractor) || null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="bg-vendle-teal hover:bg-vendle-teal/90">
            <Users className="mr-2 h-4 w-4" /> Browse Contractors
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[725px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Verified Contractors in Your Area</DialogTitle>
            <DialogDescription>
              Browse through our network of verified contractors. Select the ones you'd like to work with.
            </DialogDescription>
          </DialogHeader>

          {viewingContractor === null ? (
            <ScrollArea className="flex-1 pr-4 h-[60vh]">
              {CONTRACTORS.map(contractor => (
                <ContractorCard
                  key={contractor.id}
                  contractor={contractor}
                  isSelected={selectedContractors.includes(contractor.id)}
                  onSelect={handleSelect}
                  onClick={viewContractor}
                />
              ))}
            </ScrollArea>
          ) : (
            <div className="flex-1">
              {viewingContractorData && (
                <ContractorDetails
                  contractor={viewingContractorData}
                  onClose={closeContractorView}
                  isSelected={selectedContractors.includes(viewingContractorData.id)}
                  onSelect={handleSelect}
                />
              )}
            </div>
          )}

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {selectedContractors.length === 0 ? (
                'No contractors selected'
              ) : (
                `${selectedContractors.length} contractor${selectedContractors.length > 1 ? 's' : ''} selected`
              )}
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                if (onSelect && selectedContractors.length > 0) {
                  const selectedContractorObjects = CONTRACTORS
                    .filter(c => selectedContractors.includes(c.id))
                    .map(({ id, name, avatar, location, specialty }) => ({ 
                      id, name, avatar, location, specialty 
                    }));
                  
                  onSelect(selectedContractorObjects);
                }
                setIsOpen(false);
              }}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContractorBrowser;
