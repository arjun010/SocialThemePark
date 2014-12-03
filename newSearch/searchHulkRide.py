import twitter
import re
import json

#Setting up Twitter API
api = twitter.Api(consumer_key='CPoIzcJdlC9w48HJLASiCWfIm',
                      consumer_secret='hgNJPK9N3BnJXJg5GkZ3gCW9LIInedQzr3MiMcCjJ80rT7tW9O',
                      access_token_key='524026726-PFL8kV3zUPpPZqRNB1J1xAZSUOv0JNfA6ZoPaL2V',
                      access_token_secret='3CQxz91tTSrqb2DN0OGDewlAzeqxMxVwCkbga7ayQBEmt')

search = api.GetSearch(term='hulk ride',result_type='mixed', lang='en', count=200, since_id='539562422479368192')
tempArr = []
alreadySeen = []
jsonTweets = []

opt = open("hulkride.txt",'a')
for t in search:
  if t.text.encode('utf-8') not in alreadySeen:
    alreadySeen.append(t.text.encode('utf-8'))
    print t.user.screen_name + ' (' + t.created_at + ')'
    print t.text.encode('utf-8')
    print t.id
    tempArr.append(t.id)
    jsonTweets.append({"tweet":t.text.encode('utf-8')})
    opt.write(t.text.encode('utf-8'))
    opt.write("\n")
    print ''
opt.close()
print(max(tempArr))

with open('hulkride.json', 'a') as outfile:
  json.dump(jsonTweets, outfile,indent=0)

outfile.close()