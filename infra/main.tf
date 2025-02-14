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
    project_name = "baces-tools"
    env = {
        dev = {
            hosted_zone_id = "Z034670833Z7ZI7IJAP83"
            stage = "dev"
            domain_name = "dev-${local.project_name}.t.pilepich.com"
        }
        prod = {
            hosted_zone_id = "Z098308517HVBQRVJRVXA"
            stage = "prod"
            domain_name = "baces.tools"
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
        origin_access_control_id = aws_cloudfront_origin_access_control.default.id
    }

    enabled             = true
    is_ipv6_enabled     = true
    default_root_object = "index.html"
    aliases             = [local.env[var.stage].domain_name]
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
        acm_certificate_arn = aws_acm_certificate.cloudfront_default_certificate.arn
        ssl_support_method  = "sni-only"
    }

    tags = {
        Name = local.project_name
    }
}


resource "aws_cloudfront_origin_access_control" "default" {
    name = "${local.project_name}-origin-access-control-${var.stage}"
    origin_access_control_origin_type = "s3"
    signing_behavior = "always"
    signing_protocol = "sigv4"
}

# Route53 Record
data "aws_route53_zone" "selected" {
    zone_id = local.env[var.stage].hosted_zone_id
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

resource "aws_acm_certificate" "cloudfront_default_certificate" {
    lifecycle {
        create_before_destroy = true
    }
    domain_name       = local.env[var.stage].domain_name
    validation_method = "DNS"
}

resource "aws_route53_record" "example" {
  for_each = {
    for dvo in aws_acm_certificate.cloudfront_default_certificate.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.selected.zone_id
}

resource "aws_s3_bucket_policy" "my_bucket_policy" {
    bucket = aws_s3_bucket.my_bucket.bucket
    policy = jsonencode({
        Version = "2012-10-17",
        Statement = [
            {
                Effect = "Allow",
                Principal = {
                    Service = "cloudfront.amazonaws.com"
                },
                Action = "s3:GetObject",
                Resource = "${aws_s3_bucket.my_bucket.arn}/*",
                Condition = {
                    StringEquals = {
                        "aws:SourceArn" = aws_cloudfront_distribution.my_distribution.arn
                    }
                }
            }
        ]
    })
  
}