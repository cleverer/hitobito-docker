FROM ruby:2.5 as base

RUN apt-get update && apt-get install -y \
    graphviz \
    imagemagick \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY ./ ./

WORKDIR /app/hitobito
COPY hitobito/Wagonfile.ci ./Wagonfile
COPY hitobito/Gemfile hitobito/Gemfile.lock ./
RUN gem install --prerelease ruby-debug-ide && gem install debase
RUN bundle install