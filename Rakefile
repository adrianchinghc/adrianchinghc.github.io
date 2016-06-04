task default: %w[build]

desc 'Build the app and throw it into github'
task :deploy do
  sh 'rm -rf build'
  sh 'bundle exec middleman build'
  sh 'gulp buildcss'
  sh 'bundle exec middleman deploy'
end

desc 'Build the app'
task :build do
  sh 'rm -rf build'
  sh 'bundle exec middleman build'
  sh 'gulp buildcss'
end
