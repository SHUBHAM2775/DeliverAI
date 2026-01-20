"""
XGBoost Model Training Script
- Trains on FULL dataset (all 41,048 records)
- Uses ALL available columns (26 numeric features)
- Each delivery item is treated INDEPENDENTLY
- Generates delivery slot recommendations with specific dates
"""


import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import pickle
import json
from datetime import datetime


class DeliverySlotPredictor:
    """XGBoost model for predicting delivery success probability"""
    
    def __init__(self):
        self.model = None
        self.feature_columns = None
        self.feature_columns = None
        self.feature_columns = None
        self.parcel_category_encoding = {}
        self.traffic_profiles = {}  # Store location-based traffic patterns
        self.weather_profiles = {}  # Store season/location-based weather patterns
        self.scaler = None
    
    def load_data(self, filepath: str = "amazon_delivery_final-final.csv"):
        """Load and prepare training data"""
        print(f"Loading data from {filepath}...")
        df = pd.read_csv(filepath)
        print(f"Loaded {len(df)} records")
        return df
    
    def engineer_features(self, df: pd.DataFrame):
        """Engineer features for model training - uses ALL available columns"""
        print("Engineering features...")
        
        # Calculate distance if not present (using Haversine formula approximation)
        if 'Distance_km' not in df.columns:
            df['Distance_km'] = np.sqrt(
                (df['Drop_Latitude'] - df['Store_Latitude'])**2 + 
                (df['Drop_Longitude'] - df['Store_Longitude'])**2
            ) * 111  # Approximate km conversion
        
        # Store parcel category encoding
        if 'Parcel_Category_TE' in df.columns:
            self.parcel_category_encoding = df.groupby('Parcel_Category')['Parcel_Category_TE'].first().to_dict()
            
        # -------------------------------------------------------------------------
        # NEW: Location-Based Traffic Profiles
        # -------------------------------------------------------------------------
        print("Computing location-based traffic profiles...")
        
        # 1. Store Traffic Profile
        store_traffic = df.groupby(['Store_Latitude', 'Store_Longitude'])['Traffic_num'].mean().reset_index()
        store_traffic.columns = ['Store_Latitude', 'Store_Longitude', 'Store_Avg_Traffic']
        df = df.merge(store_traffic, on=['Store_Latitude', 'Store_Longitude'], how='left')
        
        # 2. Drop Area Traffic Profile (Round lat/long to 2 decimal places ~1.1km used as 'Area')
        df['Drop_Lat_Round'] = df['Drop_Latitude'].round(2)
        df['Drop_Lon_Round'] = df['Drop_Longitude'].round(2)
        
        drop_traffic = df.groupby(['Drop_Lat_Round', 'Drop_Lon_Round'])['Traffic_num'].mean().reset_index()
        drop_traffic.columns = ['Drop_Lat_Round', 'Drop_Lon_Round', 'Drop_Area_Avg_Traffic']
        df = df.merge(drop_traffic, on=['Drop_Lat_Round', 'Drop_Lon_Round'], how='left')
        
        # Save profiles for inference
        self.traffic_profiles = {
            'store_traffic': store_traffic.to_dict('records'),
            'drop_traffic': drop_traffic.to_dict('records')
        }
        
        # Fill missing with global average if any
        global_avg_traffic = df['Traffic_num'].mean()
        df['Store_Avg_Traffic'] = df['Store_Avg_Traffic'].fillna(global_avg_traffic)
        df['Drop_Area_Avg_Traffic'] = df['Drop_Area_Avg_Traffic'].fillna(global_avg_traffic)
        
        # -------------------------------------------------------------------------
        # NEW: Smart Weather Profiling (Seasonality + Location)
        # -------------------------------------------------------------------------
        print("Computing smart weather profiles (Season + Location)...")
        
        # Extract Month from Order_Date if available
        if 'Order_Date' in df.columns:
            # Ensure datetime
            temp_dates = pd.to_datetime(df['Order_Date'], errors='coerce')
            df['Month'] = temp_dates.dt.month
        else:
            # Fallback if no date (unlikely in this dataset)
            df['Month'] = 1
            
        # Group by Month and Drop Location (already rounded)
        # Calculate probability/mean of each weather type
        weather_cols = ['Weather_Sunny', 'Weather_Stormy', 'Weather_Sandstorms', 'Weather_Fog', 'Weather_Windy']
        
        # Ensure columns exist
        available_weather_cols = [c for c in weather_cols if c in df.columns]
        
        if available_weather_cols:
            weather_group = df.groupby(['Month', 'Drop_Lat_Round', 'Drop_Lon_Round'])[available_weather_cols].mean().reset_index()
            # Convert to dictionary for fast lookup: {(Month, Lat, Lon): {Weather_Sunny: 0.8, ...}}
            # We'll save it as a list of records for JSON serialization
            self.weather_profiles = weather_group.to_dict('records')
        
        # -------------------------------------------------------------------------
        # NEW: Weather Severity Index
        # -------------------------------------------------------------------------
        print("Calculating Weather Severity...")
        # Weighted sum: Stormy(3) > Fog(2) > Windy(1) > Sunny(0) > Sandstorms(3)
        df['Weather_Severity_Index'] = (
            df['Weather_Stormy'] * 3.0 + 
            df['Weather_Sandstorms'] * 3.0 + 
            df['Weather_Fog'] * 2.0 + 
            df['Weather_Windy'] * 1.0 + 
            df['Weather_Sunny'] * 0.0
        )
        
        # -------------------------------------------------------------------------
        # NEW: Interaction Features
        # -------------------------------------------------------------------------
        # Traffic * Weather (Bad traffic in bad weather is worse)
        df['Traffic_Weather_Interaction'] = df['Traffic_num'] * df['Weather_Severity_Index']
        
        # Distance * Traffic (Long distance in bad traffic is worse)
        df['Traffic_Weighted_Distance'] = df['Distance_km'] * df['Traffic_num']
        
        # Use ALL columns except IDs, dates, and target variables
        # This ensures we use the complete dataset for training
        exclude_cols = [
            'Order_ID',  # Identifier
            'Order_Date',  # Date string (we use derived features instead)
            'Actual_Delivery_Time',  # Target-related
            'First_Attempt_Success',  # Target-related
            'First_Attempt_Success_Prob',  # This is our target variable
            'Parcel_Category',  # Categorical (we use TE encoding instead)
            'Traffic',  # Categorical (we use numeric encoding instead)
            'Order_Slot',  # Slot identifier (derived features used)
            'Pickup_Slot',  # Slot identifier (derived features used)
            'Drop_Lat_Round', # Intermediate col
            'Drop_Lon_Round'  # Intermediate col
        ]
        
        # Get all numeric/encoded features
        all_columns = df.columns.tolist()
        feature_cols = [col for col in all_columns if col not in exclude_cols]
        
        # Verify all features are numeric
        numeric_features = []
        for col in feature_cols:
            if pd.api.types.is_numeric_dtype(df[col]):
                numeric_features.append(col)
            else:
                print(f"Skipping non-numeric column: {col}")
        
        self.feature_columns = numeric_features
        
        print(f"\n✓ Using ALL {len(numeric_features)} available features from dataset:")
        print(f"  {', '.join(numeric_features)}")
        
        return df
    
    def train(self, df: pd.DataFrame, test_size: float = 0.2, random_state: int = 42):
        """Train XGBoost model"""
        print("\nTraining XGBoost model...")
        
        # Prepare features and target
        X = df[self.feature_columns].copy()
        y = df['First_Attempt_Success_Prob'].copy()
        
        # Handle missing values
        X = X.fillna(X.median())
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state
        )
        
        print(f"Training set: {len(X_train)} samples")
        print(f"Test set: {len(X_test)} samples")
        
        # Train XGBoost regressor
        self.model = xgb.XGBRegressor(
            n_estimators=200,
            max_depth=6,
            learning_rate=0.1,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=random_state,
            eval_metric='rmse'
        )
        
        self.model.fit(
            X_train, y_train,
            eval_set=[(X_test, y_test)],
            verbose=False
        )
        
        # Evaluate
        y_pred_train = self.model.predict(X_train)
        y_pred_test = self.model.predict(X_test)
        
        train_rmse = np.sqrt(mean_squared_error(y_train, y_pred_train))
        test_rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))
        test_mae = mean_absolute_error(y_test, y_pred_test)
        test_r2 = r2_score(y_test, y_pred_test)
        
        print("\nModel Performance:")
        print(f"Train RMSE: {train_rmse:.4f}")
        print(f"Test RMSE: {test_rmse:.4f}")
        print(f"Test MAE: {test_mae:.4f}")
        print(f"Test R²: {test_r2:.4f}")
        
        return {
            'train_rmse': train_rmse,
            'test_rmse': test_rmse,
            'test_mae': test_mae,
            'test_r2': test_r2
        }
    
    def save_model(self, model_path: str = "delivery_slot_model.pkl"):
        """Save trained model and metadata"""
        if self.model is None:
            raise ValueError("Model not trained. Call train() first.")
        
        # Save model
        with open(model_path, 'wb') as f:
            pickle.dump(self.model, f)
        print(f"\nModel saved to {model_path}")
        
        # Save metadata
        metadata = {
            'feature_columns': self.feature_columns,
            'parcel_category_encoding': self.parcel_category_encoding,
            'model_type': 'XGBoost Regressor',
            'saved_at': datetime.now().isoformat()
        }
        
        metadata_path = model_path.replace('.pkl', '_metadata.json')
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        print(f"Metadata saved to {metadata_path}")
        
        # Save traffic profiles
        traffic_path = model_path.replace('delivery_slot_model.pkl', 'traffic_profiles.json')
        with open(traffic_path, 'w') as f:
            json.dump(self.traffic_profiles, f, indent=2)
        print(f"Traffic profiles saved to {traffic_path}")
        
        # Save weather profiles
        weather_path = model_path.replace('delivery_slot_model.pkl', 'weather_profiles.json')
        with open(weather_path, 'w') as f:
            json.dump(self.weather_profiles, f, indent=2)
        print(f"Weather profiles saved to {weather_path}")
    
    def load_model(self, model_path: str = "delivery_slot_model.pkl"):
        """Load trained model and metadata"""
        with open(model_path, 'rb') as f:
            self.model = pickle.load(f)
        
        metadata_path = model_path.replace('.pkl', '_metadata.json')
        with open(metadata_path, 'r') as f:
            metadata = json.load(f)
        
        self.feature_columns = metadata['feature_columns']
        self.parcel_category_encoding = metadata.get('parcel_category_encoding', {})
        
        # Load traffic profiles if available
        traffic_path = model_path.replace('delivery_slot_model.pkl', 'traffic_profiles.json')
        try:
            with open(traffic_path, 'r') as f:
                self.traffic_profiles = json.load(f)
            print(f"Traffic profiles loaded from {traffic_path}")
        except FileNotFoundError:
            print("⚠️ No traffic profiles found. Using defaults.")
            self.traffic_profiles = {}
            
        # Load weather profiles if available
        weather_path = model_path.replace('delivery_slot_model.pkl', 'weather_profiles.json')
        try:
            with open(weather_path, 'r') as f:
                self.weather_profiles = json.load(f)
            print(f"Weather profiles loaded from {weather_path}")
        except FileNotFoundError:
            print("⚠️ No weather profiles found. Using defaults.")
            self.weather_profiles = {}
        
        print(f"Model loaded from {model_path}")
    
    def recommend_delivery_slots(self, delivery_info: dict, num_days: int = 10, slots_per_day: int = 4):
        """
        Generate delivery slot recommendations for the next N days.
        Each delivery is treated independently with its own feature set.
        
        Args:
            delivery_info: Dictionary with delivery details (agent, location, parcel info)
            num_days: Number of days to generate recommendations for
            slots_per_day: Number of time slots per day
            
        Returns:
            List of recommended slots with dates, times, and success probabilities
        """
        if self.model is None:
            raise ValueError("Model not loaded. Call load_model() first.")
        
        from datetime import datetime, timedelta
        
        print(f"\n🎯 Generating delivery slot recommendations...")
        print(f"   Days: {num_days}, Slots per day: {slots_per_day}")
        
        # Define time slots (24-hour format)
        time_slots = [
            {"slot_name": "Morning", "hour": 9, "is_peak": 0},
            {"slot_name": "Midday", "hour": 12, "is_peak": 1},
            {"slot_name": "Afternoon", "hour": 15, "is_peak": 1},
            {"slot_name": "Evening", "hour": 18, "is_peak": 1}
        ][:slots_per_day]
        
        recommendations = []
        base_date = datetime.now()
        
        # Generate independent predictions for each slot
        for day_offset in range(num_days):
            delivery_date = base_date + timedelta(days=day_offset)
            day_of_week = delivery_date.weekday()  # 0=Monday, 6=Sunday
            
            for slot in time_slots:
                # Create INDEPENDENT feature set for this specific slot
                # Each delivery slot is treated as a separate prediction
                features = {}
                
                # Copy base delivery information
                for col in self.feature_columns:
                    if col in delivery_info:
                        features[col] = delivery_info[col]
                    elif col == 'Day_of_Week':
                        features[col] = day_of_week
                    elif col == 'Is_Peak_Hour':
                        features[col] = slot['is_peak']
                    elif col == 'Order_Hour':
                        features[col] = slot['hour']
                    elif col == 'Pickup_Hour':
                        features[col] = slot['hour'] + 1  # Assume 1 hour pickup
                    elif col == 'Order_Minutes':
                        features[col] = 0
                    elif col == 'Pickup_Minutes':
                        features[col] = 0
                    elif col == 'Pickup_Slot_Mismatch':
                        features[col] = 0
                    elif col == 'Store_Avg_Traffic':
                        # Use global average if specific store not found (approx 2.5)
                        features[col] = delivery_info.get('Store_Avg_Traffic', 2.5)
                    elif col == 'Drop_Area_Avg_Traffic':
                        # Use global average if specific drop area not found (approx 2.5)
                        features[col] = delivery_info.get('Drop_Area_Avg_Traffic', 2.5)
                    elif col == 'Weather_Severity_Index':
                        # Calculate on fly if weather bits provided
                        w_score = (delivery_info.get('Weather_Stormy', 0)*3 + 
                                   delivery_info.get('Weather_Sandstorms', 0)*3 +
                                   delivery_info.get('Weather_Fog', 0)*2 +
                                   delivery_info.get('Weather_Windy', 0)*1)
                        features[col] = w_score
                    elif col == 'Traffic_Weather_Interaction':
                        # Approx check
                        traffic = features.get('Traffic_num', 2.5)
                        w_score = features.get('Weather_Severity_Index', 0)
                        features[col] = traffic * w_score
                    elif col == 'Traffic_Weighted_Distance':
                        dist = features.get('Distance_km', 0)
                        traffic = features.get('Traffic_num', 2.5)
                        features[col] = dist * traffic
                    else:
                        # Default values for missing features
                        features[col] = 0
                
                # Create feature vector (INDEPENDENT for each slot)
                X = pd.DataFrame([features])[self.feature_columns]
                X = X.fillna(0)
                
                # Predict success probability for THIS SPECIFIC slot
                success_prob = self.model.predict(X)[0]
                success_prob = max(0.0, min(1.0, success_prob))  # Clip to [0, 1]
                
                recommendations.append({
                    'date': delivery_date.strftime('%Y-%m-%d'),
                    'day_name': delivery_date.strftime('%A'),
                    'slot_name': slot['slot_name'],
                    'time_hour': int(slot['hour']),  # Convert to Python int
                    'success_probability': float(round(success_prob, 4)),  # Convert to Python float
                    'day_offset': int(day_offset)  # Convert to Python int
                })

        
        # Sort by success probability (best first)
        recommendations.sort(key=lambda x: x['success_probability'], reverse=True)
        
        print(f"✓ Generated {len(recommendations)} independent slot recommendations")
        print(f"\nTop 5 Recommended Slots:")
        for i, rec in enumerate(recommendations[:5], 1):
            print(f"  {i}. {rec['date']} ({rec['day_name']}) - {rec['slot_name']} "
                  f"({rec['time_hour']}:00) - Success: {rec['success_probability']:.1%}")
        
        return recommendations



