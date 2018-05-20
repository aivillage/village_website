# AI Village website
[https://aivillage.org/](https://aivillage.org/)

# Info
This is a static website is generated with [Hugo](https://gohugo.io/) using the [Coder](https://github.com/luizdepra/hugo-coder/) theme.

# Build & Deploy
The source code for the site is hosted on the ["code" branch](https://github.com/aivillage/aivillage.github.io/tree/code) and static assets are served from the ["master" branch](https://github.com/aivillage/aivillage.github.io/tree/master).

To make use of the `deploy.sh` script, your build environment should be organized as such:

```
root
|-- code (CURRENT DIRECTORY) -> tracking code branch of git@github.com:aivillage/aivillage.github.io.git 
|    +-- archetypes 
|    +-- content
|    +-- data
|    +-- ...
|    --- README.md
|    --- deploy.sh
|    --- ...
+-- site-assets -> tracking master branch of git@github.com:aivillage/aivillage.github.io.git 
    +-- about
    +-- categories
    +-- css
    +-- ...
```