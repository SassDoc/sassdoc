# How to develop on SassDoc

## How to have a fresh install of SassDoc

```sh
# Clone the repository on your machine
# If you don't have a SSH key, feel free to clone using HTTPS instead:
# git clone https://github.com/SassDoc/sassdoc.git
git clone git@github.com:SassDoc/sassdoc.git

# Head into the local repository
cd sassdoc

# Move to `develop` branch
git checkout develop

# Install node modules
npm install

# Run all Make tasks
make
```

One liner (with SSH):

```sh
git clone git@github.com:SassDoc/sassdoc.git && cd sassdoc && git checkout develop && npm install && make
```

## How to release a new version

```sh
# Move to `develop` branch
git checkout develop

# Bump version number in `package.json`
vim package.json

# Run tests one last time and publish the package
make publish

# Commit the change in `package.json`
git add package.json
git commit -m 'Bump <version>'

# Push to the repository
git push origin develop

# Head to `master`
git checkout master

# Sync `master` to `develop` level
git reset --hard origin/develop

# Push to the repository
git push origin master --force
```

Then on GitHub, [add a new release](https://github.com/SassDoc/sassdoc/releases/new) with both *Tag version* and *Release title* matching the new version. The *description* should be the changelog.

Shortened commands (although it's recommanded to do it step by step to prevent any unfortunate mistake):

```sh
# Don't forget to replace <version> with the actual version number
git checkout develop && vim package.json && make test && npm publish && git add package.json && git commit -m "Bump <version>" && git push origin develop && git checkout master && git reset --hard origin develop && git push origin master --force
```

## How to release a pre-version

Same as [How to release a new version](#how-to-release-a-new-version) except for the `npm publish` command:

```sh
# Move to `develop` branch
git checkout develop

# Bump version number in `package.json`
vim package.json

# Run tests one last time
make test

# Publish the package
npm publish --tag rc.<rc_number>

# Commit the change in `package.json`
git add package.json && git commit -m "Bump <version>"

# Push to the repository
git push origin develop
```

Shortened commands (although it's recommanded to do it step by step to prevent any unfortunate mistake):

```sh
# Don't forget to replace <version> and <rc_number> with the actual version number and RC number
git checkout develop && vim package.json && make test && npm publish --tag rc.<rc_number> && git add package.json && git commit -m "Bump <version>-rc.<rc_number>" && git push origin develop
```

## How to work on the theme

```sh
# Make sure you have the latest version of SassDoc (CR included)
npm update sassdoc -g

# Clone the repository on your machine
# If you don't have a SSH key, feel free to clone using HTTPS instead:
# git clone https://github.com/SassDoc/sassdoc-theme-default.git
git clone git@github.com:SassDoc/sassdoc-theme-default.git

# Head into the local repository
cd sassdoc-theme-default

# Run all Make tasks
make all

# Run SassDoc
sassdoc scss/ --theme ./ --verbose
```

When you make a change:

```sh
# Run all Make tasks and SassDoc
make all && sassdoc scss/ --theme ./ --verbose
```

