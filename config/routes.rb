Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post '/currency_converter/convert', to: 'currency_convertor#convert'
      get '/currency_converter/data', to: 'currency_convertor#data'
    end
  end  
end
