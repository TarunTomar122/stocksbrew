import sys
from pathlib import Path

# Add app directory to Python path before importing custom modules
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from scripts.db import client

print("Clearing DB")

client.stockbrew_stuff.regular_stocks_news.delete_many({})
client.stockbrew_stuff.regular_stocks_summaries.delete_many({})
client.stockbrew_stuff.regular_stocks_refined_summaries.delete_many({})

client.stockbrew_stuff.hot_stocks_news.delete_many({})
client.stockbrew_stuff.hot_stocks_summaries.delete_many({})
client.stockbrew_stuff.hot_stocks_refined_summaries.delete_many({})

print("DB cleared")