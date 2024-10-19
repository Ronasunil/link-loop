resource "aws_nat_gateway" "nats_gateway_1" {
  depends_on = [aws_eip.elatic_ip_subnet_1]

  allocation_id = aws_eip.elatic_ip_subnet_1.id
  subnet_id     = aws_subnet.public_subnet_a.id

}

