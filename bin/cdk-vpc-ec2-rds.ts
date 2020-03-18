#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkVpcEc2RdsStack } from '../lib/cdk-vpc-ec2-rds-stack';

const app = new cdk.App();
new CdkVpcEc2RdsStack(app, 'CdkVpcEc2RdsStack');
