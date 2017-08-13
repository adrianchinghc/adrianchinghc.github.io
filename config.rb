# frozen_string_literal: true

require 'helpers/custom_helpers'
helpers CustomHelpers

set :relative_links, true
set :haml, format: :html5
activate :directory_indexes
activate :automatic_image_sizes
activate :syntax

# Disable Haml warnings
Haml::TempleEngine.disable_option_validator!

page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false
page '/404.html', directory_index: false

# middleman-search_engine_sitemap
set :url_root, 'http://adrianching.com'
activate :search_engine_sitemap

set :css_dir, 'assets/stylesheets'
set :images_dir, 'assets/images'
set :js_dir, 'assets/javascripts'

set :markdown_engine, :redcarpet
set :markdown, fenced_code_blocks: true, smartypants: true

activate :disqus do |d|
  d.shortname = 'adrianching'
end

# Blog Settings
activate :blog do |blog|
  blog.permalink = '{title}.html'
  blog.sources = 'posts/{year}-{month}-{day}-{title}.html'
  # blog.taglink = 'categories/{tag}.html'
  blog.layout = 'post'
  blog.summary_separator = /(READMORE)/
  blog.summary_length = 300
  blog.default_extension = '.md'
  # blog.tag_template = 'tag.html'
  # blog.calendar_template = 'calendar.html'
  # blog.new_article_template = 'source/article.slim'

  # # Enable pagination
  blog.paginate = true
  blog.per_page = 5
end

configure :build do
  activate :external_pipeline,
           name: :gulp,
           command: 'npm run production',
           source: '.tmp',
           latency: 1

  ignore 'assets/javascripts/all.js'
  ignore 'assets/stylesheets/site'

  activate :gzip

  activate :minify_html do |html|
    html.remove_quotes = false
    html.remove_intertag_spaces = true
  end

  activate :robots, rules: [
    { user_agent: '*', allow: ['/'] }
  ]
end

# Deploy-specific configuration
activate :deploy do |deploy|
  deploy.deploy_method = :git
  deploy.branch = 'master'
  deploy.build_before = false
end

# Time zone
Time.zone = 'Kuala Lumpur'
