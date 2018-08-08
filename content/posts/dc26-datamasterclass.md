+++
title = "AI Village: Intro to Data Masterclass at DEF CON 2018!"
slug = "dc26-datamasterclass"
author = "Leo Meyerovich"
authorUrl = "https://lmeyerov.github.io/"
date = "2018-08-06"
publishDate = "2018-08-06"
+++

<p float="left">
   <img src="images/graphistry_graph.png" height="250">
  <img src="images/sticker.png" height="200">
</p>

## What the?

**Curious about what it means to play with GPUs, malware or human trafficking data, random forests, and giant graphs? And know just enough Python to be dangerous?** Or, just want to score some easy AI Village CTF points for a few hours, meet some data hackers, and maybe score a badge?

Stop by the Intro to Data Masterclasses for an accessible way to get started with modern data science for security data. Leo (founder @ Graphistry) and [Eugene](https://temasek.org) (Director of Security @ Ultimate Software) will walk through interactive tutorials on core areas of modern data workflows: Wrangling data, classifying data, and exploring graphs / anomalies. 

We’ll be using real examples from human trafficking, malware, and DGA datasets.  Only basic Python scripting experience is needed. Ahead of time, we recommend preparing a pydata notebook environment. None of the sessions depend on the other, though if you are unfamiliar with Pandas, we recommend at least skimming that session before the other ones. During the sessions, you can follow along with others, hack on your own, and/or explore with a partner. After, we’ll hang out for Q&A.

## What


| What 	| Topic  	|  When 	|
|---:|---	|:---:|
|   	**Wrangling**|  Dig into trafficking & malware with Jupyter notebooks, Pandas data manipulation, and GPU-accelerated plotting  	| Friday&#160;5:45p   	|
|   	**Tour-de-ML, Graphs & Anomalies** |  Classify DGA domains with Markov Chains and Random Forest, See trafficking & malware events with GPU visual analytics & dimensionality reduction 	| Saturday&#160;5:30p  	|

## Where

* Florentine III - Caesars

## Bring

* Self
* Ability to script a bit of python
* Recommended: Friend, laptop with pydata notebook (info incoming)

## Sessions

### Friday 5:45p: Wrangling - Digging into trafficking & malware with Jupyter notebooks, Pandas data manipulation, and GPU-accelerated plotting

The open secret of data science is the time spent wrangling. Going from raw data to something understandable and algorithm-friendly is the iterative process of loading, cleaning, fusing, inspecting, transforming, summarizing, and plotting. That comes down to data science notebooks like Jupyter, dataframe libraries like Pandas, and plotting libraries like ???.  We’ll go through each phase for network security and human trafficking logs. At the end, we’ll go into overdrive with emerging GPU dataframe and visual analytics libraries ( http://gpuopenanalytics.com/ ).

### Saturday 5:30p: Tour-de-ML, Graphs & Anomalies: Classifying DGA domains with Markov Chains and Random Forest, Understanding trafficking & malware events with GPU visual analytics & dimensionality reduction

One of the most useful applications of ML is supervised classification. With a bit of training on labeled data, the software can make automatic decisions, and we can steer better data to analysts. We'll focus on classic Markov Chains and a common ML competition winner Random Forest, and connect to modern variants like XGBoost. We'll focus on the common case of classifying text: just by the domain name, is the domain malicious or not? The example will differentiate legitimate domains from Cisco Umbrella's Popularity List, and the potentially malicious Necurs DGAs domains from The DGArchive Project. The resulting classifier will be able to classify new domain names even if they are not in the training dataset. The technique can be reapplied to emails, site content, and (a lot) more. 

Understanding large datasets or those with all sorts of columns, such as we see with security and fraud logs, can be a daily struggle. Many data projects start with just trying to figure out what’s in there. When items do pop out, we may want to then ask how they’re related. Graph and clustering algorithms are powerful yet easy ways to understand large amounts of high-dimensional data. These techniques are often used as part of building anomaly detectors. In this session, we’ll look at network security and human trafficking data to spot and understand outliers. We’ll walk through how to quickly use UMAP algorithms, hypergraph modeling and graph querying, GPU visualization, and more.


<img src="images/tablecloth.jpg">