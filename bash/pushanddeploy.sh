#!/usr/bin/bash
git push &&
npm run build &&
firebase deploy --only hosting