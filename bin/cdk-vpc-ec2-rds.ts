#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { VpcStack } from '../lib/vpc-stack';
import { IStageContext } from '../lib/stage-context';
import {Ec2Stack} from "../lib/ec2-stack";
import {RDSStack} from "../lib/rds-stack";

const app = new cdk.App();

const contextCategory = app.node.tryGetContext('env');
if(!contextCategory) {
  throw new Error('parameter env is required');
}

const context: IStageContext = app.node.tryGetContext(contextCategory);
const env = {
  account: context.account,
  region: context.region
};

let vpcStackName = `${context.applicationName}-VPC`;
const vpcStack = new VpcStack(app, vpcStackName, {
  env: env,
  stackName: vpcStackName,
  context: context
});

let instanceStackName = `${context.applicationName}-instance`;
new Ec2Stack(app, instanceStackName, {
  env: env,
  stackName: instanceStackName,
  context: context,
  vpc: vpcStack.vpc,
});

const rdsStackName = `${context.applicationName}-rds`;
new RDSStack(app, rdsStackName, {
  env: env,
  stackName: rdsStackName,
  context: context,
  vpc: vpcStack.vpc,
})
