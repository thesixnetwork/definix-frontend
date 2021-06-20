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

yarn
_exit_if_fail $?

yarn build:${DEPLOY_ENV}
_exit_if_fail $?

aws s3 sync ./build s3://${WEBS3} --acl public-read --profile ${2}
_exit_if_fail $?

echo "Clear cache...."
aws cloudfront create-invalidation --distribution-id ${DISTRIBUTION_ID} --paths '/*'  --profile ${2}
_exit_if_fail $?

echo "https://${WEBS3}.s3-ap-southeast-1.amazonaws.com/index.html"

