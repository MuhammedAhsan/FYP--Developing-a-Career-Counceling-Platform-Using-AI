import pymongo 

URL = 'mongodb://localhost:27017/'
client = pymongo.MongoClient(URL)

db = client['App_Users']