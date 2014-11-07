from collections import Counter
from nltk.corpus import stopwords
cachedStopWords = stopwords.words("english")

import re
import collections
words = re.findall('\w+', open('hulkRide.txt').read().lower())
#opt = open('wc_temp.txt','w')
#for item in collections.Counter(words):
#	opt.write(item+":"+count+"\n")

#for item in collections.Counter(words):
	#print(item)
"""
wordset = set(words)
words=[]
for word in wordset:
	words.append(word)
"""
opt = open('wc_temp.txt','w')
c = collections.Counter(words)
for word in words:
	if word not in cachedStopWords:
		opt.write('%s : %d\n' % (word, c[word]))

opt.close()

from collections import OrderedDict

with open('wc_temp.txt') as fin:
    lines = (line.rstrip() for line in fin)
    unique_lines = OrderedDict.fromkeys( (line for line in lines if line) )

opt = open('wc_temp.txt','w')
for item in unique_lines.keys():
	opt.write(item+"\n")
opt.close()