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

####################################################################
FROM base as dev

ENV RAILS_ENV=development

ENTRYPOINT [ "/app/.docker/entrypoint" ]
CMD [ "rails", "server", "-b", "0.0.0.0" ]

####################################################################
FROM base as test

ENV RAILS_ENV=test

ENTRYPOINT [ "/bin/entrypoint" ]
CMD [ "rspec" ]
