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

### Debugging
Run the *Development: hitobito* run configuration in debug mode, set some breakpoints and debug away.

## Specs
Configure the RSpec run configuration template as follows:
* Use custom RSpec runner script: /path/to/your/repo/hitobito-docker/.rubymine/wagon-aware-rspec.rb
* Use pre-load server: None. *This template setting is [not respected by RubyMine](https://youtrack.jetbrains.com/issue/RUBY-16779) though, so you have to uncheck it in every run configuration manually.*
* Ruby SDK: *Use other SDK and 'rspec' gem*: Select the SDK based on **app-test** instead of the default one based on the **app** service
* docker-compose: docker-compose exec
* On the bundler tab, uncheck "Run the script in context of the bundle (bundle exec)". *This template setting is [not respected by RubyMine](https://youtrack.jetbrains.com/issue/RUBY-16779) though, so you have to uncheck it in every run configuration manually.*

Before running the tests, you now need to start the app-test container.
To do this, duplicate the *Development: hitobito* run configuration and
* Name it "*Test: hitobito*" or similar
* Set Port to 3001 or something else that is not used on your system
* Set Environment to test
* Set the SDK to the one based on app-test

Then run this new run configuration.
Once the migrations are done, you are ready to run tests (but keep in mind that you have to manually adjust the run configurations, due to the RubyMine bug mentioned above).

### Debugging
To make debugging tests work, make sure to disable "Spring for Debug" in Settings -> Debugger.
Then run *Test: hitobito* in debug mode, set some breakpoints and debug away.

Note: If *Development: hitobito* is currently running in debug mode, you have to stop that (or restart it in normal mode) before debugging *Test: hitobito*.
This is due to the fact that RubyMine can only debug via port 1234, and both containers cannot occupy this port at the same time.

## Troubleshooting
(Striked-out lines were also tried but didn't solve the problem at the time.)

##### "Unable to detect full path for ruby" when trying to add a remote docker-compose ruby SDK:
* ~~Delete .idea and restart RubyMine~~
* ~~Re-setup Docker in RubyMine~~
* Disable experimental feature ruby.docker.internal.via.exec (Ctrl+Shift+A -> Experimental Features)

##### Can't run specs in Wagon, no green arrows in gutter and in the context menu the Run 'RSpec ...' option is missing
* ~~Add hitobito/spec as a load path to all wagon modules (Settings -> Project Structure -> select wagon -> Load Path)~~
* Run a directory of specs in each wagon (right click, Run all specs), then invalidate caches & restart
* Workaround: Manually add a run configuration or only run all tests in a directory at once

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

##### "Error running 'something': Failed to find free socket port for process dispatcher"
You cannot debug both *Development: hitobito* and *Test: hitobito* at the same time.
Running both at the same time is fine, as long as not both are in debug mode.
Stop the one already running in debug mode before debugging the other.

If that doesn't help, you probably forgot to set the SDK in all RSpec run configurations to the one based on **app-test** (described in the Specs instructions above).

##### "/usr/local/bin/ruby: No such file or directory -- /opt/project/.docker/wagon-aware-rspec.rb (LoadError)" when running tests
In Settings -> Languages & Frameworks -> Ruby SDK and Gems, set the path mapping for the remote docker-compose SDK which is based on app-test:
Local path is the hitobito-docker directory on your local machine, remote path is `/app`

##### "Process finished with exit code 137 (interrupted by signal 9: SIGKILL)" when trying to run tests
Probably the app-test service is not running.
Clean up by running `docker-compose rm -fsv app-test db-test`, and then run (or debug if you want to debug tests) the *Test: hitobito* run configuration (see Specs instructions above).
