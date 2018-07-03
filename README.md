# AI Village website
[https://aivillage.org/](https://aivillage.org/)

# Info
This is a static website is generated with [Hugo](https://gohugo.io/) using the [Coder](https://github.com/luizdepra/hugo-coder/) theme. You will need hugo 0.40 or greater, which ubuntu 16.04 does not install by default. However, homebrew and later versions of ubuntu are fine.

# Build & Deploy
The source code for the site is hosted on the ["code" branch](https://github.com/aivillage/www/tree/code) and static assets are served from the ["master" branch](https://github.com/aivillage/www/tree/master).

To make use of the `deploy.sh` script, your build environment should be organized as such:

```
root
|-- code (CURRENT DIRECTORY) -> tracking code branch of aivillage/www.git
|    +-- archetypes 
|    +-- content
|    +-- data
|    +-- ...
|    --- README.md
|    --- deploy.sh
|    --- ...
|-- site-assets -> tracking master branch of aivillage/www.git
|   +-- about
|   +-- categories
|   +-- css
|   +-- ...
```

To test that all the files are in the correct location and everything points correctly you can use `deploy_local.sh`. The links are all absolute and will point to the actual website, so static assets and links on this local site will not work. However it is useful for formating purposes. 

# Contributors
Main developer of the site is [@cchio](https://github.com/cchio). Please contact him for any escalations or questions.