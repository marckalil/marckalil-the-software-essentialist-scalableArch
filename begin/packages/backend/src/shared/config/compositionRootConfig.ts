type Environment = "development" | "production" | "staging" | "ci";
type Script = "start" | "test:unit" | "test:e2e" | "test:infra";

export class CompositionRootConfig {
  private script: Script;
  private env: Environment;

  constructor(script: Script) {
    this.script = script;
    this.env = (process.env.NODE_ENV as Environment) || "development";
  }
}
