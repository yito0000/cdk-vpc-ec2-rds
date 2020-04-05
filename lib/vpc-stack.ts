import * as cdk from '@aws-cdk/core';
import {Tag} from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2'
import {IVpc, SubnetType} from '@aws-cdk/aws-ec2'
import {BaseStackProps} from './base-stack-props';

export class VpcStack extends cdk.Stack {

  vpc: IVpc;

  constructor(scope: cdk.Construct, id: string, props: BaseStackProps) {
    super(scope, id, props);

    let vpcId = `${props.context.applicationName}-VPC`;
    const vpc = new ec2.Vpc(this, vpcId, {
      cidr: "172.31.0.0/16",
      maxAzs: 2,
      subnetConfiguration: [
        {
          name: "public",
          cidrMask: 20,
          subnetType: SubnetType.PUBLIC
        },
        {
          name: "private",
          cidrMask: 20,
          subnetType: SubnetType.PRIVATE
        }
      ],
    });
    Tag.add(this, 'Name', vpcId);

    const selectedPublicSubnets = vpc.selectSubnets({
      subnetType: SubnetType.PUBLIC,
    });

    const selectedPrivateSubnets = vpc.selectSubnets({
      subnetType: SubnetType.PRIVATE,
    });

    this.vpc = vpc;

  }

}