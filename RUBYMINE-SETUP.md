# RubyMine setup

The following is a writeup of some steps that might need to be done in order to get the project running and debuggable.
This was tested on RubyMine 2019.2.3.

## Basic setup
* Mark each wagon as Ruby module root (via context menu). This will create some run configurations, we will only need the *Development: hitobito* one.
* In Settings -> Build, Execution, Deployment -> Docker, set up RubyMine's connection to Docker
* Create a remote docker-compose Ruby SDK for the app service and set it as default SDK for all wagons
* Create a second remote docker-compose Ruby SDK, this time for the app-test service. This one will be used to run the tests without affecting the dev database.
* Set the path mappings for both SDKs, local path is the hitobito-docker directory on your local machine, remote path is `/app`
* In Settings -> Version Control, register each Wagon as a repository root
* Start the application using the *Development: hitobito* run configuration.

## Specs
Configure the RSpec run configuration template as follows:
* Use custom RSpec runner script: /path/to/your/repo/hitobito-docker/.rubymine/wagon-aware-rspec.rb
* Use pre-load server: None. *This template setting is [not respected by RubyMine](https://youtrack.jetbrains.com/issue/RUBY-16779) though, so you have to uncheck it in every run configuration manually.*
* Ruby SDK: *Use other SDK and 'rspec' gem*: Select the SDK based on **app-test** instead of the default one based on the **app** service
* docker-compose: docker-compose exec
* On the bundler tab, uncheck "Run the script in context of the bundle (bundle exec)". *This template setting is [not respected by RubyMine](https://youtrack.jetbrains.com/issue/RUBY-16779) though, so you have to uncheck it in every run configuration manually.*

Before running the tests, you now need to start the app-test container.
To do this, duplicate the *Development: hitobito* run configuration and change the Environment to test and the SDK to the one based on app-test.
Once the migrations are done, you are ready to run tests (but keep in mind that you have to manually adjust the run configurations, due to the RubyMine bug mentioned above).

To make debugging tests work, disable "Spring for Debug" in Settings -> Debugger, and also run the adapted run configuration in debug mode.

## Debugging the application
* Run the *Development: hitobito* run configuration in debug mode, set some breakpoints and debug away.

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
* ~~Set path mappings in Ruby SDK dialog~~
* On the bundler tab, uncheck "Run the script in context of the bundle (bundle exec)" (already in the Specs instructions above)
* Disable Spring for the run configuration (already in the Specs instructions above)
* Use the custom rspec runner script (already in the Specs instructions above)
* Workaround: cd into the wagon before executing the test and run without bundle exec

##### "uninitialized constant <some controller name> (NameError)" in wagon's controller tests
* On the bundler tab, uncheck "Run the script in context of the bundle (bundle exec)" (already in the Specs instructions above)
* Disable Spring for the run configuration (already in the Specs instructions above)
* Use the custom rspec runner script (already in the Specs instructions above)
* Workaround: cd into the wagon before executing the test and run without bundle exec

##### "Error running 'some run configuration': Failed to find free socket port for process dispatcher"
It is not possible to run the application and some tests in debug mode at the same time.
If you were trying to run a test, stop the application, start *Development: hitobito* in normal mode and try again.
If you were trying to debug the application, stop any tests that are still being debugged and try again.

##### "/usr/local/bin/ruby: No such file or directory -- /opt/project/.docker/wagon-aware-rspec.rb (LoadError)" when running tests
In Settings -> Languages & Frameworks -> Ruby SDK and Gems, set the path mapping for the remote docker-compose SDK which is based on app-test:
Local path is the hitobito-docker directory on your local machine, remote path is `/app`

##### "Process finished with exit code 137 (interrupted by signal 9: SIGKILL)" when trying to run tests
Probably the app-test service is not running.
Run `docker-compose rm -fsv app-test db-test` and then run (or debug if you want to debug tests) the adapted run configuration (see Specs instructions above).
