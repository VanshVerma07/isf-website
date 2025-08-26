
// From our public 'profiles' table, which supplements Supabase's auth.users table
export interface User {
  id: string; // This should be a UUID from auth.users
  name: string;
  student_id: string;
  email: string; // The email is stored here for easier access
  role: 'admin' | 'executive' | 'member';
}

export interface TeamMember {
  id: number;
  name: string;
  position: string;
  photo_url: string;
  socials: {
    linkedin: string;
    instagram: string;
  };
}

export interface Event {
  id: number;
  title: string;
  description:string;
  image_url: string;
  date: string; // Stored as a timestamp or date type in the database
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  created_at: string;
}

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  isStreaming?: boolean;
}
