export type User = {
  user_id: number;
  username: string;
  password: string;
  photo: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  city: string;
  country: string;
  additional_information: string;
  role: "traveler" | "admin";
};

export type City = {
  city_id: number;
  city_name: string;
  country: string;
  region: string;
  cost_index: number;
  popularity: number;
  image: string;
};

export type Activity = {
  activity_id: number;
  city_id: number;
  activity_name: string;
  description: string;
  type: string;
  cost: number;
  duration_hours: number;
  image: string;
};

export type Trip = {
  trip_id: number;
  user_id: number;
  trip_name: string;
  description: string;
  start_date: string;
  end_date: string;
  cover_photo: string;
  public_slug?: string;
};

export type TripSection = {
  section_id: number;
  trip_id: number;
  section_order: number;
  description: string;
  start_date: string;
  end_date: string;
  budget: number;
  city_id?: number;
};

export type SectionActivity = {
  section_activity_id: number;
  section_id: number;
  activity_id: number | null;
  activity_order: number;
  activity_date: string;
  activity_name: string;
  expense: number;
  category: "transport" | "stay" | "activities" | "meals";
};

export type CommunityPost = {
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
  image?: string;
};

export type Database = {
  users: User[];
  cities: City[];
  activities: Activity[];
  trips: Trip[];
  trip_sections: TripSection[];
  section_activities: SectionActivity[];
  community_posts: CommunityPost[];
};
