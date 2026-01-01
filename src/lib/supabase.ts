import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase = url && anon ? createClient(url, anon) : null;
export const supabaseEnabled = !!supabase;

export type DbOrganogram = {
  id: string;
  owner_id: string;
  name: string;
  data_json: {
    nodes: any[];
    edges: any[];
    metadata?: Record<string, any>;
  };
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type DbOrganogramVersion = {
  id: string;
  organogram_id: string;
  data_json: DbOrganogram['data_json'];
  metadata_json?: Record<string, any>;
  created_at: string;
  created_by: string;
};

