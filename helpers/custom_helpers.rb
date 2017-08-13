module CustomHelpers
  def page_title
    if current_page.data.title
      current_page.data.title + ' - ' + data.site.title
    else
      data.site.default_page_title
    end
  end

  def page_description
    current_page.data.description || data.site.description
  end

  def current_page_url
    "#{data.site.url}#{current_page.url}"
  end

  def page_url(page)
    "#{data.site.url}#{page.url}"
  end

  def page_author
    current_page.data.author || data.site.author
  end

  def page_twitter_card_type
    current_page.data.twitter_card_type || 'summary'
  end

  def page_twitter_handle
    current_page.data.twitter_handle || data.site.twitter_handle
  end

  def page_image
    "#{data.site.url}#{current_page.data.image_url || data.site.image_url}"
  end

  # Social share URLs
  def twitter_url
    "https://twitter.com/share?text=“#{page_title}”" +
                               "&url=#{current_page_url}" +
                               "&via=#{data.site.twitter_handle}"
  end

  def facebook_url
    "https://www.facebook.com/dialog/feed?app_id=#{data.site.facebook_app_id}" +
                                          "&caption=#{page_title}" +
                                          "&picture=#{page_image}" +
                                          "&name=“#{page_title}”" +
                                          "&description=#{page_description}" +
                                          "&display=popup" +
                                          "&link=#{current_page_url}" +
                                          "&redirect_uri=#{current_page_url}"
  end

  def google_plus_url
    "https://plus.google.com/share?url=#{current_page_url}"
  end

  def linkedin_url
    "http://www.linkedin.com/shareArticle?mini=true" +
                                          "&url=#{current_page_url}" +
                                          "&title=#{page_title}" +
                                          "&summary=#{page_description}" +
                                          "&source=#{data.site.url}"
  end

  def smart_robots(path, env)
    # Add paths (like "thank you" pages) that search engines should not index.
    # Multiple paths look like this:
    # /first_path|another_path|yet_another/
    if !!(path =~ /thanks/) || env != 'production'
      'noindex, nofollow'
    else
      'index, follow'
    end
  end

  # https://robots.thoughtbot.com/organized-workflow-for-svg
  # https://gist.github.com/bitmanic/0047ef8d7eaec0bf31bb
  def inline_svg(filename, options = {})
    root = Middleman::Application.root
    file_path = "#{root}/source/assets/images/#{filename}"
    if File.exist?(file_path)
      file = File.read(file_path).force_encoding('UTF-8')
      doc = Nokogiri::HTML::DocumentFragment.parse file
      svg = doc.at_css 'svg'
      svg['class'] = options[:class] if options[:class].present?
      doc
    else
      "file not found: #{file_path}"
    end
  end
end
