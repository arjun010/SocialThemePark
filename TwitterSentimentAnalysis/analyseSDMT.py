import numpy as np
from collections import Counter
from nltk.corpus import stopwords
import re
import collections
import json
from collections import OrderedDict

def createWordCountFile():
    cachedStopWords = stopwords.words("english")
    words = re.findall('\w+', open('../newSearch/sevendwarfsminetrain.txt').read().lower())
    unImportantWords = []

    moodWords = []
    moodWordsFile = open("moodwords.txt","r")
    allMoodWords = moodWordsFile.readlines()
    moodWordsFile.close()
    for word in allMoodWords:
        moodWords.append(re.sub("\n","",word))

    #print(moodWords)

    for x in ['sevendwarfsminetrain','seven','dwarfs','dwarf','mine','train','https','com','co','disney','disneyworld','ride','rt','orlando','walt','waltdisneyworld','http','world','kingdom','lake','buena','vista','florida','fl']:
        unImportantWords.append(x)    


    opt = open('sevendwarfsminetrain_WordCount.txt','w')
    c = collections.Counter(words)
    for word in words:
        if word not in cachedStopWords:
            if word not in unImportantWords:
                if word in moodWords:
                    opt.write('%s : %d\n' % (word, c[word]))

    opt.close()

    with open('sevendwarfsminetrain_WordCount.txt') as fin:
        lines = (line.rstrip() for line in fin)
        unique_lines = OrderedDict.fromkeys( (line for line in lines if line) )

    #opt = open('sevendwarfsminetrain_WordCount.txt','w')
    finalWords = []
    finalCounts = []
    for item in unique_lines.keys():
    #    opt.write(item+"\n")
        finalWords.append(re.sub(" ","",item.split(":")[0]))
        finalCounts.append(re.sub(" ","",item.split(":")[1]))
    #opt.close()
    
    optFile = open('../WordCounts/sevendwarfsminetrain.csv', 'w')
    optFile.write("name,count\n")
    for i in range(len(finalWords)):
        optFile.write(finalWords[i]+","+finalCounts[i]+"\n")
    optFile.close

def readSentimentList(file_name):
    ifile = open(file_name, 'r')
    happy_log_probs = {}
    sad_log_probs = {}
    ifile.readline() #Ignore title row
    
    for line in ifile:
        tokens = line[:-1].split(',')
        happy_log_probs[tokens[0]] = float(tokens[1])
        sad_log_probs[tokens[0]] = float(tokens[2])

    return happy_log_probs, sad_log_probs

def classifySentiment(words, happy_log_probs, sad_log_probs):
    # Get the log-probability of each word under each sentiment
    happy_probs = [happy_log_probs[word] for word in words if word in happy_log_probs]
    sad_probs = [sad_log_probs[word] for word in words if word in sad_log_probs]

    # Sum all the log-probabilities for each sentiment to get a log-probability for the whole tweet
    tweet_happy_log_prob = np.sum(happy_probs)
    tweet_sad_log_prob = np.sum(sad_probs)

    # Calculate the probability of the tweet belonging to each sentiment
    prob_happy = np.reciprocal(np.exp(tweet_sad_log_prob - tweet_happy_log_prob) + 1)
    prob_sad = 1 - prob_happy

    return prob_happy, prob_sad

def main():
    # We load in the list of words and their log probabilities
    happy_log_probs, sad_log_probs = readSentimentList('twitter_sentiment_list.csv')

    inp = open('../newSearch/sevendwarfsminetrain.json','r')
    tweets = json.load(inp)
    inp.close()
    
    countPos = 0
    countNeg = 0
    countNeut = 0

    posTweets=[]
    negTweets=[]
    neutralTweets=[]

    for tweet in tweets:
        curTweet = tweet['tweet'].split()
        tweet_happy_prob, tweet_sad_prob = classifySentiment(curTweet, happy_log_probs, sad_log_probs)       
        #print "The probability that tweet1 (", tweet, ") is happy is ", tweet_happy_prob, "and the probability that it is sad is ", tweet_sad_prob    
        if tweet_happy_prob>tweet_sad_prob:
            countPos+=1
            posTweets.append({"tweet":""+tweet['tweet']+""})        
        elif tweet_sad_prob>tweet_happy_prob:
            countNeg+=1
            negTweets.append({"tweet":""+tweet['tweet']+""})        
        else:
            countNeut+=1
            neutralTweets.append({"tweet":""+tweet['tweet']+""})        
    

    with open('../SentimentCounts/sdmtPositiveTweets.json', 'w') as outfile:
        json.dump(posTweets, outfile,indent=0)
    outfile.close()
    with open('../SentimentCounts/sdmtNegativeTweets.json', 'w') as outfile:
        json.dump(negTweets, outfile,indent=0)
    outfile.close()
    with open('../SentimentCounts/sdmtNeutralTweets.json', 'w') as outfile:
        json.dump(neutralTweets, outfile,indent=0)
    outfile.close()

    #print("Positive: ", countPos, " Negative: ", countNeg, " Neutral: ", countNeut)
    opt=[]
    opt.append({"sentiment":"Positive","count":countPos})
    opt.append({"sentiment":"Negative","count":countNeg})
    opt.append({"sentiment":"Neutral","count":countNeut})
    with open('../SentimentCounts/sevendwarfsminetrain.json', 'w') as outfile:
        json.dump(opt, outfile,indent=0)
    outfile.close()
    createWordCountFile()
    # Here we have tweets which we have already tokenized (turned into an array of words)
    #tweet1 = ['I', 'love', 'holidays']
    #tweet2 = ['this','ride','is','boring']

    # Calculate the probabilities that the tweets are happy or sad
    #tweet1_happy_prob, tweet1_sad_prob = classifySentiment(tweet1, happy_log_probs, sad_log_probs)
    #tweet2_happy_prob, tweet2_sad_prob = classifySentiment(tweet2, happy_log_probs, sad_log_probs)
    
    #print "The probability that tweet1 (", tweet1, ") is happy is ", tweet1_happy_prob, "and the probability that it is sad is ", tweet1_sad_prob
    #print "The probability that tweet2 (", tweet2, ") is happy is ", tweet2_happy_prob, "and the probability that it is sad is ", tweet2_sad_prob


if __name__ == '__main__':
    main()