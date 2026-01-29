
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://unqntnzjxuyammlgfqci.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVucW50bnpqeHV5YW1tbGdmcWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MTQ0NzMsImV4cCI6MjA4Mzk5MDQ3M30.AhczeqB8GKPnjFNQt0QfNu1bEGRHJxK_hWUV18INLeo";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
    console.log("Listing categories...");

    const { data: categories, error } = await supabase
        .from('categories')
        .select('*');

    if (error) {
        console.error('Error listing categories:', error);
    } else {
        console.log('Categories:', JSON.stringify(categories, null, 2));
    }
}

main();
