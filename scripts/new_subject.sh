#!/bin/bash

echo '課題の番号を入力してください'
read subject_number

branch_name="subject$subject_number"

git checkout -b ${branch_name}

mkdir ./${branch_name}
touch ./${branch_name}/README.md
