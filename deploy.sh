#!/bin/bash

rm -rf public/*
cd themes/hugo-coder
make
cd ../..
hugo
cd ../site-assets
if [ $? -ne 0 ]; then
	echo "You don't have the ../site-assets directory"
else
	git pull
	rm -rf ./*
	cp -r ../www/public/* .
	cp -r ../www/CNAME .
	git add .
	git commit -m "new deployment"
	git push
	cd ../www
	git pull
fi
