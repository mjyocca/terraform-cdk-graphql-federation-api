# Serverless Terraform CDK Graphql Federation API

<br />

<p align="center">

 <img height="60px" src="https://camo.githubusercontent.com/1a4ed08978379480a9b1ca95d7f4cc8eb80b45ad47c056a7cfb5c597e9315ae5/68747470733a2f2f7777772e6461746f636d732d6173736574732e636f6d2f323838352f313632393934313234322d6c6f676f2d7465727261666f726d2d6d61696e2e737667" />
 <img height="60px" src="https://raw.githubusercontent.com/mercurius-js/graphics/main/mercurius-horizontal.svg" />

 <img height="60px" src="https://raw.githubusercontent.com/fastify/graphics/96648545bcad9d1984dd96363a39e2775b59afef/fastify-landscape-outlined.svg"/>

 <img height="60px" src="https://camo.githubusercontent.com/5f54c0817521724a2deae8dedf0c280a589fd0aa9bffd7f19fa6254bb52e996a/68747470733a2f2f6e6573746a732e636f6d2f696d672f6c6f676f2d736d616c6c2e737667"/>

</p>

<br />

Example project demonstrating how to take advantage of both [Terraform](https://www.terraform.io/) & [Terraform CDK (Typescript)](https://www.terraform.io/cdktf) to deploy graphql federated API's to a serverless environment (AWS Lambda).

### Application Architecture

<br />

*The application code in this iteration is very MVP, as the intention was more of devops and infrastructure as code automation.*

<br />

Primary Application Libraries:
* [Fastify](https://www.fastify.io/)
* [Mercurius](https://mercurius.dev/#/)
* [NestJS](https://docs.nestjs.com/)


Helpful Library Docs:
* [@fastify/aws-lambda](https://github.com/fastify/aws-lambda-fastify)
* [Mercurius Graphql Federation](https://mercurius.dev/#/docs/federation)
* [Mercurius Graphql Federation with NestJS](https://docs.nestjs.com/graphql/federation#federation-with-mercurius)
* [GraphQL Code First Approach](https://docs.nestjs.com/graphql/federation#code-first-2)

<br />

### Terraform IAS (Infrastructure as Code) Setup

*Terraform specific project code*
```
├── app
│   ├── admin
│   │   └── main.tf.ts
│   ├── gateway
│   │   └── main.tf.ts
│   └── products
│       └── main.tf.ts
├── infrastructure
│   └── dev
└── packages
    └── cdktf-constructs
```

* This iteration is demonstrating storing state locally. So this does not demonstrate how to manage terraform state for a production environment. For that purpose I would highly recommend [Terraform Cloud](https://cloud.hashicorp.com/products/terraform) (*a little biased*) or other [Terraform Backend options](https://www.terraform.io/language/settings/backends/configuration).
* Each application directory contains its own Terraform CDK Stack within: `main.tf.ts`.
* They all resuse the same construct defined in the `@packages/cdktf-constructs` pnpm workspace package
* The terraform packages have two levels in terms of sibling dependencies.
  * `Infrastructure` is required to be deployed prior to any other package since it contains the S3 bucket for lambda deployment artifacts.
  * Both `products` & `admin` packages need to be deployed prior to the `gateway` package. For service discovery, the gateway needs to aware of each subgraph in order to stitch schema requests. Managed services like Apollo Studio or self managed isolated microservice to manage that is preferred in a production environment.
  * The dependency order of package deployments is handled by [TurboRepo pipelines](https://turborepo.org/docs/core-concepts/pipelines)
* As mentioned previously, since state is stored locally, each package references other terraform stacks output(s) via the `DataTerraformRemoteStateLocal` construct

<br />

### Tooling Setup
* Install [pnpm](https://pnpm.io/)  `@latest` or `@^7.5.2`  <img height="40px" src="https://camo.githubusercontent.com/bcb56d766888dd0f2a4d74bd3ecec9b04b9dd79e5a97532ba24a8614bef12791/68747470733a2f2f706e706d2e696f2f696d672f706e706d2d6e6f2d6e616d652d776974682d6672616d652e737667" />
  ```
  npm install -g pnpm@latest
  ```
* [Install Terraform / Terraform CDK Typescript](https://learn.hashicorp.com/tutorials/terraform/cdktf-install?in=terraform/cdktf)

* Install dependencies with:

  ```
  pnpm install
  ```
* [Turborepo](https://turborepo.org/) is included as a dev dependency in the workspace root directory

<br />


### Deploy to AWS

* Setup your access key & secret access for AWS
  * If not exported in your environment shell can do the following:
    * Add **.env.local** to each app/[package] directory
      ```
      AWS_ACCESS_KEY_ID=''
      AWS_SECRET_ACCESS_KEY=''
      ```
    * Within `infrastructure/` copy auto.tfvars.example to `auto.tfvars` and add your credentials there
* Then Deploy!
  ```
  pnpm run deploy:turbo
  ```
* Once finished, remember to destory the resources you created by:
  ```
  pnpm run destroy:turbo
  ```
  *if it fails, can run `pnpm run destroy:infrastructure` & `turbo run destroy` separately*

<br />

### Retrospective
* I would consolidate Terraform CDK Stacks into a single application to deploy from. Terraform cdktf deploy command allows the user to specify a particular stack to deploy.
* Since this iteration uses local state, would recommend persisting terraform state remotely with Terraform Cloud, S3, or other Terraform Backend solutions
* I would also update the gateway application code to fetch the other subgraph api gateway endpoint urls at runtime (with caching). That way each subgraph and package can be deployed independently, without the need of re-deploying the gateway to update an environment variable.
* Research adding another useful library to compliment NestJS [Nestjs-query](https://doug-martin.github.io/nestjs-query/)