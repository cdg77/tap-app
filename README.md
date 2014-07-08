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
	git push heroku 0.0.0:master -f

Migrations must be run on Heroku:
	heroku run bash 
will open a ssh 