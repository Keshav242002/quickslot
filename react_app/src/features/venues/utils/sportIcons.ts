const SPORT_EMOJIS: Record<string, string> = {
  badminton: '🏸',
  football: '⚽',
  tennis: '🎾',
  cricket: '🏏',
  basketball: '🏀',
  swimming: '🏊',
  volleyball: '🏐',
  'table tennis': '🏓',
};

export function getSportEmoji(sportType: string): string {
  return SPORT_EMOJIS[sportType.toLowerCase()] ?? '🏟️';
}
