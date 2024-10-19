resource "aws_instance" "bashionhost" {
  launch_template {
    id      = aws_launch_template.autoscaling_template.id
    version = "$Latest"
  }

  instance_type               = "t2.micro"
  subnet_id                   = aws_subnet.public_subnet_a.id
  vpc_security_group_ids      = [aws_security_group.bastion_host_sg.id]
  associate_public_ip_address = true


  tags = {
    Name = "ec2-bashionhost"
  }

}