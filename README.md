# AI Village website
[https://aivillage.org/](https://aivillage.org/)

# Info
This is a static website is generated with [Hugo](https://gohugo.io/) using the [Coder](https://github.com/luizdepra/hugo-coder/) theme.

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

# Contributors
Main developer of the site is [@cchio](https://github.com/cchio). Please contact him for any escalations or questions.