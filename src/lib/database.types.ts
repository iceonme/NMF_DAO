export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          mars_balance: number;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          mars_balance?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          mars_balance?: number;
          created_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          title: string;
          content: string;
          author_id: string;
          status: 'pending' | 'claimed' | 'researching' | 'voting' | 'closed';
          is_quality: boolean;
          discussion_count: number;
          researcher_count: number;
          vote_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          author_id: string;
          status?: 'pending' | 'claimed' | 'researching' | 'voting' | 'closed';
          is_quality?: boolean;
          discussion_count?: number;
          researcher_count?: number;
          vote_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          author_id?: string;
          status?: 'pending' | 'claimed' | 'researching' | 'voting' | 'closed';
          is_quality?: boolean;
          discussion_count?: number;
          researcher_count?: number;
          vote_count?: number;
          created_at?: string;
        };
      };
    };
  };
}