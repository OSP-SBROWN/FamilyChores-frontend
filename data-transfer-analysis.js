// Data Transfer Size Analysis - 50% Unavailable Slots
// Scenario: 3 people × 7 days × 7 timezones = 147 total slots, 74 unavailable

// =============================================================================
// CURRENT SYSTEM: All availability records as verbose JSON
// =============================================================================

const currentSystemData = {
  "success": true,
  "data": [
    {
      "person_id": "550e8400-e29b-41d4-a716-446655440000",
      "day_type_id": "660e8400-e29b-41d4-a716-446655440001", 
      "timezone_id": "770e8400-e29b-41d4-a716-446655440002",
      "is_available": false,
      "person_name": "John Smith",
      "day_name": "monday",
      "day_display_name": "Monday",
      "timezone_name": "morning",
      "timezone_display_name": "Morning (7-9am)",
      "timezone_order": 1
    },
    // ... 146 more records like this (one for every slot)
  ]
};

// JSON Size: ~45,000 bytes (45KB) - MASSIVE!

// =============================================================================
// OPTIMIZATION 1: Only "unavailable" records, still verbose
// =============================================================================

const optimization1Data = {
  "success": true,
  "data": [
    {
      "person_id": "550e8400-e29b-41d4-a716-446655440000",
      "day_type_id": "660e8400-e29b-41d4-a716-446655440001",
      "timezone_id": "770e8400-e29b-41d4-a716-446655440002",
      "is_available": false
    },
    // ... 73 more records (only unavailable ones)
  ]
};

// JSON Size: ~12,000 bytes (12KB) - 73% reduction!

// =============================================================================
// OPTIMIZATION 2: Ultra-compact with integer mapping
// =============================================================================

const optimization2Data = {
  "success": true,
  "metadata": {
    "people": ["John", "Jane", "Bob"],           // 3 people
    "days": ["mon", "tue", "wed", "thu", "fri", "sat", "sun"], // 7 days
    "timezones": ["morn", "aft", "eve", "night", "early", "late", "flex"] // 7 timezones
  },
  "unavailable": [
    [0,0,0], [0,0,1], [0,1,2], [0,2,3], // Person 0 unavailable slots
    [1,3,4], [1,4,5], [1,5,6],          // Person 1 unavailable slots  
    [2,0,6], [2,1,0], [2,2,1]           // Person 2 unavailable slots
    // ... more triplets [personIndex, dayIndex, timezoneIndex]
  ]
};

// JSON Size: ~800 bytes (0.8KB) - 98% reduction!

// =============================================================================
// OPTIMIZATION 3: Bit-packed ultra-compressed
// =============================================================================

const optimization3Data = {
  "success": true,
  "people": ["John", "Jane", "Bob"],
  "days": ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
  "timezones": ["morn", "aft", "eve", "night", "early", "late", "flex"],
  // Each person gets a bit array: 7 days × 7 timezones = 49 bits per person
  // 0 = available, 1 = unavailable
  // Packed into hex strings for maximum compression
  "unavailability": {
    "0": "1F4A3C8B9E", // John's unavailability pattern (hex)
    "1": "2E5D7A1F3C", // Jane's unavailability pattern (hex)  
    "2": "9B4E6F2A5D"  // Bob's unavailability pattern (hex)
  }
};

// JSON Size: ~200 bytes (0.2KB) - 99.6% reduction!

// =============================================================================
// REAL WORLD COMPARISON
// =============================================================================

console.log("Data Transfer Sizes (JSON serialized):");
console.log("Current System:     ~45,000 bytes (45KB)");
console.log("Optimization 1:     ~12,000 bytes (12KB) - 73% smaller");  
console.log("Optimization 2:        ~800 bytes (0.8KB) - 98% smaller");
console.log("Optimization 3:        ~200 bytes (0.2KB) - 99.6% smaller");

// =============================================================================
// BANDWIDTH IMPACT
// =============================================================================

console.log("\nBandwidth Impact:");
console.log("3G connection (1Mbps):");
console.log("- Current:     360ms transfer time");
console.log("- Optimized 2:   6ms transfer time (60x faster!)");
console.log("- Optimized 3:   1.6ms transfer time (225x faster!)");

console.log("\n4G connection (10Mbps):"); 
console.log("- Current:     36ms transfer time");
console.log("- Optimized 2:  0.6ms transfer time"); 
console.log("- Optimized 3:  0.16ms transfer time");

export { optimization2Data, optimization3Data };
