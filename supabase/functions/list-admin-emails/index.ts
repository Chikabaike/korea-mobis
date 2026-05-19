import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Super-admin email is kept server-side only; never exposed to the client bundle.
const SUPER_ADMIN_EMAIL = (Deno.env.get('SUPER_ADMIN_EMAIL') ?? '').toLowerCase();

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey);
    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const callerEmail = (userData.user.email ?? '').toLowerCase();
    const isSuper = callerEmail === SUPER_ADMIN_EMAIL;

    // Non-super admins only get their privilege flag, never the full user list.
    if (!isSuper) {
      return new Response(JSON.stringify({ isSuper: false, users: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const users: { id: string; email: string; created_at: string; last_sign_in_at: string | null; isSuper: boolean }[] = [];
    let page = 1;
    while (true) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) throw error;
      for (const u of data.users) {
        const email = u.email ?? '';
        users.push({
          id: u.id,
          email,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at ?? null,
          isSuper: email.toLowerCase() === SUPER_ADMIN_EMAIL,
        });
      }
      if (data.users.length < 200) break;
      page += 1;
    }

    return new Response(JSON.stringify({ isSuper: true, users }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
