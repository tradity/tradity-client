#!/bin/sh
touch app/js/config.js

# admin files which are not publicly available :/
touch app/less/all/admin.less
touch app/templates/admin.notifications.html
touch app/templates/admin.schools.html
touch app/templates/admin.userdetails.html
touch app/templates/admin.statistics.html
touch app/templates/admin.userlist.html
touch app/templates/admin.html
touch app/js/controllers/adminUserlist.js
touch app/js/controllers/admin.js
touch app/js/controllers/adminNotifications.js
touch app/js/controllers/adminSchools.js
touch app/js/controllers/adminStatistics.js
touch app/js/controllers/adminUserDetails.js

command -v bower 2>/dev/null || export PATH="node_modules/bower/bin:$PATH"
command -v grunt 2>/dev/null || export PATH="node_modules/grunt-cli/bin:$PATH"

set -e
echo "var TRADITY_BUILD_STAMP = 'TDYC$(date +%s)-$(git rev-parse HEAD)';" > app/js/buildstamp.js
npm --quiet install
npm --quiet update
bower -q install

if [ x"$GRUNT_TRANSLATE_ONLY" = x"" ]; then
	grunt --no-color build doc || EXIT_CODE=$?

	EXIT_CODE=$?

	mkdir -p dist
	[ -e dist/index.html ] || cp buildfail.html dist/index.html
else
	echo "Translations-only grunt build"
	
	grunt --no-color translate-extract

	command -v msgmerge 2>/dev/null && [ -e po/templates.pot ] && (
		for langfile in po/*.po; do
			msgmerge --previous -U "$langfile" po/templates.pot
		done
	) || EXIT_CODE=$?
fi

exit $EXIT_CODE
