FROM ruby:2.5 as base

RUN apt-get update && apt-get install -y \
    graphviz \
    imagemagick \
 && rm -rf /var/lib/apt/lists/*

RUN ln -s /app/.docker/entrypoint /bin/entrypoint; \
    ln -s /app/.docker/worker-entrypoint /bin/worker-entrypoint; \
    ln -s /app/.docker/waitfortcp /bin/waitfortcp

WORKDIR /app/hitobito
COPY hitobito/Wagonfile.ci ./Wagonfile
RUN gem install --prerelease ruby-debug-ide && gem install debase
COPY hitobito/Gemfile hitobito/Gemfile.lock ./
RUN bundle install

####################################################################
FROM base as dev

ENV RAILS_ENV=development

ENTRYPOINT [ "/bin/entrypoint" ]
CMD [ "rails", "server", "-b", "0.0.0.0" ]

####################################################################
FROM base as test

ENV RAILS_ENV=test

ENTRYPOINT [ "/bin/entrypoint" ]
CMD [ "rspec" ]
