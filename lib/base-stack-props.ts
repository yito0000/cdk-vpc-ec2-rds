import * as cdk from '@aws-cdk/core';
import { IStageContext } from './stage-context';

export interface BaseStackProps extends cdk.StackProps {
    context: IStageContext;
}