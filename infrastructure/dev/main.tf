terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
    random = {
      source = "hashicorp/random"
    }
  }
}

provider "aws" {
  region     = "us-west-2"
  access_key = var.AWS_ACCESS_KEY
  secret_key = var.AWS_SECRET_KEY
}

resource "random_pet" "name" {
  length = 2
}

locals {
  stage = "dev"
}

resource "aws_s3_bucket" "lambdaDeploymentBucket" {
  bucket = "${var.deployment_bucket_prefix}-${random_pet.name.id}-${local.stage}"

  tags = {
    Name        = "terraform-lambda-deployment-bucket"
    Environment = local.stage
  }
}
