/**
 * Hand-written types matching the schema in supabase/migrations/0001_init.sql.
 *
 * Once you connect the Supabase CLI you can replace this with auto-generated
 * types via `npx supabase gen types typescript --local > lib/supabase/database.types.ts`
 *
 * IMPORTANT: Row / Insert / Update types MUST be `type` aliases (not `interface`)
 * so that they satisfy the `Record<string, unknown>` index-signature constraint
 * used internally by supabase-js / postgrest-js generics.
 */

export type FeedbackType =
  | "good_tap"
  | "bad_tap"
  | "public_review_click"
  | "private_feedback";

/* ------------------------------------------------------------------ */
/*  Row types (what you get back from a SELECT)                       */
/* ------------------------------------------------------------------ */

export type Business = {
  id: string;
  owner_user_id: string;
  name: string;
  created_at: string;
};

export type Location = {
  id: string;
  business_id: string;
  name: string;
  google_review_link: string | null;
  brand_color: string;
  created_at: string;
};

export type QrScan = {
  id: string;
  location_id: string;
  scanned_at: string;
};

export type FeedbackEvent = {
  id: string;
  location_id: string;
  type: FeedbackType;
  message: string | null;
  created_at: string;
};

/* ------------------------------------------------------------------ */
/*  Insert types (what you pass to an INSERT)                         */
/* ------------------------------------------------------------------ */

export type BusinessInsert = {
  owner_user_id: string;
  name: string;
};

export type LocationInsert = {
  business_id: string;
  name: string;
  google_review_link?: string | null;
  brand_color?: string;
};

export type QrScanInsert = {
  location_id: string;
};

export type FeedbackEventInsert = {
  location_id: string;
  type: FeedbackType;
  message?: string | null;
};

/* ------------------------------------------------------------------ */
/*  Supabase generic Database type (for createClient<Database>)       */
/* ------------------------------------------------------------------ */

export type Database = {
  public: {
    Tables: {
      businesses: {
        Row: Business;
        Insert: BusinessInsert;
        Update: Partial<BusinessInsert>;
        Relationships: [
          {
            foreignKeyName: "businesses_owner_user_id_fkey";
            columns: ["owner_user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      locations: {
        Row: Location;
        Insert: LocationInsert;
        Update: Partial<LocationInsert>;
        Relationships: [
          {
            foreignKeyName: "locations_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
        ];
      };
      qr_scans: {
        Row: QrScan;
        Insert: QrScanInsert;
        Update: Partial<QrScanInsert>;
        Relationships: [
          {
            foreignKeyName: "qr_scans_location_id_fkey";
            columns: ["location_id"];
            isOneToOne: false;
            referencedRelation: "locations";
            referencedColumns: ["id"];
          },
        ];
      };
      feedback_events: {
        Row: FeedbackEvent;
        Insert: FeedbackEventInsert;
        Update: Partial<FeedbackEventInsert>;
        Relationships: [
          {
            foreignKeyName: "feedback_events_location_id_fkey";
            columns: ["location_id"];
            isOneToOne: false;
            referencedRelation: "locations";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
