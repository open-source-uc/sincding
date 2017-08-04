if [[ $CIRCLECI ]]
then
  echo 'Running test in cli'
  if [[ $UC_USERNAME && $UC_PASSWORD ]]
  then
    echo 'Valid credentials'
  else
    echo 'ERROR: No valid credentials'
    exit 1
  fi
  if [[ $CIRCLE_USERNAME == $UC_USERNAME ]]
  then
    echo 'Valid user'
  else
    echo 'ERROR: Not valid user'
    exit 1
  fi
  ./scripts/env_file.sh
  jest
else
  jest --notify
fi
