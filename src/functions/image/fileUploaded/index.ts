export default {
  handler: `src/functions/image/fileUploaded/handler.main`,
  events: [
    {
      s3: {
        bucket: 'aws-bucket-image-test',
        event: 's3:ObjectCreated:*',
        existing: true,
      },
    },
  ],
};
