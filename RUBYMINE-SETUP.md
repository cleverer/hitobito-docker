# RubyMine setup

The following is a writeup of some steps that might need to be done in order to get the project running and debuggable.
This was tested on RubyMine 2019.2.3.

## Basic setup
* Mark each wagon as Ruby module root (via context menu). This will create some run configurations, we will only need the "Development: hitobito" one.
* In Settings -> Build, Execution, Deployment -> Docker, set up RubyMine's connection to Docker
* Create a remote docker-compose Ruby SDK for the app service and set it as default SDK for all wagons
* In Settings -> Version Control, register each Wagon as a repository root
* Start the application using the Development: hitobito run configuration.

## Specs
Configure the RSpec run configuration template as follows:
* Use custom RSpec runner script: /path/to/your/repo/hitobito-docker/.rubymine/wagon-aware-rspec.rb
* Use pre-load server: None
* docker-compose: docker-compose exec
* On the bundler tab, uncheck "Run the script in context of the bundle (bundle exec)". This template setting is not respected by RubyMine 2019.2 though, so you have to uncheck it in every run configuration manually.

To make debugging tests work, disable "Spring for Debug" in Settings -> Debugger.

Note that currently, since we are using the app container for both local server and specs, the database becomes unusable for the local server after running specs.
To fix this, run `docker-compose down --volumes` in the Terminal / console and re-run the Development: hitobito run configuration.
This unfortunately takes quite a long time, so it is currently recommended to switch between testing and GUI as little as possible.
An alternative solution involving the separate test and db-test containers is still to be developed.

## Debugging the application
* Run the Development: hitobito run configuration in debug mode, set some breakpoints and debug away.

## Common problems
(Striked-out lines were also tried but didn't solve the problem at the time.)

##### "A server is already running. Check /app/hitobito/tmp/pids/server.pid."
* Manually delete the file hitobito/tmp/pids/server.pid

##### "Unable to detect full path for ruby" when trying to add a remote docker-compose ruby SDK:
* ~~Delete .idea and restart RubyMine~~
* ~~Re-setup Docker in RubyMine~~
* Disable experimental feature ruby.docker.internal.via.exec (Ctrl+Shift+A -> Experimental Features)

##### Can't run specs in Wagon, no green arrows in gutter and in the context menu the Run 'RSpec ...' option is missing
* Add hitobito/spec as a load path to all wagon modules (Settings -> Project Structure -> select wagon -> Load Path)
* Run a directory of specs in each wagon (right click, Run all specs), then invalidate caches & restart
* Workaround: Manually add a run configuration or run all tests in a directory

##### Specs in wagon yield "No fixture named 'bulei' found for fixture set 'people'" or other random issues
* ~~Set path mappings in Ruby SDK dialog for each wagon module~~
* On the bundler tab, uncheck "Run the script in context of the bundle (bundle exec)" (already in the Specs instructions above)
* Disable Spring for the run configuration (already in the Specs instructions above)
* Use the custom rspec runner script (already in the Specs instructions above)
* Workaround: cd into the wagon before executing the test and run without bundle exec


