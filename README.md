# Gosnell Used Auto Parts

Simple marketing and lead-capture site for Gosnell Used Auto Parts (Next.js App Router).

## Local development

```bash
npm install
npm run dev
```

Open: http://localhost:3000

## Quality checks

```bash
npm run check
npm run build
```

## Deploy to AWS Amplify

Infrastructure files are in `infrastructure/amplify`.

Quick path:

1. Push this repository to GitHub
2. Set required environment variables:

```bash
export AMPLIFY_REPOSITORY_URL=https://github.com/<ORG>/<REPO>
export GITHUB_TOKEN=<github-pat>
```

3. Deploy:

```bash
./infrastructure/amplify/deploy.sh
```

See `infrastructure/amplify/README.md` for full details.
