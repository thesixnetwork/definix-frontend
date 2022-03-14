echo "./deploy.sh {env} {profile}"
DEPLOY_ENV=$1

function _exit_if_fail
{
  if [ "$1" != "0" ]; then
    exit 1
  fi
}

. ./.env.${DEPLOY_ENV}

echo "Web S3 : ${WEBS3}"
echo "Profile : ${2}"

echo -e "Enter to continue...\c"
read

aws --profile ${2} s3 cp ./public/notice_en.json s3://${WEBS3}
aws --profile ${2} s3 cp ./public/notice_ko.json s3://${WEBS3}
_exit_if_fail $?

