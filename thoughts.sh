red="\e[0;91m"
blue="\e[0;94m"
green="\e[0;92m"
reset="\e[0m"

thoughts="${green}@@@ thoughts: "

cleanup() {
    if [ -n "$apiprocess" ]; then kill $apiprocess; fi
    if [ -n "$interfaceprocess" ]; then kill $interfaceprocess; fi
}

trap cleanup EXIT

# build the output and sync with object storage
build() {
    export AWS_PROFILE=thoughts

    printf "${thoughts}${blue}Starting wm-api...${reset}"
    cd wm-api 
    npm run start &
    apiprocess=$!
    cd ..
    sleep 2

    printf "${thoughts}${blue}Copying images to static directory...${reset}\n"
    mkdir -p ltm-generator/static/images/
    rsync -rlpgoD --checksum --ignore-existing -v wm/images/ ltm-generator/static/images/

    printf "${thoughts}${blue}Building static site with ltm-generator...${reset}\n"
    cd ltm-generator && npm run build &
    generatorprocess=$!
    wait $generatorprocess

    printf "${thoughts}${blue}Copying build to ltm...${reset}\n"
    mkdir -p ltm/
    rsync -rlpgoD --checksum -v --exclude '*.js' --exclude '*.json' ltm-generator/build/ ltm/

    printf "${thoughts}${blue}Loading config file...${reset}\n"
    . thoughts.config 

    printf "${thoughts}${blue}Syncing build to object storage...${reset}\n"
    cd ltm/ && aws s3 sync . $S3_BUCKET --acl public-read --exclude ".DS_Store"

    printf "${thoughts}${blue}Export complete, exiting...${reset}\n"
    exit 
}

# run the api and interface 
write() {
    printf "${thoughts}${blue}Starting wm-api...${reset}"
    cd wm-api && npm run start &
    apiprocess=$!
    sleep 2

    printf "${thoughts}${blue}Starting wm-interface...${reset}"
    cd wm-interface && npm run dev &
    interfaceprocess=$!
    sleep 2

    printf "${thoughts}${blue}Ready for writing!${reset}\n"
    wait $apiprocess
}


while [ "$1" != "" ]; do
    case $1 in
    -b | --build)
        build
        ;;
    -w | --write)
        write
        ;;
    *)
    esac
    shift 
done
