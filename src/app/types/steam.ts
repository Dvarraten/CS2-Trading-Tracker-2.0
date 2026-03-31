export interface SteamItem {
  assetid: string;
  name: string;
  hash_name: string; // Viktig för att hämta priser senare
  icon_url: string;
  rarity_color: string;
}