+++
date = "2018-08-13"
title = "Detecting Web Attacks with Recurrent Neural Networks"
author = "Arseny Reutov, Irina Stepanyuk, Fedor Sakharov"
authorUrl = "https://twitter.com/m0nt3kk1"
math = "false"
+++

Attack detection has been a part of information security for decades. First
known examples of IDS implementations date back to the early 80s. Here is what
we read about that time on
[Wikipedia](https://en.wikipedia.org/wiki/Intrusion_detection_system):

> Dorothy E. Denning, assisted by Peter G. Neumann, published a model of an IDS
> in 1986 that formed the basis for many systems today.[20] Her model used
> statistics for anomaly detection, and resulted in an early IDS at SRI
> International named the Intrusion Detection Expert System (IDES), which ran
> on Sun workstations and could consider both user and network level data

Let's note the part about statistics for anomaly detection.

Nowadays, some decades later the industry around attack detection has formed.
There are different kinds of products like IDSs, IPSs, WAFs, firewalls, etc, most of
which offer rule-based attack detection. The idea of using some kind of statistical
anomaly detection to detect attacks in production doesn't seem that realistic as it
used to back in a day. But does it?

### Detection of attacks on web applications

The first firewalls tailored to detect application specific attacks started to appear on
the market in the early 90s. Both attack techniques and protection mechanisms have evolved
dramatically since then with attackers being a step forward at any time.

Most WAFs nowadays attempt to detect attacks in a similar fashion: some rule-based engine
embedded into a reverse proxy of some type. The most prominent example is mod_security,
a WAF module for Apache web server, which was created in 2002. Rule-based detection
has some disadvantages, for instance, they fail to detect novel attacks aka 0days while these
same attacks can easily be detected by a human expert. If you think about it, that's
not very surprising, human brain works very differently from a set of regular
expressions.

From perspectives of WAFs, the attack types can be divided into time series-based
and a single HTTP request/response-based. Our research focuses on detecting the
latter type of attacks:
- SQL Injection
- Cross Site Scripting
- XML External Entities Injection
- Path Traversal  
- OS Commanding
- Object injection
- etc.


But first let's ask ourselves:

### What would a human do when he sees a single request?

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
more time to understand what it is and as soon as you locate the exact piece
of request that is anomalous, you can start thinking about what type of attack
it is.
Essentially, our goal is to make our attack detection AI work in some fashion
that resembles this human reasoning.

A tricky moment here is that some traffic, looking malicious at first sight, might
be normal for a specific web site.

For instance, let's take a look at this request:

![malicious](images/b_request1.PNG)

Is it an anomaly?
In fact, this request is issued by the Jira bug tracker and is typical for this service,
which means that the request is benign.

Now let's take a look at another case:

![Joomla1](images/m_request1.PNG)

At first sight the request looks like a typical user registration on a web site
powered by Joomla CMS. However, the requested operation is "user.register" instead
of normal "registration.register". The former option is deprecated and contains
a vulnerability allowing anybody to register themselves as an administrator.

This exploit is known as "Joomla < 3.6.4 Account Creation / Privilege Escalation" (CVE-2016-8869, CVE-2016-8870).

![Joomla2](images/m_request2.PNG)


### How we started

First of all, we have taken a look at previous research on the topic.
Many attempts to create different statistical or machine learning algorithms to detect
attacks have been made throughout the decades. One of the most frequent approaches is to solve
a task of classification where classes are something like "benign requests,
SQL injections, XSS, CSRF, etc.". While one may achieve some decent accuracy
on a given dataset with a classifier, this approach doesn't solve very important
problems:

1. The choice of class set. What if your model during learning is presented with
   three classes, say "benign, SQLi, XSS" and in production it encounters a
   "CSRF" attack or even a brand new attack technique?
2. The meaning of these classes. Suppose you need to protect ten customers
   each of them running completely different web applications. For most of them
   you would have no idea what a single "SQL Injection" attack against their application
   really looks like. This means you would have to somehow artificially construct
   your learning datasets which is a horrible decision because you will end up
   learning on data from a completely different distribution than your real data is.
3. Interpretability of the results of your model. Ok, it
   came up with the "SQL Injection" label, now what? You and most importantly your customer,
   who is the first one to see the alert and typically is not an expert in web attacks,
   has to guess which part of the request our model has considered to be malicious.

Keeping that in mind we have decided to give classification a try anyway.

Since HTTP protocol is text-based it was obvious that we had to take a look at modern
text classifiers. One of the well-known examples is sentiment analysis of IMDB
movie review dataset. Some solutions use RNNs to classify these reviews.
We decided to use a similar RNN classification model with some slight differences.
For instance, natural language classification RNNs use word embeddings, however
it is not clear what words there are in a non-natural language like HTTP. That's why
we decided to use character embeddings in our model.

Ready-made embeddings are irrelevant for solving the problem, that is why we used
simple mappings of characters to numeric codes with several internal markers like
`<GO>` and `<EOS>`.

After finishing developing and testing the model all the problems predicted earlier
became obvious but at least our team has moved from useless speculations to some
result.

### How we proceeded

From there we have decided to take some steps in the direction of making the
results of our model more interpretable. At some point we came across the
mechanism of "attention" and started to integrate it into our model. And that
yielded some promising results: finally, everything came together
and we got some human-interpretable results. Now our model started to output
not only the labels but also the attention coefficients for every character
of the input.

If that could be visualized, say, in a web interface, we could color the exact
place where the "SQL Injection" attack has been found. That was a good result, however,
the other problems still remained unsolved.

It was clear that we have to keep going in the direction of benefiting from the
attention mechanism and to drift away from the task of classification. After
reading a lot of related research (for instance, "attention is all you need",
"word2vec", encoder-decoder architectures) on sequence models and experimenting with
our data we were able to create an anomaly-detection model that would finally work
more or less in a way how a human expert does.

### Autoencoders

At some point it became clear that an sequence-to-sequqnce Autoencoder [5]
fits our goal the most.

A sequence-to-sequence model [7] consists of two multi-layaered LSTMs:
an encoder and a decoder. The encoder maps the input sequence to vector
of fixed dimensionality. The decoder decodes the target vector using this
output of the encoder.

Autoencoder is a sequence-to-sequence model that sets its target values equal to its input
values. The idea is to teach the network to re-create things it has seen, or,
in other words, approximate an identity function. If the trained autoencoder
is given an anomalous sample it is likely to re-create it with a high degree
of error.

![autoencoder](images/detecting-web-attacks-rnn-02.png)

### The code

Our solution is made up of several parts: model initialization, training, prediction,
and validation.

Most of the code located in the  [repository](https://github.com/PositiveTechnologies/seq2seq-web-attack-detection)
is self-explanatory, we will focus on important parts only.

The model is initialized as an instance of the `Seq2Seq` class which has the following
constructor arguments:
```
batch_size - the number of samples in a batch
embed_size - the dimension of embedding space (should be less than vocabulary size)
hidden_size - the number of hidden states in lstm
num_layers - the number of lstm blocks
checkpoints - path to checkpoint directory
std_factor - the number of stds that is used for defining a model threshold
dropout - the probability that each element is kept
vocab - the Vocabulary object
```

After that, the autoencoder layers are initialized. Firstly, the encoder:
```python
  # Encoder
  cells = [self._lstm_cell(args['hidden_size']) for _ in range(args['num_layers'])]
  multilstm = tf.contrib.rnn.MultiRNNCell(cells, state_is_tuple=True)

  _, enc_state = tf.nn.dynamic_rnn(
      multilstm,
      enc_embed_input,
      sequence_length=self.lengths,
      swap_memory=True,
      dtype=tf.float32)
```

And then the decoder:
```python
  # Decoder
output_lengths = tf.reduce_sum(tf.to_int32(tf.not_equal(self.targets, 1)), 1)
helper = tf.contrib.seq2seq.TrainingHelper(
    dec_embed_input,
    output_lengths,
    time_major=False)

cells = [self._lstm_cell(args['hidden_size']) for _ in range(args['num_layers'])]
dec_cell = tf.contrib.rnn.MultiRNNCell(cells, state_is_tuple=True)

decoder = tf.contrib.seq2seq.BasicDecoder(dec_cell, helper, enc_state)

dec_outputs = tf.contrib.seq2seq.dynamic_decode(
    decoder,
    output_time_major=False,
    impute_finished=True,
    maximum_iterations=self.max_seq_len, swap_memory=True)
```

Since the problem we solve is an anomaly detection, the targets and inputs are the same.
Thus our `feed_dict` looks this way:

```python
feed_dict = {
  model.inputs: X,
  model.targets: X,
  model.lengths: L,
  model.dropout: self.dropout,
  model.batch_size: self.batch_size,
  model.max_seq_len: seq_len}
```

After each epoch the best model is saved as a checkpoint, which can be later loaded
to do predictions. For testing purposes a live web application was set up and was
protected by the model so that it was possible to test if real attacks were successful or not.

Being inspired by the attention mechanism we tried to apply it to the autoencoder but
noticed that probabilities output from the last layer works better to mark the anomalous
parts of a given request.

![attention](images/malicious.png)

At the testing stage with our samples we've got very good results: precision and
recall are close to 0.99. And the ROC curve is around 1. Looks amazing!

![ROC](images/roc.PNG)

The final code can be obtained
[here](https://github.com/PositiveTechnologies/seq2seq-web-attack-detection).

### The results

Suggested Seq2Seq autoencoder model proved to be able to detect anomalies in HTTP
requests with high precision.

![bank](images/detecting-web-attacks-rnn-01.jpg)

This model acts more like a human does: it learns only the "normal" user
requests to the web application. It detects anomalies in requests and it highlights
the exact place of the request considered anomalous. We evaluated this model
against some attacks on the test application and the results appeared to be promising.
For instance, the image above depicts how our model detected the SQL injection
split into two web form parameters. Such SQL injections are called "fragmented",
i.e. the attack payload portions are delivered in several HTTP parameters which makes it
difficult for classic rule-based WAFs to detect such cases as they usually inspect each
parameter individually.  The code of the model and the train/test data will be released
as a Jupyter notebook so anyone can reproduce our results and suggest improvements.


### Further steps and summary

There are several weak points to improve.

First of all, the next step is to try to classify the attack. Recall how a human expert would detect
an attack: first, he would notice the fact of an anomaly, then he would start reasoning
if it is an attack and if so what kind of attack. Our model performs the first
step of this, it finds some anomalous sequence inside the request. Now
that we have reduced all the significant anomaly data to this small character sequence
leaving all the application-specific parts of request that don't look like an anomaly, what if
we try to run a classifier on it? It looks it could reproduce the second step
of human reasoning about what kind of attack we are dealing with.

The second problem is adversarial examples that can be used to evade our detection.
In recent year we have seen numerous research papers on adversarial ML, people make models "see"
whatever they want them to see. Obviously, if Eve tried to evade our detection model
she would probably come up with some adversarial techniques to do so.

The third problem is performance. Now it takes days to train on our small dataset
on two GPUs, that is not scalable at all.

However, we would argue that this work proposes an interesting approach to build a
model for detecting attacks on Web Applications. One of the most important things
in this research is the attempt to mimic the reasoning of a human expert
in an unsupervised yet interpretable manner. It is also notable that we can clearly
see the further steps in this research and the steps seem to be very sound. It is our hope
that this work will kick-off the interest in using Deep Learning for Attack
Detection in many other teams and researchers and we are looking forward to collaborating
with them.

### References

[1] [Understanding LSTM networks](http://colah.github.io/posts/2015-08-Understanding-LSTMs/)

[2] [Attention and Augmented Recurrent Neural Networks](https://distill.pub/2016/augmented-rnns/)

[3] [Attention is all you need](https://ai.googleblog.com/2017/08/transformer-novel-neural-network.html)

[4] [Attention is all you need (annotated)](https://nlp.seas.harvard.edu/2018/04/03/attention.html)

[5] [Neural Machine Translation (seq2seq) Tutorial](https://github.com/tensorflow/nmt)

[6] [Autoencoders](http://ufldl.stanford.edu/tutorial/unsupervised/Autoencoders/)

[7] [Sequence to Sequence Learning with Neural Networks](https://arxiv.org/abs/1409.3215)

[8] [Building autoencoders in Keras](https://blog.keras.io/building-autoencoders-in-keras.html)
