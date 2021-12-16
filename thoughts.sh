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

    printf "${thoughts}${blue}Generating counts...${reset}"
    cd wm-scanner
    if [ ! -d env ]; then python3 -m venv env && pip install -r requirements.txt; fi
    source env/bin/activate
    python count.py
    cd ..

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
    cd ltm/ && aws s3 sync . $S3_BUCKET --acl public-read --exclude ".DS_Store" && cd ..

    printf "${thoughts}${blue}Building gemini site with ltm-generator-gemini...${reset}\n"
    mkdir -p ltm-gemini && cd ltm-gemini && mkdir -p thought && cd ..
    cd ltm-generator-gemini
    if [ ! -d env ]; then python3 -m venv env && pip install -r requirements.txt; fi
    source env/bin/activate
    python convert.py
    cd ..

    printf "${thoughts}${blue}Copying images to gemini build directory...${reset}\n"
    rsync -rlpgoD --checksum --ignore-existing -v --exclude '*.webp' wm/images/ ltm-gemini/thought/images/

    printf "${thoughts}${blue}Syncing gemini build to gemini server...${reset}\n"
    rsync -rlpgoD --checksum -v ltm-gemini/ $GEMINI_SERVER:$GEMINI_SERVE_DIR


    printf "${thoughts}${blue}Export complete, exiting...${reset}\n"
    exit 
}

# run the api and interface 
write() {
    printf "${thoughts}${blue}Starting wm-api...${reset}"
    cd wm-api && PLACE="Berkeley, CA" npm run start &
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
