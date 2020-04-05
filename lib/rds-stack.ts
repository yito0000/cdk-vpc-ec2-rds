import * as cdk from "@aws-cdk/core";
import {SecretValue, Tag} from "@aws-cdk/core";
import {BaseStackProps} from "./base-stack-props";
import {
  CfnSecurityGroup,
  InstanceClass,
  InstanceSize,
  InstanceType,
  IVpc,
  Peer,
  Port,
  SecurityGroup,
  SubnetType
} from "@aws-cdk/aws-ec2";
import {
  CfnDBInstance,
  CfnDBSubnetGroup,
  DatabaseInstance,
  DatabaseInstanceEngine,
  LicenseModel
} from "@aws-cdk/aws-rds";

interface RDSStackProps extends BaseStackProps{
  vpc: IVpc,
}

export class RDSStack extends cdk.Stack {

  constructor(scope: cdk.Construct, id: string, props: RDSStackProps) {
    super(scope, id, props);

    const securityGroupName = `${props.context.applicationName}-rds-sg`;
    const securityGroup = new SecurityGroup(this, securityGroupName, {
      vpc: props.vpc,
      allowAllOutbound: true,
      securityGroupName: securityGroupName
    });

    Tag.add(this, "Name", securityGroupName, {
      includeResourceTypes: ["AWS::EC2::SecurityGroup"]
    });

    securityGroup.addIngressRule(Peer.ipv4(`${props.context.myPlaceIp}/32`), Port.tcp(1521));

    const databaseInstanceId = `${props.context.applicationName}-db-instance`;
    const databaseInstance = new DatabaseInstance(this, databaseInstanceId, {
      databaseName: "db",
      engine: DatabaseInstanceEngine.ORACLE_SE2,
      engineVersion: "19.0.0.0.ru-2020-01.rur-2020-01.r1",
      instanceClass: InstanceType.of(InstanceClass.M5, InstanceSize.XLARGE),
      masterUsername: 'masterUser',
      masterUserPassword: SecretValue.plainText("masterPassword"),
      licenseModel: LicenseModel.LICENSE_INCLUDED,
      vpc: props.vpc,
      securityGroups: [
        securityGroup
      ],
      vpcPlacement: props.vpc.selectSubnets({
        subnetType: SubnetType.PUBLIC
      }),
    });

  }
}