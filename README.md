# 📦 Classic Svelte-Express-PostgreSQL App

A full-stack reference project that pairs a **Svelte** SPA with an **Express** API and a **PostgreSQL** database.  
Everything ships in Docker, deploys to Kubernetes via **Helm**, and the underlying AWS infrastructure is provisioned with **Terraform**.

---

## 🗂 Tech Stack

| Layer         | Tooling                                     |
| ------------- | ------------------------------------------- |
| Front-end     | [Svelte](https://svelte.dev)                |
| Back-end      | [Express](https://expressjs.com)            |
| Database      | [PostgreSQL 15](https://www.postgresql.org) |
| Container     | Docker & Docker Compose                     |
| Orchestration | Kubernetes 1.29 (templated by Helm 3)       |
| IaC / Cloud   | Terraform 1.7 + AWS Provider v5.x           |
| CI / CD       | GitHub Actions (sample workflow)            |

---

## 📁 Directory Layout

```bash
.
├─ infra/ # Terraform root – VPC, EKS, RDS, S3, IAM …
│ └─ modules/ # Re-usable TF modules
├─ helm-chart/ # Helm chart (templates/, values.yaml, Chart.yaml)
├─ services/
│ ├─ frontend/ # SvelteKit app – vite.config.js, src/
│ └─ backend/ # Express API – src/, tsconfig.json
├─ docker/ # Dockerfiles, docker-compose.yaml
└─ README.md
```

---

## 🔧 Prerequisites

- **Node.js ≥ 20**
- **Docker ≥ 24** + Docker Compose
- **kubectl**, **Helm 3**, **Terraform ≥ 1.6**
- AWS credentials with `AdministratorAccess` (or least-privilege equivalent)
- Optional: [direnv](https://direnv.net/) or `.env` file for environment variables

---

## 🏗 Local Development

# 1 – Install dependencies

cd services/frontend && pnpm i
cd ../backend && pnpm i

# 2 – Run with hot-reload

pnpm --filter frontend dev # http://localhost:5173
pnpm --filter backend dev # http://localhost:4000

# 3 – Lint & type-check

pnpm lint && pnpm typecheck
Local PostgreSQL (optional)
docker compose up -d postgres # starts postgres:15-alpine

# DB accessible at postgres://postgres:postgres@localhost:5432/app

🐳 Containerisation with Docker
docker compose up --build # builds & runs all services
Frontend: http://localhost:3000 (static build served by Nginx)

Backend: http://localhost:4000

PostgreSQL (dev): port 5432

☸️ Deployment on Kubernetes with Helm
Set your kube-context (kind, minikube, or EKS).

Copy helm-chart/values.yaml.example → values.yaml and edit:

image.tag, postgres.password, ingress.hosts, secrets, etc.

Install / upgrade:

helm upgrade --install classic-app ./helm-chart \
 --namespace classic --create-namespace \
 -f helm-chart/values.yaml
Verify:

kubectl get all -n classic
kubectl logs -l app.kubernetes.io/name=backend -n classic
☁️ AWS Infrastructure with Terraform
Terraform provisions VPC → EKS → RDS (PostgreSQL) plus supporting resources.

cd infra
terraform init -backend-config="bucket=my-tf-state"
terraform plan -var="region=us-east-1" -out=tf.plan
terraform apply tf.plan
Outputs:

eks_cluster_name = "classic-eks-prod"
rds_endpoint = "classic-db.xxxxxxx.us-east-1.rds.amazonaws.com:5432"
alb_dns_name = "classic-alb-123456.elb.us-east-1.amazonaws.com"
🔄 CI / CD Hints (GitHub Actions)
Job 1: Lint + unit tests

Job 2: Build & push Docker images to ECR

Job 3: Package Helm chart → push to Artifact Hub

Job 4: terraform plan on PR, terraform apply on main (with manual approval)

Authenticate to AWS via OIDC – no long-lived keys.

🧪 Testing
Layer Tools
Front-end Vitest, Playwright E2E
Back-end Jest, Supertest
Infra terraform validate, Terratest

pnpm test # unit
pnpm test:e2e # end-to-end
🔐 Security Notes
All secrets live in AWS Secrets Manager (or sealed-secrets in K8s).

Enable encryption at rest (RDS, S3) & in transit (TLS).

Use IAM least-privilege; turn on GuardDuty, Flow Logs, RDS audit logs.

🤝 Contributing
Fork → git checkout -b feat/my-feature

Commit using Conventional Commits (feat(api): add pagination)

pnpm lint && pnpm test must pass

Open a pull request – describe what and why

📄 License
MIT © 2025 Classic App Maintainers
