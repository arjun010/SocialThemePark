import twitter
import re
#Setting up Twitter API
api = twitter.Api(consumer_key='CPoIzcJdlC9w48HJLASiCWfIm',
                      consumer_secret='hgNJPK9N3BnJXJg5GkZ3gCW9LIInedQzr3MiMcCjJ80rT7tW9O',
                      access_token_key='524026726-PFL8kV3zUPpPZqRNB1J1xAZSUOv0JNfA6ZoPaL2V',
                      access_token_secret='3CQxz91tTSrqb2DN0OGDewlAzeqxMxVwCkbga7ayQBEmt')

search = api.GetSearch(term='space mountain', lang='en', count=6000, max_id='')
#print(search)
tempArr = []
alreadySeen = []
opt = open("spacemountain.txt",'a')
for t in search:
  """
  if re.search("^(?!RT)",t.text.encode('utf-8')):
    print t.user.screen_name + ' (' + t.created_at + ')'
    #Add the .encode to force encoding
    print t.text.encode('utf-8')
    print t.id
    print ''
    #opt.write(t.text.encode('utf-8')+"\n")
    tempArr.append(t.id)
  """
  if t.text.encode('utf-8') not in alreadySeen:
    alreadySeen.append(t.text.encode('utf-8'))
    print t.user.screen_name + ' (' + t.created_at + ')'
    #Add the .encode to force encoding
    print t.text.encode('utf-8')
    print t.id
    print ''
opt.close()
#print(max(tempArr))