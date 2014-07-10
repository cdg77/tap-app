tap-app
=======

Never commit dist on master branch

To release a new build, follow these steps:
	git co -b release master
	gulp build
	git add dist
	git ci -m '0.0.1'
	git push heroku head:master -f

		check to see if release works;
		if not rollback
		else

	git tag -a -m '0.0.1' 0.0.1
	git push --tags
	git co master
	git branch -D release

Rollback
	git push heroku 0.0.3~0:master -f

After writing a new migration, run it and check the DB to see the migration worked as expected before you commit. Then roll it back to make sure the roll back works. Then run it again and commit.

Migrations must be also be run on Heroku:
	heroku run bash
will open a ssh
