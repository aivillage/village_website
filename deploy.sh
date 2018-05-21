#!/bin/bash

rm -rf public/*
cd themes/hugo-coder
make
cd ../..
hugo
cd ../site-assets
rm -rf ./*
cp -r ../code/public/* .
cp -r ../code/CNAME .
git add .
git commit -m "new deployment"
git push
cd ../code
git pull
