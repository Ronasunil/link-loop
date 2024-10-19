resource "aws_eip" "elatic_ip_subnet_1" {
  depends_on = [aws_internet_gateway.gw]
  tags = {
    Name = "elastic_ip_1"
  }
}


