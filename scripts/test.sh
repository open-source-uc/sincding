#!/bin/bash
if [[ $CIRCLECI ]]; then
  if [[ ! $UC_USERNAME || ! $UC_PASSWORD ]]; then
    echo 'ERROR: No valid credentials'
    exit 1
  fi
  if [[ $CIRCLE_USERNAME != $UC_USERNAME ]]; then
    echo 'ERROR: Not valid user'
    exit 1
  fi

  f="./__tests__/.env.json"
  keyVal() {
    if [[ $3 == 0 ]]; then end=""; else end=","; fi
    echo "\"${1}\": \"${2}\"${end}" >> $f
  }
  echo "{" > $f
  keyVal "username" $UC_USERNAME
  keyVal "password" $UC_PASSWORD 0
  echo "}" >> $f

  jest
else
  jest --notify
fi
