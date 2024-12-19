echo "./gcloud_deploy {env}"
DEPLOY_ENV=$1

function _exit_if_fail
{
  if [ "$1" != "0" ]; then
    exit 1
  fi
}

. ./.env.${DEPLOY_ENV}

echo "Google Cloud Bucket Name : ${GCLOUD_STORAGE_NAME}"
echo "Google Cloud LB Name : ${GCLOUD_LB_NAME}"
echo "DEPLOY_ENV : ${DEPLOY_ENV}"

echo -e "Enter to continue...\c"
read

yarn
_exit_if_fail $?

yarn build:${DEPLOY_ENV}
_exit_if_fail $?

gsutil -m cp -r ./build/* ${GCLOUD_STORAGE_NAME}
_exit_if_fail $?

echo "Clear cache...."
gcloud compute url-maps invalidate-cdn-cache ${GCLOUD_LB_NAME} --path '/*' --async
_exit_if_fail $?

echo "Upload Done!"