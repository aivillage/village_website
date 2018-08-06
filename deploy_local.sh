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
	rm -rf ./*
	cp -r ../www/public/* .
	cp -r ../www/CNAME .
	cd ../www
fi
