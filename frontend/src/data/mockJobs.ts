export interface JobPosting {
  id: string;
  title: string;
  description: string;
  price: number;
  location: {
    city: string;
    state: string;
    zipCode: string;
  };
  category: string;
  postedAt: Date;
  deadline: Date;
  status: 'open' | 'closed';
  homeowner: {
    name: string;
    rating: number;
  };
}

export const mockJobs: JobPosting[] = [
  {
    id: '1',
    title: 'Water Damage Restoration - Kitchen & Basement',
    description: 'Extensive water damage from burst pipe affecting kitchen and basement. Need immediate restoration work including drywall repair, flooring replacement, and mold remediation.',
    price: 12500,
    location: {
      city: 'Miami',
      state: 'FL',
      zipCode: '33101'
    },
    category: 'Water Damage',
    postedAt: new Date('2024-01-15'),
    deadline: new Date('2024-02-01'),
    status: 'open',
    homeowner: {
      name: 'Sarah Johnson',
      rating: 4.8
    }
  },
  {
    id: '2',
    title: 'Fire Damage Repair - Living Room & Attic',
    description: 'Fire damage restoration needed for living room and attic area. Includes smoke damage cleanup, structural repairs, and complete interior restoration.',
    price: 28000,
    location: {
      city: 'Austin',
      state: 'TX',
      zipCode: '78701'
    },
    category: 'Fire Damage',
    postedAt: new Date('2024-01-16'),
    deadline: new Date('2024-02-15'),
    status: 'open',
    homeowner: {
      name: 'Michael Chen',
      rating: 4.9
    }
  },
  {
    id: '3',
    title: 'Storm Damage Roof Replacement',
    description: 'Complete roof replacement needed after severe storm damage. Includes removal of old shingles, inspection of roof deck, and installation of new roofing system.',
    price: 18500,
    location: {
      city: 'New Orleans',
      state: 'LA',
      zipCode: '70112'
    },
    category: 'Storm Damage',
    postedAt: new Date('2024-01-14'),
    deadline: new Date('2024-01-30'),
    status: 'open',
    homeowner: {
      name: 'Patricia Williams',
      rating: 4.7
    }
  },
  {
    id: '4',
    title: 'Mold Remediation - Master Bedroom Suite',
    description: 'Mold remediation required in master bedroom and bathroom. Need professional assessment, removal, and prevention measures.',
    price: 8500,
    location: {
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101'
    },
    category: 'Mold Damage',
    postedAt: new Date('2024-01-17'),
    deadline: new Date('2024-02-10'),
    status: 'open',
    homeowner: {
      name: 'Robert Martinez',
      rating: 4.6
    }
  },
  {
    id: '5',
    title: 'Flood Damage - Full First Floor Restoration',
    description: 'Complete first floor restoration after flooding. Includes flooring, baseboards, drywall, electrical inspection, and repainting.',
    price: 35000,
    location: {
      city: 'Houston',
      state: 'TX',
      zipCode: '77001'
    },
    category: 'Flood Damage',
    postedAt: new Date('2024-01-13'),
    deadline: new Date('2024-02-05'),
    status: 'open',
    homeowner: {
      name: 'Jennifer Davis',
      rating: 5.0
    }
  },
  {
    id: '6',
    title: 'Wind Damage Siding Replacement',
    description: 'Replace damaged siding on north and west sides of house due to severe wind damage. Includes inspection and repair of underlying structure.',
    price: 15000,
    location: {
      city: 'Oklahoma City',
      state: 'OK',
      zipCode: '73101'
    },
    category: 'Wind Damage',
    postedAt: new Date('2024-01-18'),
    deadline: new Date('2024-02-20'),
    status: 'open',
    homeowner: {
      name: 'David Thompson',
      rating: 4.8
    }
  },
  {
    id: '7',
    title: 'Hail Damage Repair - Roof & Windows',
    description: 'Repair hail damage to roof shingles and replace several cracked windows. Insurance approved, ready to start immediately.',
    price: 22000,
    location: {
      city: 'Denver',
      state: 'CO',
      zipCode: '80201'
    },
    category: 'Hail Damage',
    postedAt: new Date('2024-01-12'),
    deadline: new Date('2024-01-28'),
    status: 'open',
    homeowner: {
      name: 'Lisa Anderson',
      rating: 4.9
    }
  },
  {
    id: '8',
    title: 'Water Leak Ceiling Repair - Multiple Rooms',
    description: 'Ceiling repair in 3 bedrooms and hallway due to roof leak. Includes drywall replacement, texture matching, and painting.',
    price: 6500,
    location: {
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85001'
    },
    category: 'Water Damage',
    postedAt: new Date('2024-01-19'),
    deadline: new Date('2024-02-12'),
    status: 'open',
    homeowner: {
      name: 'Christopher Lee',
      rating: 4.7
    }
  },
  {
    id: '9',
    title: 'Smoke Damage Cleanup - Entire House',
    description: 'Professional smoke damage cleaning throughout entire house. Includes HVAC system cleaning, wall washing, and odor removal.',
    price: 9500,
    location: {
      city: 'Portland',
      state: 'OR',
      zipCode: '97201'
    },
    category: 'Fire Damage',
    postedAt: new Date('2024-01-11'),
    deadline: new Date('2024-01-25'),
    status: 'open',
    homeowner: {
      name: 'Amanda White',
      rating: 4.8
    }
  },
  {
    id: '10',
    title: 'Tornado Damage - Garage Rebuild',
    description: 'Complete garage rebuild after tornado damage. Foundation intact, need new structure, roof, doors, and electrical work.',
    price: 42000,
    location: {
      city: 'Tulsa',
      state: 'OK',
      zipCode: '74101'
    },
    category: 'Storm Damage',
    postedAt: new Date('2024-01-10'),
    deadline: new Date('2024-02-28'),
    status: 'open',
    homeowner: {
      name: 'James Robinson',
      rating: 4.9
    }
  }
];

// Helper function to format price
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Helper function to format location
export const formatLocation = (location: JobPosting['location']): string => {
  return `${location.city}, ${location.state} ${location.zipCode}`;
};

// Helper function to get time ago
export const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return `${Math.floor(diffInDays / 30)} months ago`;
};
