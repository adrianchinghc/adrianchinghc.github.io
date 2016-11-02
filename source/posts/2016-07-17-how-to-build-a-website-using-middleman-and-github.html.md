---
title: How to Build A Website Using Middleman and Github
date: 2016-07-17 15:42 MYT
tags: technology, ruby, middlemanapp
small_image_url: '/assets/images/middlemanapp-small.png'
image_url: '/assets/images/middlemanapp.png'
---
Website is an essential part of our digital lifestyle. Freelancers need website to showcase themselves, businesses need website to market their products and you need a website to maintain your online presence.

There are multiple ways of creating a website with the advancement of technology nowadays but I will be showing you how to build a [static site](https://en.wikipedia.org/wiki/Static_web_page) particularly and the best part is, you get to host it for FREE!

## Why Static Site?

You might be wondering, why static site? One reason, because it's blazing fast!

A static site doesn't have any dynamic contents as it consists mainly of HTML and CSS files. No fancy database is needed like [Wordpress](https://wordpress.org/) which reduces the server response time, making your website load extremely fast.

It is also easy to cache using CDNs such as [Cloudflare](https://www.cloudflare.com/).

Static site is a perfect choice for personal websites, blogs, and landing pages as these sites do not require any contents to be generated on the fly.

## Prerequisites

As this is a pretty technical blog post, you will need some experience in using terminal, code editor and code sharing site such as [Github](https://github.com)

<p class="post-alert">
  <strong>You can <a href="https://www.upwork.com/o/profiles/users/_~01c2b79130514bdaad/" target="blank" rel="noopener noreferrer">invite me to your job</a> on Upwork if you need a website.</strong>
</p>

Middleman is a static page generator built using [Ruby](https://www.ruby-lang.org/en/) so you will need to install Ruby on your machine along with [Bundler](http://bundler.io/) ([RubyGems](https://rubygems.org/) Management Tool).

If you don't have Ruby installed yet, follow the tutorial [here](https://www.ruby-lang.org/en/documentation/installation/) to get Ruby up and running on your machine.

Once that is done, install Bundler using the following command:

```bash
$ gem install bundler
```

You are all set up. Let's get started!

## Middleman and Github Pages

There are plenty of static pages generators out there, but why Middleman?

Simply because I'm from the world of [Ruby on Rails](http://rubyonrails.org/) and Middleman is very similar to Rails.

It uses ERB as the default templating language and helpers that are very similar to Rails such as `link_to`. You can even define your own helper if needed.

As for [Github Pages](https://pages.github.com/), who doesn't like FREE stuffs?

Github provides free hosting of your static website and all you have to do is to push your code to a Github Repository.

Why pay for hosting when you can get a website up and running with just one command?

Last but not least, Github Pages even allows you to have a custom domain mapped to your website so you don't need to use `username.github.io` which is the default url for your github pages powered static website.

## Set Up Middleman

Enough for all the introductions to Middleman App and Github Pages.

Let's get to code, shall we?

### Install Middleman

First, open up your terminal and enter the following command:

```bash
gem install middleman
```

If you are denied permission to install Middleman, add `sudo` in front of the command above so that you can install Middleman with the right permission.

Once the install process is done, check if Middleman is install correctly using:

```bash
bundle exec middleman version
```

You should see something like `Middleman 3.4.1` in the terminal. Version number will depend on the version of Middleman you've installed.

If you want to create a blog along side with your website, then do this so that the extension for blogging in Middleman is installed:

```bash
gem install middleman-blog
```

Once you have Middleman installed, navigate to the folder where you want to store your Middleman project.

### Create Project

To create a new Middleman project, use the command:

```bash
bundle exec middleman init my_new_site
```

or

```bash
bundle exec middleman init my_new_site --template=blog
```

if you are creating a blog.

You can rename `my_new_site` to any name you want as that will be your project name for this Middleman project.

Once the project is created, navigate to the folder `my_new_site` and check out the folder structure.

```
── my_new_site
   ├── Gemfile
   ├── Gemfile.lock
   ├── config.rb
   └── source
       ├── 2012-01-01-example-article.html.markdown
       ├── calendar.html.erb
       ├── feed.xml.builder
       ├── images
       ├── index.html.erb
       ├── javascripts
       ├── layout.erb
       ├── stylesheets
       └── tag.html.erb
```

`Gemfile` is where you list down all the gems that you want to install in this Middleman project.

`Gemfile.lock` is the file where Middleman retrieve all the dependencies of the gems that you've installed. You will not need to make changes to this file as this is automated by Bundler.

`config.rb` is the file to store all the Middleman configurations. This is where you customize the behavior of Middleman according to your needs.

`source` is the folder that keeps all your html/css/assets/articles that will be compiled into a static website.

### Start Middleman Server

Middleman comes with a local server for testing purposes.

Once the project is created, start the Middleman server.

```bash
bundle exec middleman server
```

You can now view your Middleman site by visiting `http://localhost:4567`

```
Image here
```

If you want to shut down your Middleman Server, just press `CTRL` + `C` on your keyboard.

The Middleman Server can be left open when you are editing your site. You will only need to restart the server after you add a new gem or edited the configuration of Middleman.

Adrian's Tips:
> Use `EXECJS_RUNTIME=Node bundle exec middleman server` to start your server if it always hangs after some time. This command uses NodeJS to run the Middleman Server. Refer to this [issue](https://github.com/middleman/middleman/issues/1367) for more details.

### Middleman Extensions

Middleman has something called extensions that allows you to build more cool stuffs using extra features that these extensions provide you with.

Since these extensions are bundled as a Gem, you can just include them in your Gemfile, run `bundle install` and voila!

You just installed an extensions successfully.

Here are some of the extensions that I'm using for my Middleman site which is the one that you are on currently:

`middleman-blog`

`middleman-livereload`

`middleman-minify-html`

`middleman-imageoptim`

`middleman-deploy`

`middleman-disqus`

`middleman-smusher`

`middleman-syntax`

`middleman-robots`

You can look for more extensions [here](https://directory.middlemanapp.com/#/extensions/all) to add functionality to your m

### Middleman Templates
### Asset Folders
### Create an Article
### Github Flavored Markdown
### Build Settings
### Deployment Settings

## Set Up Github Pages
### Set Up Git Repository
### Set Up Github Repository
### Custom Domain Name

## Middleman Blog Workflow
Livereload
