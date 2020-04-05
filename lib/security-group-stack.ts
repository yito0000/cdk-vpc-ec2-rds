import {BaseStackProps} from "./base-stack-props";
import {ISecurityGroup, IVpc, Peer, Port, SecurityGroup} from "@aws-cdk/aws-ec2";
import * as cdk from "@aws-cdk/core";
import {Tag} from "@aws-cdk/core";

interface SecurityGroupStackProps extends BaseStackProps{
  vpc: IVpc
}

export class SecurityGroupStack extends cdk.Stack {

  securityGroup: ISecurityGroup;

  constructor(scope: cdk.Construct, id: string, props: SecurityGroupStackProps) {
    super(scope, id, props);

    const securityGroupName = `${props.context.applicationName}-sg`;
    const securityGroup = new SecurityGroup(this, securityGroupName, {
      vpc: props.vpc,
      allowAllOutbound: true,
      securityGroupName: securityGroupName
    });

    Tag.add(this, "Name", securityGroupName, {
      includeResourceTypes: ["AWS::EC2::SecurityGroup"]
    });

    this.securityGroup = securityGroup;
  }
}