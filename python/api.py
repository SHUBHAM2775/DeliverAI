"""
Main API for Delivery Slot Recommendation
Accepts single Store and Customer inputs, returns top 8 recommended slots
"""

from inference import SlotRecommender
from datetime import datetime
from typing import Dict, List, Tuple, Optional
import os


def get_time_period(hour: int) -> str:
    """Get time period string from hour"""
    if 5 <= hour < 12:
        return "Morning"
    elif 12 <= hour < 17:
        return "Afternoon"
    elif 17 <= hour < 21:
        return "Evening"
    else:
        return "Night"

def recommend_delivery_slots(
    # Store inputs (required)
    store_id: str,
    pickup_availability_window: str,  # e.g., "09:00-21:00"
    seller_allowed_time_range: str,  # e.g., "10-21" (range, generates all 1-hour slots)
    parcel_category: str,               # e.g., "Electronics"
    
    # Customer inputs (required)
    delivery_location: Tuple[float, float],  # (latitude, longitude)
    
    # Optional inputs
    store_latitude: Optional[float] = None,  # Optional: if not provided, uses delivery location
    store_longitude: Optional[float] = None,
    selected_date: Optional[str] = None,     # Optional: e.g., "2024-01-15"
    
    # Model configuration (optional)
    model_path: str = "delivery_slot_model.pkl",
    date_range_days: int = 7,
    top_n_per_day: int = 8
) -> Dict:
    """
    Main API function to get delivery slot recommendations
    
    Args:
        store_id: Store identifier
        pickup_availability_window: Store pickup window (e.g., "09:00-21:00")
        seller_allowed_time_range: Time range for allowed slots (e.g., "10-21" generates 10-11, 11-12, ..., 20-21)
        parcel_category: Category of parcel
        store_latitude: Store latitude (optional, defaults to delivery location)
        store_longitude: Store longitude (optional, defaults to delivery location)
        delivery_location: Customer delivery location as (lat, lon) tuple
        selected_date: Optional user-selected date (YYYY-MM-DD format)
        model_path: Path to trained model file
        date_range_days: Number of days to look ahead (default: 7)
        top_n_per_day: Number of top slots to return per day (default: 8)
    
    Returns:
        Dictionary containing:
        - success: bool
        - recommendations_by_date: Dictionary with dates as keys and lists of top slots per day
        - message: Status message
    """
    
    try:
        # Try to find model file (check multiple possible paths)
        possible_paths = [
            model_path,
            f"work/{model_path}" if not model_path.startswith("work/") else model_path,
            model_path.replace("work/", "") if model_path.startswith("work/") else None
        ]
        
        actual_model_path = None
        for path in possible_paths:
            if path and os.path.exists(path):
                actual_model_path = path
                break
        
        if actual_model_path is None:
            return {
                'success': False,
                'recommendations': [],
                'message': f'Model file not found. Tried: {possible_paths}. Please train the model first.'
            }
        
        model_path = actual_model_path
        
        # Use delivery location as store location if not provided
        if store_latitude is None or store_longitude is None:
            store_latitude = delivery_location[0]
            store_longitude = delivery_location[1]
            print(f"⚠️  Store coordinates not provided. Using delivery location as proxy.")
        
        # Initialize recommender
        recommender = SlotRecommender(model_path)
        
        # Generate recommendations (returns dict by date)
        recommendations_by_date = recommender.recommend_slots(
            store_id=store_id,
            store_lat=store_latitude,
            store_lon=store_longitude,
            pickup_window=pickup_availability_window,
            seller_allowed_time_range=seller_allowed_time_range,
            parcel_category=parcel_category,
            delivery_lat=delivery_location[0],
            delivery_lon=delivery_location[1],
            date_range_days=date_range_days,
            top_n_per_day=top_n_per_day
        )
        
        # Format recommendations for output (keep structure by date)
        formatted_recommendations_by_date = {}
        total_slots = 0
        
        for date_str, day_slots in recommendations_by_date.items():
            formatted_day_slots = []
            for rec in day_slots:
                formatted_day_slots.append({
                    'date': str(rec['date']),
                    'slot': rec['slot'],
                    'datetime': rec['datetime'].isoformat(),
                    'success_probability': float(rec['success_probability']),
                    'day_of_week': int(rec['day_of_week']),
                    'hour': int(rec['hour']),
                    'period': get_time_period(rec['hour']),
                    'risk_score': rec.get('risk_score', 0.0),
                    'risk_reasons': rec.get('risk_reasons', []),
                    'day_name': rec['datetime'].strftime('%A')
                })
            formatted_recommendations_by_date[date_str] = formatted_day_slots
            total_slots += len(formatted_day_slots)
        
        return {
            'success': True,
            'recommendations_by_date': formatted_recommendations_by_date,
            'message': f'Successfully generated top {top_n_per_day} recommendations for {len(recommendations_by_date)} days ({total_slots} total slots)'
        }
        
    except Exception as e:
        return {
            'success': False,
            'recommendations': [],
            'message': f'Error generating recommendations: {str(e)}'
        }


def print_recommendations(result: Dict):
    """Print recommendations in a formatted way (grouped by day)"""
    if not result['success']:
        print(f"[ERROR] {result['message']}")
        return
    
    recommendations_by_date = result['recommendations_by_date']
    
    print("\n" + "="*70)
    print("DELIVERY SLOT RECOMMENDATIONS (Top 8 per Day)")
    print("="*70)
    print(f"\n{result['message']}\n")
    
    # Sort dates chronologically
    sorted_dates = sorted(recommendations_by_date.keys())
    
    for date_str in sorted_dates:
        day_slots = recommendations_by_date[date_str]
        if len(day_slots) > 0:
            first_slot = day_slots[0]
            day_name = first_slot['day_name']
            
            print(f"\n[DATE] {date_str} ({day_name})")
            print("-" * 70)
            
            for i, rec in enumerate(day_slots, 1):
                success_prob = rec['success_probability'] * 100
                risk_score = rec.get('risk_score', 0.0)
                reasons = rec.get('risk_reasons', [])
                
                print(f"  {i}. {rec['slot']} - Success: {success_prob:.2f}% | Risk: {risk_score:.2f}%")
                # Only show risk factors if risk is significant (>18%)
                if reasons and risk_score > 18:
                    print(f"     [!] Risk Factors: {', '.join(reasons)}")
    
    print("\n" + "="*70)


if __name__ == "__main__":
    # Example usage - can be called from another file
    print("🚀 Delivery Slot Recommendation API\n")
    
    # Example input data
    result = recommend_delivery_slots(
        # Store inputs (required)
        store_id="STR_1023",
        pickup_availability_window="09:00-21:00",
        seller_allowed_time_range="10-21",  # Range: generates 10-11, 11-12, ..., 20-21
        parcel_category="Electronics",
        
        # Customer inputs (required)
        delivery_location=(19.186, 72.846),
        
        # Optional inputs
        store_latitude=19.176,
        store_longitude=72.836,
        selected_date="2024-01-20",
        
        # Configuration
        date_range_days=7,
        top_n_per_day=8
    )
    
    # Print results
    print_recommendations(result)
