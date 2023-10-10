#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { OnlineShopStack } from '../lib/online-shop-stack';

const app = new cdk.App();
new OnlineShopStack(app, 'OnlineShopStack');