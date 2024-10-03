terraform {
    required_providers {
        aws = {
        source  = "hashicorp/aws"
        }
    }
    backend "s3" {
        region = "us-east-1"
    }
}

provider "aws" {
    region = "us-east-1"
}

data "aws_caller_identity" "current" {}

locals {
    project_name = "deckbuild"
    
    env = {
        dev = {
            stage = "dev"
            domain_name = "dev-deckbuild.t.pilepich.com"
        }
        prod = {
            stage = "prod"
            domain_name = "deckbuild.t.pilepich.com"
        }
    }
}

variable "stage" {
    default = "dev"
}

resource "aws_s3_bucket" "my_bucket" {
    bucket = "${local.project_name}-${var.stage}-${data.aws_caller_identity.current.account_id}"
}

#Cloudfront distribution
resource "aws_cloudfront_distribution" "my_distribution" {
    origin {
        domain_name = aws_s3_bucket.my_bucket.bucket_regional_domain_name
        origin_id   = aws_s3_bucket.my_bucket.bucket_regional_domain_name
    }

    enabled             = true
    is_ipv6_enabled     = true
    default_root_object = "index.html"

    default_cache_behavior {
        allowed_methods  = ["GET", "HEAD", "OPTIONS"]
        cached_methods   = ["GET", "HEAD", "OPTIONS"]
        target_origin_id = aws_s3_bucket.my_bucket.bucket_regional_domain_name

        forwarded_values {
            query_string = false

            cookies {
                forward = "none"
            }
        }

        viewer_protocol_policy = "redirect-to-https"
    }

    restrictions {
        geo_restriction {
            restriction_type = "none"
        }
    }

    viewer_certificate {
        cloudfront_default_certificate = true
    }

    tags = {
        Name = "deckbuild"
    }
}

# Route53 Record
data "aws_route53_zone" "selected" {
    name         = "t.pilepich.com."
    private_zone = false
}

resource "aws_route53_record" "selected" {
    zone_id = data.aws_route53_zone.selected.zone_id
    name    = local.env[var.stage].domain_name
    type    = "A"

    alias {
        name                   = aws_cloudfront_distribution.my_distribution.domain_name
        zone_id                = aws_cloudfront_distribution.my_distribution.hosted_zone_id
        evaluate_target_health = false
    }
}