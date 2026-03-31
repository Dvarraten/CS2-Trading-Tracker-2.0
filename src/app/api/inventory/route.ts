import { NextResponse } from 'next/server';

export async function GET() {
  const id = process.env.STEAM_ID_64;
  const key = process.env.STEAM_API_KEY;

  if (!id) {
    console.error("Configuration Error: STEAM_ID_64 is missing in .env.local");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  // Vi använder den enkla URL:en som vi vet fungerar
  const url = `https://steamcommunity.com/inventory/${id}/730/2?count=500`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      next: { revalidate: 3600 } // SE-tip: Cache i 1 timme för att spara på Steams API-gränser
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Steam API error: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();

    // SOFTWARE ENGINEERING: DATA MAPPING
    // Vi mappar ihop 'descriptions' (detaljer om föremålet) till en ren lista.
    // Steam skickar med 'icon_url' som vi gör om till en fungerande bildlänk.
    
    if (!data.descriptions) {
      return NextResponse.json({ error: "No items found or inventory is private" }, { status: 404 });
    }

    const cleanInventory = data.descriptions.map((item: any) => ({
      assetid: item.classid, // Vi använder classid som ett unikt ID för listan
      name: item.name,
      hash_name: item.market_hash_name,
      image: `https://community.akamai.steamstatic.com/economy/image/${item.icon_url}`,
      color: `#${item.name_color}`, // Lägger till # så CSS kan läsa färgen direkt
      type: item.type,
      rarity: item.tags?.find((tag: any) => tag.category === "Rarity")?.localized_tag_name || "Unknown"
    }));

    return NextResponse.json(cleanInventory);

  } catch (err) {
    console.error("Internal Server Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}