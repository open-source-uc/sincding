f="./__tests__/.env.json"

keyVal() {
  if [[ $3 == 0 ]]; then end=""; else end=","; fi
  echo "${1}: \"${2}\"${end}" >> $f
}

echo "{" > $f

keyVal "username" $UC_USERNAME
keyVal "password" $UC_PASSWORD 0

echo "}" >> $f
