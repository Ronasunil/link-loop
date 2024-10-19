resource "aws_elasticache_subnet_group" "cache_subnet_group" {
  name       = "cache-subnet"
  subnet_ids = [aws_subnet.private_subnet_a.id, aws_subnet.private_subnet_b.id]
}


resource "aws_elasticache_replication_group" "cache_replication_group" {
  automatic_failover_enabled = true
  replication_group_id       = "cache-group"
  description                = "redis cache"
  num_cache_clusters         = 2
  parameter_group_name       = var.elastic_cache_parameter_name
  node_type                  = var.elastic_cache_node_type
  security_group_ids         = [aws_security_group.elastic_cache_sg.id]
  subnet_group_name          = aws_elasticache_subnet_group.cache_subnet_group.name
  depends_on                 = [aws_security_group.elastic_cache_sg]

  provisioner "local-exec" {
    command = file("./user-data/update-env.sh")

    environment = {
      ELASTIC_CACHE_ENDPOINT = self.primary_endpoint_address
    }
  }



  tags = {
    Name = "cach-replication-group"
  }
}


# for printing  endpoint url
output "aws_elasticache_endpoint" {
  value = aws_elasticache_replication_group.cache_replication_group.primary_endpoint_address
}

