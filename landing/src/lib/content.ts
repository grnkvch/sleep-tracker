import YAML from 'yaml';
import demoSource from '../content/landing/demo.ru.yaml?raw';
import shellSource from '../content/landing/shell.ru.yaml?raw';
import factsSource from '../content/facts/verified.yaml?raw';
import { demoSchema, factsSchema, shellSchema } from '../config/content-schema';

export const demo = demoSchema.parse(YAML.parse(demoSource));
export const shellCopy = shellSchema.parse(YAML.parse(shellSource));
export const verifiedFacts = factsSchema.parse(YAML.parse(factsSource));
