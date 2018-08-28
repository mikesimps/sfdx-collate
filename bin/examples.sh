#!/bin/bash
sfdx collate:compare:files  -p test/examples/PermissionSet1.xml -s test/examples/PermissionSet2.xml > permissionset_default.csv
sfdx collate:compare:files  -p test/examples/PermissionSet1.xml -s test/examples/PermissionSet2.xml -m full > permissionset_full.csv
sfdx collate:compare:files  -p test/examples/PermissionSet1.xml -s test/examples/PermissionSet2.xml -m diff > permissionset_diff.csv
sfdx collate:compare:files  -p test/examples/PermissionSet1.xml -s test/examples/PermissionSet2.xml -m exact > permissionset_exact.csv
sfdx collate:compare:files  -p test/examples/PermissionSet1.xml -s test/examples/PermissionSet2.xml -m inner > permissionset_inner.csv

sfdx collate:compare:build -f permissionset_full.csv > permissionset_full_build.xml

# sfdx collate:compare:api -t Profile -p wc2.WC2SystemAdmin -s wc2.WC2SystemAdmin -m full > profile.csv
# sfdx collate:compare:build -f profile.csv > profile.xml