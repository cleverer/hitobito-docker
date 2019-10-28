wagon = ARGV[0][/hitobito_[^\/]*/]
Dir.chdir File.expand_path('../' + wagon) if wagon
load Gem.bin_path('rspec-core', 'rspec')