"""
api = twitter.Api(consumer_key='CPoIzcJdlC9w48HJLASiCWfIm',
                      consumer_secret='hgNJPK9N3BnJXJg5GkZ3gCW9LIInedQzr3MiMcCjJ80rT7tW9O',
                      access_token_key='524026726-PFL8kV3zUPpPZqRNB1J1xAZSUOv0JNfA6ZoPaL2V',
                      access_token_secret='3CQxz91tTSrqb2DN0OGDewlAzeqxMxVwCkbga7ayQBEmt')
"""
"""
from TwitterSearch import *
try:
    #print("hi")
    tso = TwitterSearchOrder() # create a TwitterSearchOrder object
    tso.setKeywords(['space mountain']) # let's define all words we would like to have a look for
    tso.setLanguage('en') # we want to see German tweets only
    tso.setCount(3) # please dear Mr Twitter, only give us 7 results per page
    tso.setIncludeEntities(False) # and don't give us all those entity information
    #print(tso)
    # it's about time to create a TwitterSearch object with our secret tokens
    ts = TwitterSearch(
        consumer_key = 'CPoIzcJdlC9w48HJLASiCWfIm',
        consumer_secret = 'hgNJPK9N3BnJXJg5GkZ3gCW9LIInedQzr3MiMcCjJ80rT7tW9O',
        access_token = '524026726-PFL8kV3zUPpPZqRNB1J1xAZSUOv0JNfA6ZoPaL2V',
        access_token_secret = '3CQxz91tTSrqb2DN0OGDewlAzeqxMxVwCkbga7ayQBEmt'
     )
    #print(ts)
    for tweet in ts.searchTweetsIterable(tso): # this is where the fun actually starts :)
        #print( '@%s tweeted: %s' % ( tweet['user']['screen_name'], tweet['text'] ) )
        print(tweet['text'])

except TwitterSearchException as e: # take care of all those ugly errors if there are some
    print(e)
"""
"""
import tweepy

auth = tweepy.OAuthHandler("CPoIzcJdlC9w48HJLASiCWfIm", "hgNJPK9N3BnJXJg5GkZ3gCW9LIInedQzr3MiMcCjJ80rT7tW9O")
auth.set_access_token("524026726-PFL8kV3zUPpPZqRNB1J1xAZSUOv0JNfA6ZoPaL2V", "3CQxz91tTSrqb2DN0OGDewlAzeqxMxVwCkbga7ayQBEmt")
api = tweepy.API(auth)
for tweet in tweepy.Cursor(api.search,q="hulk ride",rpp=100,result_type="recent",include_entities=True,lang="en").items():
    print tweet.text
"""
"""
from twython import Twython
twitter = Twython('CPoIzcJdlC9w48HJLASiCWfIm', 'hgNJPK9N3BnJXJg5GkZ3gCW9LIInedQzr3MiMcCjJ80rT7tW9O', '524026726-PFL8kV3zUPpPZqRNB1J1xAZSUOv0JNfA6ZoPaL2V','3CQxz91tTSrqb2DN0OGDewlAzeqxMxVwCkbga7ayQBEmt' )

results = twitter.cursor(twitter.search, q='hulk ride')
limit = 10
i = 0
for result in results:
  print result
  i+=1
  if i==limit:
    break
"""

import twitter
import re
#Setting up Twitter API
api = twitter.Api(consumer_key='CPoIzcJdlC9w48HJLASiCWfIm',
                      consumer_secret='hgNJPK9N3BnJXJg5GkZ3gCW9LIInedQzr3MiMcCjJ80rT7tW9O',
                      access_token_key='524026726-PFL8kV3zUPpPZqRNB1J1xAZSUOv0JNfA6ZoPaL2V',
                      access_token_secret='3CQxz91tTSrqb2DN0OGDewlAzeqxMxVwCkbga7ayQBEmt')

search = api.GetSearch(term='goliath six flags', lang='en', count=6000, max_id='')
#print(search)
tempArr = []
opt = open("goliath.txt",'a')
for t in search:
  if re.search("^(?!RT)",t.text.encode('utf-8')):
    print t.user.screen_name + ' (' + t.created_at + ')'
    #Add the .encode to force encoding
    print t.text.encode('utf-8')
    print ''
    tempArr.append(t.id)
    #opt.write(t.text.encode('utf-8')+"\n")
  
opt.close()
print(max(tempArr))