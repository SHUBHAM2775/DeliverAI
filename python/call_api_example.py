"""
Example: How to call the API from another file
This demonstrates how to use the API function
"""

from api import recommend_delivery_slots, print_recommendations


def main():
    """Example of calling the API from another file"""
    
    # Example 1: Basic call with all required inputs
    print("="*70)
    print("EXAMPLE 1: Basic API Call")
    print("="*70)
    
    result = recommend_delivery_slots(
        # Store inputs (required)
        store_id="STR_1023",
        pickup_availability_window="09:00-21:00",
        seller_allowed_time_range="10-21",  # Range: generates all 1-hour slots from 10 to 21
        parcel_category="Electronics",
        
        # Customer inputs (required)
        delivery_location=(19.186, 72.846),  # Mumbai coordinates
        
        # Optional: Store location
        store_latitude=19.176,
        store_longitude=72.836,
        
        # Configuration
        top_n_per_day=8
    )
    
    print_recommendations(result)
    
    # Example 2: Different city (Bangalore)
    print("\n\n" + "="*70)
    print("EXAMPLE 2: Different City (Bangalore)")
    print("="*70)
    
    result = recommend_delivery_slots(
        # Store inputs (required)
        store_id="STR_1500",
        pickup_availability_window="08:00-20:00",
        seller_allowed_time_range="09-20",  # Range: generates all 1-hour slots from 9 to 20
        parcel_category="Clothing",
        
        # Customer inputs (required)
        delivery_location=(12.981, 77.604),  # Customer location (Bangalore)
        
        # Optional: Store location
        store_latitude=12.971,
        store_longitude=77.594,
        
        # Configuration
        top_n_per_day=8
    )
    
    print_recommendations(result)
    
    # Example 3: Another city (Pune) with date and time preferences
    print("\n\n" + "="*70)
    print("EXAMPLE 3: Pune with Date/Time Preferences")
    print("="*70)
    
    result = recommend_delivery_slots(
        # Store inputs (required)
        store_id="STR_2000",
        pickup_availability_window="10:00-22:00",
        seller_allowed_time_range="10-21",  # Range: generates all 1-hour slots from 10 to 21
        parcel_category="Toys",
        
        # Customer inputs (required)
        delivery_location=(18.530, 73.866),  # Pune coordinates
        
        # Optional: Store location
        store_latitude=18.520,
        store_longitude=73.856,
        
        # Configuration
        top_n_per_day=8
    )
    
    print_recommendations(result)


if __name__ == "__main__":
    main()
