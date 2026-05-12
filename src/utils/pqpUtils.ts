// United PQP Calculation Utilities

export interface PQPResult {
  pqp: number;
  pqf: number;
  method: 'fare' | 'distance';
  isPartner: boolean;
}

// Map of Booking Classes to United PQP Multipliers for Preferred Partners
// This is a simplified map. Real-world values vary by specific partner.
const PREFERRED_PARTNER_MULTIPLIERS: Record<string, number> = {
  'J': 1.5, 'C': 1.5, 'D': 1.5, 'Z': 1.5, 'P': 1.5, // Business
  'O': 1.25, 'A': 1.25, 'R': 1.25,                 // Premium Economy
  'Y': 1.0, 'B': 1.0, 'M': 1.0, 'E': 1.0, 'U': 1.0, 'H': 1.0, 'Q': 1.0, 'V': 1.0, 'W': 1.0, 'S': 1.0, 'T': 1.0, 'L': 1.0, 'K': 1.0, 'G': 1.0 // Economy
};

/**
 * Calculates estimated PQP for a flight offer
 * @param airline Operating airline code
 * @param baseFare Base fare from API
 * @param bookingClass Booking class (e.g. 'Y')
 * @param distance Estimated distance in miles
 */
export function estimatePQP(
  airline: string,
  baseFare: number,
  bookingClass: string,
  distance: number = 0
): PQPResult {
  const isUnited = airline === 'UA';
  
  if (isUnited) {
    // For United, it's strictly based on spend (base fare + carrier surcharges)
    // Amadeus 'base' is a very close proxy
    return {
      pqp: Math.floor(baseFare),
      pqf: 1,
      method: 'fare',
      isPartner: false
    };
  } else {
    // For Partners, it's Distance-based: (Distance * Multiplier) / 5
    const multiplier = PREFERRED_PARTNER_MULTIPLIERS[bookingClass] || 0.5;
    const estimatedPQP = Math.floor((distance * multiplier) / 5);
    
    // Partner PQP is capped per segment (e.g., 1,500 for Business, 600 for Economy)
    const cap = multiplier >= 1.5 ? 1500 : 600;
    
    return {
      pqp: Math.min(estimatedPQP, cap),
      pqf: 1,
      method: 'distance',
      isPartner: true
    };
  }
}

/**
 * Helper to get a rough distance estimate between IATA codes
 * In a real app, we'd use a lookup table or coordinate-based Haversine
 */
export function getRoughDistance(origin: string, destination: string): number {
  // Placeholder logic - we'll improve this with a small coordinate database
  return 3000; 
}
