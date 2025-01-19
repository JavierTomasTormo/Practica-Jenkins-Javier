#!/bin/sh
git config user.name "JavierTomasTormo"
git config user.email "javiertomas2003@gmail.com"
git add README.md
git commit -m "Pipeline executada per ${params.Executor}. Motiu: ${params.Motiu}"
git push origin main