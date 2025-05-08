#!/bin/sh

set -e

host="$1"
shift
cmd="$@"

until nc -z $host 5432; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is up - executing command"
exec $cmd