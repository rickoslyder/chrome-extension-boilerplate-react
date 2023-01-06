export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      calendar_events: {
        Row: {
          event_id: number;
          user_id: number;
          user_id_str: string | null;
          title: string;
          start_time: string;
          end_time: string;
          location: string;
          description: string;
          attachments: Json;
        };
        Insert: {
          event_id?: number;
          user_id: number;
          user_id_str?: string | null;
          title: string;
          start_time: string;
          end_time: string;
          location: string;
          description: string;
          attachments: Json;
        };
        Update: {
          event_id?: number;
          user_id?: number;
          user_id_str?: string | null;
          title?: string;
          start_time?: string;
          end_time?: string;
          location?: string;
          description?: string;
          attachments?: Json;
        };
      };
      house_groups: {
        Row: {
          group_id: number;
          group_name: string;
          group_calendar: Json;
          read_only_link: string;
          viewing_ids: number[] | null;
          group_members: number[] | null;
          shared_listings: number[] | null;
          num_of_members: number | null;
        };
        Insert: {
          group_id?: number;
          group_name: string;
          group_calendar: Json;
          read_only_link: string;
          viewing_ids?: number[] | null;
          group_members?: number[] | null;
          shared_listings?: number[] | null;
          num_of_members?: number | null;
        };
        Update: {
          group_id?: number;
          group_name?: string;
          group_calendar?: Json;
          read_only_link?: string;
          viewing_ids?: number[] | null;
          group_members?: number[] | null;
          shared_listings?: number[] | null;
          num_of_members?: number | null;
        };
      };
      house_groups_members: {
        Row: {
          group_id: number;
          user_id: number;
          user_id_str: string | null;
          user_uuid: string | null;
        };
        Insert: {
          group_id: number;
          user_id: number;
          user_id_str?: string | null;
          user_uuid?: string | null;
        };
        Update: {
          group_id?: number;
          user_id?: number;
          user_id_str?: string | null;
          user_uuid?: string | null;
        };
      };
      listing_ratings: {
        Row: {
          rating_id: number;
          listing_id: number | null;
          user_id: number | null;
          rating: number | null;
          comments: string | null;
          created_at: string | null;
          num_ratings: number;
          avg_rating: number | null;
          display_name: string | null;
        };
        Insert: {
          rating_id: number;
          listing_id?: number | null;
          user_id?: number | null;
          rating?: number | null;
          comments?: string | null;
          created_at?: string | null;
          num_ratings?: number;
          avg_rating?: number | null;
          display_name?: string | null;
        };
        Update: {
          rating_id?: number;
          listing_id?: number | null;
          user_id?: number | null;
          rating?: number | null;
          comments?: string | null;
          created_at?: string | null;
          num_ratings?: number;
          avg_rating?: number | null;
          display_name?: string | null;
        };
      };
      listings: {
        Row: {
          listing_id: number;
          user_id: number;
          user_id_str: string | null;
          property_address: string;
          details: string;
          cost: string;
          available: string;
          furnished: string;
          size: string | null;
          description: string | null;
          floorplan: string;
          epc: string;
          agency_name: string;
          notes: string | null;
          last_modified: string | null;
          viewing_id: number | null;
          property_images: string[] | null;
          positives: string[] | null;
          concerns: string[] | null;
          avg_rating: number | null;
          property_url: string | null;
          deposit: string | null;
          agency_number: string | null;
          agency_address: string | null;
        };
        Insert: {
          listing_id?: number;
          user_id: number;
          user_id_str?: string | null;
          property_address: string;
          details: string;
          cost: string;
          available: string;
          furnished: string;
          size?: string | null;
          description?: string | null;
          floorplan: string;
          epc: string;
          agency_name: string;
          notes?: string | null;
          last_modified?: string | null;
          viewing_id?: number | null;
          property_images?: string[] | null;
          positives?: string[] | null;
          concerns?: string[] | null;
          avg_rating?: number | null;
          property_url?: string | null;
          deposit?: string | null;
          agency_number?: string | null;
          agency_address?: string | null;
        };
        Update: {
          listing_id?: number;
          user_id?: number;
          user_id_str?: string | null;
          property_address?: string;
          details?: string;
          cost?: string;
          available?: string;
          furnished?: string;
          size?: string | null;
          description?: string | null;
          floorplan?: string;
          epc?: string;
          agency_name?: string;
          notes?: string | null;
          last_modified?: string | null;
          viewing_id?: number | null;
          property_images?: string[] | null;
          positives?: string[] | null;
          concerns?: string[] | null;
          avg_rating?: number | null;
          property_url?: string | null;
          deposit?: string | null;
          agency_number?: string | null;
          agency_address?: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          website: string | null;
          allow_extra_emails: boolean | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          allow_extra_emails?: boolean | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          allow_extra_emails?: boolean | null;
        };
      };
      users: {
        Row: {
          user_id: number;
          user_id_str: string | null;
          username: string;
          password: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          viewing_id: number | null;
          house_group_id: number | null;
          house_group_id_str: string | null;
          user_uuid: string;
          display_name: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          user_id?: number;
          user_id_str?: string | null;
          username: string;
          password: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          viewing_id?: number | null;
          house_group_id?: number | null;
          house_group_id_str?: string | null;
          user_uuid: string;
          display_name?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          user_id?: number;
          user_id_str?: string | null;
          username?: string;
          password?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          viewing_id?: number | null;
          house_group_id?: number | null;
          house_group_id_str?: string | null;
          user_uuid?: string;
          display_name?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      viewings: {
        Row: {
          viewing_id: number;
          listing_id: number;
          date: string;
          time: string;
          notes: string;
          agent_name: string;
          agent_email: string;
          agent_number: string;
          house_group_id: number | null;
          house_group_id_str: string | null;
          viewing_type: string | null;
          viewing_host: string | null;
          viewing_status: string | null;
          viewing_images: string[] | null;
        };
        Insert: {
          viewing_id?: number;
          listing_id: number;
          date: string;
          time: string;
          notes: string;
          agent_name: string;
          agent_email: string;
          agent_number: string;
          house_group_id?: number | null;
          house_group_id_str?: string | null;
          viewing_type?: string | null;
          viewing_host?: string | null;
          viewing_status?: string | null;
          viewing_images?: string[] | null;
        };
        Update: {
          viewing_id?: number;
          listing_id?: number;
          date?: string;
          time?: string;
          notes?: string;
          agent_name?: string;
          agent_email?: string;
          agent_number?: string;
          house_group_id?: number | null;
          house_group_id_str?: string | null;
          viewing_type?: string | null;
          viewing_host?: string | null;
          viewing_status?: string | null;
          viewing_images?: string[] | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export interface Listing {
  listing_id?: number;
  user_id: number;
  user_id_str?: string | null;
  property_address: string;
  details: string;
  cost: string;
  available: string;
  furnished: string;
  size?: string | null;
  description?: string | null;
  floorplan: string;
  epc: string;
  agency_name: string;
  notes?: string | null;
  last_modified?: string | null;
  viewing_id?: number | null;
  property_images?: string[] | null;
  positives?: string[] | null;
  concerns?: string[] | null;
  avg_rating?: number | null;
  property_url?: string | null;
  deposit?: string | null;
  agency_number?: string | null;
  agency_address?: string | null;
}

export interface ListingNoUser {
  listing_id?: number;
  user_id?: number;
  user_id_str?: string | null;
  property_address: string;
  details: string;
  cost: string;
  available: string;
  furnished: string;
  size?: string | null;
  description?: string | null;
  floorplan: string;
  epc: string;
  agency_name: string;
  notes?: string | null;
  last_modified?: string | null;
  viewing_id?: number | null;
  property_images?: string[] | null;
  positives?: string[] | null;
  concerns?: string[] | null;
  avg_rating?: number | null;
  property_url?: string | null;
  deposit?: string | null;
  agency_number?: string | null;
  agency_address?: string | null;
}

export interface ListingUpdate {
  listing_id?: number;
  user_id?: number;
  user_id_str?: string | null;
  property_address?: string;
  details?: string;
  cost?: string;
  available?: string;
  furnished?: string;
  size?: string | null;
  description?: string | null;
  floorplan?: string;
  epc?: string;
  agency_name?: string;
  notes?: string | null;
  last_modified?: string | null;
  viewing_id?: number | null;
  property_images?: string[] | null;
  positives?: string[] | null;
  concerns?: string[] | null;
  avg_rating?: number | null;
  property_url?: string | null;
  deposit?: string | null;
  agency_number?: string | null;
  agency_address?: string | null;
}

export interface ProfileUpdate {
  id?: string;
  updated_at?: string | null;
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  website?: string | null;
  allow_extra_emails?: boolean | null;
}
