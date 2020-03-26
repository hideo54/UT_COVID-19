import tweepy

consumer_key = input('Consumer key: ')
consumer_secret = input('Consumer secret: ')

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
url = auth.get_authorization_url(auth)
print(url)
token = input('Token: ')
auth.request_token['oauth_token'] = token
verifier = input('Verifier: ')
auth.request_token['oauth_token_secret'] = verifier

auth.get_access_token(verifier)
print(auth.access_token)
print(auth.access_token_secret)