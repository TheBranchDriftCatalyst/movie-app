require 'sinatra'
require 'sinatra/reloader'
require 'haml'

set :bind, '0.0.0.0'

get '/' do
  send_file 'index.html'
end

get '/index' do
  haml :index
end
