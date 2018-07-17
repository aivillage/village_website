+++
date = "2018-07-15"
title = "Detecting Web Attacks with Recurrent Neural Networks"
author = "Arseny Reutov, Irina Stepanyuk, Fedor Sakharov"
authorUrl = "https://twitter.com/m0nt3kk1"
math = "false"
+++

Attack detection has been a part of information security for decades. First 
known examples of IDS implementations date back to the early 80s. Here is what
we read about that time on
[wikipedia](https://en.wikipedia.org/wiki/Intrusion_detection_system):

> Dorothy E. Denning, assisted by Peter G. Neumann, published a model of an IDS
> in 1986 that formed the basis for many systems today.[20] Her model used
> statistics for anomaly detection, and resulted in an early IDS at SRI
> International named the Intrusion Detection Expert System (IDES), which ran
> on Sun workstations and could consider both user and network level data

Let's note the part about statistics for anomaly detection.

Nowadays, some decades later the industry around attack detection has formed.
There are different kinds of products like IDSs, IPSs, WAFs, firewalls etc most of
which offer rule-based attack detection. The idea of using some kind of statistical
anomaly detection to detect attacks in production doesn't seem that realistic as it
used to back in a day. But does it?

### Detection of attacks on Web Applications

Most WAFs nowadays attempt to detect attacks in a similar fashion: that is some
rule-based engine embedded into a reverse proxy of some type. Rule-based detection
has some disadvantages, for instance, they fail to detect novel attacks while these
same attacks can easily be detected by a human expert. If you think about it, that's
not very surprising, human brain works very differently from a set of regular
expressions.

But first let's ask ourselves:

### What would a human do?

Take a look at an example of a regular HTTP request to some application:

```http
POST /vulnbank/online/api.php HTTP/1.1
Host: 10.0.212.25
Connection: keep-alive
Content-Length: 59
Accept: application/json, text/javascript, */*; q=0.01
Origin: http://10.0.212.25
X-Requested-With: XMLHttpRequest
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36
Content-Type: application/x-www-form-urlencoded
Referer: http://10.0.212.25/vulnbank/online/login.php
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
Cookie: PHPSESSID=4dorluj4ccherum6m9c1i0j917

type=user&action=login&username=ytrtry&password=tyhgfhgfhg

```

If you were given a task to detect malicious requests to this application most
likely you would like to observe the benign requests for a while. After taking
a look at some requests to a number of endpoints in the application, you would have
a general idea of the structure and features of benign requests.

Now you are presented with the following request:

```http
POST /vulnbank/online/api.php HTTP/1.1
Host: 10.0.212.25
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0
Accept: application/json, text/javascript, */*; q=0.01
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: http://10.0.212.25/vulnbank/online/login.php
Content-Type: application/x-www-form-urlencoded
X-Requested-With: XMLHttpRequest
Content-Length: 76
Cookie: PHPSESSID=mlacs0uiou344i3fa53s7raut6
Connection: keep-alive

type=user&action=login&username=none'+union+select+1,2,login,password,5,6,7,NULL,NULL,10,11,12,13,14,15,16,17+from+users+limit+1+--1

```

It immediately catches your eye that something is wrong here. It takes some
more time to understand what is and as soon as you locate the exact piece
of request that is anomalous, you can start thinking about what type of attack
it is.
Essentially, our goal is to make our attack detection AI work in some fashion
that resembles this human reasoning.


### How did we start

First of all, we have taken a look at previous researches on the topic.
Many attempts to create different statistical or machine learning algorithms to detect
attacks have been made throughout the decades. One of the most frequent approaches is to solve
a task of classification where classes are something like "benign requests,
SQL injections, XSS, CSRF, etc.". While one may achieve some decent accuracy
on a given dataset with a classifier, this approach doesn't solve very important
problems:

1. The choice of class set. What if your model during learning is presented with
   three classes, say "benign, SQLi, XSS" and in production it encounters a
   "CSRF" attack?
2. The meaning of these classes. Suppose you need to defend 10 customers
   each one of them, running very different web applications. For most of them
   you would have no idea what a single "SQLi" attack against their application
   really looks like. This means you would have to somehow artificially construct
   your learning datasets which is a horrible decision because you will end up
   learning on data from a completely different distribution than your real data is.
3. Interpretability of the results of your model. Ok, it
   came up with the "SQLi" label, now what? You and most importantly your customer
   (who is a) the first one to see the alert b) is not an expert on web attacks)
   has to guess which part of the request our model has considered to be malicious.

