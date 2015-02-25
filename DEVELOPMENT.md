# How to develop on SassDoc

## How to have a fresh install of SassDoc

```sh
# Clone the repository on your machine
git clone git@github.com:SassDoc/sassdoc.git

# If you don't have a SSH key, feel free to clone using HTTPS instead
# git clone https://github.com/SassDoc/sassdoc.git

# If you're not a SassDoc organisation member and you forked the repo,
# you need to clone `yourname/sassdoc.git` instead.
#
# Also add actual SassDoc repo as `upstream` to fetch code updates:
git remote add upstream https://github.com/SassDoc/sassdoc.git

# Head into the local repository
cd sassdoc

# Move to `develop` branch
git checkout develop

# Install node modules
npm install

# Run all Make tasks
make
```

## How to develop a feature

```sh
# Be sure to be on an up-to-date `develop`
git checkout develop
git pull

# If you're on a fork, be sure to pull the `upstream` version
git pull upstream develop

# Create a new feature branch
git checkout -b feature/my-new-feature

# Add some work

# Make a beautiful commit, reference related issues if needed
git commit

# Push your branch
git push -u origin feature/my-new-feature

# Then make a pull request (targeting `develop`)!
```

## How to make an hotfix

```sh
# Be sure to be on an up-to-date `master`
git checkout master
git pull

# If you're on a fork, be sure to pull the `upstream` version
git pull upstream master

# Create a new hotfix branch
git checkout -b hotfix/my-new-hotfix

# Add the actual fix

# Commit the fix, reference related issues
git commit

# Push your branch
git push -u origin hotfix/my-new-hotfix

# Make a pull request if it's relevant
```

## How to merge an hotfix

```sh
# Merge in `master`
git checkout master
git pull
git merge --no-ff hotfix/hotfix-to-merge

# Tag the hotfix version (patch should be bumped in branch)
git tag <version>

# Push
git push
git push --tags

# Merge in `develop` and push
git checkout develop
git pull
git merge --no-ff hotfix/hotfix-to-merge
git push

# Delete hotfix branch
git branch -d hotfix/hotfix-to-merge
git push origin :hotfix/hotfix-to-merge
```

## How to release a new version

```sh
# Move to `develop` branch and get latest changes
git checkout develop
git pull

# Bump version number in `package.json`
vim package.json

# Commit the change in `package.json`
git add package.json
git commit -m 'Bump <version>'

# Push on `develop`
git push

# Head to `master`
git checkout master
git pull

# Merge `develop` branch
git merge --no-ff develop

# Tag the commit
git tag <version>

# Run tests one last time and publish the package
make publish

# Push
git push
git push --tags
```

Then on GitHub, [add a new release](https://github.com/SassDoc/sassdoc/releases/new) with both *Tag version* and *Release title* matching the new version. The *description* should be the changelog.

## How to release a pre-version

Same as [How to release a new version](#how-to-release-a-new-version) except it's not merged in `master` and the `npm publish` is slightly different:

```sh
# Move to `develop` branch and get latest changes
git checkout develop
git pull

# Bump version number in `package.json`
vim package.json

# Commit the change in `package.json`
git add package.json
git commit -m 'Bump <version>'

# Push on `develop`
git push

# Run tests one last time
make test

# Publish the package
npm publish --tag beta
```

## How to work on the theme

```sh
# Make sure you have the latest version of SassDoc
npm update sassdoc -g

# Clone the repository on your machine
git clone git@github.com:SassDoc/sassdoc-theme-default.git

# If you don't have a SSH key, feel free to clone using HTTPS instead
# git clone https://github.com/SassDoc/sassdoc-theme-default.git

# Head into the local repository
cd sassdoc-theme-default

# Run all Make tasks
make

# Run SassDoc
sassdoc scss/ --theme ./ --verbose
```

When you make a change:

```sh
# Run all Make tasks and SassDoc
make all && sassdoc scss/ --theme ./ --verbose
```
