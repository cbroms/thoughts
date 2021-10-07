trap "exit" INT TERM ERR
trap "kill 0" EXIT

red="\e[0;91m"
blue="\e[0;94m"
green="\e[0;92m"
reset="\e[0m"

thoughts="${green}@@@ thoughts: "

export AWS_PROFILE=thoughts

printf "${thoughts}${blue}Starting wm-api...${reset}"

cd wm-api && npm run start &
apiprocess=$!

sleep 2

printf "${thoughts}${blue}Copying images to static directory...${reset}\n"

mkdir -p ltm-generator/static/images/

cp -R wm/images/ ltm-generator/static/images/

printf "${thoughts}${blue}Building static site with ltm-generator...${reset}\n"

cd ltm-generator && npm run build &
generatorprocess=$!

wait $generatorprocess

kill $apiprocess

printf "${thoughts}${blue}Loading config file...${reset}\n"

. thoughts.config

printf "${thoughts}${blue}Syncing build to object storage...${reset}\n"

cd ltm-generator/build/ && aws s3 sync . $S3_BUCKET --acl public-read --exclude "page-preview/*" --include "page-preview/dist/*"

printf "${thoughts}${blue}Export complete, exiting...${reset}\n"

exit 