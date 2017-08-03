f="__tests__/.env.json"

keyVal() {
  echo "{$1}: {$2}\n" >> $f
}

echo "{" > $f

keyVal "username" $UC_USERNAME
# keyVal "password" $UC_PASSWORD

echo "}" >> $f

echo 'file'
cat $f
