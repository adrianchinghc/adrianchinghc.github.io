# Blog settings

set :css_dir, 'assets/stylesheets'
set :js_dir, 'assets/javascripts'
set :images_dir, 'assets/images'
set :markdown_engine, :redcarpet
set :markdown, fenced_code_blocks: true, smartypants: true
activate :automatic_image_sizes
activate :autoprefixer
activate :pry
activate :directory_indexes
activate :syntax

activate :deploy do |deploy|
  deploy.method = :git
  deploy.branch = 'master'
  deploy.build_before = false
end

activate :blog do |blog|
  blog.permalink = "{title}.html"
  blog.sources = "posts/{year}-{month}-{day}-{title}.html"
  blog.taglink = "categories/{tag}.html"
  blog.layout = "layouts/post.slim"
  blog.summary_separator = /(READMORE)/
  blog.summary_length = 500
  blog.default_extension = ".md"
  blog.tag_template = "tag.html"
  blog.calendar_template = "calendar.html"
  blog.new_article_template = "source/article.slim"

  # # Enable pagination
  blog.paginate = true
  blog.per_page = 5
end

activate :disqus do |d|
  d.shortname = 'adrianching'
end

Time.zone = "Kuala Lumpur"

page 'sitemap.html', layout: false
page 'sitemap.xml', layout: false
page 'feed.xml', layout: false
page '404.html', directory_index: false

# Reload the browser automatically whenever files change
configure :development do
  activate :livereload
end

# Build-specific configuration
configure :build do
  activate :imageoptim
  activate :minify_css
  activate :minify_javascript
  activate :asset_hash
  activate :smusher
  activate :asset_host
  activate :gzip
  activate :minify_html
  activate :relative_assets
  activate :robots, rules: [
    { user_agent: '*', allow: ['/'] }
  ],
  sitemap: "#{data.site.url}/sitemap.xml"
  activate :imageoptim do |options|
    options.manifest = false
    options.svgo = false
    options.pngout = false
  end
end

# Add bower's directory to sprockets asset path
after_configuration do
  @bower_config = JSON.parse IO.read("#{root}/.bowerrc")
  sprockets.append_path File.join "#{root}", @bower_config["directory"]
end
