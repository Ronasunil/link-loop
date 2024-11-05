resource "aws_codedeploy_app" "link_loop_code_deploy" {
  name             = "${local.prefix}-app"
  compute_platform = "Server"



  lifecycle {
    create_before_destroy = true
  }
}


resource "aws_codedeploy_deployment_group" "codedeploy_grp" {
  app_name               = aws_codedeploy_app.link_loop_code_deploy.name
  deployment_group_name  = "${local.prefix}-group"
  service_role_arn       = aws_iam_role.codedeploy_iam_role.arn
  deployment_config_name = "CodeDeployDefault.AllAtOnce"
  autoscaling_groups     = [aws_autoscaling_group.ec2_autoscaling.name]
  auto_rollback_configuration {
    enabled = true
    events  = ["DEPLOYMENT_FAILURE"]
  }

  blue_green_deployment_config {
    deployment_ready_option {
      action_on_timeout = "CONTINUE_DEPLOYMENT"
    }

    terminate_blue_instances_on_deployment_success {
      action                           = "TERMINATE"
      termination_wait_time_in_minutes = 1
    }

    green_fleet_provisioning_option {
      action = "COPY_AUTO_SCALING_GROUP"
    }
  }

  deployment_style {
    deployment_option = "WITH_TRAFFIC_CONTROL"
    deployment_type   = "BLUE_GREEN"
  }

  load_balancer_info {
    target_group_info {
      name = aws_alb_target_group.alb_tg.name
    }
  }

}


# resource "null_resource" "delete_asg" {
#   provisioner "local-exec" {
#     command = file(("./user-data/"))
#     when = "destroy"


#     environment = {
#       asg_name = aws_codedeploy_deployment_group.codedeploy_grp.deployment_group_name
#     }
#   }


# }



# aws deploy create-deployment \
#     --application-name link-loop \
#     --deployment-config-name CodeDeployDefault.AllAtOnce \
#     --deployment-group-name link-loop-deployment-group \
#     --s3-location bucket=code-deploy-backend-1,bundleType=zip,key=link-loop.zip