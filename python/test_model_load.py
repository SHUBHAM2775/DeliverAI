
import sys
import traceback
from inference import SlotRecommender

print("Attempting to import SlotRecommender...")
try:
    recommender = SlotRecommender("delivery_slot_model.pkl")
    print("Successfully initialized SlotRecommender.")
    print(f"Model: {recommender.model}")
except Exception as e:
    print("FAILED to initialize SlotRecommender.")
    traceback.print_exc()
    sys.exit(1)
