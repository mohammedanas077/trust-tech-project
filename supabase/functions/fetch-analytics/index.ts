import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const csvUrl = 'https://docs.google.com/spreadsheets/d/1mlVPY0ppJja73NCiCvn2xqkmSKu_lBvIsSIgxJNOWWg/export?format=csv';
    
    console.log('Fetching CSV from Google Sheets...');
    const response = await fetch(csvUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    console.log('CSV fetched successfully, parsing data...');
    
    // Parse CSV
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const row: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index] || '';
        
        // Convert numeric fields
        if (['Followers', 'Impressions', 'Reach', 'Posts', 'Likes', 'Comments', 'Shares'].includes(header)) {
          row[header.toLowerCase()] = parseInt(value) || 0;
        } else if (['Engagement (%)', 'Growth (%)'].includes(header)) {
          row[header.toLowerCase().replace(' (%)', '')] = parseFloat(value) || 0;
        } else {
          row[header.toLowerCase()] = value;
        }
      });
      
      return row;
    });

    console.log(`Parsed ${data.length} rows successfully`);

    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-analytics function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
