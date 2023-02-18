# AFFiNE-ghost

AFFiNE-ghost is a tool that migrates notes into affine and easily generates an affine blog site from your personal notes by configuring the environment's quorum


Step 1 - create `.env` in root

```
AFFiNE_APP_URL=https://app.affine.pro/
AFFiNE_LOGIN_TOEKN={"token":###############}
AFFiNE_WORKSPACE_NAME=AFFiNE-docs
AFFiNE_LOCAL_SOURCE_PATH=/Users/affiner/src/AFFiNE-docs

```

Step 2 - run command

```
pnpm dev
```

Step 3 - put your notes in `./notes`
