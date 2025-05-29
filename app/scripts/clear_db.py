from db import client

print("Clearing DB")

client.stockbrew_stuff.regular_stocks_news.delete_many({})
client.stockbrew_stuff.regular_stocks_summaries.delete_many({})
client.stockbrew_stuff.regular_stocks_refined_summaries.delete_many({})

client.stockbrew_stuff.hot_stocks_news.delete_many({})
client.stockbrew_stuff.hot_stocks_summaries.delete_many({})
client.stockbrew_stuff.hot_stocks_refined_summaries.delete_many({})

print("DB cleared")