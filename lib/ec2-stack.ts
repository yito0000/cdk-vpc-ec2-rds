import * as cdk from "@aws-cdk/core";
import {BaseStackProps} from "./base-stack-props";
import {
  AmazonLinuxEdition,
  AmazonLinuxImage,
  Instance,
  InstanceClass,
  InstanceSize,
  InstanceType, ISecurityGroup, IVpc,
  Peer,
  Port,
  SecurityGroup,
  SubnetType,
  Vpc
} from "@aws-cdk/aws-ec2";
import {Tag} from "@aws-cdk/core";

interface EC2StackProps extends BaseStackProps{
  vpc: IVpc,
}

export class Ec2Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: EC2StackProps) {
    super(scope, id, props);

    let machineImage = new AmazonLinuxImage({
      edition: AmazonLinuxEdition.STANDARD
    });

    const vpcSubnets = props.vpc.selectSubnets({
      subnetType: SubnetType.PUBLIC
    });

    const securityGroupName = `${props.context.applicationName}-ec2-sg`;
    const securityGroup = new SecurityGroup(this, securityGroupName, {
      vpc: props.vpc,
      allowAllOutbound: true,
      securityGroupName: securityGroupName
    });

    Tag.add(this, "Name", securityGroupName, {
      includeResourceTypes: ["AWS::EC2::SecurityGroup"]
    });

    securityGroup.addIngressRule(Peer.ipv4(`${props.context.myPlaceIp}/32`), Port.tcp(22));

    const instanceId = `${props.context.applicationName}-instance`;
    const instance = new Instance(this, instanceId, {
      instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.LARGE),
      machineImage: machineImage,
      vpc: props.vpc,
      allowAllOutbound: true,
      instanceName: props.context.applicationName,
      keyName: props.context.keyName,
      vpcSubnets: vpcSubnets,
      securityGroup: securityGroup
    });
    Tag.add(this, "Name", instanceId, {
      includeResourceTypes: ["AWS::EC2::Instance"]
    });

  }
}
