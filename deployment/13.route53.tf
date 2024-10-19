data "aws_route53_zone" "main" {
  name         = var.main_domain
  private_zone = false
}


resource "aws_acm_certificate" "dev_cert" {
  domain_name       = var.dev_api_domain
  validation_method = "DNS"

  tags = {
    Name = "dev-certificate"
  }

  lifecycle {
    create_before_destroy = true
  }
}


resource "aws_route53_record" "acm_record" {
  allow_overwrite = false
  ttl             = 60
  zone_id         = data.aws_route53_zone.main.id
  name            = tolist(aws_acm_certificate.dev_cert.domain_validation_options)[0].resource_record_name
  type            = tolist(aws_acm_certificate.dev_cert.domain_validation_options)[0].resource_record_type
  records         = [tolist(aws_acm_certificate.dev_cert.domain_validation_options)[0].resource_record_value]


}

resource "aws_acm_certificate_validation" "cert_validation" {
  certificate_arn         = aws_acm_certificate.dev_cert.id
  validation_record_fqdns = [aws_route53_record.acm_record.fqdn]
}


resource "aws_route53_record" "alias_record" {
  name    = var.dev_api_domain
  zone_id = data.aws_route53_zone.main.zone_id
  type    = "A"

  alias {
    evaluate_target_health = false
    name                   = aws_alb.main.dns_name
    zone_id                = aws_alb.main.zone_id
  }

  depends_on = [aws_alb.main]
}