Keeping that in mind we have decided to anyway give classification a try.

Since HTTP protocol is text-based it was obvious that we had to take a look at modern
text classifiers. One of the well-known examples is sentiment analysis of IMDB
movie review dataset. Some solutions use RNNs to classify these reviews.
We decided to use a similar RNN classification model with some slight differences.
For instance, natural language classification RNNs use word embeddings however
it is not clear what words are in a non-natural language like HTTP. That's why
we decided to use char embeddings in our model.

After finishing developing and testing the model all the problems predicted earlier
were obvious but at least our team has moved from useless speculations to some
result.

### How did we proceed

From there we have decided to take some steps in the direction of making the
results of our model more interpretable. At some point, we came across the
mechanism of attention and started to integrate it into our model. And that
yielded some promising results: at some point, everything came together
and we got some human-interpretable results. Now our model started to output
not only the labels but also the attention coefficients for every character
of the input.

If that could be visualized, say, in a web interface, we could color the exact
place where the "SQLi" attack has been found. That was a good result, however,
the other problems still remained unsolved.

It was clear that we have to keep going in the direction of exploiting the
attention mechanism and to drift away from the task of classification. After
reading a lot of related research (for instance, "attention is all you need",
"word2vec", encoder-decoder architectures) on sequence models and experimenting with
our data we able to create an anomaly-detection model that would finally work
more in a way a human expert does.

### Autoencoders

At some point it became clear that an Autoencoder[5] fits our goal the most.
Autoencoder is a networks that sets it's target values equal to it's input
values. The idea is to teach the network to re-create things it has seen, or,
in other words approximate an identity function. If the trained autoencoder
is given an anomalous point it is likely to re-create it with a high degree
of error.

![bank](images/detecting-web-attacks-rnn-02.png)

*image taken from [What to do when data is missing, Part II](http://curiousily.com/data-science/2017/02/02/what-to-do-when-data-is-missing-part-2.html)*

### The result

Finally, we ended up with a seq2seq autoencoder model that proved to be able to find
anomalies in HTTP requests. Pre-processed request data is fed both to inputs
and the outputs of the model, thus it learns to re-create the sequences it sees.

We built our model into our WAF and trained against our test vulnerable application
of a bank.

![bank](images/detecting-web-attacks-rnn-01.jpg)

This model acts more like a human does: it learns only on the "normal" user
requests to the web app. It detects anomalies in requests and it highlights
the exact place of the request considered anomalous. We evaluated this model
against some attacks on the test app and the results appeared to be promising.
For instance, the image above depicts how our model detected the SQL injection
split into two web form parameters. The code of the model and the train/test
data will be released as a jupyter notebook so anyone can reproduce our results
and suggest improvements.


### Further steps

This model is a definite step forward for our team however now there are more
new problems to find solutions to and places to improve.

First of all, the next step is obvious. Recall how a human expert would detect
an attack: first, he would notice an anomaly an only then he would start reasoning
if it is an attack and what kind of attack that is. Our model performs the first
step of this, it finds some anomalous sequence inside the request. What if now
that we have reduced all the significant anomaly data to this small sequence
leaving all the application-specific parts of request that don't look like an anomaly,
we try to run a classifier on it? It looks it could reproduce the second step
of human reasoning about what kind of attack we are dealing with.

The second problem is adversarial examples that can be used to evade our detection.
In recent year we have seen an adversarial ML researches, people make models "see"
whatever they want them to see. Obviously, if Eve tried to evade our detection model
she would probably come up with some adversarial techniques to do so.

The third problem is performance. Now it takes days to train on our small dataset
on two GPUs, that is not scalable at all.

### References

[1] [Understanding LSTM networks](http://colah.github.io/posts/2015-08-Understanding-LSTMs/)

[2] [Attention and Augmented Recurrent Neural Networks](https://distill.pub/2016/augmented-rnns/)

[3] [Attentions is all you need](https://ai.googleblog.com/2017/08/transformer-novel-neural-network.html)

[4] [Neural Machine Translation (seq2seq) Tutorial](https://github.com/tensorflow/nmt)

[5] [Autoencoders](http://ufldl.stanford.edu/tutorial/unsupervised/Autoencoders/)
