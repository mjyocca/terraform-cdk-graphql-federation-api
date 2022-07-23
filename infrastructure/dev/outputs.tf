output "lambdaDeploymentBucket" {
  description = "Lambda Deployment S3 Bucket Name"
  value       = aws_s3_bucket.lambdaDeploymentBucket.bucket
}
