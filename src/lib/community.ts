import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export interface Company {
  id: string;
  name: string;
  slug: string;
  description: string;
  website_url: string | null;
  logo_url: string | null;
  verified: boolean;
  created_at: string;
}

export interface CommunityMember {
  id: string;
  display_name: string;
  handle: string;
  bio: string;
  role: string;
  website_url: string | null;
  company_id: string | null;
  avatar_initials: string;
  created_at: string;
}

export interface CompanyInput {
  name: string;
  slug: string;
  description: string;
  website_url: string;
  logo_url: string;
}

export interface MemberInput {
  display_name: string;
  handle: string;
  bio: string;
  role: string;
  website_url: string;
  company_id: string | null;
  avatar_initials: string;
}

export async function fetchCompanies(): Promise<Company[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('companies').select('*').order('created_at', { ascending: false });
  if (error) {
    console.warn('[companies] fetch failed:', error.message);
    return [];
  }
  return (data as Company[]) ?? [];
}

export async function fetchCompaniesByOwner(ownerId: string): Promise<Company[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });
  if (error) {
    console.warn('[companies] owner fetch failed:', error.message);
    return [];
  }
  return (data as Company[]) ?? [];
}

export async function fetchCommunityMembers(): Promise<CommunityMember[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('community_members')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.warn('[community] fetch failed:', error.message);
    return [];
  }
  return (data as CommunityMember[]) ?? [];
}

export async function createCompany(input: CompanyInput): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const { error } = await supabase.from('companies').insert(input);
  if (error) {
    console.warn('[companies] insert failed:', error.message);
    return false;
  }
  return true;
}

export async function updateOwnCompany(companyId: string, input: CompanyInput): Promise<string | null> {
  const { error } = await supabase
    .from('companies')
    .update({
      name: input.name,
      description: input.description,
      website_url: input.website_url,
      logo_url: input.logo_url,
    })
    .eq('id', companyId);
  if (!error) return null;
  console.warn('[companies] update failed:', error.message);
  return 'We could not save this company. Please try again.';
}

export async function createCommunityMember(input: MemberInput): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const { error } = await supabase.from('community_members').insert(input);
  if (error) {
    console.warn('[community] insert failed:', error.message);
    return false;
  }
  return true;
}
