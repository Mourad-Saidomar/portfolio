/**
 * Types de la base, alignés sur supabase/migrations.
 * Régénérables avec : npx supabase gen types typescript --project-id <id> > lib/supabase/database.types.ts
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Timestamps = { created_at: string; updated_at: string };

export type Database = {
  __InternalSupabase: { PostgrestVersion: "13" };
  public: {
    Tables: {
      admins: {
        Row: { user_id: string; created_at: string };
        Insert: { user_id: string; created_at?: string };
        Update: { user_id?: string; created_at?: string };
        Relationships: [];
      };
      profile: {
        Row: {
          id: number;
          full_name: string;
          headline: string;
          tagline: string;
          intro: string;
          bio: string;
          availability: string;
          location: string;
          email: string;
          phone: string | null;
          show_phone: boolean;
          photo_path: string | null;
          photo_alt: string;
          cv_path: string | null;
          cv_updated_at: string | null;
          github_url: string | null;
          linkedin_url: string | null;
          website_url: string | null;
          core_values: Json;
          differentiators: Json;
          languages: Json;
          interests: string[];
          updated_at: string;
        };
        Insert: {
          id?: number;
          full_name: string;
          headline: string;
          tagline: string;
          intro?: string;
          bio?: string;
          availability?: string;
          location?: string;
          email: string;
          phone?: string | null;
          show_phone?: boolean;
          photo_path?: string | null;
          photo_alt?: string;
          cv_path?: string | null;
          cv_updated_at?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          website_url?: string | null;
          core_values?: Json;
          differentiators?: Json;
          languages?: Json;
          interests?: string[];
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profile"]["Insert"]>;
        Relationships: [];
      };
      timeline_entries: {
        Row: {
          id: string;
          kind: Database["public"]["Enums"]["timeline_kind"];
          title: string;
          organization: string;
          location: string;
          start_date: string | null;
          end_date: string | null;
          is_current: boolean;
          date_precision: Database["public"]["Enums"]["date_precision"];
          description: string;
          highlights: string[];
          published: boolean;
          position: number;
        } & Timestamps;
        Insert: {
          id?: string;
          kind: Database["public"]["Enums"]["timeline_kind"];
          title: string;
          organization: string;
          location?: string;
          start_date?: string | null;
          end_date?: string | null;
          is_current?: boolean;
          date_precision?: Database["public"]["Enums"]["date_precision"];
          description?: string;
          highlights?: string[];
          published?: boolean;
          position?: number;
        } & Partial<Timestamps>;
        Update: Partial<Database["public"]["Tables"]["timeline_entries"]["Insert"]>;
        Relationships: [];
      };
      skill_categories: {
        Row: { id: string; name: string; description: string; position: number } & Timestamps;
        Insert: {
          id?: string;
          name: string;
          description?: string;
          position?: number;
        } & Partial<Timestamps>;
        Update: Partial<Database["public"]["Tables"]["skill_categories"]["Insert"]>;
        Relationships: [];
      };
      skills: {
        Row: { id: string; category_id: string; name: string; position: number; created_at: string };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          position?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["skills"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "skills_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "skill_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          summary: string;
          period: string;
          cover_path: string | null;
          cover_alt: string;
          context: Json | null;
          problem: Json | null;
          role: Json | null;
          solution: Json | null;
          results: Json | null;
          stack: string[];
          demo_url: string | null;
          repo_url: string | null;
          status: Database["public"]["Enums"]["publication_status"];
          featured: boolean;
          position: number;
          published_at: string | null;
        } & Timestamps;
        Insert: {
          id?: string;
          slug: string;
          title: string;
          summary?: string;
          period?: string;
          cover_path?: string | null;
          cover_alt?: string;
          context?: Json | null;
          problem?: Json | null;
          role?: Json | null;
          solution?: Json | null;
          results?: Json | null;
          stack?: string[];
          demo_url?: string | null;
          repo_url?: string | null;
          status?: Database["public"]["Enums"]["publication_status"];
          featured?: boolean;
          position?: number;
          published_at?: string | null;
        } & Partial<Timestamps>;
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
        Relationships: [];
      };
      project_images: {
        Row: {
          id: string;
          project_id: string;
          path: string;
          alt: string;
          caption: string;
          width: number | null;
          height: number | null;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          path: string;
          alt?: string;
          caption?: string;
          width?: number | null;
          height?: number | null;
          position?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["project_images"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          ip_hash: string | null;
          status: Database["public"]["Enums"]["message_status"];
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          ip_hash?: string | null;
          status?: Database["public"]["Enums"]["message_status"];
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          quote: string;
          author_name: string;
          author_role: string;
          organization: string;
          published: boolean;
          position: number;
        } & Timestamps;
        Insert: {
          id?: string;
          quote: string;
          author_name: string;
          author_role?: string;
          organization?: string;
          published?: boolean;
          position?: number;
        } & Partial<Timestamps>;
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
      reorder_rows: { Args: { target_table: string; ids: string[] }; Returns: undefined };
    };
    Enums: {
      timeline_kind: "experience" | "education";
      date_precision: "month" | "year";
      publication_status: "draft" | "published";
      message_status: "new" | "read" | "archived";
    };
    CompositeTypes: { [_ in never]: never };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T];
