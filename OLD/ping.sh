#!/bin/bash

REPERTOIRE="/var/www/homeping/"

HOSTS=$(cat ${REPERTOIRE}hosts)
LISTS=$(echo "$HOSTS" | cut -d@ -f2 | tr -s ' ' '/')

PING_TMP="${REPERTOIRE}result_tmp.json"
PING="${REPERTOIRE}result.json"

for i in $LISTS; do

    i=$(echo "$i" | tr -s '/' ' ')
    iIp=$(echo "$i" | cut -d' ' -f1)
    iHost=$(echo "$i" | cut -d' ' -f2)

    ping -c2 $iIp &>/dev/null

    echo '{"name":"'$iHost'","ip":"'$iIp'","up":"'$?'"},' >>$PING_TMP

done

sed -i '1i[' $PING_TMP
sed -i '$ s/.$//; $a\]' $PING_TMP

sed -i 's/"0"/"true"/g' $PING_TMP
sed -i 's/"1"/"false"/g' $PING_TMP
sed -i 's/"2"/"false"/g' $PING_TMP

mv $PING_TMP $PING
