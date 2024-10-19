resource "aws_route_table" "private_route_table" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = var.global_cidr_block
    nat_gateway_id = aws_nat_gateway.nats_gateway_1.id
  }

  tags = {
    Name = "private_route_table"
  }
}

resource "aws_route_table_association" "private_subnet_association_1" {
  route_table_id = aws_route_table.private_route_table.id
  subnet_id      = aws_subnet.private_subnet_a.id
}


resource "aws_route_table_association" "private_subnet_association_2" {
  route_table_id = aws_route_table.private_route_table.id
  subnet_id      = aws_subnet.private_subnet_b.id
}