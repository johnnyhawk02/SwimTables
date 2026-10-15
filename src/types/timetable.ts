export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type FacilityId = 'main' | 'learner' | 'health';

export type CategoryId = 
  | 'public' 
  | 'over60' 
  | 'adult' 
  | 'aquafit' 
  | 'club' 
  | 'tri' 
  | 'splash' 
  | 'health';

export interface SwimSession {
  id: string;
  day: DayOfWeek;
  facility: FacilityId;
  facilityName: string;
  title: string;
  category: CategoryId;
  startTime: string; // "06:30"
  endTime: string;   // "12:00"
  lanesInfo?: string; // e.g. "2.5 Lanes", "All Lanes", "2 Lanes", "1 Lane"
  lanesRatio?: number; // 0 to 1 for visual lane bar (e.g., 2.5/6 = ~0.42)
  notes?: string;
  priceNote?: string;
  ageRestriction?: string;
  description: string;
}

export type TimeOfDayFilter = 'all' | 'morning' | 'afternoon' | 'evening';
export type ViewMode = 'cards' | 'timeline' | 'weekly' | 'saved';

export interface CentreInfo {
  name: string;
  parentOrg: string;
  address: string;
  postcode: string;
  phone: string;
  website: string;
  effectiveDate: string;
  hours: {
    weekday: string;
    saturday: string;
    sunday: string;
  };
}
