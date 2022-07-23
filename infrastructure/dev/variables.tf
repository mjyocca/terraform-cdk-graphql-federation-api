variable "deployment_bucket_prefix" {
  description = "S3 deployment bucket name prefix"
  type        = string
  default     = "cdktf-sls"
}

variable "AWS_ACCESS_KEY" {
  type        = string
  description = "copy auto.tfvars.example file and rename to 'auto.tfvars'"
}

variable "AWS_SECRET_KEY" {
  type        = string
  description = "copy auto.tfvars.example file and rename to 'auto.tfvars'"
}