if __name__ == "__main__":
    # Initialize predictor
    predictor = DeliverySlotPredictor()
    
    # Load FULL dataset (not sample data)
    print("="*60)
    print("TRAINING ON FULL DATASET - ALL COLUMNS")
    print("="*60)
    df = predictor.load_data("amazon_delivery_final-final.csv")
    
    # Engineer features - uses ALL available columns
    df = predictor.engineer_features(df)
    
    # Train model on FULL dataset
    print(f"\n{'='*60}")
    print(f"Training on {len(df)} records (FULL DATASET)")
    print(f"{'='*60}")
    metrics = predictor.train(df)
    
    # Save model
    predictor.save_model("delivery_slot_model.pkl")
    
    print("\n" + "="*60)
    print("✅ Model training completed!")
    print("="*60)
    
    # DEMONSTRATION: Generate delivery slot recommendations with dates
    # print("\n" + "="*60)
    # print("DEMONSTRATION: Delivery Slot Recommendations")
    # print("="*60)
    
    # Example delivery information (each delivery is independent)
    # example_delivery = {
    #     'Agent_Age': 30,
    #     'Agent_Rating': 4.5,
    #     'Store_Latitude': 28.6139,
    #     'Store_Longitude': 77.2090,
    #     'Drop_Latitude': 28.7041,
    #     'Drop_Longitude': 77.1025,
    #     'Distance_km': 15.5,
    #     'Traffic_num': 2,  # Medium traffic
    #     'Vehicle_Motorcycle': 1,
    #     'Vehicle_Scooter': 0,
    #     'Vehicle_Van': 0,
    #     'Area_Urban': 1,
    #     'Area_Semi-Urban': 0,
    #     'Area_Other': 0,
    #     'Weather_Sunny': 1,
    #     'Weather_Fog': 0,
    #     'Weather_Sandstorms': 0,
    #     'Weather_Stormy': 0,
    #     'Weather_Windy': 0,
    #     'Parcel_Category_TE': 0.75
    # }
    
    # # Generate recommendations for next 10 days
    # # Each slot is treated INDEPENDENTLY
    # recommendations = predictor.recommend_delivery_slots(
    #     delivery_info=example_delivery,
    #     num_days=10,
    #     slots_per_day=4
    # )
    
    # # Save recommendations to file
    # import json
    # with open('sample_recommendations.json', 'w') as f:
    #     json.dump(recommendations, f, indent=2)
    # print(f"\n✓ Full recommendations saved to 'sample_recommendations.json'")
    
    # print("\n" + "="*60)
    # print("All items are treated INDEPENDENTLY in the model")
    # print("="*60)

