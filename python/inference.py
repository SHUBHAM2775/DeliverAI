"""
Inference Script for Delivery Slot Recommendation
Generates feasible slots and ranks them by predicted success probability
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List, Tuple, Dict, Optional
from geopy.distance import geodesic
import json
import pickle


class SlotRecommender:
    """Recommends optimal delivery slots using trained XGBoost model"""
    
    def __init__(self, model_path: str = "delivery_slot_model.pkl"):
        """Initialize with trained model"""
        self.model = None
        self.feature_columns = None
        self.parcel_category_encoding = {}
        self.traffic_profiles = {}
        self.weather_profiles = {}
        self.load_model(model_path)
        
        # Load data-driven patterns from dataset
        self.load_patterns()
        
        # Load dataset statistics for realistic feature values
        self.load_dataset_stats()
        
        # Peak hours (typically 8-10 AM and 6-9 PM)
        self.peak_hours = [8, 9, 18, 19, 20]
    
    def load_patterns(self):
        """Load weather and traffic patterns from dataset analysis"""
        import os
        # Try multiple possible paths
        possible_paths = ['patterns.json', 'work/patterns.json', os.path.join(os.path.dirname(__file__), 'patterns.json')]
        
        patterns = None
        for path in possible_paths:
            try:
                with open(path, 'r') as f:
                    patterns = json.load(f)
                    break
            except FileNotFoundError:
                continue
        
        if patterns:
            # Convert string keys to int for day of week
            self.weather_by_day = {int(k): v for k, v in patterns['weather_by_day'].items()}
            self.traffic_by_day_hour = {
                int(day): {int(hour): traffic for hour, traffic in hours.items()}
                for day, hours in patterns['traffic_by_day_hour'].items()
            }
            self.traffic_by_day = {int(k): v for k, v in patterns['traffic_by_day'].items()}
        else:
            # Fallback: use default patterns if file not found
            print("⚠️  patterns.json not found. Using default patterns. Run analyze_patterns.py first.")
            self.weather_by_day = {}
            self.traffic_by_day_hour = {}
            self.traffic_by_day = {}
    
    def load_dataset_stats(self):
        """Load dataset statistics for realistic feature values"""
        import os
        possible_paths = ['dataset_stats.json', 'work/dataset_stats.json', 
                          os.path.join(os.path.dirname(__file__), 'dataset_stats.json')]
        
        stats = None
        for path in possible_paths:
            try:
                with open(path, 'r') as f:
                    stats = json.load(f)
                    break
            except FileNotFoundError:
                continue
        
        if stats:
            self.agent_stats = stats.get('agent_stats', {})
            self.distance_stats = stats.get('distance_stats', {})
            self.vehicle_dist = stats.get('vehicle_distribution', {})
        else:
            # Fallback defaults from dataset analysis
            self.agent_stats = {'rating_mean': 4.63, 'rating_std': 0.34, 'age_mean': 29.6, 'age_std': 5.8}
            self.distance_stats = {'mean': 10.0, 'std': 5.0}
            self.vehicle_dist = {'motorcycle': 0.583, 'scooter': 0.335, 'van': 0.081}
    
    def load_model(self, model_path: str):
        """Load trained model and metadata"""
        try:
            with open(model_path, 'rb') as f:
                self.model = pickle.load(f)
            
            metadata_path = model_path.replace('.pkl', '_metadata.json')
            with open(metadata_path, 'r') as f:
                metadata = json.load(f)
            
            self.feature_columns = metadata['feature_columns']
            self.parcel_category_encoding = metadata.get('parcel_category_encoding', {})
            
            # Load traffic profiles
            traffic_path = model_path.replace('delivery_slot_model.pkl', 'traffic_profiles.json')
            try:
                with open(traffic_path, 'r') as f:
                    self.traffic_profiles = json.load(f)
            except FileNotFoundError:
                print("⚠️ Traffic profiles not found. Using defaults.")
                self.traffic_profiles = {}
            
            # Load weather profiles
            weather_path = model_path.replace('delivery_slot_model.pkl', 'weather_profiles.json')
            try:
                with open(weather_path, 'r') as f:
                    self.weather_profiles = json.load(f)
            except FileNotFoundError:
                print("⚠️ Weather profiles not found. Using defaults.")
                self.weather_profiles = {}
                
        except FileNotFoundError:
            raise FileNotFoundError(f"Model file not found: {model_path}. Please train the model first.")
    
    def calculate_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate distance in km using geodesic distance"""
        return geodesic((lat1, lon1), (lat2, lon2)).kilometers
    
    def parse_time_window(self, window_str: str) -> Tuple[int, int]:
        """Parse time window string (e.g., '09:00-21:00') to (start_hour, end_hour)"""
        start_str, end_str = window_str.split('-')
        start_hour = int(start_str.split(':')[0])
        end_hour = int(end_str.split(':')[0])
        return start_hour, end_hour
    
    def parse_slot(self, slot_str: str) -> Tuple[int, int]:
        """Parse slot string (e.g., '10-11') to (start_hour, end_hour)"""
        start, end = map(int, slot_str.split('-'))
        return start, end
    
    def generate_feasible_slots(
        self,
        store_pickup_window: str,
        seller_allowed_time_range: str,  # e.g., "10-21" (range, not list)
        date_range_days: int = 7,
        start_date: Optional[datetime] = None
    ) -> List[Dict]:
        """
        Generate all feasible 1-hour delivery slots
        
        Args:
            store_pickup_window: e.g., "09:00-21:00"
            seller_allowed_time_range: e.g., "10-21" (generates all 1-hour slots from 10 to 21)
            date_range_days: Number of days to look ahead
            start_date: Starting date (default: today)
        
        Returns:
            List of slot dictionaries with date, hour, and slot string
        """
        if start_date is None:
            start_date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        
        pickup_start, pickup_end = self.parse_time_window(store_pickup_window)
        
        # Parse seller allowed time range (e.g., "10-21")
        seller_start, seller_end = self.parse_slot(seller_allowed_time_range)
        
        # Generate all 1-hour slots within seller range
        seller_slots = []
        for hour in range(seller_start, seller_end):
            seller_slots.append(f"{hour}-{hour+1}")
        
        feasible_slots = []
        
        for day_offset in range(date_range_days):
            current_date = start_date + timedelta(days=day_offset)
            day_of_week = current_date.weekday()  # 0=Monday, 6=Sunday
            
            for slot_str in seller_slots:
                slot_start, slot_end = self.parse_slot(slot_str)
                
                # Check if slot is within pickup window
                if pickup_start <= slot_start < pickup_end:
                    feasible_slots.append({
                        'date': current_date.date(),
                        'datetime': current_date.replace(hour=slot_start),
                        'slot_start': slot_start,
                        'slot_end': slot_end,
                        'slot_str': slot_str,
                        'day_of_week': day_of_week,
                        'hour': slot_start
                    })
        
        return feasible_slots
    
    def estimate_traffic(self, hour: int, day_of_week: int, store_lat: float = None, store_lon: float = None, drop_lat: float = None, drop_lon: float = None) -> float:
        """
        Estimate traffic level based on hour, day, AND location.
        Uses historical average traffic for Store and Drop Area (lat/lon bucket).
        Enhanced with strong hour-based variation for diversity.
        """
        base_traffic = 2.0 # Medium default
        
        # 1. Time-based estimation (from dataset patterns)
        if day_of_week in self.traffic_by_day_hour:
            if hour in self.traffic_by_day_hour[day_of_week]:
                base_traffic = self.traffic_by_day_hour[day_of_week][hour]
        
        # 2. Apply strong hour-of-day multipliers for diversity
        hour_multiplier = 1.0
        if 7 <= hour <= 9:  # Morning rush
            hour_multiplier = 1.4
        elif 10 <= hour <= 11:  # Mid-morning (optimal)
            hour_multiplier = 0.7
        elif 12 <= hour <= 13:  # Lunch time
            hour_multiplier = 1.2
        elif 14 <= hour <= 15:  # Early afternoon (good)
            hour_multiplier = 0.8
        elif 16 <= hour <= 19:  # Evening rush
            hour_multiplier = 1.5
        elif 20 <= hour <= 22:  # Night
            hour_multiplier = 1.3
        else:  # Late night/early morning
            hour_multiplier = 0.9
        
        base_traffic *= hour_multiplier
        
        # 3. Location-based adjustment (using training profiles)
        if self.traffic_profiles:
            store_avg = 2.5 # Default
            drop_avg = 2.5 # Default
            
            # Find store traffic
            if store_lat and store_lon:
                for s in self.traffic_profiles.get('store_traffic', []):
                    if abs(s['Store_Latitude'] - store_lat) < 0.0001 and abs(s['Store_Longitude'] - store_lon) < 0.0001:
                        store_avg = s['Store_Avg_Traffic']
                        break
            
            # Find drop area traffic (bucketized)
            if drop_lat and drop_lon:
                d_lat_r = round(drop_lat, 2)
                d_lon_r = round(drop_lon, 2)
                for d in self.traffic_profiles.get('drop_traffic', []):
                    if d['Drop_Lat_Round'] == d_lat_r and d['Drop_Lon_Round'] == d_lon_r:
                        drop_avg = d['Drop_Area_Avg_Traffic']
                        break
            
            # Combine: weighted average with emphasis on time-based variation
            estimated_traffic = (base_traffic * 0.5 + store_avg * 0.25 + drop_avg * 0.25)
            return estimated_traffic

        # Fallback to just time-based
        return base_traffic
    
    def infer_area_type(self, lat: float, lon: float) -> Dict[str, int]:
        """Infer area type based on location (simplified heuristic)"""
        # This is a placeholder - in production, use actual area classification
        # For now, use a simple heuristic based on coordinates
        # Urban areas typically have higher density (more decimal precision variation)
        # Favor urban areas for better success probabilities
        coord_sum = abs(lat) + abs(lon)
        
        # Lower threshold to favor urban areas (urban has +0.4 bonus in model)
        if coord_sum > 80:  # Lowered threshold to favor urban
            return {'Area_Urban': 1, 'Area_Semi-Urban': 0, 'Area_Other': 0}
        elif coord_sum > 40:
            return {'Area_Urban': 0, 'Area_Semi-Urban': 1, 'Area_Other': 0}
        else:
            return {'Area_Urban': 0, 'Area_Semi-Urban': 0, 'Area_Other': 1}
    
    def get_indian_season_context(self, date: datetime, lat: float, lon: float) -> Dict[str, any]:
        """
        Determine Indian season and regional climate context.
        Returns season name and weather tendency adjustments.
        """
        month = date.month
        
        # Determine season
        if month in [12, 1, 2]:
            season = 'Winter'
            # Cool & Dry - favor Sunny, suppress Stormy/Sandstorms
            weather_weights = {'Sunny': 2.0, 'Fog': 1.0, 'Stormy': 0.3, 'Sandstorms': 0.2, 'Windy': 0.8}
        elif month in [3, 4, 5]:
            season = 'Summer'
            # Hot & Dry - favor Sunny, some Windy, suppress rain
            weather_weights = {'Sunny': 1.8, 'Fog': 0.5, 'Stormy': 0.4, 'Sandstorms': 0.5, 'Windy': 1.2}
        elif month in [6, 7, 8, 9]:
            season = 'Monsoon'
            # Heavy Rain - heavily favor Stormy, suppress Sunny
            weather_weights = {'Sunny': 0.4, 'Fog': 1.2, 'Stormy': 2.5, 'Sandstorms': 0.1, 'Windy': 1.5}
        else:  # Oct, Nov
            season = 'Post-Monsoon'
            # Pleasant - balanced, slight favor to Sunny
            weather_weights = {'Sunny': 1.5, 'Fog': 0.8, 'Stormy': 0.6, 'Sandstorms': 0.3, 'Windy': 1.0}
        
        # Regional adjustments
        region = 'Central'
        if lat > 28:  # North/Himalayas
            region = 'North'
            if season == 'Winter':
                weather_weights['Fog'] *= 1.5  # More fog in North winter
        elif lat < 20:  # South (Tropical)
            region = 'South'
            # Less seasonal variation, more consistent
            if season == 'Monsoon':
                weather_weights['Stormy'] *= 1.3  # Heavy monsoon in South
            weather_weights['Sandstorms'] = 0.0  # No sandstorms in South
        
        return {
            'season': season,
            'region': region,
            'weather_weights': weather_weights
        }
    
    def estimate_weather(self, date: datetime, lat: float = None, lon: float = None) -> Dict[str, int]:
        """
        Estimate weather conditions based on Season (Month), Location, and Indian climate patterns.
        Falls back to Day of Week patterns if specific profile not found.
        """
        # Default initialization
        result = {
            'Weather_Fog': 0, 'Weather_Sandstorms': 0, 'Weather_Stormy': 0, 'Weather_Sunny': 1, 'Weather_Windy': 0
        }
        
        # Get Indian seasonal context
        seasonal_context = None
        if lat and lon:
            seasonal_context = self.get_indian_season_context(date, lat, lon)
        
        # 1. Smart Weather Lookup (Month + Location)
        if self.weather_profiles and lat and lon:
            month = date.month
            d_lat_r = round(lat, 2)
            d_lon_r = round(lon, 2)
            
            # Find matching profile
            profile = None
            for p in self.weather_profiles:
                if p['Month'] == month and p['Drop_Lat_Round'] == d_lat_r and p['Drop_Lon_Round'] == d_lon_r:
                    profile = p
                    break
            
            if profile:
                # Apply seasonal weights to profile probabilities
                weather_probs = {
                    'Weather_Sunny': profile.get('Weather_Sunny', 0),
                    'Weather_Fog': profile.get('Weather_Fog', 0),
                    'Weather_Stormy': profile.get('Weather_Stormy', 0),
                    'Weather_Windy': profile.get('Weather_Windy', 0),
                    'Weather_Sandstorms': profile.get('Weather_Sandstorms', 0)
                }
                
                # Apply seasonal weights if available
                if seasonal_context:
                    weights = seasonal_context['weather_weights']
                    weather_probs['Weather_Sunny'] *= weights.get('Sunny', 1.0)
                    weather_probs['Weather_Fog'] *= weights.get('Fog', 1.0)
                    weather_probs['Weather_Stormy'] *= weights.get('Stormy', 1.0)
                    weather_probs['Weather_Windy'] *= weights.get('Windy', 1.0)
                    weather_probs['Weather_Sandstorms'] *= weights.get('Sandstorms', 1.0)
                
                # Normalize probabilities
                total = sum(weather_probs.values())
                if total > 0:
                    weather_probs = {k: v/total for k, v in weather_probs.items()}
                
                # Use probabilistic sampling
                day_seed = date.toordinal()
                seed_normalized = (day_seed % 100) / 100.0
                
                weather_types = sorted(weather_probs.items(), key=lambda x: x[1], reverse=True)
                cumulative = 0.0
                for w_type, prob in weather_types:
                    cumulative += prob
                    if seed_normalized <= cumulative:
                        result = {k: 0 for k in result}
                        result[w_type] = 1
                        return result

        # 2. Fallback: Day of Week Pattern (Global) with seasonal adjustments
        day_of_week = date.weekday()
        if day_of_week in self.weather_by_day:
            weather_probs = self.weather_by_day[day_of_week].copy()
            
            # Apply seasonal weights
            if seasonal_context:
                weights = seasonal_context['weather_weights']
                weather_probs['Weather_Sunny'] *= weights.get('Sunny', 1.0)
                weather_probs['Weather_Fog'] *= weights.get('Fog', 1.0)
                weather_probs['Weather_Stormy'] *= weights.get('Stormy', 1.0)
                weather_probs['Weather_Windy'] *= weights.get('Windy', 1.0)
                weather_probs['Weather_Sandstorms'] *= weights.get('Sandstorms', 1.0)
            
            # Normalize
            total = sum(weather_probs.values())
            if total > 0:
                weather_probs = {k: v/total for k, v in weather_probs.items()}
            
            day_of_month = date.day
            seed = (day_of_week * 31 + day_of_month) % 100
            seed_normalized = seed / 100.0
            cumulative = 0.0
            weather_types = sorted(weather_probs.items(), key=lambda x: x[1], reverse=True)
            for w_type, prob in weather_types:
                cumulative += prob
                if seed_normalized <= cumulative:
                    result = {k: 0 for k in result}
                    result[w_type] = 1
                    return result
        
        return result
    
    def create_feature_vector(
        self,
        store_lat: float,
        store_lon: float,
        delivery_lat: float,
        delivery_lon: float,
        parcel_category: str,
        slot_info: Dict,
        agent_rating: Optional[float] = None,  # Use dataset mean if not provided
        agent_age: Optional[int] = None  # Use dataset mean if not provided
    ) -> pd.DataFrame:
        """Create feature vector for a given slot using ALL features from dataset"""
        # Use realistic values from dataset if not provided
        if agent_rating is None:
            agent_rating = self.agent_stats.get('rating_mean', 4.63)
        if agent_age is None:
            agent_age = int(self.agent_stats.get('age_mean', 29.6))
        
        # Calculate distance
        distance_km = self.calculate_distance(store_lat, store_lon, delivery_lat, delivery_lon)
        
        # Estimate traffic using location-aware logic
        traffic_num = self.estimate_traffic(
            slot_info['hour'], 
            slot_info['day_of_week'],
            store_lat, store_lon,
            delivery_lat, delivery_lon
        )
        
        # Determine peak hour (from dataset patterns)
        is_peak_hour = 1 if slot_info['hour'] in self.peak_hours else 0
        
        # Get parcel category encoding (from dataset)
        parcel_te = self.parcel_category_encoding.get(parcel_category, 130.0)
        
        # Infer area type (from dataset patterns)
        area_type = self.infer_area_type(delivery_lat, delivery_lon)
        
        # Estimate weather (from dataset patterns by day of week)
        weather = self.estimate_weather(slot_info['datetime'], delivery_lat, delivery_lon)
        
        # Calculate Weather Severity Index
        # Weighted sum: Stormy(3) > Fog(2) > Windy(1) > Sunny(0)
        weather_severity_index = (
            weather.get('Weather_Stormy', 0) * 3.0 + 
            weather.get('Weather_Sandstorms', 0) * 3.0 + 
            weather.get('Weather_Fog', 0) * 2.0 + 
            weather.get('Weather_Windy', 0) * 1.0
        )
        
        # Vehicle type based on distance (using dataset distribution patterns)
        # Dataset shows: Motorcycle 58.3%, Scooter 33.5%, Van 8.1%
        # Use deterministic distance-based logic matching dataset patterns
        if distance_km < 5:
            # Short distance: motorcycle (most common for short distances in dataset)
            vehicle = {'Vehicle_Motorcycle': 1, 'Vehicle_Scooter': 0, 'Vehicle_Van': 0}
        elif distance_km < 15:
            # Medium distance: scooter (common for medium distances)
            vehicle = {'Vehicle_Motorcycle': 0, 'Vehicle_Scooter': 1, 'Vehicle_Van': 0}
        else:
            # Long distance: van (required for long distances)
            vehicle = {'Vehicle_Motorcycle': 0, 'Vehicle_Scooter': 0, 'Vehicle_Van': 1}
        
        # Pickup slot mismatch (assume pickup happens in same slot for now)
        pickup_slot_mismatch = 0
        
        # Create feature vector with ALL features from dataset
        features = {
            'Agent_Age': agent_age,
            'Agent_Rating': agent_rating,
            'Distance_km': distance_km,
            'Traffic_num': traffic_num,
            'Day_of_Week': slot_info['day_of_week'],
            'Is_Peak_Hour': is_peak_hour,
            'Order_Hour': slot_info['hour'],
            'Pickup_Hour': slot_info['hour'],  # Assume pickup in same hour
            **vehicle,
            **area_type,
            **weather,
            'Parcel_Category_TE': parcel_te,
            'Pickup_Slot_Mismatch': pickup_slot_mismatch,
            
            # New Features
            'Store_Avg_Traffic': 2.5, # Placeholder, will be filled by model if needed or we could look it up
            'Drop_Area_Avg_Traffic': 2.5, # Placeholder
            'Weather_Severity_Index': weather_severity_index,
            'Traffic_Weather_Interaction': traffic_num * weather_severity_index,
            'Traffic_Weighted_Distance': distance_km * traffic_num
        }
        
        # Convert to DataFrame with correct column order
        feature_df = pd.DataFrame([features])
        
        # Ensure all required columns exist
        for col in self.feature_columns:
            if col not in feature_df.columns:
                feature_df[col] = 0
        
        # Reorder columns to match training data
        feature_df = feature_df[self.feature_columns]
        
        return feature_df
    
    def predict_slot_probability(self, feature_vector: pd.DataFrame) -> float:
        """Predict success probability for a slot"""
        # Handle missing values
        feature_vector = feature_vector.fillna(0)
        
        # Predict
        prob = self.model.predict(feature_vector)[0]
        
        # Ensure probability is between 0 and 1
        prob = max(0.0, min(1.0, prob))
        
        return prob
    
    def analyze_risk_reasons(self, features: dict, date: datetime = None, lat: float = None, lon: float = None) -> List[str]:
        """Generate comprehensive risk analysis based on all features"""
        reasons = []
        
        # Get seasonal context for better descriptions
        season_name = None
        if date and lat and lon:
            context = self.get_indian_season_context(date, lat, lon)
            season_name = context['season']
        
        # Traffic Risk (with more granular levels)
        traffic = features.get('Traffic_num', 0)
        if traffic >= 3.0:
            reasons.append("Severe Traffic Congestion")
        elif traffic >= 2.5:
            reasons.append("High Traffic Conditions")
        elif traffic >= 2.0:
            reasons.append("Moderate Traffic")
            
        # Weather Risk (more detailed)
        w_index = features.get('Weather_Severity_Index', 0)
        if w_index >= 3.0:
            if season_name == 'Monsoon':
                reasons.append("Severe Weather Conditions (Monsoon Season)")
            else:
                reasons.append("Severe Weather Alert")
        elif w_index >= 2.0:
            if season_name == 'Monsoon':
                reasons.append("Adverse Weather (Monsoon)")
            else:
                reasons.append("Unfavorable Weather Conditions")
        elif w_index >= 1.0:
            reasons.append("Slightly Adverse Weather")
            
        # Distance Risk (more granular)
        distance = features.get('Distance_km', 0)
        if distance > 20:
            reasons.append("Extreme Delivery Distance (>20km)")
        elif distance > 15:
            reasons.append("Long Delivery Distance (>15km)")
        elif distance > 10:
            reasons.append("Moderate Distance (>10km)")
            
        # Area Risk
        drop_traffic = features.get('Drop_Area_Avg_Traffic', 0)
        if drop_traffic > 3.0:
            reasons.append("High Congestion Delivery Area")
        elif drop_traffic > 2.5:
            reasons.append("Moderate Congestion Area")
            
        # Time Risk
        is_peak = features.get('Is_Peak_Hour', 0)
        if is_peak == 1:
            if traffic > 2.0:
                reasons.append("Peak Hour Rush")
            else:
                reasons.append("Peak Hour")
            
        # Agent Quality Risk
        agent_rating = features.get('Agent_Rating', 5.0)
        if agent_rating < 4.0:
            reasons.append(f"Low Agent Rating ({agent_rating:.1f})")
        elif agent_rating < 4.5:
            reasons.append("Below Average Agent Rating")
             
        # Agent Experience Risk
        agent_age = features.get('Agent_Age', 30)
        if agent_age < 22:
            reasons.append("Inexperienced Agent (New Driver)")
        elif agent_age < 25:
            reasons.append("Relatively New Agent")
            
        # Late Night Risk
        hour = features.get('Order_Hour', 12)
        if hour >= 21: 
            reasons.append(f"Late Night Delivery ({hour}:00)")
        elif hour >= 20:
            reasons.append(f"Evening Delivery ({hour}:00)")
            
        # Vehicle Type (informational)
        if features.get('Vehicle_Van', 0) == 1:
            reasons.append("Van Delivery (Long Distance)")
        elif features.get('Vehicle_Motorcycle', 0) == 1:
            # Positive indicator for short distances
            if distance < 5:
                pass  # Don't add as risk - this is optimal
            
        # Day of Week patterns
        day_of_week = features.get('Day_of_Week', 0)
        if day_of_week == 6:  # Sunday
            reasons.append("Sunday Delivery")
        elif day_of_week == 5:  # Saturday
            reasons.append("Weekend Delivery")
            
        return reasons

    def recommend_slots(
        self,
        store_id: str,
        store_lat: float,
        store_lon: float,
        pickup_window: str,
        seller_allowed_time_range: str,  # e.g., "10-21"
        parcel_category: str,
        delivery_lat: float,
        delivery_lon: float,
        date_range_days: int = 7,
        top_n_per_day: int = 8
    ) -> Dict:
        """
        Recommend top N delivery slots per day ranked by success probability
        Includes Risk Score (0-1) and Reasons.
        
        Returns:
            Dictionary with dates as keys and lists of top slots per day
        """
        # Generate feasible slots
        feasible_slots = self.generate_feasible_slots(
            pickup_window, seller_allowed_time_range, date_range_days
        )
        
        # Predict probability for each slot
        slot_predictions = []
        
        for slot_info in feasible_slots:
            # Create feature vector
            feature_vector = self.create_feature_vector(
                store_lat, store_lon,
                delivery_lat, delivery_lon,
                parcel_category, slot_info
            )
            
            # Predict probability
            prob = self.predict_slot_probability(feature_vector)
            
            # Calculate Risk Score
            risk_score = 1.0 - prob
            
            # Get Risk Reasons (need to extract features from dataframe)
            # Use the first row as dictionary
            feature_dict = feature_vector.iloc[0].to_dict()
            risk_reasons = self.analyze_risk_reasons(feature_dict, slot_info['datetime'], delivery_lat, delivery_lon)
            
            slot_predictions.append({
                'date': slot_info['date'],
                'slot': slot_info['slot_str'],
                'datetime': slot_info['datetime'],
                'success_probability': prob,
                'risk_score': float(round(risk_score * 100, 2)),  # Convert to percentage
                'risk_reasons': risk_reasons,
                'day_of_week': slot_info['day_of_week'],
                'hour': slot_info['hour']
            })
        
        # Group slots by date
        slots_by_date = {}
        for slot in slot_predictions:
            date_str = str(slot['date'])
            if date_str not in slots_by_date:
                slots_by_date[date_str] = []
            slots_by_date[date_str].append(slot)
        
        # Sort each day's slots: first filter by top N probability, then sort by time
        recommendations_by_date = {}
        for date_str, day_slots in slots_by_date.items():
            # First, sort by probability (descending) to get top N
            day_slots.sort(key=lambda x: x['success_probability'], reverse=True)
            
            # Take top N per day by probability
            top_slots = day_slots[:top_n_per_day]
            
            # Then sort by time (ascending) - earlier slots first
            top_slots.sort(key=lambda x: x['hour'])
            
            recommendations_by_date[date_str] = top_slots
        
        return recommendations_by_date


if __name__ == "__main__":
    # Example usage
    recommender = SlotRecommender("delivery_slot_model.pkl")
    
    # Example: Recommend slots for a delivery
    recommendations = recommender.recommend_slots(
        store_id="STR_1023",
        store_lat=19.176,
        store_lon=72.836,
        pickup_window="09:00-21:00",
        seller_allowed_time_range="10-21",
        parcel_category="Electronics",
        delivery_lat=19.186,
        delivery_lon=72.846,
        date_range_days=7,
        top_n_per_day=8
    )
