export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      announcements: {
        Row: {
          author: string
          content: string
          created_at: string
          date: string
          id: number
          title: string
        }
        Insert: {
          author?: string | null
          content: string
          created_at?: string
          date: string
          id?: number
          title: string
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string
          date?: string
          id?: number
          title?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          date: string
          description: string
          id: number
          image_url: string
          title: string
        }
        Insert: {
          date: string
          description: string
          id?: number
          image_url: string
          title: string
        }
        Update: {
          date?: string
          description?: string
          id?: number
          image_url?: string
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          email: string
          id: string
          name: string
          role: "admin" | "executive" | "member"
          student_id: string
        }
        Insert: {
          email: string
          id: string
          name: string
          role?: "admin" | "executive" | "member"
          student_id: string
        }
        Update: {
          email?: string
          id?: string
          name?: string
          role?: "admin" | "executive" | "member"
          student_id?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: number
          name: string
          photo_url: string
          position: string
          socials: Json
        }
        Insert: {
          id?: number
          name: string
          photo_url: string
          position: string
          socials: Json
        }
        Update: {
          id?: number
          name?: string
          photo_url?: string
          position?: string
          socials?: Json
        }
        Relationships: []
      },
      threads: {
        Row: {
            id: number;
            title: string;
            author: string;
            replies: number;
            last_post: string;
        }
        Insert: {
            id?: number;
            title: string;
            author: string;
            replies?: number;
            last_post?: string;
        }
        Update: {
            id?: number;
            title?: string;
            author?: string;
            replies?: number;
            last_post?: string;
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
